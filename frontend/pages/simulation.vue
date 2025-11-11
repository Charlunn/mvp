<template>
  <div class="space-y-6">
    <PageHeader
      title="AI 场景模拟"
      description="选择高发诈骗场景，与 AI 角色进行多轮对练，及时总结识别要点。"
    />

    <Card class="border border-border/80">
      <CardHeader>
        <CardTitle>对话操作台</CardTitle>
        <CardDescription>配置场景与模式，AI 将模拟真实话术与你交互。</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <Label>场景</Label>
            <select
              v-model="scenario.type"
              class="w-full rounded-md border border-border bg-background p-2 text-sm"
              :disabled="sessionClosed"
            >
              <option v-for="option in scenarioOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div>
            <Label>难度</Label>
            <select
              v-model="scenario.difficulty"
              class="w-full rounded-md border border-border bg-background p-2 text-sm"
              :disabled="sessionClosed"
            >
              <option v-for="option in difficultyOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div>
            <Label>模式</Label>
            <select
              v-model="scenario.mode"
              class="w-full rounded-md border border-border bg-background p-2 text-sm"
              :disabled="sessionClosed"
            >
              <option v-for="option in modeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="rounded-2xl border border-border/70 bg-card p-4">
          <div class="flex items-center justify-between text-sm">
            <p class="font-medium">对话得分进度</p>
            <div v-if="sessionClosed && finalResult" class="text-right">
              <p class="text-2xl font-semibold">
                {{ finalResult.finalScore }}<span class="text-base font-normal"> / 100</span>
              </p>
              <p class="text-xs text-muted-foreground">{{ finalResult.endReasonLabel }}</p>
            </div>
            <p v-else class="text-xs text-muted-foreground">完成演练后将显示本次综合得分</p>
          </div>
          <div class="mt-2 h-2 rounded-full bg-muted">
            <div
              class="h-2 rounded-full bg-foreground transition-all"
              :style="{ width: sessionClosed && finalResult ? finalResult.finalScore + '%' : '0%' }"
            ></div>
          </div>
        </div>

        <div
          ref="chatBodyRef"
          class="max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background/80 p-4 shadow-inner"
        >
          <div
            v-for="(item, index) in conversation"
            :key="index"
            class="max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed"
            :class="item.role === 'user' ? 'ml-auto bg-foreground text-background' : 'bg-secondary text-foreground'"
          >
            {{ item.content }}
          </div>
          <p v-if="!conversation.length" class="text-sm text-muted-foreground">
            还没有任何消息，先向 AI 发起第一句对话吧。
          </p>
        </div>

        <form class="flex flex-col gap-3 md:flex-row" @submit.prevent="sendMessage">
          <Textarea
            v-model="message"
            rows="3"
            class="flex-1"
            :disabled="sessionClosed"
            placeholder="描述你的想法、疑问或进一步追问，以锻炼甄别与拒绝能力。"
          />
          <div class="flex flex-col gap-2">
            <Button type="submit" class="gap-2" :disabled="chatLoading || !message.trim() || sessionClosed">
              <Icon name="lucide:message-circle" class="h-4 w-4" />
              {{ chatLoading && !endingEarly ? '发送中...' : '发送' }}
            </Button>
            <Button type="button" variant="outline" :disabled="chatLoading" @click="resetSession">
              重置会话
            </Button>
            <Button
              type="button"
              variant="secondary"
              :disabled="sessionClosed || !conversation.length || chatLoading"
              @click="endSessionEarly"
            >
              <Icon name="lucide:flag" class="h-4 w-4" />
              {{ endingEarly ? '结算中...' : '提前结束' }}
            </Button>
          </div>
        </form>

        <p v-if="sessionClosed" class="text-sm text-amber-600">
          本次演练已结束：{{ finalResult?.endReasonLabel ?? '系统终止' }}，可以重置后开启新的对话。
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>对话总结</CardTitle>
        <CardDescription>系统自动保存最近一次完整演练，便于复盘与分享。</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="displayedResult" class="rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed">
          <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
            <span>{{ displayedResult.scenarioType }} · {{ displayedResult.difficulty }} · {{ displayedResult.mode }}</span>
            <span>轮次 {{ displayedResult.conversationRounds }}</span>
          </div>
          <p class="mt-3 text-2xl font-semibold">{{ displayedResult.finalScore }} / 100</p>
          <p class="text-xs text-muted-foreground">{{ displayedResult.endReasonLabel }}</p>

          <CapabilityRadar v-if="radarProfile" class="mt-4 w-full" :profile="radarProfile" height="240px" />

          <p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground">表现分析</p>
          <p class="mt-2 whitespace-pre-line">{{ displayedResult.performanceAnalysis }}</p>

          <p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground">改进建议</p>
          <p class="mt-2 whitespace-pre-line">{{ displayedResult.suggestions }}</p>
        </div>
        <p v-else class="text-sm text-muted-foreground">暂无总结，完成一次演练后即可查看详细复盘。</p>
        <div class="flex gap-2">
          <Button variant="outline" :disabled="latestLoading" @click="fetchLatestResult">
            <Icon name="lucide:refresh-ccw" class="h-4 w-4" />
            {{ latestLoading ? '刷新中...' : '刷新最近记录' }}
          </Button>
          <Button variant="secondary" @click="resetSession">重新开始</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import CapabilityRadar from '~/components/simulation/CapabilityRadar.client.vue'

definePageMeta({
  requiresAuth: true,
})

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type SimulationResult = {
  scenarioType: string
  difficulty: string
  mode: string
  finalScore: number
  conversationRounds: number
  endReasonLabel: string
  performanceAnalysis: string
  suggestions: string
  updatedAt?: string
  capabilityProfile?: Record<string, number>
}

