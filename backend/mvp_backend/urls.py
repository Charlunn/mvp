"""Root URL configuration for the MVP backend."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="反诈骗 MVP API",
        default_version="v1",
        description="最小可行版本的反诈骗服务端接口",
        contact=openapi.Contact(email="contact@antifraud.local"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("swagger<format>/", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("api/users/", include("users.urls")),
    path("api/quiz/", include("quiz.urls", namespace="quiz")),
    path("api/chat/", include("chatapi.urls", namespace="chat_api")),
    path("api/graph/", include("graph_api.urls", namespace="graph_api")),
    path("api/community/", include("community.urls")),
    path("api/notifications/", include("notifications.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
