<template>
  <div class="relative group">
    <div class="flex gap-3">
      <!-- Avatar Column -->
      <div class="flex flex-col items-center shrink-0">
        <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium overflow-hidden border border-border/50">
          <img v-if="false" src="" alt="" /> <!-- Placeholder for avatar image -->
          <span v-else>{{ comment.author.nickname?.[0] || comment.author.username[0] }}</span>
        </div>
        <!-- Thread Line -->
        <div 
          v-if="comment.replies?.length && !isCollapsed" 
          class="w-0.5 flex-1 bg-border/30 mt-2 group-hover:bg-border/60 transition-colors cursor-pointer rounded-full"
          @click="toggleCollapse"
        ></div>
      </div>

      <!-- Content Column -->
      <div class="flex-1 min-w-0 pb-2">
        <!-- Header -->
        <div class="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <NuxtLink :to="`/users/${comment.author.username}`" class="font-medium text-foreground hover:underline">
            {{ comment.author.nickname || comment.author.username }}
          </NuxtLink>
          <span>·</span>
          <span>{{ formatDate(comment.created_at) }}</span>
          <span v-if="isCollapsed" class="text-xs bg-muted px-1.5 py-0.5 rounded-full cursor-pointer hover:bg-muted/80" @click="toggleCollapse">
            +{{ comment.replies?.length }} 条回复
          </span>
        </div>

        <div v-if="!isCollapsed">
          <!-- Body -->
          <div class="text-sm leading-relaxed whitespace-pre-line break-words text-foreground/90">
            {{ comment.body }}
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-medium select-none">
            <button 
              class="flex items-center gap-1.5 hover:bg-muted/50 px-1.5 py-1 rounded -ml-1.5 transition-colors" 
              :class="comment.is_liked ? 'text-red-500' : ''" 
              @click="handleLike"
            >
              <Icon :name="comment.is_liked ? 'lucide:heart' : 'lucide:heart'" class="h-3.5 w-3.5" :class="comment.is_liked ? 'fill-current' : ''" />
              <span>{{ comment.like_count || '点赞' }}</span>
            </button>
            <button class="flex items-center gap-1.5 hover:bg-muted/50 px-1.5 py-1 rounded transition-colors" @click="toggleReply">
              <Icon name="lucide:message-square" class="h-3.5 w-3.5" />
              <span>回复</span>
            </button>
            <button 
              v-if="comment.can_moderate" 
              class="flex items-center gap-1.5 hover:bg-muted/50 px-1.5 py-1 rounded hover:text-destructive transition-colors" 
              :disabled="deleting"
              @click="handleDelete"
            >
              <Icon name="lucide:trash-2" class="h-3.5 w-3.5" />
              <span>{{ deleting ? '删除中' : '删除' }}</span>
            </button>
          </div>

          <!-- Reply Form -->
          <div v-if="replying" class="mt-3 mb-4">
            <div v-if="!auth.isAuthenticated" class="rounded-md border border-dashed border-border/70 p-3 text-xs text-center">
              <NuxtLink to="/login" class="underline hover:text-primary">登录</NuxtLink> 后参与讨论
            </div>
            <div v-else class="flex gap-3">
              <div class="w-0.5 bg-border/30 rounded-full"></div> <!-- Indent line for form -->
              <div class="flex-1 space-y-2">
                <Textarea 
                  v-model="replyContent" 
                  rows="3" 
                  placeholder="你的看法..." 
                  class="min-h-[80px] text-sm resize-none"
                  auto-focus
                />
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" @click="toggleReply">取消</Button>
                  <Button size="sm" :disabled="loading || !replyContent.trim()" @click="submitReply">
                    {{ loading ? '提交中…' : '回复' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Nested Replies -->
          <div v-if="comment.replies?.length" class="mt-3 space-y-4">
            <CommentThread
              v-for="reply in comment.replies"
              :key="reply.id"
              :comment="reply"
              :on-like="onLike"
              :on-reply="onReply"
              :on-delete="onDelete"
              :format-date="formatDate"
              :auth="auth"
              :depth="depth + 1"
            />
          </div>
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
