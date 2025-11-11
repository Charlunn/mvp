<template>
  <div class="space-y-6 overflow-x-hidden">
    <PageHeader title="知识图谱" description="以经典黑白配色呈现关键实体及其风险关系" />

    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div class="flex flex-1 flex-col gap-3 sm:flex-row">
        <Input
          v-model="search"
          placeholder="搜索节点或关系关键词"
          class="flex-1"
          @keyup.enter="runSearch"
        />
        <Button variant="outline" class="sm:w-auto" @click="runSearch">查询</Button>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" class="sm:hidden" @click="mobileFiltersOpen = true">筛选</Button>
        <Button variant="outline" class="flex items-center gap-2" :disabled="isLoading" @click="loadGraph">
          <span
            class="inline-flex h-4 w-4 items-center justify-center"
            :class="{ 'animate-spin': isLoading }"
            aria-hidden="true"
          >
            ⟳
          </span>
          刷新图谱
        </Button>
      </div>
    </div>

    <Card class="border border-border/80">
      <CardHeader>
        <CardTitle>图谱概览</CardTitle>
        <CardDescription>实时呈现最新的风险关系网络</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1.15fr]">
          <div class="relative overflow-hidden rounded-2xl">
            <ClientOnly>
              <VChart
                ref="chartRef"
                class="h-[340px] w-full rounded-2xl border border-border/80 bg-background/60 shadow-inner sm:h-[420px]"
                :option="chartOptions"
                autoresize
              />
            </ClientOnly>
            <div
              v-if="!visibleGraph.nodes.length"
              class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/70 text-xs text-muted-foreground"
            >
              <p>当前筛选条件下暂无可展示的节点</p>
              <p>可尝试调整过滤或提升互斥力度</p>
            </div>
          </div>
          <div class="rounded-2xl border border-border/70 bg-card/80 p-5 text-sm shadow-sm">
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">图谱统计</p>
              <div class="mt-3 grid grid-cols-2 gap-3 text-base font-semibold">
                <div class="rounded-lg border border-border/60 bg-background/60 p-3 text-center">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">节点总数</p>
                  <p class="mt-1 text-2xl font-bold">{{ metadata.nodes }}</p>
                </div>
                <div class="rounded-lg border border-border/60 bg-background/60 p-3 text-center">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">关系条数</p>
                  <p class="mt-1 text-2xl font-bold">{{ metadata.links }}</p>
                </div>
              </div>
            </div>

            <Separator class="my-4 opacity-70" />

            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">风险分布</p>
              <div class="mt-3 space-y-2">
                <div
                  v-for="stat in riskSummary"
                  :key="stat.key"
                  class="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2"
                >
                  <div class="flex items-center gap-2">
                    <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: stat.color }"></span>
                    <span class="text-xs font-semibold">{{ stat.label }}</span>
                  </div>
                  <div class="text-xs text-muted-foreground">{{ stat.count }} · {{ stat.percent }}%</div>
                </div>
              </div>
            </div>

            <Separator class="my-4 opacity-70" />

            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">节点详情</p>
              <div v-if="selectedNode" class="mt-3 space-y-2">
                <p class="text-base font-semibold">{{ selectedNode.label }}</p>
                <div class="text-xs text-muted-foreground">
                  <p>类型：{{ selectedNode.category || '未分类' }}</p>
                  <p>风险等级：{{ riskLevelLabels[selectedNode.riskLevel] || '未知' }}</p>
                </div>
                <div class="mt-3 rounded-lg border border-border/50 bg-background/50 p-3">
                  <p class="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">关联节点</p>
                  <ul class="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li v-if="!selectedNodeNeighbors.length">暂未发现关联</li>
                    <li
                      v-for="neighbor in selectedNodeNeighbors"
                      :key="neighbor.name"
                      class="flex items-center justify-between"
                    >
                      <span class="truncate">{{ neighbor.label }}</span>
                      <Button size="xs" variant="ghost" class="text-[11px]" @click="focusNode(neighbor.name)">定位</Button>
                    </li>
                  </ul>
                </div>
              </div>
              <p v-else class="mt-3 text-xs text-muted-foreground">双击任何节点即可快速查看详情</p>
            </div>
          </div>
        </div>

        <div class="hidden lg:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl border border-border/70 bg-card/80 p-4">
            <p class="text-xs uppercase tracking-widest text-muted-foreground">风险筛选</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <Button
                v-for="option in riskFilterOptions"
                :key="option.value"
                size="sm"
                :variant="riskFilter === option.value ? 'default' : 'outline'"
                class="rounded-full"
                @click="applyRiskFilter(option.value)"
              >
                {{ option.label }}
              </Button>
            </div>
          </div>
          <div class="rounded-2xl border border-border/70 bg-card/80 p-4">
            <p class="text-xs uppercase tracking-widest text-muted-foreground">布局与互斥</p>
            <div class="mt-3 space-y-3 text-xs text-muted-foreground">
              <div class="flex items-center justify-between">
                <span>节点互斥强度</span>
                <span class="font-semibold text-foreground">{{ separationStrength }}</span>
              </div>
              <input
                v-model.number="separationStrength"
                type="range"
                min="40"
                max="100"
                step="5"
                class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-black"
              />
              <div class="flex gap-2">
                <Button
                  v-for="mode in layoutOptions"
                  :key="mode.value"
                  size="sm"
                  :variant="layoutMode === mode.value ? 'default' : 'outline'"
                  class="flex-1"
                  @click="layoutMode = mode.value"
                >
                  {{ mode.label }}
                </Button>
              </div>
            </div>
          </div>
          <div class="rounded-2xl border border-border/70 bg-card/80 p-4">
            <p class="text-xs uppercase tracking-widest text-muted-foreground">快捷操作</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" @click="highlightRisk('high')">聚焦高风险</Button>
              <Button size="sm" variant="outline" @click="boostSeparation">增强互斥</Button>
              <Button size="sm" variant="outline" @click="downloadGraphImage">导出图谱</Button>
              <Button size="sm" @click="resetGraphView">重置视图</Button>
            </div>
          </div>
        </div>

        <div v-if="searchResults.length" class="border border-dashed border-border/60 p-4 text-sm">
          <p class="text-xs uppercase tracking-widest text-muted-foreground">搜索结果</p>
          <ul class="mt-2 space-y-1">
            <li
              v-for="item in searchResults"
              :key="item.id"
              class="flex items-center justify-between border-b border-border/40 py-2"
            >
              <div>
                <p class="font-medium">{{ item.label }}</p>
                <p class="text-xs text-muted-foreground">类型：{{ item.type }}</p>
              </div>
              <Button size="sm" variant="ghost" @click="focusNode(item.id)">定位</Button>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <Transition name="fade">
      <div
        v-if="mobileFiltersOpen"
        class="fixed inset-0 z-40 flex flex-col bg-background/70 backdrop-blur-sm sm:hidden"
      >
        <div class="flex-1 bg-black/40" @click="closeMobileFilters" />
        <div class="rounded-t-3xl border border-border/70 bg-card p-6 shadow-2xl">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-muted-foreground">筛选与布局</p>
            <Button variant="ghost" size="sm" @click="closeMobileFilters">关闭</Button>
          </div>
          <div class="mt-4 space-y-5 text-sm">
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">风险筛选</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <Button
                  v-for="option in riskFilterOptions"
                  :key="option.value"
                  size="sm"
                  :variant="riskFilter === option.value ? 'default' : 'outline'"
                  class="rounded-full"
                  @click="applyRiskFilter(option.value)"
                >
                  {{ option.label }}
                </Button>
              </div>
            </div>
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">节点互斥强度</p>
              <div class="mt-3 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-muted-foreground">当前值</span>
                  <span class="font-semibold text-foreground">{{ separationStrength }}</span>
                </div>
                <input
                  v-model.number="separationStrength"
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-black"
                />
              </div>
            </div>
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">布局模式</p>
              <div class="mt-3 flex gap-2">
                <Button
                  v-for="mode in layoutOptions"
                  :key="mode.value"
                  size="sm"
                  :variant="layoutMode === mode.value ? 'default' : 'outline'"
                  class="flex-1"
                  @click="layoutMode = mode.value"
                >
                  {{ mode.label }}
                </Button>
              </div>
            </div>
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">快捷操作</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" class="flex-1" @click="highlightRisk('high')">聚焦高风险</Button>
                <Button size="sm" variant="outline" class="flex-1" @click="boostSeparation">增强互斥</Button>
                <Button size="sm" variant="outline" class="flex-1" @click="downloadGraphImage">导出图谱</Button>
                <Button size="sm" class="flex-1" @click="resetGraphView">重置视图</Button>
              </div>
            </div>
          </div>
          <Button class="mt-5 w-full" @click="closeMobileFilters">完成</Button>
        </div>
      </div>
    </Transition>
  </div>
