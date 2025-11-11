<template>
  <div class="rounded-lg border border-border/70 p-4 text-sm relative">
    <button v-if="comment.replies?.length" class="absolute left-0 top-0 h-full w-4 flex items-center justify-center text-muted-foreground hover:text-foreground" @click="toggleCollapse">
      <Icon :name="isCollapsed ? 'lucide:plus' : 'lucide:minus'" class="h-4 w-4" />
    </button>
    <div :style="{ 'margin-left': `${comment.replies?.length ? 1.5 : 0}rem` }">
      <div class="flex items-start justify-between">
        <div>
          <NuxtLink :to="`/users/${comment.author.username}`" class="font-medium hover:underline">
            {{ comment.author.nickname || comment.author.username }}
          </NuxtLink>
          <p class="mt-1 text-xs text-muted-foreground">{{ formatDate(comment.created_at) }}</p>
        </div>
        <button class="flex items-center gap-1 text-xs" :class="comment.is_liked ? 'text-primary' : 'text-muted-foreground'" @click="handleLike">
          <Icon :name="comment.is_liked ? 'lucide:heart' : 'lucide:heart-off'" class="h-4 w-4" />
          <span>{{ comment.like_count }}</span>
        </button>
      </div>
      <p class="mt-3 whitespace-pre-line text-foreground">{{ comment.body }}</p>
      <div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <button class="hover:text-foreground" @click="toggleReply">{{ replying ? '取消回复' : '回复' }}</button>
        <button
          v-if="comment.can_moderate"
          class="hover:text-destructive disabled:opacity-50"
          :disabled="deleting"
          @click="handleDelete"
        >
          {{ deleting ? '删除中...' : '删除' }}
        </button>
      </div>
    </div>
    <div v-if="replying" class="mt-3 space-y-2">
      <p v-if="!auth.isAuthenticated" class="rounded-md border border-dashed border-border/70 p-2 text-xs">
        登录后才能回复。
      </p>
      <div v-else class="space-y-2">
        <Textarea v-model="replyContent" rows="3" placeholder="填写回复内容" />
        <div class="flex justify-end">
          <Button size="sm" :disabled="loading" @click="submitReply">
            {{ loading ? '提交中…' : '回复' }}
          </Button>
        </div>
      </div>
    </div>
    <div v-if="comment.replies?.length" class="mt-4 space-y-3 relative">
      <div v-if="props.depth > 0" class="absolute left-0 top-0 h-full w-0.5 bg-border" :style="{ 'margin-left': `${(props.depth - 1) * 1.5}rem` }"></div>
      <div :style="{ 'padding-left': `${props.depth * 1.5}rem` }">
        <button v-if="comment.replies.length > 3" class="text-xs text-muted-foreground hover:text-foreground" @click="toggleCollapse">
          {{ isCollapsed ? `展开 ${comment.replies.length} 条回复` : '收起回复' }}
        </button>
        <div v-if="!isCollapsed">
          <CommentThread
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :on-like="onLike"
            :on-reply="onReply"
            :format-date="formatDate"
            :auth="auth"
            :depth="props.depth + 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AuthorSummary {
  username: string
  nickname?: string | null
}

interface CommentModel {
  id: number
  body: string
  created_at: string
  like_count: number
  is_liked: boolean
  is_deleted: boolean
  can_moderate: boolean
  author: AuthorSummary
  replies?: CommentModel[]
}

const props = defineProps<{
  comment: CommentModel
  onLike: (id: number) => Promise<unknown>
  onReply: (id: number, content: string) => Promise<unknown>
  onDelete?: (id: number) => Promise<unknown>
  formatDate: (value: string) => string
  auth: { isAuthenticated: boolean }
  depth: number // 添加 depth prop
}>()

defineOptions({
  name: 'CommentThread',
})

const replying = ref(false)
const replyContent = ref('')
const loading = ref(false)
const isCollapsed = ref(false) // 新增：控制评论折叠状态
const deleting = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleReply = () => {
  replying.value = !replying.value
  if (!replying.value) {
    replyContent.value = ''
  }
}

const submitReply = async () => {
  if (!props.auth.isAuthenticated || !replyContent.value.trim()) return
  loading.value = true
  try {
    await props.onReply(props.comment.id, replyContent.value)
    replyContent.value = ''
    replying.value = false
  } finally {
    loading.value = false
  }
}

const handleLike = async () => {
  loading.value = true
  try {
    await props.onLike(props.comment.id)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!props.onDelete || deleting.value) return
  deleting.value = true
  try {
    await props.onDelete(props.comment.id)
  } finally {
    deleting.value = false
  }
}
</script>
