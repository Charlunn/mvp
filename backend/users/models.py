from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    user_type = models.CharField(max_length=20, default='normal')
    fraud_level = models.IntegerField(default=0)
    phone_number = models.CharField(max_length=15, blank=True, null=True, unique=True)
    nickname = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    theme = models.CharField(max_length=10, default='light')
    
    # 通知设置
    email_notifications = models.BooleanField(default=True)  # 邮件通知
    push_notifications = models.BooleanField(default=True)   # 推送通知
    sms_notifications = models.BooleanField(default=False)   # 短信通知
    marketing_emails = models.BooleanField(default=False)    # 营销邮件
    security_alerts = models.BooleanField(default=True)      # 安全警报
    
    # 隐私设置
    profile_visibility = models.CharField(max_length=20, default='public', choices=[
        ('public', '公开'),
        ('friends', '仅好友'),
        ('private', '私密')
    ])
    show_email = models.BooleanField(default=False)          # 显示邮箱
    show_phone = models.BooleanField(default=False)          # 显示手机号
    allow_friend_requests = models.BooleanField(default=True) # 允许好友请求
    show_online_status = models.BooleanField(default=True)    # 显示在线状态
    
    # 第三方登录字段
    qq_openid = models.CharField(max_length=100, blank=True, null=True, unique=True)  # QQ OpenID
    wechat_openid = models.CharField(max_length=100, blank=True, null=True, unique=True)  # 微信 OpenID
    douyin_openid = models.CharField(max_length=100, blank=True, null=True, unique=True)  # 抖音 OpenID
    alipay_openid = models.CharField(max_length=100, blank=True, null=True, unique=True)  # 支付宝 OpenID
    
    # 平台账号（用户自定义的平台唯一标识）
    platform_username = models.CharField(max_length=50, blank=True, null=True, unique=True)  # 平台账号
    
    # 用户基本信息（注册后引导收集）
    age_range = models.CharField(max_length=20, blank=True, null=True, choices=[
        ('under_18', '18岁以下'),
        ('18_25', '18-25岁'),
        ('26_35', '26-35岁'),
        ('36_45', '36-45岁'),
        ('46_55', '46-55岁'),
        ('over_55', '55岁以上'),
        ('prefer_not_say', '不愿透露')
    ])
    gender = models.CharField(max_length=20, blank=True, null=True, choices=[
        ('male', '男'),
        ('female', '女'),
        ('other', '其他'),
        ('prefer_not_say', '不愿透露')
    ])
    occupation = models.CharField(max_length=50, blank=True, null=True, choices=[
        ('student', '学生'),
        ('teacher', '教师'),
        ('engineer', '工程师'),
        ('doctor', '医生'),
        ('business', '商务人员'),
        ('government', '政府工作人员'),
        ('freelancer', '自由职业者'),
        ('retired', '退休人员'),
        ('other', '其他'),
        ('prefer_not_say', '不愿透露')
    ])
    
    # 第三方头像URL
    avatar_url = models.URLField(blank=True, null=True)  # 第三方头像链接
    
    # 引导流程完成标记
    onboarding_completed = models.BooleanField(default=False)  # 是否完成引导流程

    def __str__(self):
        return self.username
