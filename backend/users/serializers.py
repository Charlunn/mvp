from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from utils.avatar_cache import avatar_cache_manager

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    avatar = serializers.ImageField(required=False) # 添加头像字段，非必填

    class Meta:
        model = CustomUser
        fields = ('username', 'nickname', 'password', 'password2', 'email', 'phone_number', 'avatar') # 包含头像字段
        extra_kwargs = {
            'username': {'required': True},
            'nickname': {'required': False},
            'email': {'required': False},
            'phone_number': {'required': False},
            'avatar': {'required': False}, # 明确指定 avatar 为非必填
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        avatar_file = validated_data.pop('avatar', None)

        email = validated_data.get('email')
        phone_number = validated_data.get('phone_number')

        # Convert empty strings to None for fields that allow null=True and have unique=True
        if email == '':
            validated_data['email'] = None
        if phone_number == '':
            validated_data['phone_number'] = None

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            nickname=validated_data.get('nickname'),
            email=validated_data.get('email'),
            phone_number=validated_data.get('phone_number')
        )
        user.user_type = 'normal'
        if avatar_file:
            user.avatar = avatar_file
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    cached_avatar_url = serializers.SerializerMethodField()
    community_stats = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'username',
            'nickname',
            'email',
            'phone_number',
            'fraud_level',
            'user_type',
            'is_staff',
            'is_superuser',
            'avatar',
            'avatar_url',
            'cached_avatar_url',
            'profile_visibility',
            'show_email',
            'show_phone',
            'allow_friend_requests',
            'show_online_status',
            'community_stats',
        )
        read_only_fields = (
            'username',
            'fraud_level',
            'user_type',
            'is_staff',
            'is_superuser',
            'cached_avatar_url',
            'community_stats',
        )
    
    def get_cached_avatar_url(self, obj):
        """
        获取缓存的头像URL
        优先返回本地头像，其次返回缓存的第三方头像，最后返回原始第三方头像
        """
        # 如果有本地上传的头像，优先使用
        if obj.avatar:
            return self.context['request'].build_absolute_uri(obj.avatar.url) if 'request' in self.context else obj.avatar.url
        
        # 如果有第三方头像URL，尝试获取缓存版本
        if obj.avatar_url:
            try:
                cached_url = avatar_cache_manager.get_cached_avatar_url(obj.avatar_url)
                if cached_url and 'request' in self.context:
                    # 如果是相对路径，转换为绝对路径
                    if not cached_url.startswith(('http://', 'https://')):
                        return self.context['request'].build_absolute_uri(cached_url)
                return cached_url
            except Exception:
                # 如果缓存失败，返回原始URL
                return obj.avatar_url

        return None

    def get_community_stats(self, obj):
        try:
            from community.models import Comment, CommentLike, Post, PostLike

            posts_count = Post.objects.filter(author=obj, is_deleted=False).count()
            comments_count = Comment.objects.filter(author=obj, is_deleted=False).count()
            post_likes = PostLike.objects.filter(post__author=obj).count()
            comment_likes = CommentLike.objects.filter(comment__author=obj).count()
            return {
                'posts_published': posts_count,
                'comments_written': comments_count,
                'post_likes_received': post_likes,
                'comment_likes_received': comment_likes,
            }
        except Exception:
            return {
                'posts_published': 0,
                'comments_written': 0,
                'post_likes_received': 0,
                'comment_likes_received': 0,
            }

    def validate_email(self, value):
        # 校验邮箱唯一性
        if value and self.instance and CustomUser.objects.exclude(id=self.instance.id).filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_phone_number(self, value):
        # 校验手机号唯一性
        if value and self.instance and CustomUser.objects.exclude(id=self.instance.id).filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def update(self, instance, validated_data):
        # 在这里可以处理更复杂的更新逻辑，例如触发验证码发送
        # 目前只进行简单的更新
        return super().update(instance, validated_data)


class UserLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Call the parent class's validate method to get the tokens
        data = super().validate(attrs)

        # Add the user data to the response
        # The user object is available via self.user after successful validation
        user_serializer = UserProfileSerializer(self.user)
        data['user'] = user_serializer.data

        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    new_password2 = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "New passwords do not match"})
        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect old password.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class PublicUserProfileSerializer(serializers.ModelSerializer):
    cached_avatar_url = serializers.SerializerMethodField()
    community_stats = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    is_self = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'username',
            'nickname',
            'fraud_level',
            'user_type',
            'avatar_url',
            'cached_avatar_url',
            'profile_visibility',
            'show_email',
            'show_phone',
            'allow_friend_requests',
            'show_online_status',
            'community_stats',
            'email',
            'phone_number',
            'is_self',
        )
        read_only_fields = fields

    def _viewer(self):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return request.user
        return None

    def _can_view_sensitive(self, obj):
        viewer = self._viewer()
        if not viewer:
            return False
        if viewer == obj:
            return True
        if viewer.is_superuser or viewer.is_staff or getattr(viewer, 'user_type', '') == 'admin':
            return True
        return False

    def get_cached_avatar_url(self, obj):
        helper = UserProfileSerializer(context=self.context)
        return helper.get_cached_avatar_url(obj)

    def get_community_stats(self, obj):
        helper = UserProfileSerializer(context=self.context)
        return helper.get_community_stats(obj)

    def get_email(self, obj):
        if obj.show_email or self._can_view_sensitive(obj):
            return obj.email
        return None

    def get_phone_number(self, obj):
        if obj.show_phone or self._can_view_sensitive(obj):
            return obj.phone_number
        return None

    def get_is_self(self, obj):
        viewer = self._viewer()
        return bool(viewer and viewer == obj)


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'language', 'theme',
            # 通知设置
            'email_notifications', 'push_notifications', 'sms_notifications',
            'marketing_emails', 'security_alerts',
            # 隐私设置
            'profile_visibility', 'show_email', 'show_phone',
            'allow_friend_requests', 'show_online_status'
        )
    
    def validate_profile_visibility(self, value):
        """验证个人资料可见性设置"""
        valid_choices = ['public', 'friends', 'private']
        if value not in valid_choices:
            raise serializers.ValidationError(f"Invalid choice. Must be one of: {valid_choices}")
        return value


class BindEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()


class BindPhoneSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    code = serializers.CharField()


class PasswordValidationSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        password = attrs.get('password')
        temp_user = CustomUser(
            username=attrs.get('username') or '',
            email=attrs.get('email') or '',
            phone_number=attrs.get('phone_number') or '',
        )
        try:
            validate_password(password, temp_user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": exc.messages})
        return attrs
