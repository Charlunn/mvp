<template>
  <ClientOnly v-if="option">
    <RadarChart :option="option" autoresize class="w-full" :style="{ height }" />
  </ClientOnly>
  <div v-else class="flex h-full items-center justify-center text-xs text-muted-foreground">
    暂无能力画像
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h } from 'vue'
import { use } from 'echarts/core'
import { RadarChart as EchartsRadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([EchartsRadarChart, TooltipComponent, LegendComponent, CanvasRenderer])

const RadarChart = defineAsyncComponent({
  loader: () => (process.client ? import('vue-echarts') : Promise.resolve({ default: () => null })),
  suspensible: false,
  ssr: false,
  loadingComponent: {
    render() {
      return h(
        'div',
        {
          class:
            'h-full w-full rounded-2xl border border-dashed border-border/60 bg-background flex items-center justify-center text-xs text-muted-foreground',
        },
        '雷达图加载中...'
      )
    },
  },
})

const props = defineProps<{
  profile?: Record<string, number> | null
  height?: string
}>()

const capabilityDimensions = [
  { key: 'risk_discernment', label: '风险识别' },
  { key: 'info_protection', label: '信息保护' },
  { key: 'response_speed', label: '响应速度' },
  { key: 'emotional_control', label: '情绪稳定' },
  { key: 'verification_skill', label: '核验能力' },
]

const option = computed(() => {
  if (!props.profile) return null
  const indicators = capabilityDimensions.map((item) => ({
    name: item.label,
    max: 100,
  }))
  const values = capabilityDimensions.map((item) => props.profile?.[item.key] ?? 0)
  return {
    tooltip: {},
    radar: {
      indicator: indicators,
      splitArea: { areaStyle: { color: ['rgba(15,15,15,0.04)', 'transparent'] } },
      axisName: { color: '#6b7280' },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#0f0f0f' },
        areaStyle: { color: 'rgba(15,15,15,0.15)' },
        data: [{ value: values }],
      },
    ],
  }
})

const height = computed(() => props.height || '240px')
</script>
