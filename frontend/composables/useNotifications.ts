import { ref, onMounted, onUnmounted } from 'vue'

export function useNotifications() {
  const { $api } = useNuxtApp()
  const auth = useAuthStore()

  const unreadCount = ref(0)
  let pollingTimer: NodeJS.Timeout | null = null

  async function fetchUnreadCount() {
    if (!auth.isAuthenticated) return
    try {
      const { data } = await $api.get('/notifications/unread-count/')
      unreadCount.value = data.unread_count
    } catch (error) {
      console.error('Failed to fetch unread notification count:', error)
    }
  }

  function startPolling(interval = 60000) {
    if (pollingTimer) {
      stopPolling()
    }
    pollingTimer = setInterval(fetchUnreadCount, interval)
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  onMounted(() => {
    if (auth.isAuthenticated) {
      fetchUnreadCount()
      startPolling()
    }
  })

  onUnmounted(() => {
    stopPolling()
  })

  watch(() => auth.isAuthenticated, (isAuth) => {
    if (isAuth) {
      fetchUnreadCount()
      startPolling()
    } else {
      unreadCount.value = 0
      stopPolling()
    }
  })

  return {
    unreadCount,
    fetchUnreadCount,
  }
}
