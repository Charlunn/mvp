<script setup lang="ts">
import { inject } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  value: string
  disabled?: boolean
}>()

const context = inject('TabsContext') as { modelValue: { value: string } }

const isActive = () => context.modelValue.value === props.value

const handleClick = () => {
  if (!props.disabled) {
    context.modelValue.value = props.value
  }
}
</script>

<template>
  <button
    :data-state="isActive() ? 'active' : 'inactive'"
    :disabled="disabled"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm'
    )"
    @click="handleClick"
  >
    <slot />
  </button>
</template>