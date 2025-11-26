import axios, { AxiosError } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseURL = process.server
    ? (config as any).apiBaseServer ?? config.public.apiBase
    : config.public.apiBase
  const api = axios.create({
    baseURL,
    withCredentials: true,
  })

  api.interceptors.request.use((request) => {
    const accessToken = useCookie('mvp-access-token').value
    if (accessToken) {
      request.headers = request.headers || {}
      request.headers.Authorization = `Bearer ${accessToken}`
    }
    return request
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useCookie('mvp-access-token').value = null
        useCookie('mvp-refresh-token').value = null
      }
      
      // 处理HTML错误响应（如nginx错误页面）
      if (error.response?.data && typeof error.response.data === 'string') {
        const htmlPattern = /<\s*html[^>]*>/i
        if (htmlPattern.test(error.response.data)) {
          // 将HTML响应转换为友好的错误消息
          const statusText = error.response.statusText || '服务器错误'
          const status = error.response.status
          error.response.data = {
            detail: `请求失败 (${status}): ${statusText}`,
            message: '服务暂时不可用，请稍后重试'
          } as any
        }
      }
      
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api,
    },
  }
})