const { $api } = useNuxtApp()
const score = ref(50)
const message = ref('')
const conversation = ref<ChatMessage[]>([])
const chatBodyRef = ref<HTMLElement | null>(null)
const chatLoading = ref(false)
const endingEarly = ref(false)
const sessionClosed = ref(false)
const finalResult = ref<SimulationResult | null>(null)
const latestResult = ref<SimulationResult | null>(null)
const latestLoading = ref(false)

const scenarioOptions = [
  { label: '杀猪盘 / 感情投资', value: 'pig-butchering' },
  { label: '钓鱼链接 / 伪装客服', value: 'phishing' },
  { label: '冒充公检法', value: 'fake-customer-service' },
  { label: '投资理财骗局', value: 'investment' },
  { label: '借贷与刷单', value: 'loan' },
] as const

const difficultyOptions = [
  { label: '入门', value: 'easy' },
  { label: '进阶', value: 'medium' },
  { label: '挑战', value: 'hard' },
] as const

const modeOptions = [
  { label: '混合博弈（提问 + 引诱）', value: 'mixed' },
  { label: '纯诈骗话术', value: 'pure_fake' },
] as const

const scenario = reactive({
  type: scenarioOptions[0].value,
  difficulty: difficultyOptions[1].value,
  mode: modeOptions[0].value,
})

const displayedResult = computed(() => finalResult.value ?? latestResult.value)
const radarProfile = computed(() => displayedResult.value?.capabilityProfile ?? null)

const scrollToBottom = () => {
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

const showToast = (text: string) => {
  if (process.client) window.alert(text)
}

const extractErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<any>
  const data = axiosError?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return Array.isArray(data.message) ? data.message[0] : data.message
  if (data?.detail) return Array.isArray(data.detail) ? data.detail[0] : data.detail
  return fallback
}

const mapResultFromApi = (payload: any): SimulationResult => ({
  scenarioType: payload.scenario_type ?? scenario.type,
  difficulty: payload.difficulty ?? scenario.difficulty,
  mode: payload.mode ?? scenario.mode,
  finalScore: payload.final_score ?? 0,
  conversationRounds: payload.conversation_rounds ?? 0,
  endReasonLabel: payload.end_reason_label ?? '系统结束',
  performanceAnalysis: payload.performance_analysis ?? '',
  suggestions: payload.suggestions ?? '',
  updatedAt: payload.updated_at ?? new Date().toISOString(),
  capabilityProfile: payload.capability_profile ?? undefined,
})

const applyClosurePayload = (payload: any) => {
  sessionClosed.value = true
  const mapped = mapResultFromApi(payload)
  score.value = mapped.finalScore
  finalResult.value = mapped
  latestResult.value = mapped
}

const fetchLatestResult = async () => {
  latestLoading.value = true
  try {
    const { data } = await $api.get('/chat/latest-result/')
    if (data.has_result) {
      latestResult.value = mapResultFromApi(data.data)
    } else {
      latestResult.value = null
    }
  } catch (error) {
    console.warn('fetch latest result failed', error)
  } finally {
    latestLoading.value = false
  }
}

const sendMessage = async () => {
  const content = message.value.trim()
  if (!content || chatLoading.value) return
  if (sessionClosed.value) {
    showToast('当前会话已结束，请重新开始。')
    return
  }

  chatLoading.value = true
  const historyPayload = conversation.value.map((item) => ({ role: item.role, content: item.content }))
  historyPayload.push({ role: 'user', content })

  conversation.value.push({ role: 'user', content })
  message.value = ''

  try {
    const { data } = await $api.post('/chat/scenario/stateless/', {
      message: content,
      scenario_type: scenario.type,
      difficulty: scenario.difficulty,
      mode: scenario.mode,
      history: historyPayload,
      current_score: score.value,
    })

    conversation.value.push({
      role: 'assistant',
      content: data.response || 'AI 暂无回复，请稍后再试。',
    })

    if (data.session_closed) {
      applyClosurePayload(data)
    }
  } catch (error) {
    showToast(extractErrorMessage(error, '发送失败，请稍后重试'))
  } finally {
    chatLoading.value = false
    nextTick(scrollToBottom)
  }
}

const endSessionEarly = async () => {
  if (!conversation.value.length || sessionClosed.value || chatLoading.value) return
  chatLoading.value = true
  endingEarly.value = true
  try {
    const historyPayload = conversation.value.map((item) => ({ role: item.role, content: item.content }))
    const { data } = await $api.post('/chat/scenario/stateless/', {
      force_end: true,
      scenario_type: scenario.type,
      difficulty: scenario.difficulty,
      mode: scenario.mode,
      history: historyPayload,
      current_score: score.value,
    })

    if (data.response) {
      conversation.value.push({ role: 'assistant', content: data.response })
    }

    if (data.session_closed) {
      applyClosurePayload(data)
    }
  } catch (error) {
    showToast(extractErrorMessage(error, '结束失败，请稍后再试'))
  } finally {
    chatLoading.value = false
    endingEarly.value = false
    nextTick(scrollToBottom)
  }
}

const resetSession = async () => {
  if (chatLoading.value) return
  try {
    await $api.post('/chat/scenario/stateless/', {
      reset: true,
      scenario_type: scenario.type,
      difficulty: scenario.difficulty,
      mode: scenario.mode,
    })
  } catch (error) {
    console.warn('reset session failed', error)
  } finally {
    conversation.value = []
    message.value = ''
    sessionClosed.value = false
    finalResult.value = null
    chatLoading.value = false
    endingEarly.value = false
    nextTick(scrollToBottom)
  }
}

onMounted(fetchLatestResult)
watch(conversation, () => nextTick(scrollToBottom), { deep: true })
</script>
