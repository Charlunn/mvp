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
            @click="startQuiz"
          >
            <Icon name="lucide:play" class="h-4 w-4" />
            开始本轮答题
          </Button>
        </div>

        <div class="mt-6 text-center py-10 border border-dashed rounded-lg bg-muted/10">
          <Icon name="lucide:brain-circuit" class="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 class="text-lg font-medium">准备好挑战了吗？</h3>
          <p class="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            选择上方难度，点击“开始本轮答题”进入测验。每轮包含 5 道题目，完成后系统将自动评估你的防骗能力。
          </p>
        </div>
      </CardContent>
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
const router = useRouter()
const { quizStats, refreshQuizStats } = useStatsSync()

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

const selectedLevel = ref('beginner')
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

const changeLevel = (value: string) => {
  selectedLevel.value = value
}

const startQuiz = () => {
  router.push({
    path: '/quiz/play',
    query: { level: selectedLevel.value }
  })
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
  loadStats()
  loadAdminQuestions()
})
</script>
