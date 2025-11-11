<script setup lang="ts">
import { cn } from '~/lib/utils'
</script>

<template>
  <div :class="cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground')">
    <slot />
  </div>
</template>