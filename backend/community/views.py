from __future__ import annotations

from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from users.models import CustomUser
from utils.permissions import IsAdminUser

from .models import Comment, CommentLike, Community, CommunityMembership, Post, PostImage, PostLike
from .permissions import IsCommunityModeratorOrAuthor
from .serializers import (
    CommentSerializer,
    CommunityMembershipSerializer,
    CommunitySerializer,
    PostSerializer,
)


class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all().prefetch_related("memberships")
    serializer_class = CommunitySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        if self.action in {"create", "update", "partial_update", "destroy", "set_role"}:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def join(self, request, slug=None):
        community = self.get_object()
        membership, created = CommunityMembership.objects.get_or_create(
            community=community, user=request.user
        )
        if created:
            membership.role = CommunityMembership.ROLE_MEMBER
            membership.save()
        return Response({"role": membership.role}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def leave(self, request, slug=None):
        community = self.get_object()
        CommunityMembership.objects.filter(community=community, user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def members(self, request, slug=None):
        community = self.get_object()
        memberships = community.memberships.select_related("user").order_by("-role", "-joined_at")
        page = self.paginate_queryset(memberships)
        if page is not None:
            serializer = CommunityMembershipSerializer(page, many=True, context=self.get_serializer_context())
            return self.get_paginated_response(serializer.data)
        serializer = CommunityMembershipSerializer(memberships, many=True, context=self.get_serializer_context())
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def set_role(self, request, slug=None):
        community = self.get_object()
        user_id = request.data.get("user_id")
        role = request.data.get("role")
        if role not in dict(CommunityMembership.ROLE_CHOICES):
            return Response({"detail": "无效的角色"}, status=status.HTTP_400_BAD_REQUEST)
        membership, _ = CommunityMembership.objects.get_or_create(community=community, user_id=user_id)
        membership.role = role
        membership.save(update_fields=["role"])
        return Response({"role": membership.role})


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsCommunityModeratorOrAuthor]

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        if self.action == "create":
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Post.objects.filter(is_deleted=False).select_related("author", "community").prefetch_related(
            "images",
            "likes",
            "comments",
        )
        community_param = self.request.query_params.get("community")
        if community_param:
            queryset = queryset.filter(
                Q(community__slug=community_param) | Q(community__id=community_param)
            )
        author_username = self.request.query_params.get("author")
        if author_username:
            queryset = queryset.filter(author__username=author_username)
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            queryset = queryset.filter(community__is_private=False)
        elif not (user.is_superuser or user.is_staff or getattr(user, "user_type", "") == "admin"):
            allowed_communities = CommunityMembership.objects.filter(user=user).values_list("community_id", flat=True)
            queryset = queryset.filter(
                Q(community__is_private=False) | Q(community_id__in=allowed_communities) | Q(author=user)
            )
        return queryset.order_by("-is_pinned", "-created_at")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["include_comments"] = self.action == "retrieve"
        return context

    def perform_create(self, serializer):
        images = self.request.FILES.getlist("images")
        community = serializer.validated_data.get("community")

        if not community:
            # 如果前端没有提供 community，则尝试获取唯一的社区
            try:
                community = Community.objects.get() # 获取唯一的社区
            except Community.DoesNotExist:
                raise serializers.ValidationError("未找到任何社区，无法发帖。请联系管理员。")
            except Community.MultipleObjectsReturned:
                raise serializers.ValidationError("存在多个社区，但未指定发布社区。请联系管理员。")
            serializer.validated_data['community'] = community # 将获取到的社区添加到 validated_data

        if community.is_private and not self._can_access_private(community, self.request.user):
            raise PermissionDenied("你不是该社区成员，无法发帖")
        with transaction.atomic():
            post = serializer.save(author=self.request.user)
            for index, image in enumerate(images):
                PostImage.objects.create(post=post, image=image, order=index)
        return post

    def perform_update(self, serializer):
        post = serializer.save()
        if "images" in self.request.FILES:
            post.images.all().delete()
            images = self.request.FILES.getlist("images")
            for index, image in enumerate(images):
                PostImage.objects.create(post=post, image=image, order=index)
        return post

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = PostLike.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
        return Response({"liked": liked, "like_count": post.likes.count()})

    def _can_access_private(self, community: Community, user):
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff or getattr(user, "user_type", "") == "admin":
            return True
        return CommunityMembership.objects.filter(community=community, user=user).exists()


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsCommunityModeratorOrAuthor]

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [AllowAny()]
        if self.action == "create":
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Comment.objects.select_related("author", "post", "post__community").prefetch_related("likes")
        post_id = self.request.query_params.get("post")
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        parent_id = self.request.query_params.get("parent")
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        else:
            queryset = queryset.filter(parent__isnull=True)
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            queryset = queryset.filter(post__community__is_private=False)
        elif not (user.is_superuser or user.is_staff or getattr(user, "user_type", "") == "admin"):
            allowed_communities = CommunityMembership.objects.filter(user=user).values_list("community_id", flat=True)
            queryset = queryset.filter(
                Q(post__community__is_private=False) | Q(post__community_id__in=allowed_communities) | Q(author=user)
            )
        return queryset.order_by("created_at")

    def perform_create(self, serializer):
        from notifications.models import Notification

        post = serializer.validated_data.get("post")
        if post.community.is_private and not self._can_access_private(post.community, self.request.user):
            raise PermissionDenied("你不是该社区成员，无法评论")
        comment = serializer.save(author=self.request.user)

        # 准备一个列表，用于存储需要接收通知的用户
        recipients = set()

        # 1. 通知帖子作者
        if post.author != self.request.user:
            recipients.add(post.author)

        # 2. 如果是回复，通知被回复的评论作者
        parent = serializer.validated_data.get("parent")
        if parent and parent.author != self.request.user:
            recipients.add(parent.author)

        # 批量创建通知
        for user in recipients:
            Notification.objects.create(
                recipient=user,
                sender=self.request.user,
                notification_type=Notification.NotificationType.NEW_REPLY,
                post=post,
                comment=comment,
            )

        return comment

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        comment = self.get_object()
        like, created = CommentLike.objects.get_or_create(comment=comment, user=request.user)
        if not created:
            like.delete()
            liked = False
        else:
            liked = True
        return Response({"liked": liked, "like_count": comment.likes.count()})

    def _can_access_private(self, community: Community, user):
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser or user.is_staff or getattr(user, "user_type", "") == "admin":
            return True
        return CommunityMembership.objects.filter(community=community, user=user).exists()


