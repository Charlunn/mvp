<template>
  <div class="space-y-6">
    <PageHeader title="社区名片" description="查看用户在社区内的贡献与动态" />

    <div v-if="profile" class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section class="space-y-6">
        <Card class="border border-border/70">
          <CardHeader class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle class="text-2xl">{{ profile.nickname || profile.username }}</CardTitle>
              <CardDescription class="text-sm">
                {{ profile.is_self ? '这是你的公共主页' : `@${profile.username}` }}
              </CardDescription>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline">{{ visibilityLabel }}</Badge>
              <Badge variant="outline">帖子 {{ profile.community_stats.posts_published }}</Badge>
              <Badge variant="outline">评论 {{ profile.community_stats.comments_written }}</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <p class="text-xs text-muted-foreground">邮箱</p>
                <p>{{ profile.email || '未公开' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">手机号</p>
                <p>{{ profile.phone_number || '未公开' }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">帖子获赞</p>
                <p>{{ profile.community_stats.post_likes_received }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">评论获赞</p>
                <p>{{ profile.community_stats.comment_likes_received }}</p>
              </div>
            </div>
            <div class="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
              <p>隐私设置：
                <span v-if="profile.profile_visibility === 'private'">仅本人可见</span>
                <span v-else-if="profile.profile_visibility === 'friends'">仅授权用户可见</span>
                <span v-else>公开主页</span>
              </p>
              <p>展示邮箱：{{ profile.show_email ? '是' : '否' }} · 展示手机号：{{ profile.show_phone ? '是' : '否' }}</p>
            </div>
          </CardContent>
        </Card>

        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>最近发表</CardTitle>
            <CardDescription>浏览该用户最近的帖子与互动</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="postsError" class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              {{ postsError }}
            </div>
            <div v-else-if="postsLoading" class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              正在加载帖子…
            </div>
            <div v-else-if="!posts.length" class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
              暂无帖子。
            </div>
            <div v-else class="space-y-4">
              <Card v-for="post in posts" :key="post.id" class="border border-border/70">
                <CardHeader>
                  <CardTitle class="text-lg">{{ post.title }}</CardTitle>
                  <CardDescription>
                    发布于
                    <NuxtLink :to="`/community/${post.community_detail.slug}`" class="font-medium hover:underline">
                      {{ post.community_detail.name }}
                    </NuxtLink>
                    · {{ formatDate(post.created_at) }}
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-3 text-sm">
                  <p class="line-clamp-3 whitespace-pre-line leading-relaxed">{{ post.body }}</p>
                  <div class="flex items-center gap-4 text-muted-foreground">
                    <span class="flex items-center gap-1"><Icon name="lucide:heart" class="h-4 w-4" />{{ post.like_count }}</span>
                    <span class="flex items-center gap-1"><Icon name="lucide:message-square" class="h-4 w-4" />{{ post.comment_count }}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" @click="navigateTo(`/community/posts/${post.id}`)">查看详情</Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      <aside class="space-y-4">
        <Card class="border border-border/70 bg-secondary/20">
          <CardHeader>
            <CardTitle>社区积分</CardTitle>
            <CardDescription>统计来自公开互动的数据</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2 text-sm">
            <p>帖子数量：{{ profile.community_stats.posts_published }}</p>
            <p>评论数量：{{ profile.community_stats.comments_written }}</p>
            <p>帖子获赞：{{ profile.community_stats.post_likes_received }}</p>
            <p>评论获赞：{{ profile.community_stats.comment_likes_received }}</p>
          </CardContent>
        </Card>
        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>互动力度</CardTitle>
            <CardDescription>了解该用户在社区的参与趋势</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2 text-xs text-muted-foreground">
            <p>· 若主页设为私密，只有本人及管理员可见详细资料。</p>
            <p>· 帖子与评论获赞越多，可信度越高。</p>
            <p>· 设置隐私字段可控制邮箱和手机号是否公开。</p>
          </CardContent>
        </Card>
      </aside>
    </div>

    <div v-else class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
      {{ profileError || '正在加载用户资料…' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'

interface CommunityStats {
  posts_published: number
  comments_written: number
  post_likes_received: number
  comment_likes_received: number
}

interface PublicProfile {
  username: string
  nickname?: string | null
  email?: string | null
  phone_number?: string | null
  profile_visibility: string
  show_email: boolean
  show_phone: boolean
  community_stats: CommunityStats
  is_self: boolean
}

interface PostSummary {
  id: number
  title: string
  body: string
  created_at: string
  like_count: number
  comment_count: number
  community_detail: { id: number; name: string; slug: string }
}

const route = useRoute()
const { $api } = useNuxtApp()

const profile = ref<PublicProfile | null>(null)
const profileError = ref<string | null>(null)
const posts = ref<PostSummary[]>([])
const postsLoading = ref(false)
const postsError = ref<string | null>(null)

const visibilityLabel = computed(() => {
  if (!profile.value) return '未知'
  switch (profile.value.profile_visibility) {
    case 'private':
      return '私密主页'
    case 'friends':
      return '半公开'
    default:
      return '公开主页'
  }
})

const fetchProfile = async () => {
  profileError.value = null
  try {
    const { data } = await $api.get(`/community/users/${route.params.username}/`)
    profile.value = data
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>
    profile.value = null
    profileError.value = axiosError.response?.data?.detail || '无法获取该用户信息'
  }
}

const fetchPosts = async () => {
  postsLoading.value = true
  postsError.value = null
  try {
    const { data } = await $api.get(`/community/users/${route.params.username}/posts/`)
    posts.value = Array.isArray(data) ? data : data.results || []
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>
    posts.value = []
    postsError.value = axiosError.response?.data?.detail || '无法获取帖子列表'
  } finally {
    postsLoading.value = false
  }
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
  () => route.params.username,
  async () => {
    await fetchProfile()
    await fetchPosts()
  },
  { immediate: true }
)
</script>
