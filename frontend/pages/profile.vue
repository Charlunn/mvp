<template>
  <div class="space-y-6">
    <PageHeader title="用户主页" description="掌握账号安全、训练表现与个人资料" />

    <!-- User Header Card -->
    <Card class="border-border/70 bg-secondary/40">
      <CardHeader class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl font-semibold">
            {{ userInitials }}
          </div>
          <div>
            <CardTitle class="text-2xl">
              {{ profileForm.nickname || auth.user?.nickname || auth.user?.username }}
            </CardTitle>
            <CardDescription>澄源反诈 · {{ accountRoleLabel }}</CardDescription>
          </div>
        </div>
        <div class="text-sm">
          <p class="text-muted-foreground">安全指数</p>
          <div class="relative mt-2 h-2 w-48 rounded-full bg-border">
            <span class="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all" :style="{ width: securityScore + '%' }" />
          </div>
          <p class="mt-1 text-xs text-muted-foreground">{{ securityScore }} / 100</p>
        </div>
      </CardHeader>
    </Card>

    <!-- Tabs for Profile Sections -->
    <Tabs default-value="profile" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="profile">个人资料</TabsTrigger>
        <TabsTrigger value="community">社区动态</TabsTrigger>
        <TabsTrigger value="training">训练报告</TabsTrigger>
      </TabsList>

      <!-- Profile Tab Content -->
      <TabsContent value="profile" class="mt-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card class="border-border/70">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>更新昵称、联系方式，保持账号可恢复</CardDescription>
            </CardHeader>
            <CardContent>
              <form class="space-y-4" @submit.prevent="saveProfile">
                <div class="grid gap-4 md:grid-cols-2">
                  <div><Label for="nickname">昵称</Label><Input id="nickname" v-model="profileForm.nickname" /></div>
                  <div><Label for="username">账号</Label><Input id="username" :value="auth.user?.username" disabled /></div>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                  <div><Label for="email">邮箱</Label><Input id="email" v-model="profileForm.email" type="email" /></div>
                  <div><Label for="phone">手机号</Label><Input id="phone" v-model="profileForm.phone_number" /></div>
                </div>
                 <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label for="visibility">主页可见性</Label>
                    <select v-model="profileForm.profile_visibility" class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="public">公开</option>
                      <option value="private">私密</option>
                    </select>
                  </div>
                  <div class="space-y-2 rounded-lg border border-dashed border-border/60 p-3">
                     <label class="flex items-center gap-2 text-xs"><input v-model="profileForm.show_email" type="checkbox" />公开邮箱</label>
                     <label class="flex items-center gap-2 text-xs"><input v-model="profileForm.show_phone" type="checkbox" />公开手机号</label>
                  </div>
                </div>
                <Button type="submit" class="w-full" :disabled="profileLoading">{{ profileLoading ? '保存中...' : '保存资料' }}</Button>
              </form>
            </CardContent>
          </Card>
          <div class="space-y-6">
            <Card class="border-border/70">
              <CardHeader><CardTitle>安全清单</CardTitle><CardDescription>完善关键资料提升安全指数</CardDescription></CardHeader>
              <CardContent class="space-y-3">
                <div v-for="task in securityTasks" :key="task.label" class="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                  <div><p class="text-sm font-medium">{{ task.label }}</p><p class="text-xs text-muted-foreground">{{ task.hint }}</p></div>
                  <Icon :name="task.done ? 'lucide:check-circle' : 'lucide:circle'" class="h-5 w-5" :class="task.done ? 'text-emerald-500' : 'text-muted-foreground'" />
                </div>
              </CardContent>
            </Card>
             <Card class="border-border/70">
              <CardHeader><CardTitle>账号状态</CardTitle><CardDescription>同步登录、活跃度与最近记录</CardDescription></CardHeader>
              <CardContent class="space-y-4">
                <div v-for="item in accountHighlights" :key="item.label" class="flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <div><p class="text-xs text-muted-foreground">{{ item.label }}</p><p class="mt-1 font-medium">{{ item.value }}</p></div>
                  <Icon :name="item.icon" class="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <!-- Community Tab Content -->
      <TabsContent value="community" class="mt-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card class="border-border/70">
            <CardHeader><CardTitle>社区活跃度</CardTitle><CardDescription>你的发帖与互动数据总览</CardDescription></CardHeader>
            <CardContent class="grid grid-cols-2 gap-4">
              <div class="rounded-lg bg-background/70 p-3"><p class="text-xs text-muted-foreground">发布帖子</p><p class="mt-1 text-xl font-semibold">{{ communityStats.posts_published }}</p></div>
              <div class="rounded-lg bg-background/70 p-3"><p class="text-xs text-muted-foreground">参与评论</p><p class="mt-1 text-xl font-semibold">{{ communityStats.comments_written }}</p></div>
              <div class="rounded-lg bg-background/70 p-3"><p class="text-xs text-muted-foreground">帖子获赞</p><p class="mt-1 text-xl font-semibold">{{ communityStats.post_likes_received }}</p></div>
              <div class="rounded-lg bg-background/70 p-3"><p class="text-xs text-muted-foreground">评论获赞</p><p class="mt-1 text-xl font-semibold">{{ communityStats.comment_likes_received }}</p></div>
            </CardContent>
          </Card>
          <Card class="border-border/70">
            <CardHeader><CardTitle>我的帖子</CardTitle><CardDescription>已发布的全部帖子列表</CardDescription></CardHeader>
            <CardContent>
              <div v-if="myPostsLoading && !myPosts.length" class="text-sm text-muted-foreground">加载中…</div>
              <div v-else-if="!myPosts.length" class="text-sm text-muted-foreground">暂未发布任何帖子。</div>
              <div v-else class="space-y-3">
                <div v-for="post in myPosts" :key="post.id" class="flex items-center justify-between gap-2 rounded-lg border border-border/70 p-3">
                  <div class="min-w-0">
                    <p class="truncate font-medium">{{ post.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ post.community_detail?.name || '社区' }} · {{ formatDate(post.created_at) }}</p>
                  </div>
                  <Button variant="ghost" size="sm" @click="navigateTo(`/community/posts/${post.id}`)">查看</Button>
                </div>
                <Button v-if="hasMorePosts" class="w-full" variant="outline" :disabled="myPostsLoading" @click="fetchMyPosts(true)">
                  {{ myPostsLoading ? '加载中...' : '加载更多帖子' }}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Training Report Tab Content -->
      <TabsContent value="training" class="mt-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="space-y-6">
            <Card class="border-border/70">
              <CardHeader><CardTitle>AI 模拟总结</CardTitle><CardDescription>最近一次对话式演练表现</CardDescription></CardHeader>
              <CardContent v-if="latestSimulation" class="space-y-3 text-sm">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div><p class="text-xs uppercase text-muted-foreground">场景</p><p class="mt-1 font-medium">{{ latestSimulation.scenarioType }}</p></div>
                  <div><p class="text-xs uppercase text-muted-foreground">难度</p><p class="mt-1 font-medium capitalize">{{ latestSimulation.difficulty }}</p></div>
                </div>
                <div class="rounded-xl border border-border/70 bg-muted/40 p-3 text-center">
                  <p class="text-xs uppercase text-muted-foreground">最终得分</p>
                  <p class="mt-2 text-3xl font-semibold">{{ latestSimulation.finalScore }}</p>
                </div>
                <p class="rounded-xl border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground">{{ latestSimulation.performanceAnalysis }}</p>
              </CardContent>
              <CardContent v-else><p class="text-muted-foreground">暂无模拟记录。</p></CardContent>
            </Card>
            <Card class="border-border/70">
              <CardHeader><CardTitle>成长建议</CardTitle><CardDescription>基于当前表现生成训练提示</CardDescription></CardHeader>
              <CardContent><ul class="list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li v-for="tip in growthTips" :key="tip">{{ tip }}</li></ul></CardContent>
            </Card>
          </div>
          <div class="space-y-6">
            <Card class="border-border/70">
              <CardHeader><CardTitle>能力雷达图</CardTitle><CardDescription>多维度评估反诈能力</CardDescription></CardHeader>
              <CardContent class="p-4"><CapabilityRadar :profile="simulationRadarProfile" height="240px" /></CardContent>
            </Card>
            <Card class="border-border/70">
              <CardHeader><CardTitle>账号活动记录</CardTitle><CardDescription>了解安全动作与训练轨迹</CardDescription></CardHeader>
              <CardContent>
                <div v-if="!activityFeed.length" class="text-sm text-muted-foreground">暂无活动记录</div>
                <ul v-else class="space-y-4">
                  <li v-for="item in activityFeed" :key="item.title + item.time" class="relative pl-6 text-sm">
                    <span class="absolute left-0 top-1 h-2 w-2 rounded-full" :class="item.status === 'success' ? 'bg-emerald-500' : 'bg-muted-foreground'" />
                    <p class="font-medium">{{ item.title }}</p><p class="text-xs text-muted-foreground">{{ item.time }}</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import CapabilityRadar from '~/components/simulation/CapabilityRadar.client.vue'
