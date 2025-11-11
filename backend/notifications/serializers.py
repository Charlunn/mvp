from rest_framework import serializers
from .models import Notification
from community.models import Post, Comment
from community.serializers import UserSummarySerializer

class PostSerializerForNotification(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title')

class CommentSerializerForNotification(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'body')

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSummarySerializer(read_only=True)
    post = PostSerializerForNotification(read_only=True)
    comment = CommentSerializerForNotification(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'sender', 'notification_type', 'post', 'comment', 'is_read', 'created_at')
