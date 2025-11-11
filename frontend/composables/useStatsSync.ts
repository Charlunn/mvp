import type { AxiosResponse } from 'axios'

export type DashboardStats = {
  quiz_attempts_count: number
  average_score: number
  best_score: number
  last_attempt?: {
    score: number
    level: string
    created_at: string
  } | null
}

export type QuizPerformanceStats = {
  total_attempts: number
  average_score: number
  best_score: number
  level_stats: Record<string, { attempts: number; average_score: number; best_score: number }>
  recent_attempts: Array<{
    id: number
    level: string
    score: number
    total_questions: number
    correct_answers: number
    created_at: string
  }>
}

type QuizStatsResponse = Partial<QuizPerformanceStats> & {
  recent_attempts?: QuizPerformanceStats['recent_attempts']
  level_stats?: QuizPerformanceStats['level_stats']
}

export const useStatsSync = () => {
  const { $api } = useNuxtApp()
  const userStats = useState<DashboardStats | null>('mvp-user-stats', () => null)
  const quizStats = useState<QuizPerformanceStats | null>('mvp-quiz-stats', () => null)
  const syncing = useState('mvp-stats-syncing', () => false)

  const refreshUserStats = async () => {
    const { data }: AxiosResponse<DashboardStats> = await $api.get('/users/stats/')
    userStats.value = data
    return data
  }

  const refreshQuizStats = async () => {
    const response: AxiosResponse<QuizStatsResponse> = await $api.get('/quiz/stats/')
    const payload = {
      level_stats: response.data.level_stats ?? {},
      recent_attempts: response.data.recent_attempts ?? [],
      total_attempts: response.data.total_attempts ?? 0,
      average_score: response.data.average_score ?? 0,
      best_score: response.data.best_score ?? 0,
    }
    quizStats.value = payload
    return payload
  }

  const refreshAllStats = async () => {
    syncing.value = true
    try {
      const [user, quiz] = await Promise.all([refreshUserStats(), refreshQuizStats()])
      return { user, quiz }
    } finally {
      syncing.value = false
    }
  }

  return {
    userStats,
    quizStats,
    syncing,
    refreshUserStats,
    refreshQuizStats,
    refreshAllStats,
  }
}
