from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet, CommunityViewSet, PostViewSet, PublicUserProfileView, UserPostsView

router = DefaultRouter()
router.register(r"communities", CommunityViewSet, basename="community")
router.register(r"posts", PostViewSet, basename="community-post")
router.register(r"comments", CommentViewSet, basename="community-comment")

urlpatterns = [
    path("", include(router.urls)),
    path("users/<str:username>/posts/", UserPostsView.as_view(), name="community-user-posts"),
    path("users/<str:username>/", PublicUserProfileView.as_view(), name="community-user-profile"),
]
