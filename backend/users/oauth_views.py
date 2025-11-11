from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from django.db import models
from django.utils import timezone
from datetime import timedelta
from oauth2_provider.models import Application, AccessToken, RefreshToken
import secrets
from django.http import JsonResponse
import json
from .models import CustomUser
from .serializers import UserProfileSerializer
import logging

logger = logging.getLogger(__name__)

class OAuth2LoginView(APIView):
    """
    OAuth 2.0 登录视图
    接收用户名/密码，返回access_token和refresh_token
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 支持用户名、邮箱、手机号登录
        user = None
        try:
            # 尝试通过用户名、邮箱或手机号查找用户
            user_query = CustomUser.objects.filter(
                models.Q(username=username) | 
                models.Q(email=username) | 
                models.Q(phone_number=username)
            ).first()
            
            if user_query:
                user = authenticate(username=user_query.username, password=password)
        except Exception as e:
            logger.error(f"Login error: {e}")
            
        if not user:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # 获取OAuth应用
        try:
            application = Application.objects.get(client_id='frontend-client')
        except Application.DoesNotExist:
            return Response({
                'error': 'OAuth application not found'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # 创建访问令牌
        from datetime import datetime, timedelta
        from django.utils import timezone
        
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
        
        # 返回用户信息和令牌
        user_serializer = UserProfileSerializer(user)
        
        return Response({
            'access_token': access_token.token,
            'refresh_token': refresh_token.token,
            'expires_in': 3600,
            'token_type': 'Bearer',
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)

class OAuth2LogoutView(APIView):
    """
    OAuth 2.0 登出视图
    撤销用户的访问令牌
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # 获取当前用户的所有令牌并删除
            AccessToken.objects.filter(user=request.user).delete()
            RefreshToken.objects.filter(user=request.user).delete()
            
            return Response({
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Logout error: {e}")
            return Response({
                'error': 'Logout failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OAuth2RefreshTokenView(APIView):
    """
    OAuth 2.0 刷新令牌视图
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token_string = request.data.get('refresh_token')
        
        if not refresh_token_string:
            return Response({
                'error': 'Refresh token is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            refresh_token = RefreshToken.objects.get(token=refresh_token_string)
            
            # 检查刷新令牌是否过期
            if refresh_token.access_token.is_expired():
                # 创建新的访问令牌
                new_access_token = AccessToken.objects.create(
                    user=refresh_token.user,
                    application=refresh_token.application,
                    token=secrets.token_urlsafe(32),
                    expires=timezone.now() + timedelta(seconds=3600),
                    scope=refresh_token.access_token.scope
                )
                
                # 更新刷新令牌关联的访问令牌
                refresh_token.access_token = new_access_token
                refresh_token.save()
                
                return Response({
                    'access_token': new_access_token.token,
                    'expires_in': 3600,
                    'token_type': 'Bearer'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'access_token': refresh_token.access_token.token,
                    'expires_in': int((refresh_token.access_token.expires - timezone.now()).total_seconds()),
                    'token_type': 'Bearer'
                }, status=status.HTTP_200_OK)
                
        except RefreshToken.DoesNotExist:
            return Response({
                'error': 'Invalid refresh token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Token refresh error: {e}")
            return Response({
                'error': 'Token refresh failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OAuth2VerifyTokenView(APIView):
    """
    OAuth 2.0 令牌验证视图
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        
        if not token:
            return Response({
                'error': 'Token is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            access_token = AccessToken.objects.get(token=token)
            
            if access_token.is_expired():
                return Response({
                    'valid': False,
                    'error': 'Token expired'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            user_serializer = UserProfileSerializer(access_token.user)
            
            return Response({
                'valid': True,
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
            
        except AccessToken.DoesNotExist:
            return Response({
                'valid': False,
                'error': 'Invalid token'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            return Response({
                'valid': False,
                'error': 'Token verification failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)