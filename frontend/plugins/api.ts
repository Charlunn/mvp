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
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api,
    },
  }
})
