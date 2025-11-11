<template>
  <div class="space-y-6">
    <PageHeader title="用户主页" description="掌握账号安全、训练表现与个人资料" />

    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card class="border border-border/70 bg-secondary/40">
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
        <CardContent>
          <div class="grid gap-4 md:grid-cols-3">
            <div v-for="item in heroStats" :key="item.label" class="rounded-lg border border-border/80 bg-background/70 p-4">
              <p class="text-xs uppercase tracking-wide text-muted-foreground">{{ item.label }}</p>
              <p class="mt-2 text-2xl font-semibold">{{ item.value }}</p>
              <p class="text-xs text-muted-foreground">{{ item.hint }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border border-border/70">
        <CardHeader>
          <CardTitle>账号状态</CardTitle>
          <CardDescription>同步登录、活跃度与最近记录</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-for="item in accountHighlights"
            :key="item.label"
            class="flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
          >
            <div>
              <p class="text-xs text-muted-foreground">{{ item.label }}</p>
              <p class="mt-1 font-medium">{{ item.value }}</p>
            </div>
            <Icon :name="item.icon" class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
            上次测验：{{ lastAttemptText }}
          </div>
        </CardContent>
      </Card>
    </section>

    <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card class="border border-border/70">
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>更新昵称、联系方式，保持账号可恢复</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="saveProfile">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <Label for="nickname">昵称</Label>
                <Input id="nickname" v-model="profileForm.nickname" placeholder="澄源守护者" />
              </div>
              <div>
                <Label for="username">账号</Label>
                <Input id="username" :value="auth.user?.username" disabled />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <Label for="email">邮箱</Label>
                <Input id="email" v-model="profileForm.email" type="email" placeholder="you@example.com" />
                <p class="mt-1 text-xs text-muted-foreground">绑定邮箱可接收安全提醒与训练摘要</p>
              </div>
              <div>
                <Label for="phone">手机号</Label>
                <Input id="phone" v-model="profileForm.phone_number" placeholder="138****" />
                <p class="mt-1 text-xs text-muted-foreground">建议填写真实号码，便于二次验证</p>
              </div>
            </div>
            <Button type="submit" class="w-full" :disabled="profileLoading">
              {{ profileLoading ? '保存中...' : '保存个人资料' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div class="space-y-6">
        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>AI 模拟总结</CardTitle>
            <CardDescription>最近一次对话式演练表现</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div v-if="latestSimulation" class="space-y-2">
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <p class="text-xs uppercase tracking-widest text-muted-foreground">场景类别</p>
                  <p class="mt-1 font-medium">{{ latestSimulation.scenarioType }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-widest text-muted-foreground">难度</p>
                  <p class="mt-1 font-medium capitalize">{{ latestSimulation.difficulty }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-widest text-muted-foreground">模式</p>
                  <p class="mt-1 font-medium">{{ latestSimulation.mode }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-widest text-muted-foreground">轮次</p>
                  <p class="mt-1 font-medium">{{ latestSimulation.conversationRounds }}</p>
                </div>
              </div>
              <div class="rounded-xl border border-border/70 bg-muted/40 p-3 text-center">
                <p class="text-xs uppercase tracking-wide text-muted-foreground">最终得分</p>
                <p class="mt-2 text-3xl font-semibold">{{ latestSimulation.finalScore }} 分</p>
              </div>
              <p class="rounded-xl border border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground">
                {{ latestSimulation.performanceAnalysis }}
              </p>
            </div>
            <p v-else class="text-muted-foreground">暂无模拟记录，快去体验一场 AI 场景训练。</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" class="w-full gap-2" @click="navigateTo('/simulation')">
              <Icon name="lucide:bot" class="h-4 w-4" />
              前往 AI 模拟
            </Button>
          </CardFooter>
        </Card>

        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>能力雷达图</CardTitle>
            <CardDescription>多维度评估反诈能力</CardDescription>
          </CardHeader>
          <CardContent class="p-4">
            <CapabilityRadar :profile="simulationRadarProfile" height="240px" />
          </CardContent>
        </Card>

        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>安全清单</CardTitle>
            <CardDescription>完善关键资料提升安全指数</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div
              v-for="task in securityTasks"
              :key="task.label"
              class="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
            >
              <div>
                <p class="text-sm font-medium">{{ task.label }}</p>
                <p class="text-xs text-muted-foreground">{{ task.hint }}</p>
              </div>
              <Icon
                :name="task.done ? 'lucide:check-circle' : 'lucide:circle'"
                class="h-5 w-5"
                :class="task.done ? 'text-emerald-500' : 'text-muted-foreground'"
              />
            </div>
          </CardContent>
        </Card>

        <Card class="border border-border/70">
          <CardHeader>
            <CardTitle>成长建议</CardTitle>
            <CardDescription>基于当前表现生成训练提示</CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li v-for="tip in growthTips" :key="tip">{{ tip }}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>

    <Card class="border border-border/70">
      <CardHeader>
        <CardTitle>账号活动记录</CardTitle>
        <CardDescription>了解安全动作与训练轨迹</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="!activityFeed.length" class="text-sm text-muted-foreground">暂无活动记录</div>
        <ul v-else class="space-y-4">
          <li v-for="item in activityFeed" :key="item.title + item.time" class="relative pl-6 text-sm">
            <span
              class="absolute left-0 top-1 h-2 w-2 rounded-full"
              :class="item.status === 'success' ? 'bg-emerald-500' : 'bg-muted-foreground'"
            />
            <p class="font-medium">{{ item.title }}</p>
            <p class="text-xs text-muted-foreground">{{ item.time }}</p>
            <p class="mt-1 text-muted-foreground">{{ item.description }}</p>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import CapabilityRadar from '~/components/simulation/CapabilityRadar.client.vue'
import type { DashboardStats } from '~/composables/useStatsSync'

definePageMeta({
  requiresAuth: true,
})

type SimulationResult = {
  scenarioType: string
  difficulty: string
  mode: string
  finalScore: number
  conversationRounds: number
  endReasonLabel: string
  performanceAnalysis: string
  capabilityProfile?: Record<string, number>
}

const auth = useAuthStore()
const { $api } = useNuxtApp()
const { userStats, refreshUserStats } = useStatsSync()
const profileLoading = ref(false)
const latestSimulation = ref<SimulationResult | null>(null)

const profileForm = reactive({
  nickname: '',
  email: '',
  phone_number: '',
})

const defaultStats: DashboardStats = {
  quiz_attempts_count: 0,
  average_score: 0,
  best_score: 0,
  last_attempt: null,
}

const stats = computed(() => userStats.value ?? defaultStats)

const levelMap: Record<string, string> = {
  beginner: '初级训练',
  intermediate: '中级训练',
  advanced: '高级训练',
}

const formatScore = (value?: number | null) => {
  if (value === null || value === undefined) return '--'
  return `${Math.round(value)} 分`
}

const userInitials = computed(() => {
  const source = (profileForm.nickname || auth.user?.nickname || auth.user?.username || 'U').trim()
  return source.slice(0, 2)
})

const accountRoleLabel = computed(() => (auth.isAdmin ? '系统管理员' : '实战学员'))

const heroStats = computed(() => [
  { label: '累计答题', value: stats.value.quiz_attempts_count ?? 0, hint: '历史完成次数' },
  { label: '平均得分', value: formatScore(stats.value.average_score), hint: '最近测验表现' },
  { label: '最佳成绩', value: formatScore(stats.value.best_score), hint: '历史最高分' },
])

const accountHighlights = computed(() => [
  { label: '当前身份', value: accountRoleLabel.value, icon: 'lucide:user-check' },
  { label: '测验段位', value: levelMap[stats.value.last_attempt?.level || 'beginner'], icon: 'lucide:activity' },
  { label: '安全邮箱', value: profileForm.email || '未填写', icon: 'lucide:mail' },
])

const lastAttemptText = computed(() => {
  if (!stats.value.last_attempt) return '暂无记录'
  return new Date(stats.value.last_attempt.created_at).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const simulationRadarProfile = computed(() => latestSimulation.value?.capabilityProfile ?? null)

const securityScore = computed(() => {
  let score = 40
  if (profileForm.email) score += 20
  if (profileForm.phone_number) score += 20
  if (stats.value.quiz_attempts_count > 0) score += 20
  return Math.min(score, 100)
})

const securityTasks = computed(() => [
  {
    label: '绑定邮箱',
    hint: '用于找回密码与接收安全预警',
    done: Boolean(profileForm.email),
  },
  {
    label: '绑定手机号',
    hint: '可启用二次验证与短信提醒',
    done: Boolean(profileForm.phone_number),
  },
  {
    label: '完成测验',
    hint: '最近 30 天至少完成 1 次',
    done: stats.value.quiz_attempts_count > 0,
  },
  {
    label: '实时关注',
    hint: '保持账号活跃度与登录频率',
    done: Boolean(auth.isAuthenticated),
  },
])

const growthTips = computed(() => {
  const tips: string[] = []
  if ((stats.value.average_score || 0) < 70) {
    tips.push('平均得分低于 70 分，建议复习“知识雷达”课程或回顾错题。')
  }
  if (!profileForm.phone_number) {
    tips.push('尚未绑定手机号，可启用短信提醒快速识别异常登录。')
  }
  if (!stats.value.last_attempt) {
    tips.push('最近缺少测验记录，建议完成一次测验或 AI 场景演练。')
  }
  if (!tips.length) {
    tips.push('保持当前训练频率，可以挑战更高难度的专题测验。')
  }
  return tips
})

const activityFeed = computed(() => {
  const feed: Array<{ title: string; time: string; description: string; status: 'success' | 'pending' }> = []
  if (stats.value.last_attempt) {
    feed.push({
      title: `完成 ${levelMap[stats.value.last_attempt.level] || '测验'}`,
      time: new Date(stats.value.last_attempt.created_at).toLocaleString('zh-CN'),
      description: `得分 ${stats.value.last_attempt.score} 分，刷新训练记录。`,
      status: 'success',
    })
  }
  if (profileForm.email) {
    feed.push({
      title: '邮箱已绑定',
      time: '实时生效',
      description: `当前邮箱：${profileForm.email}`,
      status: 'success',
    })
  }
  if (profileForm.phone_number) {
    feed.push({
      title: '手机号已绑定',
      time: '实时生效',
      description: `安全提醒将发送至 ${profileForm.phone_number}`,
      status: 'success',
    })
  }
  if (!feed.length) {
    feed.push({
      title: '暂无安全动作',
      time: '',
      description: '完善资料并完成训练后即可看到最新动态。',
      status: 'pending',
    })
  }
  return feed
})

const loadSimulation = async () => {
  try {
    const { data } = await $api.get('/chat/latest-result/')
    if (data?.has_result) {
      const result = data.data
      latestSimulation.value = {
        scenarioType: result.scenario_type,
        difficulty: result.difficulty,
        mode: result.mode,
        finalScore: result.final_score,
        conversationRounds: result.conversation_rounds,
        endReasonLabel: result.end_reason_label,
        performanceAnalysis: result.performance_analysis,
        capabilityProfile: result.capability_profile,
      }
    } else {
      latestSimulation.value = null
    }
  } catch (error) {
    console.warn('Failed to fetch simulation result', error)
    latestSimulation.value = null
  }
}

const loadProfile = async () => {
  try {
    const [profileRes] = await Promise.all([$api.get('/users/profile/'), refreshUserStats()])
    Object.assign(profileForm, {
      nickname: profileRes.data?.nickname ?? '',
      email: profileRes.data?.email ?? '',
      phone_number: profileRes.data?.phone_number ?? '',
    })
  } catch (error) {
    console.error('加载用户资料失败', error)
  }
  await loadSimulation()
}

const saveProfile = async () => {
  profileLoading.value = true
  try {
    await $api.put('/users/profile/', profileForm)
    useMessage('资料已更新')
    await refreshUserStats()
  } catch (error) {
    console.error('保存资料失败', error)
    useMessage('保存失败，请稍后再试')
  } finally {
    profileLoading.value = false
  }
}

const useMessage = (message: string) => {
  if (process.client) window.alert(message)
}

onMounted(loadProfile)
</script>
