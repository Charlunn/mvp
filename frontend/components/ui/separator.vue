<script setup lang="ts">
import { Separator } from 'radix-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  class?: string
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal'
})
</script>

<template>
  <Separator
    v-bind="$attrs"
    :orientation="props.orientation"
    :class="cn(
      'bg-border',
      props.orientation === 'vertical'
        ? 'h-full w-px'
        : 'h-px w-full'
    , props.class)"
  />
</template>