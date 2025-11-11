<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">消息中心</h1>
    <div v-if="loading" class="text-center">加载中...</div>
    <div v-else-if="error" class="text-center text-red-500">加载失败</div>
    <div v-else-if="notifications.length === 0" class="text-center text-gray-500">暂无消息</div>
    <div v-else>
      <div v-for="notification in notifications" :key="notification.id"
           class="p-4 mb-4 border rounded-lg cursor-pointer"
           :class="{ 'bg-gray-100 dark:bg-gray-800': notification.is_read }"
           @click="handleNotificationClick(notification)">
        <p>
          <strong>{{ notification.sender.nickname || notification.sender.username }}</strong>
          在帖子
          <strong>{{ notification.post.title }}</strong>
          中回复了你:
        </p>
        <p class="text-gray-600 dark:text-gray-300">{{ notification.comment.body }}</p>
        <small class="text-gray-400">{{ new Date(notification.created_at).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Sender {
  id: number
  username: string
  nickname: string | null
  avatar_url: string | null
}

interface Post {
  id: number
  title: string
}

interface Comment {
  id: number
  body: string
}

interface Notification {
  id: number
  sender: Sender
  notification_type: string
  post: Post
  comment: Comment
  is_read: boolean
  created_at: string
}

const { $api } = useNuxtApp()
const notifications = ref<Notification[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchNotifications = async () => {
  try {
    const response = await $api.get('/notifications/')
    notifications.value = response.data.results
  } catch (e) {
    error.value = 'Failed to load notifications.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.is_read) {
    try {
      await $api.post(`/notifications/${notification.id}/mark-as-read/`)
      notification.is_read = true
    } catch (e) {
      console.error('Failed to mark notification as read', e)
    }
  }
  navigateTo(`/community/posts/${notification.post.id}#comment-${notification.comment.id}`)
}

onMounted(fetchNotifications)
</script>
