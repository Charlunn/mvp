"""
Django settings for the Anti-Fraud MVP backend.

This configuration keeps only the services that power the MVP feature set:
authentication, quizzes, AI simulation and the knowledge graph APIs.
"""

from pathlib import Path
from datetime import timedelta
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

# Load env vars from the repo root first (preferred), then allow local overrides.
for env_path in (BASE_DIR.parent / ".env", BASE_DIR / ".env"):
    if env_path.exists():
        load_dotenv(env_path)


# ---------------------------------------------------------------------------
# 核心设置
# ---------------------------------------------------------------------------
# Django 密钥，用于加密签名等安全功能，生产环境必须修改
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "mvp-secret-key-change-me",
)
# 调试模式开关，生产环境必须设为 False
DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in {"1", "true", "yes"}

# 允许访问的主机名列表，防止 HTTP Host 头攻击
default_hosts = "localhost,127.0.0.1,backend"
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("DJANGO_ALLOWED_HOSTS", default_hosts).split(",")
    if host.strip()
]
if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["*"] if DEBUG else ["localhost"]


# ---------------------------------------------------------------------------
# 应用配置
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    # Django 内置应用
    "django.contrib.admin",         # 管理后台
    "django.contrib.auth",          # 认证系统
    "django.contrib.contenttypes",  # 内容类型框架
    "django.contrib.sessions",      # 会话管理
    "django.contrib.messages",      # 消息框架
    "django.contrib.staticfiles",   # 静态文件管理
    
    # 第三方应用
    "corsheaders",                         # CORS 跨域支持
    "rest_framework",                      # REST API 框架
    "rest_framework_simplejwt",            # JWT 认证
    "rest_framework_simplejwt.token_blacklist",  # JWT 令牌黑名单
    "drf_yasg",                            # API 文档生成
    
    # 项目应用
    "users",          # 用户管理
    "quiz",           # 知识测验
    "chatapi",        # AI 模拟对话
    "graph_api",      # 知识图谱
    "community",      # 社区功能
    "notifications",  # 通知系统
]


# ---------------------------------------------------------------------------
# Middleware / templates
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "mvp_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mvp_backend.wsgi.application"


# ---------------------------------------------------------------------------
# 数据库配置
# ---------------------------------------------------------------------------
def _env(key: str, default: str | None = None) -> str | None:
    """获取环境变量，自动去除首尾空格"""
    value = os.environ.get(key, default)
    return value.strip() if isinstance(value, str) else value


# 根据环境变量决定使用 PostgreSQL 还是 SQLite
if _env("DB_NAME"):
    # 生产环境：使用 PostgreSQL 数据库
    DATABASES = {
        "default": {
            "ENGINE": _env("DB_ENGINE", "django.db.backends.postgresql"),
            "NAME": _env("DB_NAME", "antifraud"),
            "USER": _env("DB_USER", "postgres"),
            "PASSWORD": _env("DB_PASSWORD", "postgres"),
            "HOST": _env("DB_HOST", "postgres"),
            "PORT": _env("DB_PORT", "5432"),
        }
    }
else:
    # 开发环境：使用 SQLite 数据库（无需额外配置）
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ---------------------------------------------------------------------------
# Authentication / internationalization
# ---------------------------------------------------------------------------
AUTH_USER_MODEL = "users.CustomUser"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "zh-hans"
TIME_ZONE = "Asia/Shanghai"
USE_I18N = True
USE_L10N = True
USE_TZ = True


# ---------------------------------------------------------------------------
# Static & media files
# ---------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# ---------------------------------------------------------------------------
# REST Framework 配置
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    # 认证方式：JWT 令牌认证和会话认证
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    # 默认权限：需要用户认证
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    # 分页配置：使用页码分页，每页 20 条记录
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# 响应渲染器配置：使用 Unicode JSON 渲染器
renderer_classes = ["mvp_backend.renderers.UnicodeJSONRenderer"]
if DEBUG:
    # 调试模式下添加可浏览的 API 界面
    renderer_classes.append("rest_framework.renderers.BrowsableAPIRenderer")
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = renderer_classes


# JWT 令牌配置
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),     # 访问令牌有效期 1 小时
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),     # 刷新令牌有效期 1 天
    "ROTATE_REFRESH_TOKENS": True,                   # 刷新时轮换令牌
    "BLACKLIST_AFTER_ROTATION": True,                # 轮换后将旧令牌加入黑名单
    "AUTH_HEADER_TYPES": ("Bearer",),                # 认证头类型
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",        # 认证头名称
}


# ---------------------------------------------------------------------------
# CORS / CSRF
# ---------------------------------------------------------------------------
default_cors_origins = [
    "http://localhost:3100",
    "http://127.0.0.1:3100",
]

cors_origins_env = [
    origin.strip()
    for origin in os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

if cors_origins_env:
    CORS_ALLOWED_ORIGINS = cors_origins_env
else:
    CORS_ALLOWED_ORIGINS = default_cors_origins

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    origin for origin in CORS_ALLOWED_ORIGINS if origin.startswith(("http://", "https://"))
]


# ---------------------------------------------------------------------------
# Neo4j / AI services
# ---------------------------------------------------------------------------
DOCKER_ENV = os.environ.get("DOCKER_ENV", "").lower() in {"1", "true", "yes"}
NEO4J_URI = _env("NEO4J_URI", "bolt://neo4j:7687" if DOCKER_ENV else "bolt://localhost:7687")
NEO4J_USERNAME = _env("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = _env("NEO4J_PASSWORD", "password")
NEO4J_DATABASE = _env("NEO4J_DATABASE", "neo4j")


# ---------------------------------------------------------------------------
# JSON encoding to keep Chinese characters readable
# ---------------------------------------------------------------------------
from django.core.serializers.json import DjangoJSONEncoder


class CustomJSONEncoder(DjangoJSONEncoder):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("ensure_ascii", False)
        super().__init__(*args, **kwargs)


REST_FRAMEWORK_JSON_ENCODER = CustomJSONEncoder


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "{levelname} {asctime} {module} {message}", "style": "{"},
        "simple": {"format": "{levelname} {message}", "style": "{"},
    },
    "handlers": {
        "console": {
            "level": "DEBUG" if DEBUG else "INFO",
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": True,
        },
        "graph_api": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
        "chatapi": {"handlers": ["console"], "level": "DEBUG", "propagate": False},
    },
}


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
