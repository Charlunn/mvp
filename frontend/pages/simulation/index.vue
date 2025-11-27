<template>
  <div class="space-y-6">
    <PageHeader
      title="AI 场景模拟"
      description="选择高发诈骗场景，与 AI 角色进行多轮对练，及时总结识别要点。"
    />

    <Card class="border border-border/80">
      <CardHeader>
        <CardTitle>开始新的演练</CardTitle>
        <CardDescription>配置场景与模式，AI 将模拟真实话术与你交互。</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="space-y-2">
            <Label>诈骗场景</Label>
            <select
              v-model="config.type"
              class="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option v-for="option in scenarioOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p class="text-xs text-muted-foreground">选择一种常见的诈骗类型进行针对性训练。</p>
          </div>
          
          <div class="space-y-2">
            <Label>难度等级</Label>
            <select
              v-model="config.difficulty"
              class="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option v-for="option in difficultyOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p class="text-xs text-muted-foreground">难度越高，AI 的话术越隐蔽，破绽越少。</p>
          </div>
          
          <div class="space-y-2">
            <Label>训练模式</Label>
            <select
              v-model="config.mode"
              class="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option v-for="option in modeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p class="text-xs text-muted-foreground">混合模式下，你需要自行判断对方是真还是假。</p>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <Button size="lg" class="w-full md:w-auto gap-2" @click="startSimulation">
            开始模拟对话
            <Icon name="lucide:arrow-right" class="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>最近演练记录</CardTitle>
        <CardDescription>回顾你最近一次的训练表现。</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="latestLoading" class="py-8 text-center text-sm text-muted-foreground">
          加载中...
        </div>
        <div v-else-if="latestResult" class="rounded-2xl border border-border/70 bg-card p-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <Badge variant="outline">{{ latestResult.scenarioType }}</Badge>
                <span>{{ latestResult.difficulty }} · {{ latestResult.mode }}</span>
              </div>
              <p class="mt-2 text-3xl font-bold">{{ latestResult.finalScore }} <span class="text-sm font-normal text-muted-foreground">/ 100</span></p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium">{{ latestResult.endReasonLabel }}</p>
              <p class="text-xs text-muted-foreground">对话轮次: {{ latestResult.conversationRounds }}</p>
            </div>
          </div>

          <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground mb-2">能力评估</p>
              <CapabilityRadar v-if="latestResult.capabilityProfile" :profile="latestResult.capabilityProfile" height="200px" />
            </div>
            <div class="space-y-4">
              <div>
                <p class="text-xs uppercase tracking-widest text-muted-foreground">表现分析</p>
                <p class="mt-1 text-sm text-muted-foreground leading-relaxed">{{ latestResult.performanceAnalysis }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-widest text-muted-foreground">改进建议</p>
                <p class="mt-1 text-sm text-muted-foreground leading-relaxed">{{ latestResult.suggestions }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-8 text-center text-sm text-muted-foreground">
          暂无演练记录，快去开始第一次训练吧。
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import CapabilityRadar from '~/components/simulation/CapabilityRadar.client.vue'

definePageMeta({
  requiresAuth: true,
})

const { $api } = useNuxtApp()
const latestResult = ref<any>(null)
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

const config = reactive({
  type: scenarioOptions[0].value,
  difficulty: difficultyOptions[1].value,
  mode: modeOptions[0].value,
})

const startSimulation = () => {
  navigateTo({
    path: '/simulation/chat',
    query: {
      type: config.type,
      difficulty: config.difficulty,
      mode: config.mode,
    },
  })
}

const fetchLatestResult = async () => {
  latestLoading.value = true
  try {
    const { data } = await $api.get('/chat/latest-result/')
    if (data.has_result) {
      latestResult.value = data.data
    }
  } catch (error) {
    console.warn('fetch latest result failed', error)
  } finally {
    latestLoading.value = false
  }
}

onMounted(fetchLatestResult)
</script>