</template>




<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'
import { use } from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent } from 'echarts/components'

use([GraphChart, CanvasRenderer, TooltipComponent])

const VChart = defineAsyncComponent({
  loader: () => (process.client ? import('vue-echarts') : Promise.resolve({ default: () => null })),
  suspensible: false,
  ssr: false,
  loadingComponent: {
    render() {
      return h(
        'div',
        {
          class:
            'h-[420px] border border-dashed border-border/60 bg-background flex items-center justify-center text-xs text-muted-foreground',
        },
        '图谱加载中...'
      )
    },
  },
})

const { $api } = useNuxtApp()
const chartRef = ref<any>(null)
const graphData = ref({ nodes: [] as any[], links: [] as any[] })
const selectedNode = ref<any>(null)
const metadata = reactive({ nodes: 0, links: 0 })
const search = ref('')
const searchResults = ref<any[]>([])
const riskLevelLabels: Record<string, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
}
const layoutMode = ref<'force' | 'circular'>('force')
const riskFilter = ref<'all' | 'high' | 'medium' | 'low'>('all')
const separationStrength = ref(70)
const graphZoom = ref(1)
const isLoading = ref(false)
const mobileFiltersOpen = ref(false)
const riskFilterOptions = [
  { label: '全部', value: 'all' },
  { label: '高风险', value: 'high' },
  { label: '中风险', value: 'medium' },
  { label: '低风险', value: 'low' },
]
const layoutOptions = [
  { label: '力导布局', value: 'force' },
  { label: '环形布局', value: 'circular' },
]
const NODE_PALETTE: Record<string, { fill: string; text: string; halo: string; stroke: string }> = {
  high: { fill: '#09090b', text: '#f4f4f5', halo: 'rgba(9,9,11,0.45)', stroke: '#18181b' },
  medium: { fill: '#f4f4f5', text: '#09090b', halo: 'rgba(24,24,27,0.08)', stroke: '#d4d4d8' },
  low: { fill: '#e4e4e7', text: '#18181b', halo: 'rgba(24,24,27,0.06)', stroke: '#d4d4d8' },
}

