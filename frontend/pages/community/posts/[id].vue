<template>
  <div class="space-y-6">
    <div v-if="post" class="space-y-6">
      <Card class="border border-border/70">
        <CardHeader class="space-y-2">
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <NuxtLink :to="`/community/${post.community_detail.slug}`" class="font-medium text-foreground hover:underline">
              {{ post.community_detail.name }}
            </NuxtLink>
            <span>{{ formatDate(post.created_at) }}</span>
          </div>
          <CardTitle class="text-2xl">{{ post.title }}</CardTitle>
          <CardDescription>
            <NuxtLink :to="`/users/${post.author.username}`" class="font-medium text-foreground hover:underline">
              {{ post.author.nickname || post.author.username }}
            </NuxtLink>
            发布
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="whitespace-pre-line text-sm leading-relaxed">{{ post.body }}</p>
          <div v-if="post.images.length" class="grid gap-3 md:grid-cols-2">
            <img v-for="image in post.images" :key="image.id" :src="resolveMedia(image.image)" class="h-64 w-full rounded-lg object-cover" />
          </div>
        </CardContent>
        <CardFooter class="flex items-center justify-between text-sm text-muted-foreground">
          <div class="flex items-center gap-4">
            <button class="flex items-center gap-1" :class="post.is_liked ? 'text-primary' : ''" @click="togglePostLike">
              <Icon :name="post.is_liked ? 'lucide:heart' : 'lucide:heart-off'" class="h-4 w-4" />
              <span>{{ post.like_count }}</span>
            </button>
            <div class="flex items-center gap-1">
              <Icon name="lucide:message-square" class="h-4 w-4" />
              <span>{{ post.comment_count }}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" @click="navigateTo(`/community/${post.community_detail.slug}`)">
            返回社区
          </Button>
        </CardFooter>
      </Card>

      <Card class="border border-border/70">
        <CardHeader>
          <CardTitle>发表评论</CardTitle>
          <CardDescription>保持友善、理性和务实的讨论氛围</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="!auth.isAuthenticated" class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
            登录后即可发表评论。<NuxtLink to="/login" class="ml-1 text-foreground hover:underline">前往登录</NuxtLink>
          </div>
          <form v-else class="space-y-4" @submit.prevent="submitComment">
            <Textarea v-model="newComment" rows="4" placeholder="分享你的见解或补充案例" required />
            <div class="flex justify-end">
              <Button type="submit" :disabled="commentLoading">{{ commentLoading ? '提交中…' : '发布评论' }}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section class="space-y-4">
        <h2 class="text-lg font-semibold">全部评论</h2>
        <div v-if="loading" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
          正在加载评论…
        </div>
        <div v-else-if="!post.comments?.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
          暂无评论，欢迎抢先留言。
        </div>
        <div v-else class="space-y-4">
          <CommentThread
            v-for="comment in post.comments"
            :key="comment.id"
            :comment="comment"
            :on-like="handleCommentLike"
            :on-reply="handleReplySubmit"
            :format-date="formatDate"
            :auth="auth"
            :depth="0"
          />
        </div>
      </section>
    </div>
    <div v-else class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
      正在加载帖子…
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

interface CommunitySummary {
  id: number
  name: string
  slug: string
}

interface PostImage {
  id: number
  image: string
  order: number
}

interface PostAuthor {
  username: string
  nickname?: string | null
}

interface CommentModel {
  id: number
  body: string
  created_at: string
  updated_at: string
  like_count: number
  is_liked: boolean
  is_deleted: boolean
  author: PostAuthor
  replies: CommentModel[]
  post: number
  parent?: number | null
}

interface PostDetail {
  id: number
  title: string
  body: string
  images: PostImage[]
  author: PostAuthor
  community_detail: CommunitySummary
  created_at: string
  like_count: number
  comment_count: number
  is_liked: boolean
  comments: CommentModel[]
}

import CommentThread from '~/components/community/CommentThread.vue'

const route = useRoute()
const { $api, $config } = useNuxtApp()
const auth = useAuthStore()

const post = ref<PostDetail | null>(null)
const loading = ref(true)
const commentLoading = ref(false)
const newComment = ref('')

const fetchPost = async () => {
  loading.value = true
  try {
    const { data } = await $api.get(`/community/posts/${route.params.id}/`)
    post.value = data
  } catch (error) {
    console.error('加载帖子失败', error)
    post.value = null
  } finally {
    loading.value = false
  }
}

const submitComment = async () => {
  if (!post.value) return
  commentLoading.value = true
  try {
    await $api.post('/community/comments/', {
      post: post.value.id,
      body: newComment.value,
    })
    newComment.value = ''
    await fetchPost()
  } catch (error) {
    console.error('发布评论失败', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '发布失败，请稍后重试')
  } finally {
    commentLoading.value = false
  }
}

const handleReplySubmit = async (commentId: number, content: string) => {
  if (!post.value) return
  try {
    await $api.post('/community/comments/', {
      post: post.value.id,
      parent: commentId,
      body: content,
    })
    await fetchPost()
  } catch (error) {
    console.error('回复失败', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '回复失败，请稍后重试')
  }
}

const handleCommentLike = async (commentId: number) => {
  if (!auth.isAuthenticated) {
    window.alert('请先登录后再点赞评论')
    return
  }
  try {
    await $api.post(`/community/comments/${commentId}/like/`)
    await fetchPost()
  } catch (error) {
    console.error('评论点赞失败', error)
    window.alert('操作失败，请稍后重试')
  }
}

const togglePostLike = async () => {
  if (!auth.isAuthenticated) {
    window.alert('请先登录后再点赞')
    return
  }
  if (!post.value) return
  try {
    const { data } = await $api.post(`/community/posts/${post.value.id}/like/`)
    post.value.is_liked = Boolean(data?.liked)
    if (typeof data?.like_count === 'number') {
      post.value.like_count = data.like_count
    }
  } catch (error) {
    console.error('点赞失败', error)
  }
}

const resolveMedia = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = $config.public.apiBase?.replace(/\/$/, '') ?? ''
  return `${base}${path}`
}

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return value
  }
}

watch(
  () => route.params.id,
  async () => {
    await fetchPost()
  },
  { immediate: true }
)
</script>
