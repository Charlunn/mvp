<template>
  <div class="space-y-8">
    <section class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-widest text-muted-foreground">MVP / Dashboard</p>
        <h1 class="mt-1 text-3xl font-semibold">欢迎回来，{{ auth.user?.nickname || auth.user?.username }}</h1>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" class="gap-2" @click="navigateTo('/profile')">
          <Icon name="lucide:user" class="h-4 w-4" />
          我的主页
        </Button>
        <Button class="gap-2" @click="navigateTo('/quiz')">
          <Icon name="lucide:play" class="h-4 w-4" />
          开始测验
        </Button>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-4">
      <Card v-for="item in statCards" :key="item.label" class="border border-border/80">
        <CardHeader class="space-y-2">
          <CardDescription>{{ item.label }}</CardDescription>
          <CardTitle class="text-3xl">{{ item.value }}</CardTitle>
          <p class="text-xs text-muted-foreground">{{ item.hint }}</p>
        </CardHeader>
      </Card>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <Card class="border border-border/80">
        <CardHeader>
          <CardTitle>个人测验概况</CardTitle>
          <CardDescription>最近 5 次测验表现（按时间倒序）</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="quizLoading" class="text-sm text-muted-foreground">加载中...</div>
          <div v-else class="space-y-4">
            <div
              v-for="attempt in recentAttempts"
              :key="attempt.created_at"
              class="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
            >
              <div>
                <p class="font-medium">{{ levelMap[attempt.level] || '未知等级' }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDate(attempt.created_at) }}</p>
              </div>
              <Badge>{{ attempt.score }} 分</Badge>
            </div>
            <p v-if="!recentAttempts.length" class="text-sm text-muted-foreground">暂无测验记录，先去完成一场测验吧。</p>
          </div>
        </CardContent>
      </Card>

      <Card class="border border-border/80">
        <CardHeader>
          <CardTitle>系统快捷入口</CardTitle>
          <CardDescription>快速跳转到核心 MVP 功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3">
            <Button variant="outline" class="justify-between" @click="navigateTo('/simulation')">
              <span>AI 场景模拟</span>
              <Icon name="lucide:bot" class="h-4 w-4" />
            </Button>
            <Button variant="outline" class="justify-between" @click="navigateTo('/graph')">
              <span>知识图谱可视化</span>
              <Icon name="lucide:network" class="h-4 w-4" />
            </Button>
            <Button
              v-if="auth.isAdmin"
              variant="outline"
              class="justify-between"
              @click="navigateTo('/admin/questions')"
            >
              <span>题库管理（管理员）</span>
              <Icon name="lucide:shield" class="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <Card class="border border-border/80">
        <CardHeader>
          <CardTitle>最新 AI 场景模拟</CardTitle>
          <CardDescription>回顾最近一次对话式演练</CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="latestSimulation" class="space-y-4">
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
                <p class="text-xs uppercase tracking-widest text-muted-foreground">对话轮次</p>
                <p class="mt-1 font-medium">{{ latestSimulation.conversationRounds }}</p>
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-border/70 p-4 text-center">
                <p class="text-xs uppercase tracking-widest text-muted-foreground">最终得分</p>
                <p class="mt-2 text-3xl font-semibold">{{ latestSimulation.finalScore }} 分</p>
              </div>
              <div class="rounded-xl border border-border/70 p-4 text-center">
                <p class="text-xs uppercase tracking-widest text-muted-foreground">结束原因</p>
                <p class="mt-2 text-base font-medium">{{ latestSimulation.endReasonLabel }}</p>
              </div>
            </div>
            <div class="rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-sm">
              <p class="text-xs uppercase tracking-widest text-muted-foreground">表现综述</p>
              <p class="mt-2 text-muted-foreground">{{ latestSimulation.performanceAnalysis }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">
            暂无模拟记录，前往 AI 场景模拟体验一场完整的对话演练。
          </p>
        </CardContent>
      </Card>

      <Card class="border border-border/80">
        <CardHeader>
          <CardTitle>能力雷达图</CardTitle>
          <CardDescription>从多个维度评估反诈能力</CardDescription>
        </CardHeader>
        <CardContent class="p-4">
          <CapabilityRadar :profile="simulationRadarProfile" height="320px" />
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CapabilityRadar from '~/components/simulation/CapabilityRadar.client.vue'

definePageMeta({
  requiresAuth: true,
})

const auth = useAuthStore()
const { $api } = useNuxtApp()
const { userStats, quizStats, refreshAllStats } = useStatsSync()

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

type QuizAttempt = {
  created_at: string
  level: string
  score: number
}

const levelMap: Record<string, string> = {
  beginner: '初级训练',
  intermediate: '中级训练',
  advanced: '高级训练',
}

const quizLoading = ref(true)
const aiScore = ref('-')
const latestSimulation = ref<SimulationResult | null>(null)
const totalAttempts = computed(() => userStats.value?.quiz_attempts_count ?? 0)
const averageScore = computed(() => quizStats.value?.average_score ?? 0)
const bestScore = computed(() => quizStats.value?.best_score ?? 0)
const recentAttempts = computed<QuizAttempt[]>(() => quizStats.value?.recent_attempts ?? [])

const formatDate = (value: string) => {
  return new Date(value).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const simulationRadarProfile = computed(() => latestSimulation.value?.capabilityProfile ?? null)
const formatPercentValue = (value?: number | null) => {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : 0
  const fixed = numeric.toFixed(2)
  return fixed.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

const statCards = computed(() => [
  {
    label: '累计测验次数',
    value: quizLoading.value ? '-' : totalAttempts.value.toString(),
    hint: '包含所有历史答题',
  },
  {
    label: '平均得分',
    value: quizLoading.value ? '-' : `${formatPercentValue(averageScore.value)}%`,
    hint: '最近测验平均成绩',
  },
  {
    label: '最佳成绩',
    value: quizLoading.value ? '-' : `${formatPercentValue(bestScore.value)}%`,
    hint: '历史最高成绩',
  },
  {
    label: 'AI 模拟得分',
    value: aiScore.value,
    hint: '最近一次 AI 场景',
  },
])

const loadStats = async () => {
  quizLoading.value = true
  try {
    await refreshAllStats()
  } catch (error) {
    console.error('Failed to refresh quiz / user stats', error)
  } finally {
    quizLoading.value = false
  }

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
      aiScore.value = `${result.final_score} 分`
    } else {
      latestSimulation.value = null
      aiScore.value = '-'
    }
  } catch (error) {
    console.warn('Failed to fetch simulation result', error)
    latestSimulation.value = null
    aiScore.value = '-'
  }
}

onMounted(loadStats)
</script>
