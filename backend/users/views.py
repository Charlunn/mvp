from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from django.db.models import Q, Avg, Max
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    BindEmailSerializer,
    BindPhoneSerializer,
    PasswordValidationSerializer,
    UserSettingsSerializer,
)
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken # Import necessary models
from .models import CustomUser
from utils.permissions import IsAdminUser, IsOwnerOrAdmin
from quiz.models import QuizAttempt
import logging
import re
import random
import string

logger = logging.getLogger(__name__)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Registration validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        user = serializer.save()
        # 在这里可以添加一些额外的逻辑，例如发送注册确认邮件等
        pass


class PasswordValidationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordValidationSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"valid": True}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(TokenObtainPairView):
    # 使用我们自定义的登录序列化器来处理账号/邮箱/手机号登录逻辑
    serializer_class = UserLoginSerializer

class UserLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist() # 将 refresh_token 加入黑名单 (如果启用了黑名单)
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid token or token not provided"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated] # 只允许认证用户访问

    def get_object(self):
        # 返回当前登录用户
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        # 在这里可以添加逻辑来检查邮箱或手机号是否发生了变化，并触发验证流程
        # 目前我们只依赖序列化器的 validate 方法进行唯一性校验

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        # 返回更新后的用户个人信息，包括头像的 URL
        # 使用 UserProfileSerializer 再次序列化 instance 以确保返回最新的数据
        return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()
        # 在这里可以添加一些额外的逻辑，例如记录修改日志等
        pass


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid():
                if not self.object.check_password(serializer.validated_data.get("old_password")):
                    logger.warning(f"User {self.object.id} attempted password change with wrong old password")
                    return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

                self.object.set_password(serializer.validated_data.get("new_password"))
                self.object.save()
                logger.info(f"User {self.object.id} successfully changed password")

                # Blacklist all refresh tokens for the user
                try:
                    for token in OutstandingToken.objects.filter(user=self.object):
                        t, _ = BlacklistedToken.objects.get_or_create(token=token)
                    logger.info(f"Blacklisted tokens for user {self.object.id} after password change")
                except Exception as e:
                    logger.error(f"Error blacklisting tokens for user {self.object.id}: {e}")

                return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error changing password for user {self.object.id}: {e}")
            return Response({"detail": "An error occurred while changing password"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    pass


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        try:
            user_id = user.id
            user.delete()
            logger.info(f"User {user_id} successfully deleted their account")
            return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(f"Error deleting account for user {user.id}: {e}")
            return Response({"detail": "An error occurred while deleting account"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class BindEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = BindEmailSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if serializer.validated_data['code'] != '123456':
                logger.warning(f"User {request.user.id} attempted email binding with invalid code")
                return Response({'detail': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
            request.user.email = serializer.validated_data['email']
            request.user.save()
            logger.info(f"User {request.user.id} successfully bound email: {serializer.validated_data['email']}")
            return Response({'message': 'Email bound successfully'})
        except Exception as e:
            logger.error(f"Error binding email for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while binding email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BindPhoneView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = BindPhoneSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if serializer.validated_data['code'] != '123456':
                logger.warning(f"User {request.user.id} attempted phone binding with invalid code")
                return Response({'detail': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
            request.user.phone_number = serializer.validated_data['phone_number']
            request.user.save()
            logger.info(f"User {request.user.id} successfully bound phone: {serializer.validated_data['phone_number']}")
            return Response({'message': 'Phone number bound successfully'})
        except Exception as e:
            logger.error(f"Error binding phone for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while binding phone'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UnbindEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.email = ''
            request.user.save()
            logger.info(f"User {request.user.id} successfully unbound email")
            return Response({'message': 'Email unbound'})
        except Exception as e:
            logger.error(f"Error unbinding email for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while unbinding email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UnbindPhoneView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.phone_number = None
            request.user.save()
            logger.info(f"User {request.user.id} successfully unbound phone")
            return Response({'message': 'Phone number unbound'})
        except Exception as e:
            logger.error(f"Error unbinding phone for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while unbinding phone'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminUserListView(generics.ListAPIView):
    """管理员查看所有用户列表"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]
    queryset = CustomUser.objects.all()
    
    def get_queryset(self):
        queryset = CustomUser.objects.all().order_by('-date_joined')
        
        # 搜索功能
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) | 
                Q(email__icontains=search) | 
                Q(nickname__icontains=search)
            )
        
        # 用户类型筛选
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        return queryset


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """管理员查看和管理特定用户"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]
    queryset = CustomUser.objects.all()


class UserStatsView(APIView):
    """MVP用户仪表盘统计"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            attempts = QuizAttempt.objects.filter(user=user)
            summary = attempts.aggregate(
                avg_score=Avg('score'),
                best_score=Max('score'),
            )
            last_attempt = attempts.order_by('-created_at').values('score', 'level', 'created_at').first()
            
            stats = {
                'quiz_attempts_count': attempts.count(),
                'average_score': round(summary['avg_score'] or 0, 2),
                'best_score': summary['best_score'] or 0,
                'last_attempt': last_attempt,
            }
            
            logger.info(f"Retrieved MVP stats for user {user.id}")
            return Response(stats)
        except Exception as e:
            logger.error(f"Error retrieving MVP stats for user {request.user.id}: {e}")
            return Response({'detail': 'An error occurred while retrieving user stats'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckUsernameView(APIView):
    """实时校验用户名可用性并提供推荐"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username', '').strip()
            
            if not username:
                return Response({
                    'available': False,
                    'message': '用户名不能为空',
                    'suggestions': []
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 验证用户名格式（只允许大小写字母、数字、下划线）
            if not re.match(r'^[a-zA-Z0-9_]+$', username):
                return Response({
                    'available': False,
                    'message': '用户名只能包含大小写字母、数字和下划线',
                    'suggestions': self._generate_suggestions(username)
                })
            
            # 检查长度限制
            if len(username) < 3 or len(username) > 50:
                return Response({
                    'available': False,
                    'message': '用户名长度必须在3-50个字符之间',
                    'suggestions': self._generate_suggestions(username)
                })
            
            # 检查是否已被占用（检查username和platform_username字段）
            is_taken = CustomUser.objects.filter(
                Q(username=username) | Q(platform_username=username)
            ).exists()
            
            if is_taken:
                suggestions = self._generate_suggestions(username)
                return Response({
                    'available': False,
                    'message': '该用户名已被占用',
                    'suggestions': suggestions
                })
            
            return Response({
                'available': True,
                'message': '用户名可用',
                'suggestions': []
            })
            
        except Exception as e:
            logger.error(f"Error checking username availability: {e}")
            return Response({
                'available': False,
                'message': '检查用户名时发生错误',
                'suggestions': []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_suggestions(self, username):
        """生成推荐用户名"""
        suggestions = []
        
        # 过滤用户名，只保留合法字符
        clean_username = re.sub(r'[^a-zA-Z0-9_]', '', username)
        if not clean_username:
            clean_username = 'user'
        
        # 生成3个推荐选项
        for i in range(3):
            # 策略1：原用户名 + 随机数字
            suggestion = clean_username + str(random.randint(100, 9999))
            
            # 策略2：原用户名 + 随机字母
            if i == 1:
                suggestion = clean_username + ''.join(random.choices(string.ascii_lowercase, k=2))
            
            # 策略3：原用户名 + 下划线 + 随机数字
            if i == 2:
                suggestion = clean_username + '_' + str(random.randint(10, 999))
            
            # 确保推荐的用户名未被占用
            if not CustomUser.objects.filter(
                Q(username=suggestion) | Q(platform_username=suggestion)
            ).exists():
                suggestions.append(suggestion)
        
        # 如果生成的建议不足3个，补充更多随机选项
        while len(suggestions) < 3:
            suggestion = clean_username + str(random.randint(1000, 99999))
            if not CustomUser.objects.filter(
                Q(username=suggestion) | Q(platform_username=suggestion)
            ).exists() and suggestion not in suggestions:
                suggestions.append(suggestion)
        
        return suggestions[:3]


class OAuthRegistrationView(APIView):
    """第三方登录注册信息补全视图"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # 获取第三方登录信息
            provider = request.data.get('provider')  # qq, wechat, douyin, alipay
            openid = request.data.get('openid')
            third_party_info = request.data.get('third_party_info', {})
            
            # 用户填写的注册信息
            platform_username = request.data.get('platform_username', '').strip()
            password = request.data.get('password')
            email = request.data.get('email', '').strip()
            phone = request.data.get('phone', '').strip()
            nickname = request.data.get('nickname', '').strip()
            
            # 验证必填字段
            if not all([provider, openid, platform_username, password]):
                return Response({
                    'error': '缺少必填字段'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 验证至少填写邮箱或手机号
            if not email and not phone:
                return Response({
                    'error': '请至少填写邮箱或手机号'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 验证平台账号格式
            if not re.match(r'^[a-zA-Z0-9_]+$', platform_username):
                return Response({
                    'error': '平台账号只能包含大小写字母、数字和下划线'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 检查平台账号是否已被占用
            if CustomUser.objects.filter(
                Q(username=platform_username) | Q(platform_username=platform_username)
            ).exists():
                return Response({
                    'error': '平台账号已被占用'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 检查第三方账号是否已绑定
            openid_field = f'{provider}_openid'
            existing_user = CustomUser.objects.filter(**{openid_field: openid}).first()
            if existing_user:
                return Response({
                    'error': '该第三方账号已绑定其他用户',
                    'conflict': True,
                    'existing_user': {
                        'masked_nickname': self._mask_nickname(existing_user.nickname),
                        'avatar_url': existing_user.avatar_url
                    }
                }, status=status.HTTP_409_CONFLICT)
            
            # 创建新用户
            with transaction.atomic():
                user_data = {
                    'username': platform_username,
                    'platform_username': platform_username,
                    'nickname': nickname or third_party_info.get('nickname', platform_username),
                    'email': email,
                    'phone': phone,
                    'avatar_url': third_party_info.get('avatar_url', ''),
                    'is_active': True,
                    openid_field: openid
                }
                
                user = CustomUser.objects.create_user(
                    password=password,
                    **user_data
                )
                
                # 生成JWT token
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'message': '注册成功',
                    'user': UserProfileSerializer(user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    }
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"OAuth registration error: {e}")
            return Response({
                'error': '注册失败，请稍后重试'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _mask_nickname(self, nickname):
        """掩码昵称显示"""
        if not nickname or len(nickname) <= 2:
            return nickname
        
        if len(nickname) <= 4:
            return nickname[0] + '*' * (len(nickname) - 2) + nickname[-1]
        else:
            return nickname[:2] + '*' * (len(nickname) - 4) + nickname[-2:]


class OAuthConflictResolveView(APIView):
    """第三方账户冲突处理视图"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            provider = request.data.get('provider')
            openid = request.data.get('openid')
            action = request.data.get('action')  # 'login' 或 'unbind_and_register'
            
            if not all([provider, openid, action]):
                return Response({
                    'error': '缺少必填字段'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            openid_field = f'{provider}_openid'
            existing_user = CustomUser.objects.filter(**{openid_field: openid}).first()
            
            if not existing_user:
                return Response({
                    'error': '未找到绑定的用户'
                }, status=status.HTTP_404_NOT_FOUND)
            
            if action == 'login':
                # 直接登录现有账户
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(existing_user)
                
                return Response({
                    'message': '登录成功',
                    'user': UserProfileSerializer(existing_user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    }
                }, status=status.HTTP_200_OK)
            
            elif action == 'unbind_and_register':
                # 解绑原账户并准备重新注册
                with transaction.atomic():
                    # 清除原用户的第三方绑定
                    setattr(existing_user, openid_field, None)
                    existing_user.save()
                    
                    return Response({
                        'message': '已解绑原账户，请继续注册流程'
                    }, status=status.HTTP_200_OK)
            
            else:
                return Response({
                    'error': '无效的操作类型'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"OAuth conflict resolve error: {e}")
            return Response({
                 'error': '处理冲突时发生错误'
             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BindOAuthAccountView(APIView):
    """绑定第三方账户视图"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            provider = request.data.get('provider')  # qq, wechat, douyin, alipay
            openid = request.data.get('openid')
            third_party_info = request.data.get('third_party_info', {})
            
            if not all([provider, openid]):
                return Response({
                    'error': '缺少必填字段'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if provider not in ['qq', 'wechat', 'douyin', 'alipay']:
                return Response({
                    'error': '不支持的第三方平台'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            openid_field = f'{provider}_openid'
            
            # 检查当前用户是否已绑定该平台
            if getattr(user, openid_field):
                return Response({
                    'error': f'您已绑定{provider}账户'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 检查该第三方账号是否已被其他用户绑定
            existing_user = CustomUser.objects.filter(**{openid_field: openid}).first()
            if existing_user and existing_user != user:
                return Response({
                    'error': '该第三方账号已被其他用户绑定',
                    'conflict': True,
                    'existing_user': {
                        'masked_nickname': self._mask_nickname(existing_user.nickname),
                        'avatar_url': existing_user.avatar_url
                    }
                }, status=status.HTTP_409_CONFLICT)
            
            # 绑定第三方账户
            with transaction.atomic():
                setattr(user, openid_field, openid)
                
                # 如果用户没有头像，使用第三方头像
                if not user.avatar_url and third_party_info.get('avatar_url'):
                    user.avatar_url = third_party_info['avatar_url']
                
                user.save()
                
                return Response({
                    'message': f'成功绑定{provider}账户',
                    'user': UserProfileSerializer(user).data
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Bind OAuth account error: {e}")
            return Response({
                'error': '绑定失败，请稍后重试'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _mask_nickname(self, nickname):
        """掩码昵称显示"""
        if not nickname or len(nickname) <= 2:
            return nickname
        
        if len(nickname) <= 4:
            return nickname[0] + '*' * (len(nickname) - 2) + nickname[-1]
        else:
            return nickname[:2] + '*' * (len(nickname) - 4) + nickname[-2:]


class UnbindOAuthAccountView(APIView):
    """解绑第三方账户视图"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            provider = request.data.get('provider')
            password = request.data.get('password')  # 需要密码验证
            
            if not all([provider, password]):
                return Response({
                    'error': '缺少必填字段'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if provider not in ['qq', 'wechat', 'douyin', 'alipay']:
                return Response({
                    'error': '不支持的第三方平台'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            
            # 验证密码
            if not user.check_password(password):
                return Response({
                    'error': '密码错误'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            openid_field = f'{provider}_openid'
            
            # 检查是否已绑定该平台
            if not getattr(user, openid_field):
                return Response({
                    'error': f'您尚未绑定{provider}账户'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # 解绑第三方账户
            with transaction.atomic():
                setattr(user, openid_field, None)
                user.save()
                
                return Response({
                    'message': f'成功解绑{provider}账户',
                    'user': UserProfileSerializer(user).data
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Unbind OAuth account error: {e}")
            return Response({
                'error': '解绑失败，请稍后重试'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetOAuthBindingStatusView(APIView):
    """获取用户第三方账户绑定状态"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            
            binding_status = {
                'qq': {
                    'bound': bool(user.qq_openid),
                    'openid': user.qq_openid[:8] + '***' if user.qq_openid else None
                },
                'wechat': {
                    'bound': bool(user.wechat_openid),
                    'openid': user.wechat_openid[:8] + '***' if user.wechat_openid else None
                },
                'douyin': {
                    'bound': bool(user.douyin_openid),
                    'openid': user.douyin_openid[:8] + '***' if user.douyin_openid else None
                },
                'alipay': {
                    'bound': bool(user.alipay_openid),
                    'openid': user.alipay_openid[:8] + '***' if user.alipay_openid else None
                }
            }
            
            return Response({
                'binding_status': binding_status
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Get OAuth binding status error: {e}")
            return Response({
                 'error': '获取绑定状态失败'
             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserOnboardingView(APIView):
    """用户注册后引导流程视图"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            
            # 获取用户填写的基本信息
            age_range = request.data.get('age_range')  # 年龄段
            gender = request.data.get('gender')  # 性别
            occupation = request.data.get('occupation')  # 职业大类
            
            # 验证字段值
            valid_age_ranges = ['under_18', '18_25', '26_35', '36_45', '46_55', 'over_55', 'prefer_not_say']
            valid_genders = ['male', 'female', 'other', 'prefer_not_say']
            valid_occupations = [
                'student', 'teacher', 'engineer', 'doctor', 'business',
                'government', 'freelancer', 'retired', 'other', 'prefer_not_say'
            ]
            
            # 更新用户信息（可选字段）
            updated = False
            if age_range and age_range in valid_age_ranges:
                user.age_range = age_range
                updated = True
            
            if gender and gender in valid_genders:
                user.gender = gender
                updated = True
            
            if occupation and occupation in valid_occupations:
                user.occupation = occupation
                updated = True
            
            if updated:
                user.save()
            
            # 标记用户已完成引导流程
            user.onboarding_completed = True
            user.save()
            
            return Response({
                'message': '引导流程完成',
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"User onboarding error: {e}")
            return Response({
                'error': '引导流程失败，请稍后重试'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request):
        """获取引导流程选项"""
        try:
            options = {
                'age_ranges': [
                    {'value': 'under_18', 'label': '18岁以下'},
                    {'value': '18_25', 'label': '18-25岁'},
                    {'value': '26_35', 'label': '26-35岁'},
                    {'value': '36_45', 'label': '36-45岁'},
                    {'value': '46_55', 'label': '46-55岁'},
                    {'value': 'over_55', 'label': '55岁以上'},
                    {'value': 'prefer_not_say', 'label': '不愿透露'}
                ],
                'genders': [
                    {'value': 'male', 'label': '男'},
                    {'value': 'female', 'label': '女'},
                    {'value': 'other', 'label': '其他'},
                    {'value': 'prefer_not_say', 'label': '不愿透露'}
                ],
                'occupations': [
                    {'value': 'student', 'label': '学生'},
                    {'value': 'teacher', 'label': '教师'},
                    {'value': 'engineer', 'label': '工程师'},
                    {'value': 'doctor', 'label': '医生'},
                    {'value': 'business', 'label': '商务人员'},
                    {'value': 'government', 'label': '政府工作人员'},
                    {'value': 'freelancer', 'label': '自由职业者'},
                    {'value': 'retired', 'label': '退休人员'},
                    {'value': 'other', 'label': '其他'},
                    {'value': 'prefer_not_say', 'label': '不愿透露'}
                ]
            }
            
            return Response({
                'options': options,
                'user_completed': request.user.onboarding_completed if hasattr(request.user, 'onboarding_completed') else False
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Get onboarding options error: {e}")
            return Response({
                'error': '获取选项失败'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
