import { fileURLToPath } from 'node:url'

const isProd = process.env.NODE_ENV === 'production'
const defaultServerApiBase = isProd ? 'http://backend:8000/api' : 'http://localhost:8000/api'
const defaultPublicApiBase = isProd ? '/api' : 'http://localhost:8000/api'

export default defineNuxtConfig({
  compatibilityDate: '2024-12-01',
  devtools: { enabled: false },
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icon'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  alias: {
    '~/lib': fileURLToPath(new URL('./lib', import.meta.url)),
    '@lib': fileURLToPath(new URL('./lib', import.meta.url)),
  },
  runtimeConfig: {
    apiBaseServer:
      process.env.NUXT_SERVER_API_BASE ||
      process.env.NUXT_PUBLIC_API_BASE ||
      defaultServerApiBase,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || defaultPublicApiBase,
    }
  },
  tailwindcss: {
    exposeConfig: true
  },
  pinia: {
    autoImports: ['defineStore']
  },
  imports: {
    dirs: ['stores']
  },
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        types: ['vue', 'node']
      }
    }
  }
})
