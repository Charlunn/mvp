from django.contrib import admin

from .models import Comment, CommentLike, Community, CommunityMembership, Post, PostImage, PostLike


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 0


class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "community", "author", "created_at", "is_pinned", "is_locked")
    list_filter = ("community", "is_pinned", "is_locked", "created_at")
    search_fields = ("title", "body", "author__username")
    inlines = [PostImageInline]


class CommunityMembershipInline(admin.TabularInline):
    model = CommunityMembership
    extra = 0


class CommunityAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_private", "created_by", "created_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CommunityMembershipInline]


admin.site.register(Community, CommunityAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(PostLike)
admin.site.register(PostImage)
admin.site.register(Comment)
admin.site.register(CommentLike)
admin.site.register(CommunityMembership)
