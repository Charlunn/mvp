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

        <div class="flex justify-end pt-4">
          <Button size="lg" @click="startSimulation" class="w-full md:w-auto">
            <Icon name="lucide:play-circle" class="h-5 w-5 mr-2" />
            开始模拟演练
          </Button>
        </div>
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
import { extractErrorMessage } from '~/composables/useErrorHandler'

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
const router = useRouter()
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

const startSimulation = () => {
  router.push({
    path: '/simulation/chat',
    query: {
      type: scenario.type,
      difficulty: scenario.difficulty,
      mode: scenario.mode,
    },
  })
}

onMounted(fetchLatestResult)
</script>
