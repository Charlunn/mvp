<template>
  <button
    class="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-semibold transition hover:bg-secondary"
    @click="toggleTheme"
  >
    <Icon :name="isDark ? 'lucide:moon' : 'lucide:sun'" class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
const isDark = useState('mvp-theme', () => false)

if (process.client) {
  isDark.value = document.documentElement.classList.contains('dark')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
}
</script>