const normalizeRiskLevel = (candidates: any[], props: Record<string, any>) => {
  const detectFromValue = (input: any) => {
    const raw = (input ?? '').toString().trim()
    if (!raw) return null
    const lower = raw.toLowerCase()
    if (['high', 'high-risk', 'risk-high', 'critical', 'severe'].includes(lower) || /高/.test(raw)) return 'high'
    if (['low', 'low-risk', 'risk-low', 'minor'].includes(lower) || /低/.test(raw)) return 'low'
    if (['medium', 'mid', 'moderate', 'middle'].includes(lower) || /中/.test(raw)) return 'medium'

    const numeric = Number(raw)
    if (!Number.isNaN(numeric)) {
      if (numeric >= 0.66 || numeric >= 3) return 'high'
      if (numeric <= 0.33 || numeric <= 1) return 'low'
      return 'medium'
    }
    return null
  }

  for (const candidate of candidates) {
    const resolved = detectFromValue(candidate)
    if (resolved) return resolved
  }

  const numericFallbacks = [
    props?.riskScore,
    props?.score,
    props?.risk_value,
    props?.level,
    props?.severityScore,
    props?.importance,
  ]
  for (const candidate of numericFallbacks) {
    const resolved = detectFromValue(candidate)
    if (resolved) return resolved
  }

  return 'medium'
}

const formatNodeLabel = (label: string) => {

  const safeLabel = (label || '').trim()

  if (safeLabel.length <= 4) return safeLabel || 'Node'

  const chunk = safeLabel.length > 8 ? 5 : 4

  const pattern = new RegExp(`.{1,${chunk}}`, 'g')

  return safeLabel.match(pattern)?.join('\n') ?? safeLabel

}



const getNodeRadius = (label: string, riskLevel: string) => {
  const base = 46 + Math.min(32, Math.max(0, (label || '').length - 4) * 3)
  if (riskLevel === 'high') return base + 6
  if (riskLevel === 'low') return base - 4
  return base
}

const clampZoom = (value: number) => Math.min(1.8, Math.max(0.65, value))
const getResponsiveFontSize = (base = 12) => Math.round(base * clampZoom(graphZoom.value || 1))
const getResponsiveLineHeight = (fontSize: number) => Math.round(fontSize * 1.2)
const closeMobileFilters = () => {
  mobileFiltersOpen.value = false
}
const ensureChartFits = async () => {
  if (!process.client) return
  await nextTick()
  const instance = chartRef.value ? chartRef.value.chart : null
  instance?.resize({ animation: false })
}

