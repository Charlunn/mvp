from __future__ import annotations

from typing import Optional

from rest_framework import permissions

from .models import Comment, CommunityMembership, Post


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
        if user.is_staff or user.is_superuser:
            return True

        # The author of the object can always modify it
        author = getattr(obj, "author", None)
        if author and author.id == user.id:
            return True

        # For objects within a community (like Post or Comment),
        # check for community admin/moderator role.
        community = None
        if isinstance(obj, Post):
            community = obj.community
        elif isinstance(obj, Comment):
            community = obj.post.community

        if community:
            try:
                membership = community.memberships.get(user=user)
                return membership.role in [CommunityMembership.ROLE_ADMIN, CommunityMembership.ROLE_MODERATOR]
            except CommunityMembership.DoesNotExist:
                return False

        return False


def _get_membership(manager, user_id: int) -> Optional[CommunityMembership]:
    try:
        return manager.get(user_id=user_id)
    except CommunityMembership.DoesNotExist:
        return None


def author_id(author):
    return getattr(author, "id", None)
