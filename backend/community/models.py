from __future__ import annotations

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Community(models.Model):
    """A discussion community (similar to a subreddit)."""

    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(
        default=False,
        help_text="If enabled, only approved members can view or post inside the community.",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="communities_created",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "community"
            slug = base_slug
            index = 1
            while Community.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                index += 1
                slug = f"{base_slug}-{index}"
            self.slug = slug
        super().save(*args, **kwargs)


class CommunityMembership(models.Model):
    ROLE_MEMBER = "member"
    ROLE_ADMIN = "admin"
    ROLE_MODERATOR = "moderator"
    ROLE_CHOICES = (
        (ROLE_MEMBER, "成员"),
        (ROLE_ADMIN, "社区管理员"),
        (ROLE_MODERATOR, "协管"),
    )
    MODERATOR_ROLES = {ROLE_ADMIN, ROLE_MODERATOR}

    community = models.ForeignKey(
        Community,
        related_name="memberships",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="community_memberships",
        on_delete=models.CASCADE,
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    joined_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        unique_together = ("community", "user")
        verbose_name = "Community membership"
        verbose_name_plural = "Community memberships"

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.user} -> {self.community} ({self.role})"

    @property
    def is_moderator(self) -> bool:
        return self.role in self.MODERATOR_ROLES

    @property
    def is_admin(self) -> bool:
        return self.role == self.ROLE_ADMIN

    @property
    def can_moderate(self) -> bool:
        return self.role in self.MODERATOR_ROLES


class Post(models.Model):
    community = models.ForeignKey(
        Community,
        related_name="posts",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="community_posts",
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ("-is_pinned", "-created_at")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title}"


class PostImage(models.Model):
    post = models.ForeignKey(
        Post,
        related_name="images",
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to="community/posts/%Y/%m/%d/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "id")

    def __str__(self) -> str:  # pragma: no cover
        return f"Image for post {self.post_id}"


class PostLike(models.Model):
    post = models.ForeignKey(
        Post,
        related_name="likes",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="liked_posts",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.user} likes {self.post}"


class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        related_name="comments",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="community_comments",
        on_delete=models.CASCADE,
    )
    parent = models.ForeignKey(
        "self",
        related_name="replies",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    body = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ("created_at",)

    def __str__(self) -> str:  # pragma: no cover
        return f"Comment {self.pk} on {self.post_id}"

    def clean(self):  # pragma: no cover - validated in serializer
        if self.parent and self.parent.post_id != self.post_id:
            raise ValidationError("Parent comment must belong to the same post")


class CommentLike(models.Model):
    comment = models.ForeignKey(
        Comment,
        related_name="likes",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="liked_comments",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        unique_together = ("comment", "user")

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.user} likes comment {self.comment_id}"
