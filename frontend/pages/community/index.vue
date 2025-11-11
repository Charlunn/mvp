<template>
  <div class="space-y-6">
    <PageHeader title="社区广场" description="与反诈同行者分享经验、讨论案例，构建可信赖的知识社区" />

    <div v-if="auth.isAuthenticated && auth.user?.is_staff" class="flex justify-end">
      <Button @click="showCreateCommunityDialog = true">
        <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
        创建新社区
      </Button>
    </div>

    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-4">
        <Card v-if="auth.isAuthenticated" class="border border-border/70 bg-secondary/30">
          <CardHeader>
            <CardTitle>发表新帖</CardTitle>
            <CardDescription>分享最新的防骗提示或求助讨论</CardDescription>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="submitPost">
              <div class="grid gap-4">
                <div>
                  <Label for="title">帖子标题</Label>
                  <Input id="title" v-model="postForm.title" placeholder="一句话总结你的观点" required />
                </div>
              </div>
              <div>
                <Label for="body">内容</Label>
                <Textarea
                  id="body"
                  v-model="postForm.body"
                  rows="4"
                  placeholder="分享你的反诈经验、风险提示或求助问题"
                  required
                />
              </div>
              <div>
                <Label class="mb-1 block text-sm font-medium text-muted-foreground">上传图片（可选）</Label>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileChange"
                />
                <Button type="button" variant="outline" @click="triggerFileInput">
                  <Icon name="lucide:upload" class="mr-2 h-4 w-4" />
                  选择图片
                </Button>
                <p v-if="postForm.images.length" class="mt-2 text-xs text-muted-foreground">
                  已选择 {{ postForm.images.length }} 张图片
                </p>
              </div>
              <div class="flex items-center justify-end gap-3">
                <Button type="submit" :disabled="createLoading">
                  {{ createLoading ? '发布中…' : '发布帖子' }}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card v-else class="border border-border/70 bg-muted/30">
          <CardHeader>
            <CardTitle>登录后参与讨论</CardTitle>
            <CardDescription>登录账号即可发帖、点赞和评论</CardDescription>
          </CardHeader>
          <CardContent>
            <Button class="w-full" @click="navigateTo('/login')">前往登录</Button>
          </CardContent>
        </Card>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">社区热帖</h2>
            <Button variant="outline" size="sm" :disabled="feedLoading" @click="refreshPosts">
              <Icon name="lucide:refresh-cw" class="mr-1 h-4 w-4" />
              刷新
            </Button>
          </div>
          <div v-if="feedLoading && !posts.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            正在加载社区内容…
          </div>
          <div v-else-if="!posts.length" class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            暂无帖子，成为第一位分享者吧！
          </div>
          <div v-else class="space-y-4">
            <Card v-for="post in posts" :key="post.id" class="cursor-pointer border border-border/70 transition-colors hover:bg-muted/50" @click="goToPost(post.id, $event)">
              <CardHeader class="space-y-1">
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    发布于
                    <NuxtLink :to="`/community/${post.community_detail.slug}`" class="font-medium text-foreground hover:underline">
                      {{ post.community_detail.name }}
                    </NuxtLink>
                  </div>
                  <span>{{ formatDate(post.created_at) }}</span>
                </div>
                <CardTitle class="text-xl">{{ post.title }}</CardTitle>
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
                  <img
                    v-for="image in post.images"
                    :key="image.id"
                    :src="resolveMedia(image.image)"
                    class="h-48 w-full rounded-lg object-cover"
                    alt="帖子图片"
                  />
                </div>
              </CardContent>
              <CardFooter class="flex items-center justify-between gap-4 text-sm">
                <div class="flex items-center gap-4 text-muted-foreground">
                  <button class="flex items-center gap-1" :class="post.is_liked ? 'text-primary' : ''" @click.stop="toggleLike(post)">
                    <Icon :name="post.is_liked ? 'lucide:heart' : 'lucide:heart-off'" class="h-4 w-4" />
                    <span>{{ post.like_count }}</span>
                  </button>
                  <div class="flex items-center gap-1">
                    <Icon name="lucide:message-square" class="h-4 w-4" />
                    <span>{{ post.comment_count }}</span>
                  </div>
                </div>
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
            <CardTitle>推荐热帖</CardTitle>
            <CardDescription>看看大家都在讨论什么</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div v-if="hotPostsLoading" class="text-muted-foreground">加载中…</div>
            <div v-else-if="!hotPosts.length" class="text-muted-foreground">暂无热帖</div>
            <div v-else class="space-y-3">
              <div
                v-for="post in hotPosts"
                :key="post.id"
                class="rounded-lg border border-border/70 bg-background/80 p-3"
              >
                <NuxtLink :to="`/community/posts/${post.id}`" class="font-medium hover:underline">
                  {{ post.title }}
                </NuxtLink>
                <p class="mt-1 text-xs text-muted-foreground">
                  {{ post.like_count }} 人点赞 · {{ post.comment_count }} 条评论
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border border-border/70 bg-secondary/20">
          <CardHeader>
            <CardTitle>社区守则</CardTitle>
            <CardDescription>共建高质量、可信的防诈空间</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2 text-xs text-muted-foreground">
            <p>· 分享真实有效的反诈经验和案例，避免传播未经验证的信息。</p>
            <p>· 尊重其他用户的隐私，不公开个人敏感数据。</p>
            <p>· 对异常内容使用举报或提醒社区管理员处理。</p>
          </CardContent>
        </Card>
      </aside>
    </section>
  </div>
    <Dialog v-model:open="showCreateCommunityDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新社区</DialogTitle>
          <DialogDescription>填写社区信息以创建一个新的反诈社区。</DialogDescription>
        </DialogHeader>
        <form class="grid gap-4 py-4" @submit.prevent="createCommunity">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-name" class="text-right">名称</Label>
            <Input id="community-name" v-model="createCommunityForm.name" class="col-span-3" required />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-slug" class="text-right">Slug</Label>
            <Input id="community-slug" v-model="createCommunityForm.slug" class="col-span-3" required />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-description" class="text-right">描述</Label>
            <Textarea id="community-description" v-model="createCommunityForm.description" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="community-private" class="text-right">私有社区</Label>
            <Switch id="community-private" v-model:checked="createCommunityForm.is_private" class="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" :disabled="createCommunityLoading">
              {{ createCommunityLoading ? '创建中…' : '创建社区' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

interface CommunitySummary {
  id: number
  name: string
  slug: string
  description: string
  members_count: number
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
  community: number
  community_detail: CommunitySummary & { current_role?: string | null; created_at?: string }
  author: PostAuthor
  images: PostImage[]
  created_at: string
  like_count: number
  comment_count: number
  is_liked: boolean
}

const { $api, $config } = useNuxtApp()
const auth = useAuthStore()

const hotPosts = ref<PostItem[]>([])
const hotPostsLoading = ref(true)
const posts = ref<PostItem[]>([])
const feedLoading = ref(false)
const currentPage = ref(1)
const hasMore = ref(false)
const createLoading = ref(false)
const showCreateCommunityDialog = ref(false)
const createCommunityLoading = ref(false)

const createCommunityForm = reactive({
  name: '',
  slug: '',
  description: '',
  is_private: false,
})

const createCommunity = async () => {
  createCommunityLoading.value = true
  try {
    await $api.post('/community/communities/', createCommunityForm)
    window.alert('社区创建成功！')
    showCreateCommunityDialog.value = false
    createCommunityForm.name = ''
    createCommunityForm.slug = ''
    createCommunityForm.description = ''
    createCommunityForm.is_private = false
    // 重新加载默认社区，确保 postForm.community 被设置
    await fetchDefaultCommunity()
  } catch (error) {
    console.error('创建社区失败', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '创建社区失败，请稍后重试')
  } finally {
    createCommunityLoading.value = false
  }
}

const postForm = reactive({
  community: '',
  title: '',
  body: '',
  images: [] as File[],
})

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const fetchDefaultCommunity = async () => {
  try {
    const { data } = await $api.get('/community/communities/', { params: { page_size: 1 } });
    const results = Array.isArray(data) ? data : data.results || [];
    if (results.length) {
      postForm.community = String(results[0].id);
    } else {
      window.alert('未找到任何社区，无法发布帖子。请联系管理员。');
      console.error('未找到任何社区，无法发布帖子。');
    }
  } catch (error) {
    console.error('加载默认社区失败', error);
  }
};

const fetchHotPosts = async () => {
  hotPostsLoading.value = true;
  try {
    const { data } = await $api.get('/community/posts/', { params: { ordering: '-like_count,-created_at', page_size: 5 } });
    hotPosts.value = Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error('加载热帖失败', error);
  } finally {
    hotPostsLoading.value = false;
  }
};

const fetchPosts = async (page = 1, append = false) => {
  feedLoading.value = true
  try {
    const { data } = await $api.get('/community/posts/', { params: { page } })
    const results = Array.isArray(data) ? data : data.results || []
    if (append) {
      posts.value = [...posts.value, ...results]
    } else {
      posts.value = results
    }
    hasMore.value = Boolean(data?.next)
    currentPage.value = page
  } catch (error) {
    console.error('加载帖子失败', error)
  } finally {
    feedLoading.value = false
  }
}

const refreshPosts = () => fetchPosts(1, false)

const loadMore = () => {
  if (feedLoading.value || !hasMore.value) return
  fetchPosts(currentPage.value + 1, true)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  postForm.images = Array.from(target.files ?? [])
}

const submitPost = async () => {
  console.log('submitPost triggered');
  if (!postForm.title.trim() || !postForm.body.trim()) {
    window.alert('标题和内容不能为空。');
    return;
  }
  createLoading.value = true
  try {
    const formData = new FormData()
    // 只有当 postForm.community 有值时才发送 community 字段
    if (postForm.community) {
      formData.append('community', postForm.community)
    }
    formData.append('title', postForm.title)
    formData.append('body', postForm.body)
    postForm.images.forEach((file) => formData.append('images', file))
    await $api.post('/community/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    window.alert('帖子已发布')
    postForm.title = ''
    postForm.body = ''
    postForm.images = []
    await refreshPosts()
  } catch (error) {
    console.error('发布帖子失败', error)
    const axiosError = error as AxiosError<{ detail?: string }>
    window.alert(axiosError.response?.data?.detail || '发布失败，请稍后重试')
  } finally {
    createLoading.value = false
  }
}

const goToPost = (postId: number, event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.closest('a, button')) {
    return
  }
  navigateTo(`/community/posts/${postId}`)
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

onMounted(async () => {
  await fetchDefaultCommunity()
  await fetchHotPosts()
  await fetchPosts()
})
</script>