import type { DashboardStats } from '~/composables/useStatsSync'

definePageMeta({ requiresAuth: true })

type SimulationResult = {
  scenarioType: string; difficulty: string; mode: string; finalScore: number;
  conversationRounds: number; endReasonLabel: string; performanceAnalysis: string;
  capabilityProfile?: Record<string, number>;
}

const auth = useAuthStore()
const { $api } = useNuxtApp()
const { userStats, refreshUserStats } = useStatsSync()
const profileLoading = ref(false)
const latestSimulation = ref<SimulationResult | null>(null)

const profileForm = reactive({
  nickname: '', email: '', phone_number: '',
  profile_visibility: 'public', show_email: false, show_phone: false,
})

const communityStats = ref({
  posts_published: 0, comments_written: 0,
  post_likes_received: 0, comment_likes_received: 0,
})

const myPosts = ref<any[]>([])
const myPostsLoading = ref(false)
const postsPage = ref(1)
const hasMorePosts = ref(false)

const defaultStats: DashboardStats = {
  quiz_attempts_count: 0, average_score: 0, best_score: 0, last_attempt: null,
}

const stats = computed(() => userStats.value ?? defaultStats)
const userInitials = computed(() => (profileForm.nickname || auth.user?.nickname || auth.user?.username || 'U').trim().slice(0, 2))
const accountRoleLabel = computed(() => (auth.isAdmin ? '系统管理员' : '实战学员'))

