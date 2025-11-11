from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.db import transaction
from oauth2_provider.models import Application, AccessToken, RefreshToken
import secrets
from django.utils import timezone
from datetime import timedelta
import requests
import json
import uuid
from .models import CustomUser
from .serializers import UserProfileSerializer
import logging
from utils.avatar_cache import avatar_cache_manager

logger = logging.getLogger(__name__)
User = get_user_model()

class QQOAuthLoginView(APIView):
    """
    QQ OAuth 登录视图
    处理QQ第三方登录回调
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        处理QQ OAuth登录
        请求参数:
        - code: QQ授权码
        - state: 状态参数（可选）
        """
        code = request.data.get('code')
        state = request.data.get('state', '')
        
        if not code:
            return Response({
                'error': 'Authorization code is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. 使用授权码获取access_token
            qq_token_data = self._get_qq_access_token(code)
            if not qq_token_data:
                return Response({
                    'error': 'Failed to get QQ access token'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. 获取用户OpenID
            openid = self._get_qq_openid(qq_token_data['access_token'])
            if not openid:
                return Response({
                    'error': 'Failed to get QQ OpenID'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. 获取用户信息
            user_info = self._get_qq_user_info(qq_token_data['access_token'], openid)
            if not user_info:
                return Response({
                    'error': 'Failed to get QQ user info'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 4. 创建或获取用户
            user = self._create_or_get_user_from_qq(openid, user_info)
            
            # 5. 生成应用token
            token_data = self._generate_oauth_tokens(user)
            
            return Response({
                'access_token': token_data['access_token'],
                'refresh_token': token_data['refresh_token'],
                'expires_in': 3600,
                'token_type': 'Bearer',
                'user': UserProfileSerializer(user).data,
                'provider': 'qq'
            }, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            # 处理账户冲突
            if hasattr(e, 'detail') and isinstance(e.detail, dict) and e.detail.get('conflict'):
                return Response(e.detail, status=status.HTTP_409_CONFLICT)
            raise e
        except Exception as e:
            logger.error(f"QQ OAuth login error: {e}")
            return Response({
                'error': 'QQ login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_qq_access_token(self, code):
        """获取QQ access_token"""
        # 这里需要配置QQ应用的client_id和client_secret
        # 实际使用时需要从settings中获取
        qq_app_id = 'YOUR_QQ_APP_ID'  # 需要配置
        qq_app_key = 'YOUR_QQ_APP_KEY'  # 需要配置
        redirect_uri = 'YOUR_REDIRECT_URI'  # 需要配置
        
        token_url = 'https://graph.qq.com/oauth2.0/token'
        params = {
            'grant_type': 'authorization_code',
            'client_id': qq_app_id,
            'client_secret': qq_app_key,
            'code': code,
            'redirect_uri': redirect_uri
        }
        
        try:
            response = requests.get(token_url, params=params, timeout=10)
            if response.status_code == 200:
                # QQ返回的是URL编码格式，需要解析
                result = {}
                for item in response.text.split('&'):
                    key, value = item.split('=')
                    result[key] = value
                return result
        except Exception as e:
            logger.error(f"Get QQ access token error: {e}")
        return None
    
    def _get_qq_openid(self, access_token):
        """获取QQ OpenID"""
        openid_url = f'https://graph.qq.com/oauth2.0/me?access_token={access_token}'
        
        try:
            response = requests.get(openid_url, timeout=10)
            if response.status_code == 200:
                # 解析JSONP格式返回
                text = response.text
                start = text.find('{"')
                end = text.rfind('}')
                if start != -1 and end != -1:
                    json_str = text[start:end+1]
                    data = json.loads(json_str)
                    return data.get('openid')
        except Exception as e:
            logger.error(f"Get QQ OpenID error: {e}")
        return None
    
    def _get_qq_user_info(self, access_token, openid):
        """获取QQ用户信息"""
        qq_app_id = 'YOUR_QQ_APP_ID'  # 需要配置
        
        user_info_url = 'https://graph.qq.com/user/get_user_info'
        params = {
            'access_token': access_token,
            'oauth_consumer_key': qq_app_id,
            'openid': openid
        }
        
        try:
            response = requests.get(user_info_url, params=params, timeout=10)
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            logger.error(f"Get QQ user info error: {e}")
        return None
    
    def _create_or_get_user_from_qq(self, openid, user_info):
        """从QQ信息创建或获取用户"""
        # 尝试通过QQ OpenID查找现有用户
        try:
            user = CustomUser.objects.get(qq_openid=openid)
            return user
        except CustomUser.DoesNotExist:
            pass
        
        # 检查是否存在冲突（相同邮箱或手机号的用户）
        conflict_result = self._check_oauth_conflict('qq', openid, user_info)
        if conflict_result:
            return conflict_result  # 返回冲突信息或临时token
        
        # 创建新用户
        with transaction.atomic():
            username = f"qq_{openid[:10]}"  # 生成用户名
            nickname = user_info.get('nickname', username)
            
            # 确保用户名唯一
            counter = 1
            original_username = username
            while CustomUser.objects.filter(username=username).exists():
                username = f"{original_username}_{counter}"
                counter += 1
            
            avatar_url = user_info.get('figureurl_qq_1', '')
            user = CustomUser.objects.create(
                username=username,
                nickname=nickname,
                qq_openid=openid,
                avatar_url=avatar_url,
                is_active=True
            )
            
            # 缓存第三方头像
            if avatar_url:
                try:
                    cached_url = avatar_cache_manager.cache_avatar(avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                        user.save(update_fields=['avatar'])
                except Exception as e:
                    logger.warning(f"Failed to cache QQ avatar for user {user.id}: {e}")
            
            return user
    
    def _check_oauth_conflict(self, provider, openid, user_info):
        """检查OAuth登录是否存在账户冲突"""
        # 这里可以根据第三方平台返回的信息检查冲突
        # 例如：检查是否有相同邮箱或手机号的用户
        
        # 如果第三方平台提供了邮箱信息，检查是否已存在
        email = user_info.get('email')
        phone = user_info.get('phone')
        
        existing_user = None
        conflict_field = None
        
        if email:
            try:
                existing_user = CustomUser.objects.get(email=email)
                conflict_field = 'email'
            except CustomUser.DoesNotExist:
                pass
        
        if not existing_user and phone:
            try:
                existing_user = CustomUser.objects.get(phone_number=phone)
                conflict_field = 'phone'
            except CustomUser.DoesNotExist:
                pass
        
        if existing_user:
            # 生成临时token用于冲突处理
            temp_token = str(uuid.uuid4())
            
            # 将冲突信息存储到缓存或临时表中
            from django.core.cache import cache
            conflict_data = {
                'provider': provider,
                'openid': openid,
                'user_info': user_info,
                'existing_user_id': existing_user.id,
                'conflict_field': conflict_field
            }
            cache.set(f'oauth_conflict_{temp_token}', conflict_data, timeout=1800)  # 30分钟过期
            
            # 抛出特殊异常，包含冲突信息
            from rest_framework.exceptions import ValidationError
            raise ValidationError({
                'conflict': True,
                'temp_token': temp_token,
                'message': f'检测到账户冲突：已存在使用相同{"邮箱" if conflict_field == "email" else "手机号"}的账户',
                'existing_user': {
                    'username': existing_user.username,
                    'email': existing_user.email,
                    'date_joined': existing_user.date_joined.isoformat()
                },
                'oauth_user_info': {
                    'nickname': user_info.get('nickname', ''),
                    'avatar_url': user_info.get('figureurl_qq_1', '') if provider == 'qq' else user_info.get('avatar_url', '')
                }
            })
        
        return None  # 无冲突
    
    def _generate_oauth_tokens(self, user):
        """生成OAuth tokens"""
        try:
            application = Application.objects.get(client_id='frontend-client')
        except Application.DoesNotExist:
            raise Exception('OAuth application not found')
        
        # 删除用户的旧令牌
        AccessToken.objects.filter(user=user, application=application).delete()
        RefreshToken.objects.filter(user=user, application=application).delete()
        
        # 创建新的访问令牌
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            token=secrets.token_urlsafe(32),
            expires=timezone.now() + timedelta(seconds=3600),
            scope='read write'
        )
        
        # 创建刷新令牌
        refresh_token = RefreshToken.objects.create(
            user=user,
            application=application,
            token=secrets.token_urlsafe(32),
            access_token=access_token
        )
        
        return {
            'access_token': access_token.token,
            'refresh_token': refresh_token.token
        }


class OAuthConflictResolveView(APIView):
    """
    OAuth冲突解决视图
    处理第三方登录时的账户冲突
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        解决OAuth冲突
        请求参数:
        - temp_token: 临时token
        - action: 处理方式 ('login' | 'create' | 'cancel')
        - password: 如果action是login，需要提供密码
        """
        temp_token = request.data.get('temp_token')
        action = request.data.get('action')
        password = request.data.get('password')
        
        if not temp_token or not action:
            return Response({
                'error': 'temp_token and action are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 从缓存中获取冲突信息
        from django.core.cache import cache
        conflict_data = cache.get(f'oauth_conflict_{temp_token}')
        
        if not conflict_data:
            return Response({
                'error': 'Invalid or expired temp_token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if action == 'cancel':
                # 取消操作，清除缓存
                cache.delete(f'oauth_conflict_{temp_token}')
                return Response({
                    'message': 'Operation cancelled'
                }, status=status.HTTP_200_OK)
            
            elif action == 'login':
                # 登录现有账户并绑定第三方账户
                if not password:
                    return Response({
                        'error': 'Password is required for login action'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                existing_user = CustomUser.objects.get(id=conflict_data['existing_user_id'])
                
                # 验证密码
                from django.contrib.auth import authenticate
                user = authenticate(username=existing_user.username, password=password)
                if not user:
                    return Response({
                        'error': 'Invalid password'
                    }, status=status.HTTP_401_UNAUTHORIZED)
                
                # 绑定第三方账户
                provider = conflict_data['provider']
                openid = conflict_data['openid']
                user_info = conflict_data['user_info']
                
                self._bind_oauth_account(user, provider, openid, user_info)
                
                # 生成token
                token_data = self._generate_oauth_tokens(user)
                
                # 清除缓存
                cache.delete(f'oauth_conflict_{temp_token}')
                
                return Response({
                    'access_token': token_data['access_token'],
                    'refresh_token': token_data['refresh_token'],
                    'expires_in': 3600,
                    'token_type': 'Bearer',
                    'user': UserProfileSerializer(user).data,
                    'provider': provider,
                    'message': 'Successfully logged in and bound OAuth account'
                }, status=status.HTTP_200_OK)
            
            elif action == 'create':
                # 创建新账户
                provider = conflict_data['provider']
                openid = conflict_data['openid']
                user_info = conflict_data['user_info']
                
                # 生成唯一用户名
                username = f"{provider}_{openid[:10]}"
                counter = 1
                original_username = username
                while CustomUser.objects.filter(username=username).exists():
                    username = f"{original_username}_{counter}"
                    counter += 1
                
                # 创建用户
                with transaction.atomic():
                    user = CustomUser.objects.create(
                        username=username,
                        nickname=user_info.get('nickname', username),
                        is_active=True
                    )
                    
                    # 绑定第三方账户
                    self._bind_oauth_account(user, provider, openid, user_info)
                
                # 生成token
                token_data = self._generate_oauth_tokens(user)
                
                # 清除缓存
                cache.delete(f'oauth_conflict_{temp_token}')
                
                return Response({
                    'access_token': token_data['access_token'],
                    'refresh_token': token_data['refresh_token'],
                    'expires_in': 3600,
                    'token_type': 'Bearer',
                    'user': UserProfileSerializer(user).data,
                    'provider': provider,
                    'message': 'Successfully created new account and bound OAuth account'
                }, status=status.HTTP_201_CREATED)
            
            else:
                return Response({
                    'error': 'Invalid action. Must be login, create, or cancel'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"OAuth conflict resolve error: {e}")
            return Response({
                'error': 'Failed to resolve OAuth conflict'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _bind_oauth_account(self, user, provider, openid, user_info):
        """绑定第三方账户到用户"""
        if provider == 'qq':
            user.qq_openid = openid
            if not user.avatar_url and user_info.get('figureurl_qq_1'):
                user.avatar_url = user_info.get('figureurl_qq_1')
                # 缓存第三方头像
                try:
                    cached_url = avatar_cache_manager.cache_avatar(user.avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                except Exception as e:
                    logger.warning(f"Failed to cache QQ avatar for user {user.id}: {e}")
        elif provider == 'wechat':
            user.wechat_openid = openid
            if not user.avatar_url and user_info.get('headimgurl'):
                user.avatar_url = user_info.get('headimgurl')
                # 缓存第三方头像
                try:
                    cached_url = avatar_cache_manager.cache_avatar(user.avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                except Exception as e:
                    logger.warning(f"Failed to cache WeChat avatar for user {user.id}: {e}")
        elif provider == 'douyin':
            user.douyin_openid = openid
            if not user.avatar_url and user_info.get('avatar'):
                user.avatar_url = user_info.get('avatar')
                # 缓存第三方头像
                try:
                    cached_url = avatar_cache_manager.cache_avatar(user.avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                except Exception as e:
                    logger.warning(f"Failed to cache Douyin avatar for user {user.id}: {e}")
        elif provider == 'alipay':
            user.alipay_user_id = openid
            if not user.avatar_url and user_info.get('avatar'):
                user.avatar_url = user_info.get('avatar')
                # 缓存第三方头像
                try:
                    cached_url = avatar_cache_manager.cache_avatar(user.avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                except Exception as e:
                    logger.warning(f"Failed to cache Alipay avatar for user {user.id}: {e}")
        
        user.save()
    
    def _generate_oauth_tokens(self, user):
        """生成OAuth tokens"""
        try:
            application = Application.objects.get(client_id='frontend-client')
        except Application.DoesNotExist:
            raise Exception('OAuth application not found')
        
        # 删除用户的旧令牌
        AccessToken.objects.filter(user=user, application=application).delete()
        RefreshToken.objects.filter(user=user, application=application).delete()
        
        # 创建新的访问令牌
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            token=secrets.token_urlsafe(32),
            expires=timezone.now() + timedelta(seconds=3600),
            scope='read write'
        )
        
        # 创建刷新令牌
        refresh_token = RefreshToken.objects.create(
            user=user,
            application=application,
            token=secrets.token_urlsafe(32),
            access_token=access_token
        )
        
        return {
            'access_token': access_token.token,
            'refresh_token': refresh_token.token
        }


class DouyinOAuthLoginView(APIView):
    """
    抖音 OAuth 登录视图
    处理抖音第三方登录回调
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        处理抖音 OAuth登录
        请求参数:
        - code: 抖音授权码
        - state: 状态参数（可选）
        """
        code = request.data.get('code')
        state = request.data.get('state', '')
        
        if not code:
            return Response({
                'error': 'Authorization code is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. 使用授权码获取access_token
            douyin_token_data = self._get_douyin_access_token(code)
            if not douyin_token_data:
                return Response({
                    'error': 'Failed to get Douyin access token'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. 获取用户信息
            user_info = self._get_douyin_user_info(
                douyin_token_data['access_token'],
                douyin_token_data['open_id']
            )
            if not user_info:
                return Response({
                    'error': 'Failed to get Douyin user info'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. 创建或获取用户
            user = self._create_or_get_user_from_douyin(
                douyin_token_data['open_id'], 
                user_info
            )
            
            # 4. 生成应用token
            token_data = self._generate_oauth_tokens(user)
            
            return Response({
                'access_token': token_data['access_token'],
                'refresh_token': token_data['refresh_token'],
                'expires_in': 3600,
                'token_type': 'Bearer',
                'user': UserProfileSerializer(user).data,
                'provider': 'douyin'
            }, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            # 处理OAuth冲突
            if hasattr(e, 'detail') and isinstance(e.detail, dict) and 'conflict_details' in e.detail:
                return Response(e.detail, status=status.HTTP_409_CONFLICT)
            else:
                raise e
        except Exception as e:
            logger.error(f"Douyin OAuth login error: {e}")
            return Response({
                'error': 'Douyin login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_douyin_access_token(self, code):
        """获取抖音 access_token"""
        # 抖音开放平台配置
        douyin_client_key = 'YOUR_DOUYIN_CLIENT_KEY'  # 需要配置
        douyin_client_secret = 'YOUR_DOUYIN_CLIENT_SECRET'  # 需要配置
        
        token_url = 'https://open.douyin.com/oauth/access_token/'
        data = {
            'client_key': douyin_client_key,
            'client_secret': douyin_client_secret,
            'code': code,
            'grant_type': 'authorization_code'
        }
        
        try:
            response = requests.post(token_url, json=data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('data'):
                    return result['data']
        except Exception as e:
            logger.error(f"Get Douyin access token error: {e}")
        return None
    
    def _get_douyin_user_info(self, access_token, open_id):
        """获取抖音用户信息"""
        user_info_url = 'https://open.douyin.com/oauth/userinfo/'
        params = {
            'access_token': access_token,
            'open_id': open_id
        }
        
        try:
            response = requests.get(user_info_url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('data'):
                    return result['data']
        except Exception as e:
            logger.error(f"Get Douyin user info error: {e}")
        return None
    
    def _create_or_get_user_from_douyin(self, open_id, user_info):
        """从抖音信息创建或获取用户"""
        try:
            user = CustomUser.objects.get(douyin_openid=open_id)
            return user
        except CustomUser.DoesNotExist:
            pass
        
        # 检查是否存在冲突
        conflict_info = self._check_oauth_conflict('douyin', open_id, user_info)
        if conflict_info:
            raise ValidationError(conflict_info)
        
        # 创建新用户
        with transaction.atomic():
            username = f"douyin_{open_id[:10]}"
            nickname = user_info.get('nickname', username)
            
            # 确保用户名唯一
            counter = 1
            original_username = username
            while CustomUser.objects.filter(username=username).exists():
                username = f"{original_username}_{counter}"
                counter += 1
            
            avatar_url = user_info.get('avatar', '')
            user = CustomUser.objects.create(
                username=username,
                nickname=nickname,
                douyin_openid=open_id,
                avatar_url=avatar_url,
                is_active=True
            )
            
            # 缓存第三方头像
            if avatar_url:
                try:
                    cached_url = avatar_cache_manager.cache_avatar(avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                        user.save(update_fields=['avatar'])
                except Exception as e:
                    logger.warning(f"Failed to cache Douyin avatar for user {user.id}: {e}")
            
            return user


class AlipayOAuthLoginView(APIView):
    """
    支付宝 OAuth 登录视图
    处理支付宝第三方登录回调
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        处理支付宝 OAuth登录
        请求参数:
        - auth_code: 支付宝授权码
        - state: 状态参数（可选）
        """
        auth_code = request.data.get('auth_code')
        state = request.data.get('state', '')
        
        if not auth_code:
            return Response({
                'error': 'Authorization code is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. 使用授权码获取access_token
            alipay_token_data = self._get_alipay_access_token(auth_code)
            if not alipay_token_data:
                return Response({
                    'error': 'Failed to get Alipay access token'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. 获取用户信息
            user_info = self._get_alipay_user_info(
                alipay_token_data['access_token']
            )
            if not user_info:
                return Response({
                    'error': 'Failed to get Alipay user info'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. 创建或获取用户
            user = self._create_or_get_user_from_alipay(
                alipay_token_data['user_id'], 
                user_info
            )
            
            # 4. 生成应用token
            token_data = self._generate_oauth_tokens(user)
            
            return Response({
                'access_token': token_data['access_token'],
                'refresh_token': token_data['refresh_token'],
                'expires_in': 3600,
                'token_type': 'Bearer',
                'user': UserProfileSerializer(user).data,
                'provider': 'alipay'
            }, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            # 处理OAuth冲突
            if hasattr(e, 'detail') and isinstance(e.detail, dict) and 'conflict_details' in e.detail:
                return Response(e.detail, status=status.HTTP_409_CONFLICT)
            else:
                raise e
        except Exception as e:
            logger.error(f"Alipay OAuth login error: {e}")
            return Response({
                'error': 'Alipay login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_alipay_access_token(self, auth_code):
        """获取支付宝 access_token"""
        # 支付宝开放平台配置
        alipay_app_id = 'YOUR_ALIPAY_APP_ID'  # 需要配置
        alipay_private_key = 'YOUR_ALIPAY_PRIVATE_KEY'  # 需要配置
        
        # 注意：支付宝需要使用RSA签名，这里简化处理
        # 实际使用时需要使用支付宝SDK进行签名
        token_url = 'https://openapi.alipay.com/gateway.do'
        
        # 这里需要实现支付宝的签名逻辑
        # 由于支付宝API较为复杂，建议使用官方SDK
        try:
            # 实际实现需要使用支付宝SDK
            # 这里返回模拟数据结构
            return {
                'access_token': 'mock_access_token',
                'user_id': 'mock_user_id'
            }
        except Exception as e:
            logger.error(f"Get Alipay access token error: {e}")
        return None
    
    def _get_alipay_user_info(self, access_token):
        """获取支付宝用户信息"""
        # 支付宝用户信息接口
        # 实际使用时需要调用 alipay.user.info.share 接口
        try:
            # 实际实现需要使用支付宝SDK
            # 这里返回模拟数据结构
            return {
                'nick_name': 'Alipay User',
                'avatar': 'https://example.com/avatar.jpg'
            }
        except Exception as e:
            logger.error(f"Get Alipay user info error: {e}")
        return None
    
    def _create_or_get_user_from_alipay(self, user_id, user_info):
        """从支付宝信息创建或获取用户"""
        try:
            user = CustomUser.objects.get(alipay_openid=user_id)
            return user
        except CustomUser.DoesNotExist:
            pass
        
        # 检查是否存在冲突
        conflict_info = self._check_oauth_conflict('alipay', user_id, user_info)
        if conflict_info:
            raise ValidationError(conflict_info)
        
        # 创建新用户
        with transaction.atomic():
            username = f"alipay_{user_id[:10]}"
            nickname = user_info.get('nick_name', username)
            
            # 确保用户名唯一
            counter = 1
            original_username = username
            while CustomUser.objects.filter(username=username).exists():
                username = f"{original_username}_{counter}"
                counter += 1
            
            avatar_url = user_info.get('avatar', '')
            user = CustomUser.objects.create(
                username=username,
                nickname=nickname,
                alipay_openid=user_id,
                avatar_url=avatar_url,
                is_active=True
            )
            
            # 缓存第三方头像
            if avatar_url:
                try:
                    cached_url = avatar_cache_manager.cache_avatar(avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                        user.save(update_fields=['avatar'])
                except Exception as e:
                    logger.warning(f"Failed to cache Alipay avatar for user {user.id}: {e}")
            
            return user

class WeChatOAuthLoginView(APIView):
    """
    微信 OAuth 登录视图
    处理微信第三方登录回调
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        处理微信 OAuth登录
        请求参数:
        - code: 微信授权码
        - state: 状态参数（可选）
        """
        code = request.data.get('code')
        state = request.data.get('state', '')
        
        if not code:
            return Response({
                'error': 'Authorization code is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # 1. 使用授权码获取access_token
            wechat_token_data = self._get_wechat_access_token(code)
            if not wechat_token_data:
                return Response({
                    'error': 'Failed to get WeChat access token'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 2. 获取用户信息
            user_info = self._get_wechat_user_info(
                wechat_token_data['access_token'],
                wechat_token_data['openid']
            )
            if not user_info:
                return Response({
                    'error': 'Failed to get WeChat user info'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 3. 创建或获取用户
            user = self._create_or_get_user_from_wechat(
                wechat_token_data['openid'], user_info
            )
            
            # 4. 生成应用token
            token_data = self._generate_oauth_tokens(user)
            
            return Response({
                'access_token': token_data['access_token'],
                'refresh_token': token_data['refresh_token'],
                'expires_in': 3600,
                'token_type': 'Bearer',
                'user': UserProfileSerializer(user).data,
                'provider': 'wechat'
            }, status=status.HTTP_200_OK)
            
        except ValidationError as e:
            # 处理OAuth冲突
            if hasattr(e, 'detail') and isinstance(e.detail, dict) and 'conflict_details' in e.detail:
                return Response(e.detail, status=status.HTTP_409_CONFLICT)
            else:
                raise e
        except Exception as e:
            logger.error(f"WeChat OAuth login error: {e}")
            return Response({
                'error': 'WeChat login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_wechat_access_token(self, code):
        """获取微信 access_token"""
        # 这里需要配置微信应用的appid和secret
        wechat_appid = 'YOUR_WECHAT_APPID'  # 需要配置
        wechat_secret = 'YOUR_WECHAT_SECRET'  # 需要配置
        
        token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token'
        params = {
            'appid': wechat_appid,
            'secret': wechat_secret,
            'code': code,
            'grant_type': 'authorization_code'
        }
        
        try:
            response = requests.get(token_url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data:
                    return data
        except Exception as e:
            logger.error(f"Get WeChat access token error: {e}")
        return None
    
    def _get_wechat_user_info(self, access_token, openid):
        """获取微信用户信息"""
        user_info_url = 'https://api.weixin.qq.com/sns/userinfo'
        params = {
            'access_token': access_token,
            'openid': openid,
            'lang': 'zh_CN'
        }
        
        try:
            response = requests.get(user_info_url, params=params, timeout=10)
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            logger.error(f"Get WeChat user info error: {e}")
        return None
    
    def _create_or_get_user_from_wechat(self, openid, user_info):
        """从微信信息创建或获取用户"""
        # 尝试通过微信 OpenID查找现有用户
        # 这里假设在CustomUser模型中有wechat_openid字段
        try:
            user = CustomUser.objects.get(wechat_openid=openid)
            return user
        except CustomUser.DoesNotExist:
            pass
        
        # 检查是否存在冲突
        conflict_info = self._check_oauth_conflict('wechat', openid, user_info)
        if conflict_info:
            raise ValidationError(conflict_info)
        
        # 创建新用户
        with transaction.atomic():
            username = f"wechat_{openid[:10]}"  # 生成用户名
            nickname = user_info.get('nickname', username)
            
            # 确保用户名唯一
            counter = 1
            original_username = username
            while CustomUser.objects.filter(username=username).exists():
                username = f"{original_username}_{counter}"
                counter += 1
            
            avatar_url = user_info.get('headimgurl', '')
            user = CustomUser.objects.create(
                username=username,
                nickname=nickname,
                wechat_openid=openid,
                avatar_url=avatar_url,
                is_active=True
            )
            
            # 缓存第三方头像
            if avatar_url:
                try:
                    cached_url = avatar_cache_manager.cache_avatar(avatar_url, user.id)
                    if cached_url:
                        user.avatar = cached_url
                        user.save(update_fields=['avatar'])
                except Exception as e:
                    logger.warning(f"Failed to cache WeChat avatar for user {user.id}: {e}")
            
            return user
    
    def _generate_oauth_tokens(self, user):
        """生成OAuth tokens"""
        try:
            application = Application.objects.get(client_id='frontend-client')
        except Application.DoesNotExist:
            raise Exception('OAuth application not found')
        
        # 删除用户的旧令牌
        AccessToken.objects.filter(user=user, application=application).delete()
        RefreshToken.objects.filter(user=user, application=application).delete()
        
        # 创建新的访问令牌
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            token=secrets.token_urlsafe(32),
            expires=timezone.now() + timedelta(seconds=3600),
            scope='read write'
        )
        
        # 创建刷新令牌
        refresh_token = RefreshToken.objects.create(
            user=user,
            application=application,
            token=secrets.token_urlsafe(32),
            access_token=access_token
        )
        
        return {
            'access_token': access_token.token,
            'refresh_token': refresh_token.token
        }