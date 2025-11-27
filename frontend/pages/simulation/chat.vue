<template>
  <div class="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">
        模拟对话: {{ scenarioLabel }} ({{ difficultyLabel }} - {{ modeLabel }})
      </h1>
      <Button variant="outline" size="sm" @click="goBack">
        <Icon name="lucide:arrow-left" class="h-4 w-4 mr-2" />
        返回配置
      </Button>
    </div>

    <div class="flex-1 flex flex-col overflow-hidden border rounded-lg bg-background">
      <!-- Chat Body -->
      <div
        ref="chatBodyRef"
        class="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <div
          v-for="(item, index) in conversation"
          :key="index"
          class="max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed"
          :class="item.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'"
        >
          {{ item.content }}
        </div>
        <div v-if="chatLoading && !conversation.length" class="text-center text-muted-foreground">
          正在初始化场景...
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t bg-card">
        <form class="flex flex-col gap-3 md:flex-row" @submit.prevent="sendMessage">
          <Textarea
            v-model="message"
            rows="2"
            class="flex-1 resize-none"
            :disabled="sessionClosed || chatLoading"
            placeholder="输入你的回复..."
            @keydown.enter.prevent="handleEnter"
          />
          <div class="flex flex-col gap-2 justify-end">
            <Button type="submit" :disabled="chatLoading || !message.trim() || sessionClosed">
              <Icon name="lucide:send" class="h-4 w-4 mr-2" />
              发送
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              :disabled="sessionClosed || !conversation.length || chatLoading"
              @click="endSessionEarly"
            >
              结束对话
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Result Modal or Overlay could go here, or just redirect back -->
    <div v-if="sessionClosed" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-background p-6 rounded-lg max-w-md w-full shadow-lg">
        <h2 class="text-xl font-bold mb-4">演练结束</h2>
        <p class="mb-2">最终得分: <span class="font-bold text-2xl">{{ finalResult?.finalScore }}</span></p>
        <p class="mb-4 text-muted-foreground">{{ finalResult?.endReasonLabel }}</p>
        <div class="flex justify-end gap-2">
          <Button @click="goBack">返回查看详情</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { extractErrorMessage } from '~/composables/useErrorHandler'

definePageMeta({
  layout: 'default',
  requiresAuth: true,
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const scenarioType = route.query.type as string
const difficulty = route.query.difficulty as string
const mode = route.query.mode as string

const scenarioOptions = {
  'pig-butchering': '杀猪盘 / 感情投资',
  'phishing': '钓鱼链接 / 伪装客服',
  'fake-customer-service': '冒充公检法',
  'investment': '投资理财骗局',
  'loan': '借贷与刷单',
}
const difficultyOptions = {
  'easy': '入门',
  'medium': '进阶',
  'hard': '挑战',
}
const modeOptions = {
  'mixed': '混合博弈',
  'pure_fake': '纯诈骗话术',
}

const scenarioLabel = computed(() => scenarioOptions[scenarioType as keyof typeof scenarioOptions] || scenarioType)
const difficultyLabel = computed(() => difficultyOptions[difficulty as keyof typeof difficultyOptions] || difficulty)
const modeLabel = computed(() => modeOptions[mode as keyof typeof modeOptions] || mode)

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const message = ref('')
const conversation = ref<ChatMessage[]>([])
const chatBodyRef = ref<HTMLElement | null>(null)
const chatLoading = ref(false)
const sessionClosed = ref(false)
const finalResult = ref<any>(null)
const score = ref(50)

const scrollToBottom = () => {
  if (chatBodyRef.value) {
    chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
  }
}

const handleEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    sendMessage()
  }
}

const initSession = async () => {
  chatLoading.value = true
  try {
    const { data } = await $api.post('/chat/scenario/stateless/', {
      init: true,
      scenario_type: scenarioType,
      difficulty: difficulty,
      mode: mode,
    })
    if (data.response) {
      conversation.value.push({ role: 'assistant', content: data.response })
    }
  } catch (error) {
    console.error('Init session failed', error)
    alert('初始化场景失败，请重试')
  } finally {
    chatLoading.value = false
    nextTick(scrollToBottom)
  }
}

const sendMessage = async () => {
  const content = message.value.trim()
  if (!content || chatLoading.value) return

  chatLoading.value = true
  const historyPayload = conversation.value.map((item) => ({ role: item.role, content: item.content }))
  
  conversation.value.push({ role: 'user', content })
  message.value = ''
  nextTick(scrollToBottom)

  try {
    const { data } = await $api.post('/chat/scenario/stateless/', {
      message: content,
      scenario_type: scenarioType,
      difficulty: difficulty,
      mode: mode,
      history: historyPayload,
      current_score: score.value,
    })

    if (data.response) {
      conversation.value.push({ role: 'assistant', content: data.response })
    }

    if (data.session_closed) {
      sessionClosed.value = true
      finalResult.value = {
        finalScore: data.final_score,
        endReasonLabel: data.end_reason_label
      }
    }
  } catch (error) {
    console.error('Send message failed', error)
    alert('发送失败，请重试')
  } finally {
    chatLoading.value = false
    nextTick(scrollToBottom)
  }
}

const endSessionEarly = async () => {
  if (!confirm('确定要提前结束对话吗？')) return
  
  chatLoading.value = true
  try {
    const historyPayload = conversation.value.map((item) => ({ role: item.role, content: item.content }))
    const { data } = await $api.post('/chat/scenario/stateless/', {
      force_end: true,
      scenario_type: scenarioType,
      difficulty: difficulty,
      mode: mode,
      history: historyPayload,
      current_score: score.value,
    })
    
    if (data.session_closed) {
      sessionClosed.value = true
      finalResult.value = {
        finalScore: data.final_score,
        endReasonLabel: data.end_reason_label
      }
    }
  } catch (error) {
    console.error('End session failed', error)
  } finally {
    chatLoading.value = false
  }
}

const goBack = () => {
  router.push('/simulation')
}

onMounted(() => {
  if (!scenarioType || !difficulty || !mode) {
    alert('参数缺失，返回配置页')
    router.push('/simulation')
    return
  }
  initSession()
})
</script>
