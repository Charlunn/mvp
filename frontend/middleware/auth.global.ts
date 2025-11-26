export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const requiresAuth = Boolean(to.meta?.requiresAuth)
  
  // 登录页面总是允许访问，无需鉴权检查
  if (to.path === '/login') {
    // 如果已登录，重定向到首页
    if (auth.isAuthenticated) {
      return navigateTo('/', { redirectCode: 302 })
    }
    return
  }
  
  // 不需要认证的页面直接放行
  if (!requiresAuth) {
    return
  }

  // 服务端渲染时的处理
  if (process.server) {
    if (!auth.isAuthenticated) {
      return navigateTo('/login', { redirectCode: 302 })
    }
    return
  }

  // 客户端渲染时的处理
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }

  // 已认证但未加载用户信息，尝试获取
  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch (error) {
      console.warn('Unable to refresh profile', error)
      // 如果获取失败且是401错误，清除token并重定向
      if ((error as any)?.response?.status === 401) {
        auth.logout()
        return navigateTo('/login')
      }
    }
  }
})
