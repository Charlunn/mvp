<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">知识测验 - {{ levelLabel }}</h1>
      <Button variant="outline" size="sm" @click="goBack">
        <Icon name="lucide:x" class="h-4 w-4 mr-2" />
        退出
      </Button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="h-32 rounded-lg border border-dashed animate-pulse"></div>
      <div class="h-32 rounded-lg border border-dashed animate-pulse"></div>
    </div>

    <div v-else-if="error" class="text-center py-10">
      <Icon name="lucide:alert-circle" class="h-10 w-10 text-red-500 mx-auto mb-4" />
      <p class="text-lg text-muted-foreground">{{ error }}</p>
      <Button class="mt-4" @click="startSession">重试</Button>
    </div>

    <div v-else-if="result" class="text-center py-10 space-y-6">
      <Icon name="lucide:trophy" class="h-16 w-16 text-yellow-500 mx-auto" />
      <h2 class="text-3xl font-bold">本次得分: {{ result.score }}</h2>
      <p class="text-muted-foreground">
        正确 {{ result.correct_answers }} / {{ result.total_questions }} 题
      </p>
      <div class="flex justify-center gap-4">
        <Button variant="outline" @click="goBack">返回主页</Button>
        <Button @click="startSession">再来一轮</Button>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span>进度: {{ answeredCount }} / {{ questions.length }}</span>
        <span>{{ sessionMeta?.total_questions }} 题 / 轮</span>
      </div>

      <div class="space-y-6">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="rounded-xl border bg-card p-6 shadow-sm"
        >
          <div class="flex items-start gap-4">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {{ index + 1 }}
            </span>
            <div class="flex-1 space-y-4">
              <p class="text-lg font-medium">{{ question.text }}</p>
              <div class="grid gap-3">
                <label
                  v-for="option in question.options"
                  :key="option.value"
                  class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                  :class="{ 'border-primary bg-primary/5': answers[question.id] === option.value }"
                >
                  <div class="flex h-5 w-5 items-center justify-center rounded-full border border-primary">
                    <div v-if="answers[question.id] === option.value" class="h-2.5 w-2.5 rounded-full bg-primary"></div>
                  </div>
                  <span class="flex-1">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 border rounded-lg shadow-lg flex justify-between items-center">
        <p class="text-sm text-muted-foreground">
          {{ answeredCount === questions.length ? '所有题目已完成' : '请完成所有题目后提交' }}
        </p>
        <Button :disabled="submitting || answeredCount < questions.length" @click="submitQuiz">
          {{ submitting ? '提交中...' : '提交答案' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'default',
  requiresAuth: true,
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { refreshAllStats } = useStatsSync()

const level = route.query.level as string || 'beginner'
const levelMap: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
}
const levelLabel = computed(() => levelMap[level] || level)

interface QuestionDTO {
  id: number
  text: string
  level: string
  options: { label: string; value: string }[]
}

interface QuizSessionMeta {
  id: number
  level: string
  total_questions: number
}

const loading = ref(true)
const error = ref<string | null>(null)
const questions = ref<QuestionDTO[]>([])
const answers = reactive<Record<number, string>>({})
const sessionMeta = ref<QuizSessionMeta | null>(null)
const submitting = ref(false)
const result = ref<any>(null)

const answeredCount = computed(() =>
  questions.value.reduce((count, question) => (answers[question.id] ? count + 1 : count), 0)
)

const shapeQuestion = (q: any) => ({
  id: q.id,
  text: q.text,
  level: q.level,
  options: [
    { label: q.option_a, value: 'A' },
    { label: q.option_b, value: 'B' },
    { label: q.option_c, value: 'C' },
    { label: q.option_d, value: 'D' },
  ],
})

const startSession = async () => {
  loading.value = true
  error.value = null
  result.value = null
  questions.value = []
  Object.keys(answers).forEach(k => delete answers[Number(k)])
  
  try {
    const { data } = await $api.post('/quiz/start/', {
      level: level,
      limit: 5,
    })
    const items = (data?.questions ?? []) as any[]
    questions.value = items.map(shapeQuestion)
    sessionMeta.value = {
      id: data.session_id,
      level: data.level,
      total_questions: data.total_questions,
    }
  } catch (e: any) {
    console.error('Start quiz failed', e)
    error.value = e?.response?.data?.detail ?? '加载题目失败'
  } finally {
    loading.value = false
  }
}

const submitQuiz = async () => {
  if (!sessionMeta.value) return
  submitting.value = true
  try {
    const payload = {
      level: sessionMeta.value.level,
      session_id: sessionMeta.value.id,
      answers: { ...answers },
    }
    const { data } = await $api.post('/quiz/submit/', payload)
    result.value = data
    await refreshAllStats()
  } catch (e) {
    console.error('Submit quiz failed', e)
    alert('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/quiz')
}

onMounted(() => {
  startSession()
})
</script>