const mapNode = (node: any) => {
  const props = node.properties || {}
  const riskLevel = normalizeRiskLevel(
    [
      props.riskLevel,
      props.risk_level,
      props.risk,
      node.riskLevel,
      node.risk_level,
      props.riskCategory,
      props.risk_category,
      props.severity,
      props.level,
      props.riskScore,
      props.score,
    ],
    props
  )
  const labelText = node.name || node.id
  const palette = NODE_PALETTE[riskLevel] || NODE_PALETTE.medium
  const radius = getNodeRadius(labelText, riskLevel)
  const baseFontSize = 12

  return {
    name: node.id,
    category: node.category || props.category || '未分类',
    riskLevel,
    value: node.value || 1,
    draggable: true,
    symbol: 'circle',
    symbolSize: radius,
    labelBaseSize: baseFontSize,
    itemStyle: {
      color: palette.fill,
      borderColor: palette.stroke,
      borderWidth: 2,
      shadowBlur: 20,
      shadowColor: palette.halo,
    },
    label: {
      show: true,
      color: palette.text,
      fontWeight: 600,
      fontSize: baseFontSize,
      formatter: formatNodeLabel(labelText),
      lineHeight: getResponsiveLineHeight(baseFontSize),
      padding: [0, 6],
    },
    properties: props,
  }
}

const mapLink = (edge: any) => ({
  source: edge.source,
  target: edge.target,
  value: edge.value || 1,
  label:
    edge.label || {
      show: true,
      formatter: edge.type || '关联',
      backgroundColor: 'rgba(15,23,42,0.85)',
      color: '#f8fafc',
      padding: [2, 8],
      borderRadius: 14,
      fontSize: 11,
      fontWeight: 500,
    },
  lineStyle:
    edge.lineStyle || {
      width: 1.1,
      curveness: 0.24,
      color: 'rgba(15,23,42,0.25)',
      shadowBlur: 2,
      shadowColor: 'rgba(15,23,42,0.2)',
    },
  properties: edge.properties || {},
  type: edge.type || '',
})

const filteredGraph = computed(() => {
  if (riskFilter.value === 'all') {
    return {
      nodes: graphData.value.nodes.slice(),
      links: graphData.value.links.slice(),
    }
  }
  const nodes = graphData.value.nodes.filter((node: any) => node.riskLevel === riskFilter.value)
  const allow = new Set(nodes.map((node: any) => node.name))
  const links = graphData.value.links.filter((link: any) => allow.has(link.source) && allow.has(link.target))
  return { nodes, links }
})

const visibleGraph = computed(() => ({
  nodes: filteredGraph.value.nodes.map((node: any) => {
    const baseSize = node.labelBaseSize || 12
    const scaledFont = getResponsiveFontSize(baseSize)
    return {
      ...node,
      label: {
        ...(node.label || {}),
        fontSize: scaledFont,
        lineHeight: getResponsiveLineHeight(scaledFont),
      },
    }
  }),
  links: filteredGraph.value.links,
}))

const riskSummary = computed(() => {
  const counts: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 0, low: 0 }
  graphData.value.nodes.forEach((node: any) => {
    const key = (node.riskLevel as 'high' | 'medium' | 'low') || 'medium'
    counts[key] = (counts[key] || 0) + 1
  })
  const total = graphData.value.nodes.length || 1
  return (['high', 'medium', 'low'] as const).map((key) => ({
    key,
    label: riskLevelLabels[key],
    count: counts[key],
    percent: Math.round((counts[key] / Math.max(total, 1)) * 100),
    color: NODE_PALETTE[key].fill,
  }))
})

const selectedNodeNeighbors = computed(() => {
  if (!selectedNode.value) return []
  const neighborIds = new Set<string>()
  graphData.value.links.forEach((link: any) => {
    if (link.source === selectedNode.value.name) neighborIds.add(link.target)
    if (link.target === selectedNode.value.name) neighborIds.add(link.source)
  })
  return graphData.value.nodes.filter((node: any) => neighborIds.has(node.name)).slice(0, 5)
})

