<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
    <div class="space-y-2">
      <p v-if="props.eyebrow" class="text-sm font-medium uppercase tracking-wide text-primary/80">
        {{ props.eyebrow }}
      </p>
      <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {{ props.title }}
      </h1>
      <p v-if="props.description" class="max-w-2xl text-base text-muted-foreground">
        {{ props.description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex flex-col gap-2 sm:flex-row">
      <slot name="actions" />
    </div>
  </div>
</template>