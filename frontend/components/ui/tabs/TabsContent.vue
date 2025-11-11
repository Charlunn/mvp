<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  value: string
}>()

const context = inject('TabsContext') as { modelValue: { value: string } }

const isActive = () => context.modelValue.value === props.value
</script>

<template>
  <div v-if="isActive()">
    <slot />
  </div>
</template>