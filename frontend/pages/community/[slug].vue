<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-border/70 bg-secondary/30 p-6">
      <div v-if="community" class="space-y-4">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-semibold">{{ community.name }}</h1>
            <p class="mt-1 max-w-2xl text-sm text-muted-foreground">{{ community.description || '这个社区还没有简介。' }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span class="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1">
              <Icon name="lucide:users" class="h-4 w-4" />
              {{ community.members_count }} 名成员
            </span>
            <span v-if="community.is_private" class="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1">
              <Icon name="lucide:lock" class="h-4 w-4" />
              私密社区
            </span>
            <Badge v-if="community.current_role === 'moderator'" variant="outline">社区管理员</Badge>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <Button v-if="!isMember" :disabled="actionLoading" @click="joinCommunity">
            {{ actionLoading ? '处理中…' : '加入社区' }}
          </Button>
          <Button v-else variant="outline" :disabled="actionLoading" @click="leaveCommunity">
            {{ actionLoading ? '处理中…' : '退出社区' }}
          </Button>
          <NuxtLink to="/community" class="text-sm text-muted-foreground hover:text-foreground">
            返回社区广场
          </NuxtLink>
        </div>
      </div>
      <div v-else class="text-sm text-muted-foreground">正在加载社区信息…</div>
    </div>

    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-4">
        <Card v-if="auth.isAuthenticated && isMember" class="border border-border/70">
          <CardHeader>
            <CardTitle>分享新帖子</CardTitle>
            <CardDescription>与社区成员交流实战经验</CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="submitPost">
              <div>
                <Label for="title">标题</Label>
                <Input id="title" v-model="postForm.title" placeholder="一句话概括你的观点" required />
              </div>
              <div>
                <Label for="body">内容</Label>
                <Textarea id="body" v-model="postForm.body" rows="4" placeholder="详细描述你的案例或问题" required />
              </div>
              <div>
                <Label class="mb-1 block text-sm font-medium text-muted-foreground">上传图片（可选）</Label>
                <input type="file" multiple accept="image/*" class="w-full text-sm" @change="handleFileChange" />
                <p v-if="postForm.images.length" class="mt-2 text-xs text-muted-foreground">已选择 {{ postForm.images.length }} 张图片</p>
              </div>
              <div class="flex justify-end">
                <Button type="submit" :disabled="createLoading">
                  {{ createLoading ? '发布中…' : '发布' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card v-else-if="community && community.is_private && !isMember" class="border border-dashed border-border/70 bg-muted/20">
          <CardHeader>
            <CardTitle>加入后查看讨论</CardTitle>
            <CardDescription>这是一个私密社区，成员加入后可访问全部内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Button class="w-full" :disabled="actionLoading" @click="joinCommunity">申请加入</Button>
          </CardContent>
        </Card>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">社区动态</h2>
            <Button variant="outline" size="sm" :disabled="feedLoading" @click="refreshPosts">
              <Icon name="lucide:refresh-cw" class="mr-1 h-4 w-4" />刷新
            </Button>
          </div>
          <div v-if="feedLoading && !posts.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            正在加载帖子…
          </div>
          <div v-else-if="!posts.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            {{ emptyMessage }}
          </div>
          <div v-else class="space-y-4">
            <Card v-for="post in posts" :key="post.id" class="border border-border/70">
              <CardHeader>
                <CardTitle class="text-xl">{{ post.title }}</CardTitle>
                <CardDescription>
                  <NuxtLink :to="`/users/${post.author.username}`" class="font-medium hover:underline">
                    {{ post.author.nickname || post.author.username }}
                  </NuxtLink>
                  · {{ formatDate(post.created_at) }}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="whitespace-pre-line text-sm leading-relaxed">{{ post.body }}</p>
                <div v-if="post.images.length" class="grid gap-3 md:grid-cols-2">
                  <img v-for="image in post.images" :key="image.id" :src="resolveMedia(image.image)" class="h-48 w-full rounded-lg object-cover" />
                </div>
              </CardContent>
              <CardFooter class="flex items-center justify-between text-sm text-muted-foreground">
                <div class="flex items-center gap-4">
                  <button class="flex items-center gap-1" :class="post.is_liked ? 'text-primary' : ''" @click="toggleLike(post)">
                    <Icon :name="post.is_liked ? 'lucide:heart' : 'lucide:heart-off'" class="h-4 w-4" />
                    <span>{{ post.like_count }}</span>
                  </button>
                  <div class="flex items-center gap-1">
                    <Icon name="lucide:message-square" class="h-4 w-4" />
                    <span>{{ post.comment_count }}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" @click="navigateTo(`/community/posts/${post.id}`)">查看详情</Button>
              </CardFooter>
            </Card>
            <div v-if="hasMore" class="flex justify-center">
              <Button variant="outline" :disabled="feedLoading" @click="loadMore">
                {{ feedLoading ? '加载中…' : '加载更多' }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>社区概览</CardTitle>
            <CardDescription>掌握成员结构与互动情况</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 text-sm text-muted-foreground">
            <p><strong class="text-foreground">成员数：</strong>{{ community?.members_count ?? 0 }}</p>
            <p><strong class="text-foreground">创建时间：</strong>{{ community ? formatDate(community.created_at) : '-' }}</p>
            <p><strong class="text-foreground">管理员：</strong>{{ community?.current_role === 'moderator' ? '你是管理员' : '由平台指定' }}</p>
            <p><strong class="text-foreground">访问权限：</strong>{{ community?.is_private ? '需要加入后访问' : '公开社区' }}</p>
          </CardContent>
        </Card>
        <Card class="border border-border/70 bg-muted/30">
          <CardHeader>
            <CardTitle>互动提示</CardTitle>
            <CardDescription>管理员可删除违规内容，维护社区秩序</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2 text-xs text-muted-foreground">
            <p>· 建议使用案例+提示的结构分享信息。</p>
            <p>· 如发现诈骗线索，可@社区管理员标记处理。</p>
            <p>· 积极参与讨论可提升个人资料中的社区活跃度。</p>
          </CardContent>
        </Card>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

interface CommunityDetail {
  id: number
  name: string
  slug: string
  description: string
  members_count: number
  current_role?: string | null
  is_private: boolean
  created_at: string
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

interface PostItem {
  id: number
  title: string
  body: string
  created_at: string
  like_count: number
  comment_count: number
  is_liked: boolean
  images: PostImage[]
  author: PostAuthor
}

const route = useRoute()
const auth = useAuthStore()
const { $api, $config } = useNuxtApp()

const community = ref<CommunityDetail | null>(null)
const actionLoading = ref(false)
const feedLoading = ref(false)
const posts = ref<PostItem[]>([])
const hasMore = ref(false)
const currentPage = ref(1)
const createLoading = ref(false)

const postForm = reactive({
  title: '',
  body: '',
  images: [] as File[],
})

const isMember = computed(() => Boolean(community.value?.current_role))

const emptyMessage = computed(() => {
  if (community.value?.is_private && !isMember.value) {
    return '加入社区后即可查看全部帖子'
  }
  return '暂无帖子，快来发布第一条内容吧'
})

const fetchCommunity = async () => {
  try {
    const { data } = await $api.get(`/community/communities/${route.params.slug}/`)
    community.value = data
  } catch (error) {
    console.error('加载社区详情失败', error)
    community.value = null
  }
}

const fetchPosts = async (page = 1, append = false) => {
  feedLoading.value = true
  try {
    const { data } = await $api.get('/community/posts/', {
      params: { community: route.params.slug, page },
    })
    const results = Array.isArray(data) ? data : data.results || []
    if (append) {
      posts.value = [...posts.value, ...results]
    } else {
      posts.value = results
    }
    hasMore.value = Boolean(data?.next)
    currentPage.value = page
  } catch (error) {
    console.error('加载社区帖子失败', error)
    if (!append) posts.value = []
  } finally {
    feedLoading.value = false
  }
}

const joinCommunity = async () => {
  if (!auth.isAuthenticated) {
    window.alert('请先登录后再加入社区')
    return
  }
  actionLoading.value = true
  try {
    await $api.post(`/community/communities/${route.params.slug}/join/`)
    await fetchCommunity()
    await fetchPosts()
    window.alert('已加入社区')
  } catch (error) {
    console.error('加入社区失败', error)
    window.alert('加入失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const leaveCommunity = async () => {
  actionLoading.value = true
  try {
    await $api.post(`/community/communities/${route.params.slug}/leave/`)
    await fetchCommunity()
    await fetchPosts()
    window.alert('已退出社区')
  } catch (error) {
    console.error('退出社区失败', error)
    window.alert('退出失败，请稍后重试')
  } finally {
    actionLoading.value = false
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  postForm.images = Array.from(target.files ?? [])
}

const submitPost = async () => {
  if (!postForm.title.trim() || !postForm.body.trim()) return
  createLoading.value = true
  try {
    const formData = new FormData()
    formData.append('community', String(community.value?.id ?? ''))
    formData.append('title', postForm.title)
    formData.append('body', postForm.body)
    postForm.images.forEach((file) => formData.append('images', file))
    await $api.post('/community/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    postForm.title = ''
    postForm.body = ''
    postForm.images = []
    await fetchPosts()
    window.alert('帖子已发布')
  } catch (error) {
    console.error('发布帖子失败', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '发布失败，请稍后重试')
  } finally {
    createLoading.value = false
  }
}

const toggleLike = async (post: PostItem) => {
  if (!auth.isAuthenticated) {
    window.alert('请先登录后再点赞')
    return
  }
  try {
    const { data } = await $api.post(`/community/posts/${post.id}/like/`)
    post.is_liked = Boolean(data?.liked)
    if (typeof data?.like_count === 'number') {
      post.like_count = data.like_count
    }
  } catch (error) {
    console.error('点赞失败', error)
  }
}

const loadMore = () => {
  if (!hasMore.value || feedLoading.value) return
  fetchPosts(currentPage.value + 1, true)
}

const refreshPosts = () => fetchPosts(1, false)

const resolveMedia = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = $config.public.apiBase?.replace(/\/$/, '') ?? ''
  return `${base}${path}`
}

const formatDate = (value?: string) => {
  if (!value) return '-'
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
  () => route.params.slug,
  async () => {
    await fetchCommunity()
    await fetchPosts()
  },
  { immediate: true }
)
</script>
