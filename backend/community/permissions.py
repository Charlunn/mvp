from __future__ import annotations

from rest_framework import permissions

from .models import Comment, Post
from .utils import has_moderation_power, is_system_admin


class IsCommunityModeratorOrAuthor(permissions.BasePermission):
    """Allow modification for post/comment authors, community moderators or system admins."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Safe methods are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user
        # User must be authenticated for any write permission
        if not user or not user.is_authenticated:
            return False

        # System admins (staff/superuser) have all permissions
        if is_system_admin(user):
            return True

        if isinstance(obj, Post):
            if getattr(obj, "author_id", None) == user.id:
                return True
            return has_moderation_power(user, obj.community)

        if isinstance(obj, Comment):
            if getattr(obj, "author_id", None) == user.id:
                return True
            if getattr(obj.post, "author_id", None) == user.id:
                return True
            return has_moderation_power(user, obj.post.community)

        # Default deny for unknown objects
        return False
