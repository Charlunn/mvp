<template>
  <Card class="w-full max-w-md border border-border/60 bg-card shadow-none">
    <CardHeader class="space-y-3">
      <CardTitle>
        {{ mode === 'login' ? '账号登录' : '快速注册' }}
      </CardTitle>
      <CardDescription>
        {{ mode === 'login' ? '使用已有账号登录澄源反诈平台' : '创建新的普通用户账号（如需管理员权限请联系平台）' }}
      </CardDescription>
      <div class="grid grid-cols-2 gap-2 pt-2">
        <Button
          type="button"
          :variant="mode === 'login' ? 'default' : 'outline'"
          class="w-full"
          :disabled="isBusy"
          @click="mode = 'login'"
        >
          登录
        </Button>
        <Button
          type="button"
          :variant="mode === 'register' ? 'default' : 'outline'"
          class="w-full"
          :disabled="isBusy"
          @click="mode = 'register'"
        >
          注册
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <form v-if="mode === 'login'" class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <Label for="username">账号 / 邮箱 / 手机</Label>
          <Input
            id="username"
            name="username"
            v-model="form.username"
            required
            autocomplete="username"
            placeholder="admin"
          />
        </div>
        <div>
          <Label for="password">密码</Label>
          <Input
            id="password"
            name="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="请输入密码"
          />
        </div>
        <Button type="submit" class="w-full" :disabled="auth.loading">
          <span v-if="auth.loading">登录中...</span>
          <span v-else>登录</span>
        </Button>
      </form>

      <form v-else class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <Label for="register-username">用户名*</Label>
          <Input
            id="register-username"
            v-model="registerForm.username"
            required
            autocomplete="off"
            placeholder="new_user"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label for="register-nickname">昵称</Label>
            <Input
              id="register-nickname"
              v-model="registerForm.nickname"
              autocomplete="off"
              placeholder="可选"
            />
          </div>
          <div>
            <Label for="register-email">邮箱</Label>
            <Input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              autocomplete="off"
              placeholder="可选"
            />
          </div>
        </div>
        <div>
          <Label for="register-password">密码*</Label>
          <Input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            required
            autocomplete="new-password"
            placeholder="至少 8 位且非常见密码"
          />
          <p
            class="text-xs min-h-[1.25rem]"
            :class="passwordErrors.length ? 'text-destructive' : passwordValid ? 'text-emerald-600' : 'text-muted-foreground'"
          >
            <span v-if="passwordChecking">正在校验密码强度...</span>
            <span v-else-if="passwordErrors.length">{{ passwordErrors[0] }}</span>
            <span v-else-if="passwordValid">密码符合当前安全要求</span>
            <span v-else>密码需满足平台设定的长度与复杂度要求</span>
          </p>
        </div>
        <div>
          <Label for="register-password2">确认密码*</Label>
          <Input
            id="register-password2"
            v-model="registerForm.password2"
            type="password"
            required
            autocomplete="new-password"
            placeholder="再次输入密码"
          />
        </div>
        <Button type="submit" class="w-full" :disabled="auth.registerLoading || passwordChecking">
          <span v-if="auth.registerLoading">注册中...</span>
          <span v-else>注册并登录</span>
        </Button>
      </form>
    </CardContent>
    <CardFooter v-if="mode === 'register'" class="text-xs text-muted-foreground leading-relaxed">
      <p>注册创建的账户默认为普通用户，如需管理员权限请联系平台维护人员。</p>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import type { AxiosError } from 'axios'
import { useDebounceFn } from '@vueuse/core'

type AuthMode = 'login' | 'register'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const auth = useAuthStore()
const router = useRouter()
const mode = ref<AuthMode>('login')
const passwordErrors = ref<string[]>([])
const passwordValid = ref(false)
const passwordChecking = ref(false)
const isBusy = computed(() => auth.loading || auth.registerLoading || passwordChecking.value)

const form = reactive({
  username: '',
  password: '',
})

const registerForm = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  password2: '',
})

const extractErrors = (error: unknown): string[] => {
  const axiosError = error as AxiosError<any>
  const data = axiosError?.response?.data
  if (!data) {
    return [axiosError?.message || '请求失败']
  }
  if (typeof data === 'string') {
    return [data]
  }
  if (Array.isArray(data)) {
    return data.map(String)
  }
  if (typeof data === 'object') {
    if (Array.isArray((data as any).password)) {
      return (data as any).password.map(String)
    }
    const flattened = Object.values(data).flatMap((value) => {
      if (Array.isArray(value)) return value.map(String)
      if (typeof value === 'string') return [value]
      return []
    })
    if (flattened.length) {
      return flattened
    }
  }
  return ['请求失败']
}

const extractErrorMessage = (error: unknown, fallback: string) => {
  const list = extractErrors(error)
  return list[0] || fallback
}

const handleLogin = async () => {
  const payload = {
    username: form.username.trim(),
    password: form.password,
  }

  if (!payload.username || !payload.password) {
    useToast('请输入账号和密码')
    return
  }

  try {
    await auth.login(payload)
    await auth.fetchProfile()
    router.push('/')
  } catch (error) {
    console.error(error)
    useToast(extractErrorMessage(error, '登录失败，请检查凭证'))
  }
}

const performPasswordValidation = async () => {
  if (mode.value !== 'register') return true
  if (!registerForm.password) {
    passwordErrors.value = []
    passwordValid.value = false
    return false
  }
  passwordChecking.value = true
  try {
    await $api.post('/users/password/validate/', {
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
    })
    passwordErrors.value = []
    passwordValid.value = true
    return true
  } catch (error) {
    passwordErrors.value = extractErrors(error)
    passwordValid.value = false
    return false
  } finally {
    passwordChecking.value = false
  }
}

const debouncedPasswordValidation = useDebounceFn(performPasswordValidation, 400)

watch(
  [() => registerForm.password, () => registerForm.username, () => registerForm.email],
  () => {
    if (mode.value !== 'register') return
    if (!registerForm.password) {
      passwordErrors.value = []
      passwordValid.value = false
      return
    }
    debouncedPasswordValidation()
  }
)

watch(
  () => mode.value,
  (current) => {
    if (current === 'register' && registerForm.password) {
      performPasswordValidation()
    } else {
      passwordErrors.value = []
      passwordValid.value = false
    }
  }
)

const handleRegister = async () => {
  const username = registerForm.username.trim()
  const nickname = registerForm.nickname.trim()
  const email = registerForm.email.trim()

  if (!username || !registerForm.password || !registerForm.password2) {
    useToast('请填写必填项（用户名和两次密码）')
    return
  }

  if (registerForm.password !== registerForm.password2) {
    useToast('两次输入的密码不一致')
    return
  }

  const passwordOk = await performPasswordValidation()
  if (!passwordOk) {
    useToast(passwordErrors.value[0] || '请根据提示调整密码')
    return
  }

  const payload: {
    username: string
    password: string
    password2: string
    nickname?: string
    email?: string
  } = {
    username,
    password: registerForm.password,
    password2: registerForm.password2,
  }

  if (nickname) payload.nickname = nickname
  if (email) payload.email = email

  try {
    await auth.register(payload)
    useToast('注册成功，正在为您登录')
    await auth.login({ username, password: registerForm.password })
    await auth.fetchProfile()
    router.push('/')
  } catch (error) {
    console.error(error)
    useToast(extractErrorMessage(error, '注册失败，请检查信息是否有效或已被占用'))
  }
}

const useToast = (message: string) => {
  if (process.client) {
    window.alert(message)
  }
}
</script>
