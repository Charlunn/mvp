import type { AxiosError } from 'axios'

type LoginPayload = {
  username: string
  password: string
}

type RegisterPayload = {
  username: string
  password: string
  password2: string
  nickname?: string
  email?: string
}

export interface AuthUser {
  id: number
  username: string
  nickname?: string
  user_type: string
  fraud_level: number
  email?: string
  is_staff?: boolean
  is_superuser?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const { $api } = useNuxtApp()
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const registerLoading = ref(false)
  const accessToken = useCookie<string | null>('mvp-access-token', { sameSite: 'lax' })
  const refreshToken = useCookie<string | null>('mvp-refresh-token', { sameSite: 'lax' })

  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const isAdmin = computed(
    () =>
      user.value?.user_type === 'admin' ||
      Boolean(user.value?.is_staff) ||
      Boolean(user.value?.is_superuser),
  )

  const setTokens = (access?: string, refresh?: string) => {
    accessToken.value = access ?? null
    refreshToken.value = refresh ?? null
  }

  const login = async (payload: LoginPayload) => {
    loading.value = true
    try {
      const { data } = await $api.post('/users/login/', payload)
      setTokens(data.access_token, data.refresh_token)
      user.value = data.user
      return data.user as AuthUser
    } catch (err) {
      setTokens()
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    registerLoading.value = true
    try {
      await $api.post('/users/register/', payload)
    } finally {
      registerLoading.value = false
    }
  }

  const fetchProfile = async () => {
    if (!accessToken.value) return null
    try {
      const { data } = await $api.get('/users/me/')
      user.value = data
      return data as AuthUser
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        setTokens()
        user.value = null
      }
      throw error
    }
  }

  const logout = async () => {
    if (refreshToken.value) {
      try {
        await $api.post('/users/logout/', { refresh_token: refreshToken.value })
      } catch (error) {
        console.warn('logout failed', error)
      }
    }
    setTokens()
    user.value = null
  }

  return {
    user,
    loading,
    registerLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchProfile,
    logout,
  }
})
