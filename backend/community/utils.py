from __future__ import annotations

from typing import Optional

from .models import Community, CommunityMembership


def is_system_admin(user) -> bool:
    """Check whether the given user is a platform-level administrator."""
    if not user or not getattr(user, "is_authenticated", False):
        return False
    return bool(
        getattr(user, "is_superuser", False)
        or getattr(user, "is_staff", False)
        or getattr(user, "user_type", "") == "admin"
    )


def get_membership(community: Community, user) -> Optional[CommunityMembership]:
    """Return the membership for a user inside a community, if any."""
    if not user or not getattr(user, "is_authenticated", False):
        return None
    try:
        return community.memberships.get(user=user)
    except CommunityMembership.DoesNotExist:
        return None


def has_moderation_power(user, community: Community) -> bool:
    """Whether the user can moderate (edit/delete/move) posts in a community."""
    if is_system_admin(user):
        return True
    membership = get_membership(community, user)
    return bool(membership and membership.role in CommunityMembership.MODERATOR_ROLES)


def is_community_admin(user, community: Community) -> bool:
    """Whether the user is the community administrator (not just a helper)."""
    if is_system_admin(user):
        return True
    membership = get_membership(community, user)
    return bool(membership and membership.role == CommunityMembership.ROLE_ADMIN)
