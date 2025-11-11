<template>
  <div class="space-y-6">
    <PageHeader title="知识测验" description="选择难度、回答问题并获得实时得分。" />

    <Card class="border border-border/80">
      <CardHeader>
        <CardTitle>答题区域</CardTitle>
        <CardDescription>黑白分明的题目卡片帮助你聚焦内容。</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <Button
            v-for="level in levels"
            :key="level.value"
            :variant="selectedLevel === level.value ? 'default' : 'outline'"
            class="gap-2"
            @click="changeLevel(level.value)"
          >
            <Icon :name="level.icon" class="h-4 w-4" />
            {{ level.label }}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            class="gap-2"
            :disabled="loading"
            @click="startSession"
          >
            <Icon :name="sessionMeta ? 'lucide:refresh-cw' : 'lucide:play'" class="h-4 w-4" />
            {{ sessionMeta ? '重新抽题' : '开始本轮答题' }}
          </Button>
        </div>

        <div
          v-if="sessionMeta"
          class="flex items-center gap-3 rounded-lg border border-border/70 bg-secondary/30 px-4 py-3 text-sm text-muted-foreground"
        >
          <Icon name="lucide:timer" class="h-4 w-4" />
          <div>
            <p>当前会话：{{ levelMap[sessionMeta.level] }} · {{ sessionMeta.total_questions }} 题</p>
            <p class="text-xs">完成本轮后再提交答案，系统会刷新整体统计</p>
          </div>
        </div>

        <div class="space-y-3" v-if="loading">
          <div class="h-24 rounded-md border border-dashed border-border/60"></div>
          <div class="h-24 rounded-md border border-dashed border-border/60"></div>
          <div class="h-24 rounded-md border border-dashed border-border/60"></div>
        </div>

        <div v-else>
          <div v-if="questions.length" class="space-y-4">
            <div
              v-for="question in questions"
              :key="question.id"
              class="rounded-xl border border-border/80 bg-card p-4"
            >
              <p class="text-sm uppercase tracking-widest text-muted-foreground">{{ levelMap[question.level] }}</p>
              <p class="mt-2 text-base font-medium">{{ question.text }}</p>
              <div class="mt-3 grid gap-2">
                <label
                  v-for="option in question.options"
                  :key="option.value"
                  class="flex cursor-pointer items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-secondary"
                >
                  <div class="flex items-center gap-3">
                    <input
                      type="radio"
                      :name="'question-' + question.id"
                      :value="option.value"
                      v-model="answers[question.id]"
                      :disabled="!sessionMeta"
                      class="accent-black"
                    />
                    <span>{{ option.label }}</span>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ option.value }}</span>
                </label>
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/10 p-6 text-center text-sm text-muted-foreground"
          >
            <Icon name="lucide:sparkles" class="h-6 w-6 text-muted-foreground" />
            <p>{{ emptyStateMessage }}</p>
            <Button size="sm" variant="outline" class="gap-2" @click="startSession">
              <Icon name="lucide:refresh-cw" class="h-4 w-4" />
              重新加载题目
            </Button>
            <p v-if="auth.isAdmin" class="text-xs">
              作为管理员，你也可以在下方快速录入新题
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-3 border-t border-border/60 pt-4 md:flex-row md:items-center md:justify-between">
        <p class="text-sm text-muted-foreground">
          {{ progressCopy }}
        </p>
        <div class="flex items-center gap-3">
          <Button class="gap-2" :disabled="submitting || !canSubmit" :variant="canSubmit ? 'default' : 'secondary'" @click="submitQuiz">
            <Icon name="lucide:send" class="h-4 w-4" />
            {{ submitting ? '提交中...' : '提交答案' }}
          </Button>
          <p v-if="result" class="text-sm text-muted-foreground">
            得分 {{ result.score }}，正确 {{ result.correct_answers }}/{{ result.total_questions }}
          </p>
        </div>
      </CardFooter>
    </Card>

    <Card class="border border-border/80">
      <CardHeader>
        <CardTitle>测验统计</CardTitle>
        <CardDescription>了解你的进步趋势。</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-border/60 p-4">
          <p class="text-xs uppercase tracking-widest text-muted-foreground">总次数</p>
          <p class="mt-2 text-3xl font-semibold">{{ stats.total_attempts }}</p>
        </div>
        <div class="rounded-xl border border-border/60 p-4">
          <p class="text-xs uppercase tracking-widest text-muted-foreground">平均分</p>
          <p class="mt-2 text-3xl font-semibold">{{ stats.average_score }}%</p>
        </div>
        <div class="rounded-xl border border-border/60 p-4">
          <p class="text-xs uppercase tracking-widest text-muted-foreground">最佳成绩</p>
          <p class="mt-2 text-3xl font-semibold">{{ stats.best_score }}%</p>
        </div>
      </CardContent>
    </Card>

    <Card v-if="auth.isAdmin" class="border border-border/80">
      <CardHeader>
        <CardTitle>管理员：快速扩展题库</CardTitle>
        <CardDescription>黑白控制台内即可录入新题。</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-6 md:grid-cols-2">
        <form class="space-y-3" @submit.prevent="createQuestion">
          <div>
            <Label>题目内容</Label>
            <Textarea v-model="newQuestion.text" required placeholder="描述一个诈骗场景" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="option in ['A','B','C','D']" :key="option">
              <Label>选项 {{ option }}</Label>
              <Textarea v-model="newQuestion['option_' + option.toLowerCase()]" rows="2" required />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Label>难度</Label>
              <select v-model="newQuestion.level" class="w-full rounded-md border border-border bg-background p-2 text-sm">
                <option value="beginner">初级</option>
                <option value="intermediate">中级</option>
                <option value="advanced">高级</option>
              </select>
            </div>
            <div>
              <Label>正确答案</Label>
              <select v-model="newQuestion.correct_answer" class="w-full rounded-md border border-border bg-background p-2 text-sm">
                <option v-for="option in ['A','B','C','D']" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>
          <Button type="submit" class="w-full" :disabled="adminSaving">
            {{ adminSaving ? '保存中...' : '新增题目' }}
          </Button>
        </form>

        <div class="space-y-3">
          <p class="text-sm text-muted-foreground">最近录入题目</p>
          <div v-for="item in adminQuestions" :key="item.id" class="rounded-lg border border-border/70 p-3 text-sm">
            <p class="font-medium">{{ item.text }}</p>
            <p class="text-xs text-muted-foreground mt-1">正确答案：{{ item.correct_answer }} · 难度：{{ levelMap[item.level] }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { QuizPerformanceStats } from '~/composables/useStatsSync'

definePageMeta({
  requiresAuth: true,
  ssr: false,
})

const auth = useAuthStore()
const { $api } = useNuxtApp()
const { quizStats, refreshQuizStats, refreshAllStats } = useStatsSync()

const levels = [
  { value: 'beginner', label: '初级', icon: 'lucide:leaf' },
  { value: 'intermediate', label: '中级', icon: 'lucide:kanban' },
  { value: 'advanced', label: '高级', icon: 'lucide:zap' },
]

const levelMap: Record<string, string> = {
  beginner: '初级训练',
  intermediate: '中级训练',
  advanced: '高级训练',
}

interface QuestionDTO {
  id: number
  text: string
  level: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

interface QuizSessionMeta {
  id: number
  level: string
  total_questions: number
}

const QUESTION_BATCH_SIZE = 5
const selectedLevel = ref('beginner')
const questions = ref<QuestionDTO[]>([])
const answers = reactive<Record<number, string>>({})
const loading = ref(true)
const submitting = ref(false)
const result = ref<any>(null)
const sessionMeta = ref<QuizSessionMeta | null>(null)
const sessionError = ref<string | null>(null)
const defaultQuizStats: QuizPerformanceStats = {
  total_attempts: 0,
  average_score: 0,
  best_score: 0,
  level_stats: {},
  recent_attempts: [],
}
const stats = computed(() => quizStats.value ?? defaultQuizStats)

const newQuestion = reactive<any>({
  text: '',
  level: 'beginner',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
})
const adminQuestions = ref<QuestionDTO[]>([])
const adminSaving = ref(false)

const normalizeListResponse = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  if (payload && Array.isArray(payload.results)) {
    return payload.results
  }
  return []
}

const resetAnswers = () => {
  Object.keys(answers).forEach((key) => delete answers[Number(key)])
}

const resetSessionState = () => {
  sessionMeta.value = null
  sessionError.value = null
  questions.value = []
  resetAnswers()
}

const answeredCount = computed(() =>
  questions.value.reduce((count, question) => (answers[question.id] ? count + 1 : count), 0)
)
const canSubmit = computed(
  () =>
    !loading.value &&
    !!sessionMeta.value &&
    questions.value.length > 0 &&
    answeredCount.value === questions.value.length
)
const progressCopy = computed(() => {
  if (loading.value) {
    return '正在为你抽取本轮题目...'
  }
  if (!sessionMeta.value) {
    return '选择难度后点击“开始本轮答题”，系统会随机抽题'
  }
  if (!questions.value.length) {
    return sessionError.value || '当前难度暂无题目，试试重新抽题或切换难度'
  }
  if (!answeredCount.value) {
    return `本轮共有 ${questions.value.length} 题，等待作答`
  }
  if (answeredCount.value < questions.value.length) {
    return `已完成 ${answeredCount.value}/${questions.value.length} 题，继续加油`
  }
  return '全部题目已完成作答，可以提交'
})
const emptyStateMessage = computed(
  () => sessionError.value || '当前难度暂无可用题目，试试重新抽题或切换到其他难度。'
)

const shapeQuestion = (q: QuestionDTO) => ({
  ...q,
  options: [
    { label: q.option_a, value: 'A' },
    { label: q.option_b, value: 'B' },
    { label: q.option_c, value: 'C' },
    { label: q.option_d, value: 'D' },
  ],
})

const changeLevel = (value: string) => {
  selectedLevel.value = value
  result.value = null
  resetSessionState()
}

const startSession = async () => {
  loading.value = true
  result.value = null
  resetSessionState()
  try {
    const { data } = await $api.post('/quiz/start/', {
      level: selectedLevel.value,
      limit: QUESTION_BATCH_SIZE,
    })
    const items = (data?.questions ?? []) as QuestionDTO[]
    questions.value = items.map((item: QuestionDTO) => shapeQuestion(item))
    sessionMeta.value = {
      id: data.session_id,
      level: data.level,
      total_questions: data.total_questions,
    }
  } catch (error: any) {
    console.error('Failed to start quiz session', error)
    sessionMeta.value = null
    questions.value = []
    sessionError.value = error?.response?.data?.detail ?? '创建测验失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const submitQuiz = async () => {
  if (!canSubmit.value || !sessionMeta.value) {
    return
  }
  submitting.value = true
  try {
    const payload = {
      level: sessionMeta.value.level,
      session_id: sessionMeta.value.id,
      answers: { ...answers },
    }
    const { data } = await $api.post('/quiz/submit/', payload)
    result.value = data
    resetSessionState()
    try {
      await refreshAllStats()
    } catch (error) {
      console.warn('Failed to refresh stats after submission', error)
    }
  } finally {
    submitting.value = false
  }
}

const loadStats = async () => {
  try {
    await refreshQuizStats()
  } catch (error) {
    console.warn('Failed to load stats', error)
  }
}

const loadAdminQuestions = async () => {
  if (!auth.isAdmin) return
  const { data } = await $api.get('/quiz/admin/questions/', { params: { limit: 5 } })
  adminQuestions.value = normalizeListResponse<QuestionDTO>(data).slice(0, 5)
}

const createQuestion = async () => {
  adminSaving.value = true
  try {
    await $api.post('/quiz/admin/questions/', newQuestion)
    Object.assign(newQuestion, {
      text: '',
      level: 'beginner',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
    })
    loadAdminQuestions()
  } finally {
    adminSaving.value = false
  }
}

onMounted(() => {
  startSession()
  loadStats()
  loadAdminQuestions()
})
</script>
