<template>
  <div class="bg-background text-foreground min-h-screen md:grid md:grid-cols-[240px_1fr] md:items-start">
    <aside
      class="hidden md:flex md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto flex-col border-r border-border px-6 py-8 gap-8"
    >
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-muted-foreground">VirifySpring</p>
        <p class="text-lg font-semibold">澄源</p>
      </div>
      <nav class="space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition hover:border-border hover:bg-secondary"
          :class="isActive(item.to) ? 'bg-secondary border-border text-foreground' : 'text-muted-foreground'"
        >
          <div class="flex items-center gap-2">
            <span>{{ item.label }}</span>
            <span
              v-if="item.label === '消息中心' && unreadCount > 0"
              class="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ unreadCount }}
            </span>
          </div>
          <Icon :name="item.icon" class="h-4 w-4" />
        </NuxtLink>
      </nav>

      <div class="rounded-xl border border-border/70 bg-secondary/30 p-4 text-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-muted-foreground">登录状态</p>
            <p class="mt-1 text-base font-semibold">{{ userDisplayName }}</p>
          </div>
          <span
            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            :class="auth.isAuthenticated ? 'bg-emerald-500/15 text-emerald-500' : 'bg-muted text-muted-foreground'"
          >
            {{ auth.isAuthenticated ? '在线' : '未登录' }}
          </span>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">
          {{ auth.isAuthenticated ? '已连接至反诈风控系统，可直接使用所有功能。' : '访问受限，请先完成登录。' }}
        </p>
        <Button
          class="mt-4 w-full justify-center gap-2"
          variant="outline"
          size="sm"
          :disabled="logoutLoading"
          @click="handleAuthAction"
        >
          <Icon :name="auth.isAuthenticated ? 'lucide:log-out' : 'lucide:log-in'" class="h-4 w-4" />
          {{ auth.isAuthenticated ? (logoutLoading ? '正在退出' : '退出登录') : '前往登录' }}
        </Button>
      </div>

      <div class="mt-auto text-xs text-muted-foreground">
        <p class="mt-1">{{ today }}</p>
      </div>
    </aside>

    <div class="flex flex-col min-h-screen">
      <header
        class="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden"
      >
        <button class="text-sm font-semibold" @click="drawerOpen = !drawerOpen">
          菜单
        </button>
        <NuxtLink to="/" class="font-semibold">澄源反诈平台</NuxtLink>
        <div class="flex items-center gap-2">
          <NuxtLink to="/notifications" class="relative">
            <Icon name="lucide:bell" class="h-5 w-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ unreadCount }}
            </span>
          </NuxtLink>
          <ThemeToggle />
        </div>
      </header>
      <Transition name="fade">
        <div v-if="drawerOpen" class="md:hidden border-b border-border bg-background px-4 py-4 space-y-4">
          <nav class="space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium"
              :class="isActive(item.to) ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
              @click="drawerOpen = false"
            >
              <span>{{ item.label }}</span>
              <span
                v-if="item.label === '消息中心' && unreadCount > 0"
                class="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>
            </NuxtLink>
          </nav>
          <div class="rounded-lg border border-border/80 p-3 text-sm">
            <p class="text-xs text-muted-foreground">当前状态</p>
            <div class="mt-1 flex items-center justify-between">
              <span class="font-medium">{{ userDisplayName }}</span>
              <span class="text-xs text-muted-foreground">
                {{ auth.isAuthenticated ? '在线' : '未登录' }}
              </span>
            </div>
            <Button
              class="mt-3 w-full justify-center gap-2"
              size="sm"
              variant="outline"
              :disabled="logoutLoading"
              @click="handleMobileAuthAction"
            >
              <Icon :name="auth.isAuthenticated ? 'lucide:log-out' : 'lucide:log-in'" class="h-4 w-4" />
              {{ auth.isAuthenticated ? (logoutLoading ? '正在退出' : '退出登录') : '前往登录' }}
            </Button>
          </div>
        </div>
      </Transition>
      <main class="flex-1 px-4 py-6 md:px-10">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '~/components/layout/ThemeToggle.vue'
import { useNotifications } from '~/composables/useNotifications'

const route = useRoute()
const drawerOpen = ref(false)
const auth = useAuthStore()
const logoutLoading = ref(false)
const { unreadCount } = useNotifications()

const navItems = [
  { label: '概览', to: '/', icon: 'lucide:layout-dashboard' },
  { label: '社区广场', to: '/community', icon: 'lucide:users-round' },
  { label: '消息中心', to: '/notifications', icon: 'lucide:bell' },
  { label: '知识测验', to: '/quiz', icon: 'lucide:badge-check' },
  { label: 'AI 场景模拟', to: '/simulation', icon: 'lucide:bot' },
  { label: '知识图谱', to: '/graph', icon: 'lucide:share-2' },
  { label: '个人主页', to: '/profile', icon: 'lucide:user-round' },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const userDisplayName = computed(() => auth.user?.nickname || auth.user?.username || '访客')
const today = new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const handleMobileAuthAction = () => {
  drawerOpen.value = false
  handleAuthAction()
}

const handleAuthAction = async () => {
  if (!auth.isAuthenticated) {
    navigateTo('/login')
    return
  }
  if (logoutLoading.value) return
  logoutLoading.value = true
  try {
    await auth.logout()
    navigateTo('/login')
  } finally {
    logoutLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