const accountHighlights = computed(() => [
  { label: '当前身份', value: accountRoleLabel.value, icon: 'lucide:user-check' },
  { label: '测验段位', value: '初级训练', icon: 'lucide:activity' },
  { label: '安全邮箱', value: profileForm.email || '未填写', icon: 'lucide:mail' },
])

const simulationRadarProfile = computed(() => latestSimulation.value?.capabilityProfile ?? null)

const securityScore = computed(() => {
  let score = 40
  if (profileForm.email) score += 20
  if (profileForm.phone_number) score += 20
  if (stats.value.quiz_attempts_count > 0) score += 20
  return Math.min(score, 100)
})

const securityTasks = computed(() => [
  { label: '绑定邮箱', hint: '用于找回密码与接收安全预警', done: Boolean(profileForm.email) },
  { label: '绑定手机号', hint: '可启用二次验证与短信提醒', done: Boolean(profileForm.phone_number) },
  { label: '完成测验', hint: '最近 30 天至少完成 1 次', done: stats.value.quiz_attempts_count > 0 },
])

const growthTips = computed(() => {
  const tips: string[] = []
  if ((stats.value.average_score || 0) < 70) tips.push('平均得分低于 70 分，建议复习课程。')
  if (!profileForm.phone_number) tips.push('尚未绑定手机号，建议绑定以提高安全性。')
  if (!stats.value.last_attempt) tips.push('缺少测验记录，建议完成一次测验。')
  if (!tips.length) tips.push('保持当前训练频率，挑战更高难度。')
  return tips
})

const activityFeed = computed(() => {
  const feed: any[] = []
  if (stats.value.last_attempt) {
    feed.push({
      title: `完成测验`,
      time: new Date(stats.value.last_attempt.created_at).toLocaleString('zh-CN'),
      status: 'success',
    })
  }
  if (profileForm.email) {
    feed.push({ title: '邮箱已绑定', time: '实时生效', status: 'success' })
  }
  return feed
})

const loadSimulation = async () => {
  try {
    const { data } = await $api.get('/chat/latest-result/')
    if (data?.has_result) latestSimulation.value = data.data
  } catch (error) { console.warn('Failed to fetch simulation result', error) }
}

const loadProfile = async () => {
  try {
    const [profileRes] = await Promise.all([$api.get('/users/profile/'), refreshUserStats()])
    Object.assign(profileForm, profileRes.data)
    communityStats.value = profileRes.data?.community_stats ?? communityStats.value
  } catch (error) { console.error('加载用户资料失败', error) }
  await Promise.all([loadSimulation(), fetchMyPosts()])
}

const saveProfile = async () => {
  profileLoading.value = true
  try {
    await $api.put('/users/profile/', profileForm)
    window.alert('资料已更新')
  } catch (error) {
    console.error('保存资料失败', error)
    window.alert('保存失败，请稍后再试')
  } finally {
    profileLoading.value = false
  }
}

const fetchMyPosts = async (loadMore = false) => {
  if (!auth.user?.username) return
  myPostsLoading.value = true
  const pageToFetch = loadMore ? postsPage.value + 1 : 1
  try {
    const { data } = await $api.get('/community/posts/', {
      params: { author: auth.user.username, page: pageToFetch },
    })
    const results = data.results || []
    if (loadMore) {
      myPosts.value.push(...results)
    } else {
      myPosts.value = results
    }
    hasMorePosts.value = Boolean(data.next)
    postsPage.value = pageToFetch
  } catch (error) {
    console.warn('加载个人帖子失败', error)
  } finally {
    myPostsLoading.value = false
  }
}

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('zh-CN')

onMounted(loadProfile)
</script>