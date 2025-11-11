from __future__ import annotations

from typing import Any, Dict

from typing import Any, Dict

from rest_framework import serializers

from users.models import CustomUser

from .models import (
    Comment,
    CommentLike,
    Community,
    CommunityMembership,
    Post,
    PostImage,
    PostLike,
)
from .utils import has_moderation_power, is_system_admin


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "username",
            "nickname",
            "avatar_url",
        )


class CommunityMembershipSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = CommunityMembership
        fields = ("id", "user", "role", "joined_at")
        read_only_fields = ("joined_at",)


class CommunitySerializer(serializers.ModelSerializer):
    created_by = UserSummarySerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    current_role = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "is_private",
            "created_by",
            "created_at",
            "updated_at",
            "members_count",
            "current_role",
        )
        read_only_fields = ("slug", "created_by", "created_at", "updated_at", "members_count", "current_role")

    def get_members_count(self, obj: Community) -> int:
        return obj.memberships.count()

    def get_current_role(self, obj: Community) -> str | None:
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return None
        try:
            membership = obj.memberships.get(user=request.user)
            return membership.role
        except CommunityMembership.DoesNotExist:
            return None

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ("id", "image", "order")
        read_only_fields = ("id",)


class PostSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    community = serializers.PrimaryKeyRelatedField(queryset=Community.objects.all())
    community_detail = CommunitySerializer(source="community", read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    can_moderate = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            "id",
            "community",
            "community_detail",
            "author",
            "title",
            "body",
            "created_at",
            "updated_at",
            "is_pinned",
            "is_locked",
            "images",
            "like_count",
            "comment_count",
            "is_liked",
            "can_moderate",
            "comments",
        )
        read_only_fields = (
            "author",
            "created_at",
            "updated_at",
            "is_pinned",
            "is_locked",
            "like_count",
            "comment_count",
            "is_liked",
            "can_moderate",
            "comments",
            "community_detail",
        )

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        community: Community = attrs.get("community") or getattr(self.instance, "community", None)
        if not community:
            raise serializers.ValidationError({"community": "帖子必须属于一个社区"})

        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            if community.is_private and not (
                is_system_admin(user) or community.memberships.filter(user=user).exists()
            ):
                raise serializers.ValidationError("你不是该社区成员，无法在该社区发帖")

            if self.instance and "community" in attrs:
                target = attrs["community"]
                if target.id != self.instance.community_id:
                    if not has_moderation_power(user, self.instance.community):
                        raise serializers.ValidationError("你没有权限移动该帖子")
                    if not has_moderation_power(user, target):
                        raise serializers.ValidationError("没有权限将帖子移动到目标社区")
        elif request and request.method and request.method.upper() != "GET":
            raise serializers.ValidationError("登录后才能执行该操作")

        return attrs

    def get_like_count(self, obj: Post) -> int:
        return obj.likes.count()

    def get_comment_count(self, obj: Post) -> int:
        return obj.comments.filter(is_deleted=False).count()

    def get_is_liked(self, obj: Post) -> bool:
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()

    def get_can_moderate(self, obj: Post) -> bool:
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return False
        user = request.user
        if obj.author_id == user.id:
            return True
        return has_moderation_power(user, obj.community)

    def get_comments(self, obj: Post):
        if not self.context.get("include_comments"):
            return None
        top_level = obj.comments.filter(parent__isnull=True).select_related("author").prefetch_related("replies__author")
        return CommentSerializer(
            top_level,
            many=True,
            context={**self.context, "depth": 0, "include_replies": True},
        ).data


class CommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    can_moderate = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_deleted = serializers.BooleanField(read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id",
            "post",
            "author",
            "parent",
            "body",
            "created_at",
            "updated_at",
            "is_deleted",
            "like_count",
            "is_liked",
            "can_moderate",
            "replies",
        )
        read_only_fields = (
            "author",
            "created_at",
            "updated_at",
            "like_count",
            "is_liked",
            "can_moderate",
            "replies",
        )

    def validate(self, attrs):
        parent = attrs.get("parent") or getattr(self.instance, "parent", None)
        post = attrs.get("post") or getattr(self.instance, "post", None)
        if parent and post and parent.post_id != post.id:
            raise serializers.ValidationError("回复必须属于同一帖子")
        if post and post.is_locked:
            raise serializers.ValidationError("帖子已锁定，无法继续评论")
        return attrs

    def to_representation(self, instance: Comment):
        data = super().to_representation(instance)
        if instance.is_deleted:
            data["body"] = "该评论已被删除"
        return data

    def get_like_count(self, obj: Comment) -> int:
        return obj.likes.count()

    def get_is_liked(self, obj: Comment) -> bool:
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()

    def get_can_moderate(self, obj: Comment) -> bool:
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return False
        user = request.user
        if is_system_admin(user):
            return True
        if obj.author_id == user.id:
            return True
        if obj.post.author_id == user.id:
            return True
        return has_moderation_power(user, obj.post.community)

    MAX_COMMENT_DEPTH = 5 # 定义最大评论嵌套深度

    def get_replies(self, obj: Comment):
        include_replies = self.context.get("include_replies", False)
        depth = self.context.get("depth", 0)
        if not include_replies or depth >= self.MAX_COMMENT_DEPTH: # 使用 MAX_COMMENT_DEPTH
            return []
        replies = obj.replies.select_related("author")
        serializer = CommentSerializer(
            replies,
            many=True,
            context={**self.context, "depth": depth + 1},
        )
        return serializer.data


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentLike
        fields = ("id", "comment", "user", "created_at")
        read_only_fields = ("id", "user", "created_at")


class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ("id", "post", "user", "created_at")
        read_only_fields = ("id", "user", "created_at")
