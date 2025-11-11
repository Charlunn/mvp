from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status, serializers
from django.contrib.auth import authenticate
from django.db import models
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from .models import CustomUser
from .serializers import UserProfileSerializer
import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    自定义JWT Token序列化器，支持用户名、邮箱、手机号登录
    """
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if not username or not password:
            raise serializers.ValidationError('用户名和密码不能为空')
        
        # 支持用户名、邮箱、手机号登录
        user = None
        try:
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
            raise serializers.ValidationError('用户名或密码错误')
        
        if not user.is_active:
            raise serializers.ValidationError('用户账户已被禁用')
        
        # 生成token
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserProfileSerializer(user).data
        }

class JWTLoginView(TokenObtainPairView):
    """
    JWT 登录视图
    接收用户名/密码，返回access_token和refresh_token
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                data = response.data
                return Response({
                    'access_token': data['access'],
                    'refresh_token': data['refresh'],
                    'token_type': 'Bearer',
                    'expires_in': 3600,  # 1 hour
                    'user': data['user']
                }, status=status.HTTP_200_OK)
            return response
        except Exception as e:
            logger.error(f"JWT Login error: {e}")
            return Response({
                'error': '登录失败，请检查用户名和密码'
            }, status=status.HTTP_401_UNAUTHORIZED)

class JWTLogoutView(APIView):
    """
    JWT 登出视图
    将refresh token加入黑名单
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': '成功登出'
            }, status=status.HTTP_200_OK)
        except TokenError as e:
            logger.error(f"JWT Logout error: {e}")
            return Response({
                'error': '登出失败'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"JWT Logout error: {e}")
            return Response({
                'error': '登出失败'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class JWTRefreshTokenView(TokenRefreshView):
    """
    JWT 刷新令牌视图
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                data = response.data
                return Response({
                    'access_token': data['access'],
                    'token_type': 'Bearer',
                    'expires_in': 3600  # 1 hour
                }, status=status.HTTP_200_OK)
            return response
        except Exception as e:
            logger.error(f"JWT Token refresh error: {e}")
            return Response({
                'error': '刷新令牌失败'
            }, status=status.HTTP_401_UNAUTHORIZED)

class JWTVerifyTokenView(APIView):
    """
    JWT 令牌验证视图
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user_serializer = UserProfileSerializer(request.user)
            return Response({
                'valid': True,
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"JWT Token verification error: {e}")
            return Response({
                'valid': False,
                'error': '令牌验证失败'
            }, status=status.HTTP_401_UNAUTHORIZED)

class JWTUserProfileView(APIView):
    """
    获取当前用户信息视图
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user_serializer = UserProfileSerializer(request.user)
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Get user profile error: {e}")
            return Response({
                'error': '获取用户信息失败'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)