const chartOptions = computed(() => {
  const dataset = visibleGraph.value
  const repulsion = 360 + separationStrength.value * 6
  const isCircular = layoutMode.value === 'circular'
  return {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (params: any) => (params.data && params.data.label) || params.name,
    },
    series: [
      {
        type: 'graph',
        layout: isCircular ? 'circular' : 'force',
        roam: true,
        focusNodeAdjacency: true,
        draggable: true,
        scaleLimit: { min: 0.6, max: 2.2 },
        circular: isCircular
          ? {
              rotateLabel: true,
            }
          : undefined,
        force: isCircular
          ? undefined
          : {
              repulsion,
              edgeLength: [110, 190],
              gravity: 0.035,
              friction: 0.12,
            },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [6, 12],
        lineStyle: {
          color: 'rgba(24,24,27,0.4)',
          width: 1.2,
          opacity: 0.85,
          curveness: 0.24,
        },
        label: {
          show: false,
        },
        itemStyle: {
          borderWidth: 0,
        },
        data: dataset.nodes,
        links: dataset.links,
        animationDuration: 1400,
        animationEasingUpdate: 'cubicInOut',
        emphasis: {
          focus: 'adjacency',
          scale: true,
          lineStyle: {
            width: 2,
            color: '#09090b',
            opacity: 0.95,
          },
        },
      },
    ],
  }
})

const bindGraphEvents = () => {
  const instance = chartRef.value ? chartRef.value.chart : null
  if (!instance) return
  instance.off('click')
  instance.off('dblclick')
  instance.off('graphRoam')
  instance.on('click', (params: any) => {
    if (params.dataType === 'node') {
      selectedNode.value = params.data
    }
  })
  instance.on('dblclick', async (params: any) => {
    if (params.dataType === 'node' && params.data?.name) {
      await focusNode(params.data.name)
    }
  })
  instance.on('graphRoam', (params: any) => {
    if (typeof params.zoom === 'number' && !Number.isNaN(params.zoom)) {
      graphZoom.value = clampZoom(params.zoom)
    }
  })
}

const loadGraph = async () => {
  try {
    isLoading.value = true
    const response = await $api.get('/graph/initial/', { params: { limit: 80 } })
    const graph = response.data.graph || { nodes: [], links: [] }
    graphData.value = {
      nodes: graph.nodes.map(mapNode),
      links: graph.links.map(mapLink),
    }
    metadata.nodes = (graph.counts && graph.counts.nodes) || graph.nodes.length
    metadata.links = (graph.counts && graph.counts.links) || graph.links.length
    selectedNode.value = null
    graphZoom.value = 1
    await nextTick()
    bindGraphEvents()
    await ensureChartFits()
  } finally {
    isLoading.value = false
  }
}

const runSearch = async () => {
  const query = search.value.trim()
  if (!query) {
    searchResults.value = []
    return
  }
  try {
    const response = await $api.get('/graph/search/universal/', { params: { query } })
    searchResults.value = response.data.nodes ? response.data.nodes.slice(0, 5) : []
  } catch (error) {
    console.error('Failed to search graph', error)
    searchResults.value = []
  }
}

const focusNode = async (nodeId: string) => {
  if (!nodeId) return
  try {
    const response = await $api.get(`/graph/node/${nodeId}/expand/`, { params: { limit: 30 } })
    const graph = response.data.graph || response.data
    graphData.value = {
      nodes: graph.nodes.map(mapNode),
      links: graph.links.map(mapLink),
    }
    selectedNode.value = graphData.value.nodes.find((node) => node.name === nodeId) || null
    searchResults.value = []
    await nextTick()
    bindGraphEvents()
    await ensureChartFits()
  } catch (error) {
    console.error('Failed to focus node', error)
  }
}

const applyRiskFilter = (value: 'all' | 'high' | 'medium' | 'low') => {
  riskFilter.value = value
}
const highlightRisk = (level: 'high' | 'medium' | 'low') => {
  riskFilter.value = level
}
const boostSeparation = () => {
  separationStrength.value = Math.min(100, separationStrength.value + 10)
}
const downloadGraphImage = () => {
  if (!process.client) return
  const instance = chartRef.value ? chartRef.value.chart : null
  if (!instance) return
  const url = instance.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#ffffff' })
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `graph-${Date.now()}.png`
  anchor.click()
}
const resetGraphView = () => {
  riskFilter.value = 'all'
  separationStrength.value = 70
  layoutMode.value = 'force'
  graphZoom.value = 1
  loadGraph()
}

watch(riskFilter, (value) => {
  if (value === 'all') return
  if (selectedNode.value && selectedNode.value.riskLevel !== value) {
    selectedNode.value = null
  }
})

onMounted(loadGraph)
</script>



