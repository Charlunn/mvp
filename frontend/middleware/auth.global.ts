export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const requiresAuth = Boolean(to.meta?.requiresAuth)
  if (!requiresAuth) {
    return
  }

  if (process.server) {
    if (!auth.isAuthenticated && to.path !== '/login') {
      return navigateTo('/login', { redirectCode: 302 })
    }
    if (auth.isAuthenticated && to.path === '/login') {
      return navigateTo('/', { redirectCode: 302 })
    }
    return
  }

  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch (error) {
      console.warn('Unable to refresh profile', error)
    }
  }

  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
