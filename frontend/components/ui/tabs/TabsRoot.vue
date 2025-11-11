<script setup lang="ts">
import { provide } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  defaultValue?: string
  modelValue?: string
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

provide('TabsContext', {
  modelValue,
  orientation: props.orientation ?? 'horizontal',
  dir: props.dir ?? 'ltr',
  activationMode: props.activationMode ?? 'automatic',
})
</script>

<template>
  <div :data-orientation="orientation">
    <slot />
  </div>
</template>
