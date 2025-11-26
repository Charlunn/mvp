/**
 * 统一的错误处理工具
 * 避免将HTML错误页面显示给用户
 */
import type { AxiosError } from 'axios'

export interface ErrorResponse {
  detail?: string | string[]
  message?: string | string[]
  error?: string
  [key: string]: any
}

/**
 * 从错误对象中提取友好的错误消息
 */
export function extractErrorMessage(error: unknown, fallback: string = '操作失败，请稍后重试'): string {
  const axiosError = error as AxiosError<any>
  const data = axiosError?.response?.data

  if (!data) {
    return axiosError?.message || fallback
  }

  // 检查是否为HTML响应（如nginx错误页面）
  if (typeof data === 'string') {
    const htmlPattern = /<\s*html[^>]*>/i
    if (htmlPattern.test(data)) {
      const status = axiosError?.response?.status
      const statusText = axiosError?.response?.statusText || '未知错误'
      return `服务器响应异常 (${status || statusText})，请稍后重试`
    }
    // 非HTML的字符串响应直接返回
    return data.trim() || fallback
  }

  // 处理对象类型的错误响应
  if (typeof data === 'object' && data !== null) {
    // 优先处理标准错误字段
    if (data.detail) {
      return Array.isArray(data.detail) ? data.detail[0] : String(data.detail)
    }
    if (data.message) {
      return Array.isArray(data.message) ? data.message[0] : String(data.message)
    }
    if (data.error) {
      return Array.isArray(data.error) ? data.error[0] : String(data.error)
    }

    // 尝试提取第一个字段的值
    const values = Object.values(data)
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) {
        return value
      }
      if (Array.isArray(value) && value.length > 0) {
        return String(value[0])
      }
    }
  }

  return fallback
}

/**
 * 从错误对象中提取所有错误消息（数组形式）
 */
export function extractErrors(error: unknown): string[] {
  const axiosError = error as AxiosError<any>
  const data = axiosError?.response?.data

  if (!data) {
    return [axiosError?.message || '请求失败']
  }

  // 检查是否为HTML响应
  if (typeof data === 'string') {
    const htmlPattern = /<\s*html[^>]*>/i
    if (htmlPattern.test(data)) {
      const status = axiosError?.response?.status
      return [`服务器响应异常 (${status || '未知错误'})，请稍后重试`]
    }
    return [data]
  }

  if (Array.isArray(data)) {
    return data.map(String)
  }

  if (typeof data === 'object' && data !== null) {
    // 优先处理标准错误字段
    if (data.detail) {
      return Array.isArray(data.detail) ? data.detail.map(String) : [String(data.detail)]
    }
    if (data.message) {
      return Array.isArray(data.message) ? data.message.map(String) : [String(data.message)]
    }
    if (data.error) {
      return Array.isArray(data.error) ? data.error.map(String) : [String(data.error)]
    }

    // 特殊处理密码验证错误
    if (data.password && Array.isArray(data.password)) {
      return data.password.map(String)
    }

    // 收集所有字段的错误
    const flattened = Object.values(data).flatMap((value) => {
      if (Array.isArray(value)) return value.map(String)
      if (typeof value === 'string' && value.trim()) return [value]
      return []
    })

    if (flattened.length) {
      return flattened
    }
  }

  return ['请求失败']
}

/**
 * 显示友好的错误提示（使用alert或自定义toast）
 */
export function showError(error: unknown, fallback?: string) {
  const message = extractErrorMessage(error, fallback)
  if (process.client) {
    // 这里可以替换为更好的toast组件
    window.alert(message)
  }
}

/**
 * 检查是否为认证错误
 */
export function isAuthError(error: unknown): boolean {
  const axiosError = error as AxiosError
  return axiosError?.response?.status === 401
}

/**
 * 检查是否为权限错误
 */
export function isPermissionError(error: unknown): boolean {
  const axiosError = error as AxiosError
  return axiosError?.response?.status === 403
}

/**
 * 检查是否为网络错误
 */
export function isNetworkError(error: unknown): boolean {
  const axiosError = error as AxiosError
  return !axiosError?.response && Boolean(axiosError?.request)
}