class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        username = self.kwargs["username"]
        user = get_object_or_404(CustomUser, username=username)
        viewer = self.request.user if self.request.user.is_authenticated else None
        if user.profile_visibility == "private" and not self._can_view_private(user, viewer):
            return Post.objects.none()
        queryset = (
            Post.objects.filter(author=user, is_deleted=False)
            .select_related("author", "community")
            .prefetch_related("images", "likes", "comments")
        )
        if viewer is None or not viewer.is_authenticated:
            queryset = queryset.filter(community__is_private=False)
        return queryset.order_by("-created_at")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["include_comments"] = False
        return context

    def list(self, request, *args, **kwargs):
        username = kwargs["username"]
        user = get_object_or_404(CustomUser, username=username)
        viewer = request.user if request.user.is_authenticated else None
        if user.profile_visibility == "private" and not self._can_view_private(user, viewer):
            return Response({"detail": "该用户的主页不可见"}, status=status.HTTP_403_FORBIDDEN)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def _can_view_private(self, profile_user: CustomUser, viewer: CustomUser | None) -> bool:
        if not viewer:
            return False
        if viewer == profile_user:
            return True
        if viewer.is_superuser or viewer.is_staff or getattr(viewer, "user_type", "") == "admin":
            return True
        return False


class PublicUserProfileView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [AllowAny]
    lookup_field = "username"

    def get_serializer_class(self):
        from users.serializers import PublicUserProfileSerializer

        return PublicUserProfileSerializer

    def get_object(self):
        user = super().get_object()
        viewer = self.request.user if self.request.user.is_authenticated else None
        if user.profile_visibility == "private" and viewer not in {user}:
            if not viewer or not (
                viewer.is_superuser or viewer.is_staff or getattr(viewer, "user_type", "") == "admin"
            ):
                raise PermissionDenied("该用户的主页不可见")
        return user
