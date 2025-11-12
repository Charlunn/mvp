import { _ as _sfc_main$2 } from "./page-header-C0onwRJI.js";
import { _ as _sfc_main$3 } from "./input-DmJdLXAM.js";
import { c as cn, _ as _sfc_main$4 } from "./button-BNulVDON.js";
import { _ as _sfc_main$5, a as _sfc_main$6, b as _sfc_main$7, c as _sfc_main$8, d as _sfc_main$9 } from "./card-content-BbSy3frX.js";
import { a as useNuxtApp, b as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, unref, mergeProps, useSSRContext, defineAsyncComponent, h, ref, reactive, computed, watch, isRef, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelText, nextTick } from "vue";
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { Separator } from "radix-vue";
import { use } from "echarts/core";
import { GraphChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent } from "echarts/components";
import "clsx";
import "tailwind-merge";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/unctx/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/radix3/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ufo/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/destr/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ohash/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "axios";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "separator",
  __ssrInlineRender: true,
  props: {
    class: {},
    orientation: { default: "horizontal" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Separator), mergeProps(_ctx.$attrs, {
        orientation: props.orientation,
        class: unref(cn)(
          "bg-border",
          props.orientation === "vertical" ? "h-full w-px" : "h-px w-full",
          props.class
        )
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/separator.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "graph",
  __ssrInlineRender: true,
  setup(__props) {
    use([GraphChart, CanvasRenderer, TooltipComponent]);
    const VChart = defineAsyncComponent({
      loader: () => Promise.resolve({ default: () => null }),
      suspensible: false,
      ssr: false,
      loadingComponent: {
        render() {
          return h(
            "div",
            {
              class: "h-[420px] border border-dashed border-border/60 bg-background flex items-center justify-center text-xs text-muted-foreground"
            },
            "图谱加载中..."
          );
        }
      }
    });
    const { $api } = useNuxtApp();
    const chartRef = ref(null);
    const graphData = ref({ nodes: [], links: [] });
    const selectedNode = ref(null);
    const metadata = reactive({ nodes: 0, links: 0 });
    const search = ref("");
    const searchResults = ref([]);
    const riskLevelLabels = {
      high: "高风险",
      medium: "中风险",
      low: "低风险"
    };
    const layoutMode = ref("force");
    const riskFilter = ref("all");
    const separationStrength = ref(70);
    const graphZoom = ref(1);
    const isLoading = ref(false);
    const mobileFiltersOpen = ref(false);
    const riskFilterOptions = [
      { label: "全部", value: "all" },
      { label: "高风险", value: "high" },
      { label: "中风险", value: "medium" },
      { label: "低风险", value: "low" }
    ];
    const layoutOptions = [
      { label: "力导布局", value: "force" },
      { label: "环形布局", value: "circular" }
    ];
    const NODE_PALETTE = {
      high: { fill: "#09090b", text: "#f4f4f5", halo: "rgba(9,9,11,0.45)", stroke: "#18181b" },
      medium: { fill: "#f4f4f5", text: "#09090b", halo: "rgba(24,24,27,0.08)", stroke: "#d4d4d8" },
      low: { fill: "#e4e4e7", text: "#18181b", halo: "rgba(24,24,27,0.06)", stroke: "#d4d4d8" }
    };
    const normalizeRiskLevel = (candidates, props) => {
      const detectFromValue = (input) => {
        const raw = (input ?? "").toString().trim();
        if (!raw) return null;
        const lower = raw.toLowerCase();
        if (["high", "high-risk", "risk-high", "critical", "severe"].includes(lower) || /高/.test(raw)) return "high";
        if (["low", "low-risk", "risk-low", "minor"].includes(lower) || /低/.test(raw)) return "low";
        if (["medium", "mid", "moderate", "middle"].includes(lower) || /中/.test(raw)) return "medium";
        const numeric = Number(raw);
        if (!Number.isNaN(numeric)) {
          if (numeric >= 0.66 || numeric >= 3) return "high";
          if (numeric <= 0.33 || numeric <= 1) return "low";
          return "medium";
        }
        return null;
      };
      for (const candidate of candidates) {
        const resolved = detectFromValue(candidate);
        if (resolved) return resolved;
      }
      const numericFallbacks = [
        props?.riskScore,
        props?.score,
        props?.risk_value,
        props?.level,
        props?.severityScore,
        props?.importance
      ];
      for (const candidate of numericFallbacks) {
        const resolved = detectFromValue(candidate);
        if (resolved) return resolved;
      }
      return "medium";
    };
    const formatNodeLabel = (label) => {
      const safeLabel = (label || "").trim();
      if (safeLabel.length <= 4) return safeLabel || "Node";
      const chunk = safeLabel.length > 8 ? 5 : 4;
      const pattern = new RegExp(`.{1,${chunk}}`, "g");
      return safeLabel.match(pattern)?.join("\n") ?? safeLabel;
    };
    const getNodeRadius = (label, riskLevel) => {
      const base = 46 + Math.min(32, Math.max(0, (label || "").length - 4) * 3);
      if (riskLevel === "high") return base + 6;
      if (riskLevel === "low") return base - 4;
      return base;
    };
    const clampZoom = (value) => Math.min(1.8, Math.max(0.65, value));
    const getResponsiveFontSize = (base = 12) => Math.round(base * clampZoom(graphZoom.value || 1));
    const getResponsiveLineHeight = (fontSize) => Math.round(fontSize * 1.2);
    const closeMobileFilters = () => {
      mobileFiltersOpen.value = false;
    };
    const ensureChartFits = async () => {
      return;
    };
    const mapNode = (node) => {
      const props = node.properties || {};
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
          props.score
        ],
        props
      );
      const labelText = node.name || node.id;
      const palette = NODE_PALETTE[riskLevel] || NODE_PALETTE.medium;
      const radius = getNodeRadius(labelText, riskLevel);
      const baseFontSize = 12;
      return {
        name: node.id,
        category: node.category || props.category || "未分类",
        riskLevel,
        value: node.value || 1,
        draggable: true,
        symbol: "circle",
        symbolSize: radius,
        labelBaseSize: baseFontSize,
        itemStyle: {
          color: palette.fill,
          borderColor: palette.stroke,
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: palette.halo
        },
        label: {
          show: true,
          color: palette.text,
          fontWeight: 600,
          fontSize: baseFontSize,
          formatter: formatNodeLabel(labelText),
          lineHeight: getResponsiveLineHeight(baseFontSize),
          padding: [0, 6]
        },
        properties: props
      };
    };
    const mapLink = (edge) => ({
      source: edge.source,
      target: edge.target,
      value: edge.value || 1,
      label: edge.label || {
        show: true,
        formatter: edge.type || "关联",
        backgroundColor: "rgba(15,23,42,0.85)",
        color: "#f8fafc",
        padding: [2, 8],
        borderRadius: 14,
        fontSize: 11,
        fontWeight: 500
      },
      lineStyle: edge.lineStyle || {
        width: 1.1,
        curveness: 0.24,
        color: "rgba(15,23,42,0.25)",
        shadowBlur: 2,
        shadowColor: "rgba(15,23,42,0.2)"
      },
      properties: edge.properties || {},
      type: edge.type || ""
    });
    const filteredGraph = computed(() => {
      if (riskFilter.value === "all") {
        return {
          nodes: graphData.value.nodes.slice(),
          links: graphData.value.links.slice()
        };
      }
      const nodes = graphData.value.nodes.filter((node) => node.riskLevel === riskFilter.value);
      const allow = new Set(nodes.map((node) => node.name));
      const links = graphData.value.links.filter((link) => allow.has(link.source) && allow.has(link.target));
      return { nodes, links };
    });
    const visibleGraph = computed(() => ({
      nodes: filteredGraph.value.nodes.map((node) => {
        const baseSize = node.labelBaseSize || 12;
        const scaledFont = getResponsiveFontSize(baseSize);
        return {
          ...node,
          label: {
            ...node.label || {},
            fontSize: scaledFont,
            lineHeight: getResponsiveLineHeight(scaledFont)
          }
        };
      }),
      links: filteredGraph.value.links
    }));
    const riskSummary = computed(() => {
      const counts = { high: 0, medium: 0, low: 0 };
      graphData.value.nodes.forEach((node) => {
        const key = node.riskLevel || "medium";
        counts[key] = (counts[key] || 0) + 1;
      });
      const total = graphData.value.nodes.length || 1;
      return ["high", "medium", "low"].map((key) => ({
        key,
        label: riskLevelLabels[key],
        count: counts[key],
        percent: Math.round(counts[key] / Math.max(total, 1) * 100),
        color: NODE_PALETTE[key].fill
      }));
    });
    const selectedNodeNeighbors = computed(() => {
      if (!selectedNode.value) return [];
      const neighborIds = /* @__PURE__ */ new Set();
      graphData.value.links.forEach((link) => {
        if (link.source === selectedNode.value.name) neighborIds.add(link.target);
        if (link.target === selectedNode.value.name) neighborIds.add(link.source);
      });
      return graphData.value.nodes.filter((node) => neighborIds.has(node.name)).slice(0, 5);
    });
    const chartOptions = computed(() => {
      const dataset = visibleGraph.value;
      const repulsion = 360 + separationStrength.value * 6;
      const isCircular = layoutMode.value === "circular";
      return {
        backgroundColor: "transparent",
        tooltip: {
          formatter: (params) => params.data && params.data.label || params.name
        },
        series: [
          {
            type: "graph",
            layout: isCircular ? "circular" : "force",
            roam: true,
            focusNodeAdjacency: true,
            draggable: true,
            scaleLimit: { min: 0.6, max: 2.2 },
            circular: isCircular ? {
              rotateLabel: true
            } : void 0,
            force: isCircular ? void 0 : {
              repulsion,
              edgeLength: [110, 190],
              gravity: 0.035,
              friction: 0.12
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [6, 12],
            lineStyle: {
              color: "rgba(24,24,27,0.4)",
              width: 1.2,
              opacity: 0.85,
              curveness: 0.24
            },
            label: {
              show: false
            },
            itemStyle: {
              borderWidth: 0
            },
            data: dataset.nodes,
            links: dataset.links,
            animationDuration: 1400,
            animationEasingUpdate: "cubicInOut",
            emphasis: {
              focus: "adjacency",
              scale: true,
              lineStyle: {
                width: 2,
                color: "#09090b",
                opacity: 0.95
              }
            }
          }
        ]
      };
    });
    const bindGraphEvents = () => {
      const instance = chartRef.value ? chartRef.value.chart : null;
      if (!instance) return;
      instance.off("click");
      instance.off("dblclick");
      instance.off("graphRoam");
      instance.on("click", (params) => {
        if (params.dataType === "node") {
          selectedNode.value = params.data;
        }
      });
      instance.on("dblclick", async (params) => {
        if (params.dataType === "node" && params.data?.name) {
          await focusNode(params.data.name);
        }
      });
      instance.on("graphRoam", (params) => {
        if (typeof params.zoom === "number" && !Number.isNaN(params.zoom)) {
          graphZoom.value = clampZoom(params.zoom);
        }
      });
    };
    const loadGraph = async () => {
      try {
        isLoading.value = true;
        const response = await $api.get("/graph/initial/", { params: { limit: 80 } });
        const graph = response.data.graph || { nodes: [], links: [] };
        graphData.value = {
          nodes: graph.nodes.map(mapNode),
          links: graph.links.map(mapLink)
        };
        metadata.nodes = graph.counts && graph.counts.nodes || graph.nodes.length;
        metadata.links = graph.counts && graph.counts.links || graph.links.length;
        selectedNode.value = null;
        graphZoom.value = 1;
        await nextTick();
        bindGraphEvents();
        await ensureChartFits();
      } finally {
        isLoading.value = false;
      }
    };
    const runSearch = async () => {
      const query = search.value.trim();
      if (!query) {
        searchResults.value = [];
        return;
      }
      try {
        const response = await $api.get("/graph/search/universal/", { params: { query } });
        searchResults.value = response.data.nodes ? response.data.nodes.slice(0, 5) : [];
      } catch (error) {
        console.error("Failed to search graph", error);
        searchResults.value = [];
      }
    };
    const focusNode = async (nodeId) => {
      if (!nodeId) return;
      try {
        const response = await $api.get(`/graph/node/${nodeId}/expand/`, { params: { limit: 30 } });
        const graph = response.data.graph || response.data;
        graphData.value = {
          nodes: graph.nodes.map(mapNode),
          links: graph.links.map(mapLink)
        };
        selectedNode.value = graphData.value.nodes.find((node) => node.name === nodeId) || null;
        searchResults.value = [];
        await nextTick();
        bindGraphEvents();
        await ensureChartFits();
      } catch (error) {
        console.error("Failed to focus node", error);
      }
    };
    const applyRiskFilter = (value) => {
      riskFilter.value = value;
    };
    const highlightRisk = (level) => {
      riskFilter.value = level;
    };
    const boostSeparation = () => {
      separationStrength.value = Math.min(100, separationStrength.value + 10);
    };
    const downloadGraphImage = () => {
      return;
    };
    const resetGraphView = () => {
      riskFilter.value = "all";
      separationStrength.value = 70;
      layoutMode.value = "force";
      graphZoom.value = 1;
      loadGraph();
    };
    watch(riskFilter, (value) => {
      if (value === "all") return;
      if (selectedNode.value && selectedNode.value.riskLevel !== value) {
        selectedNode.value = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$2;
      const _component_Input = _sfc_main$3;
      const _component_Button = _sfc_main$4;
      const _component_Card = _sfc_main$5;
      const _component_CardHeader = _sfc_main$6;
      const _component_CardTitle = _sfc_main$7;
      const _component_CardDescription = _sfc_main$8;
      const _component_CardContent = _sfc_main$9;
      const _component_ClientOnly = __nuxt_component_0;
      const _component_Separator = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 overflow-x-hidden" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "知识图谱",
        description: "以经典黑白配色呈现关键实体及其风险关系"
      }, null, _parent));
      _push(`<div class="flex flex-col gap-3 lg:flex-row lg:items-center"><div class="flex flex-1 flex-col gap-3 sm:flex-row">`);
      _push(ssrRenderComponent(_component_Input, {
        modelValue: unref(search),
        "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "搜索节点或关系关键词",
        class: "flex-1",
        onKeyup: runSearch
      }, null, _parent));
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        class: "sm:w-auto",
        onClick: runSearch
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`查询`);
          } else {
            return [
              createTextVNode("查询")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        class: "sm:hidden",
        onClick: ($event) => mobileFiltersOpen.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`筛选`);
          } else {
            return [
              createTextVNode("筛选")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        class: "flex items-center gap-2",
        disabled: unref(isLoading),
        onClick: loadGraph
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="${ssrRenderClass([{ "animate-spin": unref(isLoading) }, "inline-flex h-4 w-4 items-center justify-center"])}" aria-hidden="true"${_scopeId}> ⟳ </span> 刷新图谱 `);
          } else {
            return [
              createVNode("span", {
                class: ["inline-flex h-4 w-4 items-center justify-center", { "animate-spin": unref(isLoading) }],
                "aria-hidden": "true"
              }, " ⟳ ", 2),
              createTextVNode(" 刷新图谱 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`图谱概览`);
                      } else {
                        return [
                          createTextVNode("图谱概览")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`实时呈现最新的风险关系网络`);
                      } else {
                        return [
                          createTextVNode("实时呈现最新的风险关系网络")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("图谱概览")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("实时呈现最新的风险关系网络")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1.15fr]"${_scopeId2}><div class="relative overflow-hidden rounded-2xl"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_ClientOnly, null, {}, _parent3, _scopeId2));
                  if (!unref(visibleGraph).nodes.length) {
                    _push3(`<div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/70 text-xs text-muted-foreground"${_scopeId2}><p${_scopeId2}>当前筛选条件下暂无可展示的节点</p><p${_scopeId2}>可尝试调整过滤或提升互斥力度</p></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="rounded-2xl border border-border/70 bg-card/80 p-5 text-sm shadow-sm"${_scopeId2}><div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>图谱统计</p><div class="mt-3 grid grid-cols-2 gap-3 text-base font-semibold"${_scopeId2}><div class="rounded-lg border border-border/60 bg-background/60 p-3 text-center"${_scopeId2}><p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"${_scopeId2}>节点总数</p><p class="mt-1 text-2xl font-bold"${_scopeId2}>${ssrInterpolate(unref(metadata).nodes)}</p></div><div class="rounded-lg border border-border/60 bg-background/60 p-3 text-center"${_scopeId2}><p class="text-[11px] uppercase tracking-[0.2em] text-muted-foreground"${_scopeId2}>关系条数</p><p class="mt-1 text-2xl font-bold"${_scopeId2}>${ssrInterpolate(unref(metadata).links)}</p></div></div></div>`);
                  _push3(ssrRenderComponent(_component_Separator, { class: "my-4 opacity-70" }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>风险分布</p><div class="mt-3 space-y-2"${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(riskSummary), (stat) => {
                    _push3(`<div class="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2"${_scopeId2}><div class="flex items-center gap-2"${_scopeId2}><span class="h-2.5 w-2.5 rounded-full" style="${ssrRenderStyle({ backgroundColor: stat.color })}"${_scopeId2}></span><span class="text-xs font-semibold"${_scopeId2}>${ssrInterpolate(stat.label)}</span></div><div class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(stat.count)} · ${ssrInterpolate(stat.percent)}%</div></div>`);
                  });
                  _push3(`<!--]--></div></div>`);
                  _push3(ssrRenderComponent(_component_Separator, { class: "my-4 opacity-70" }, null, _parent3, _scopeId2));
                  _push3(`<div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>节点详情</p>`);
                  if (unref(selectedNode)) {
                    _push3(`<div class="mt-3 space-y-2"${_scopeId2}><p class="text-base font-semibold"${_scopeId2}>${ssrInterpolate(unref(selectedNode).label)}</p><div class="text-xs text-muted-foreground"${_scopeId2}><p${_scopeId2}>类型：${ssrInterpolate(unref(selectedNode).category || "未分类")}</p><p${_scopeId2}>风险等级：${ssrInterpolate(riskLevelLabels[unref(selectedNode).riskLevel] || "未知")}</p></div><div class="mt-3 rounded-lg border border-border/50 bg-background/50 p-3"${_scopeId2}><p class="text-[11px] uppercase tracking-[0.3em] text-muted-foreground"${_scopeId2}>关联节点</p><ul class="mt-2 space-y-1 text-xs text-muted-foreground"${_scopeId2}>`);
                    if (!unref(selectedNodeNeighbors).length) {
                      _push3(`<li${_scopeId2}>暂未发现关联</li>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--[-->`);
                    ssrRenderList(unref(selectedNodeNeighbors), (neighbor) => {
                      _push3(`<li class="flex items-center justify-between"${_scopeId2}><span class="truncate"${_scopeId2}>${ssrInterpolate(neighbor.label)}</span>`);
                      _push3(ssrRenderComponent(_component_Button, {
                        size: "xs",
                        variant: "ghost",
                        class: "text-[11px]",
                        onClick: ($event) => focusNode(neighbor.name)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`定位`);
                          } else {
                            return [
                              createTextVNode("定位")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</li>`);
                    });
                    _push3(`<!--]--></ul></div></div>`);
                  } else {
                    _push3(`<p class="mt-3 text-xs text-muted-foreground"${_scopeId2}>双击任何节点即可快速查看详情</p>`);
                  }
                  _push3(`</div></div></div><div class="hidden lg:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"${_scopeId2}><div class="rounded-2xl border border-border/70 bg-card/80 p-4"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>风险筛选</p><div class="mt-3 flex flex-wrap gap-2"${_scopeId2}><!--[-->`);
                  ssrRenderList(riskFilterOptions, (option) => {
                    _push3(ssrRenderComponent(_component_Button, {
                      key: option.value,
                      size: "sm",
                      variant: unref(riskFilter) === option.value ? "default" : "outline",
                      class: "rounded-full",
                      onClick: ($event) => applyRiskFilter(option.value)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(option.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(option.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div></div><div class="rounded-2xl border border-border/70 bg-card/80 p-4"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>布局与互斥</p><div class="mt-3 space-y-3 text-xs text-muted-foreground"${_scopeId2}><div class="flex items-center justify-between"${_scopeId2}><span${_scopeId2}>节点互斥强度</span><span class="font-semibold text-foreground"${_scopeId2}>${ssrInterpolate(unref(separationStrength))}</span></div><input${ssrRenderAttr("value", unref(separationStrength))} type="range" min="40" max="100" step="5" class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-black"${_scopeId2}><div class="flex gap-2"${_scopeId2}><!--[-->`);
                  ssrRenderList(layoutOptions, (mode) => {
                    _push3(ssrRenderComponent(_component_Button, {
                      key: mode.value,
                      size: "sm",
                      variant: unref(layoutMode) === mode.value ? "default" : "outline",
                      class: "flex-1",
                      onClick: ($event) => layoutMode.value = mode.value
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(mode.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(mode.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div></div></div><div class="rounded-2xl border border-border/70 bg-card/80 p-4"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>快捷操作</p><div class="mt-3 flex flex-wrap gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: ($event) => highlightRisk("high")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`聚焦高风险`);
                      } else {
                        return [
                          createTextVNode("聚焦高风险")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: boostSeparation
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`增强互斥`);
                      } else {
                        return [
                          createTextVNode("增强互斥")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    size: "sm",
                    variant: "outline",
                    onClick: downloadGraphImage
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`导出图谱`);
                      } else {
                        return [
                          createTextVNode("导出图谱")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    size: "sm",
                    onClick: resetGraphView
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`重置视图`);
                      } else {
                        return [
                          createTextVNode("重置视图")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></div>`);
                  if (unref(searchResults).length) {
                    _push3(`<div class="border border-dashed border-border/60 p-4 text-sm"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>搜索结果</p><ul class="mt-2 space-y-1"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(searchResults), (item) => {
                      _push3(`<li class="flex items-center justify-between border-b border-border/40 py-2"${_scopeId2}><div${_scopeId2}><p class="font-medium"${_scopeId2}>${ssrInterpolate(item.label)}</p><p class="text-xs text-muted-foreground"${_scopeId2}>类型：${ssrInterpolate(item.type)}</p></div>`);
                      _push3(ssrRenderComponent(_component_Button, {
                        size: "sm",
                        variant: "ghost",
                        onClick: ($event) => focusNode(item.id)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`定位`);
                          } else {
                            return [
                              createTextVNode("定位")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</li>`);
                    });
                    _push3(`<!--]--></ul></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1.15fr]" }, [
                      createVNode("div", { class: "relative overflow-hidden rounded-2xl" }, [
                        createVNode(_component_ClientOnly, null, {
                          default: withCtx(() => [
                            createVNode(unref(VChart), {
                              ref_key: "chartRef",
                              ref: chartRef,
                              class: "h-[340px] w-full rounded-2xl border border-border/80 bg-background/60 shadow-inner sm:h-[420px]",
                              option: unref(chartOptions),
                              autoresize: ""
                            }, null, 8, ["option"])
                          ]),
                          _: 1
                        }),
                        !unref(visibleGraph).nodes.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/70 text-xs text-muted-foreground"
                        }, [
                          createVNode("p", null, "当前筛选条件下暂无可展示的节点"),
                          createVNode("p", null, "可尝试调整过滤或提升互斥力度")
                        ])) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-5 text-sm shadow-sm" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "图谱统计"),
                          createVNode("div", { class: "mt-3 grid grid-cols-2 gap-3 text-base font-semibold" }, [
                            createVNode("div", { class: "rounded-lg border border-border/60 bg-background/60 p-3 text-center" }, [
                              createVNode("p", { class: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground" }, "节点总数"),
                              createVNode("p", { class: "mt-1 text-2xl font-bold" }, toDisplayString(unref(metadata).nodes), 1)
                            ]),
                            createVNode("div", { class: "rounded-lg border border-border/60 bg-background/60 p-3 text-center" }, [
                              createVNode("p", { class: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground" }, "关系条数"),
                              createVNode("p", { class: "mt-1 text-2xl font-bold" }, toDisplayString(unref(metadata).links), 1)
                            ])
                          ])
                        ]),
                        createVNode(_component_Separator, { class: "my-4 opacity-70" }),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "风险分布"),
                          createVNode("div", { class: "mt-3 space-y-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(riskSummary), (stat) => {
                              return openBlock(), createBlock("div", {
                                key: stat.key,
                                class: "flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2"
                              }, [
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  createVNode("span", {
                                    class: "h-2.5 w-2.5 rounded-full",
                                    style: { backgroundColor: stat.color }
                                  }, null, 4),
                                  createVNode("span", { class: "text-xs font-semibold" }, toDisplayString(stat.label), 1)
                                ]),
                                createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(stat.count) + " · " + toDisplayString(stat.percent) + "%", 1)
                              ]);
                            }), 128))
                          ])
                        ]),
                        createVNode(_component_Separator, { class: "my-4 opacity-70" }),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "节点详情"),
                          unref(selectedNode) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "mt-3 space-y-2"
                          }, [
                            createVNode("p", { class: "text-base font-semibold" }, toDisplayString(unref(selectedNode).label), 1),
                            createVNode("div", { class: "text-xs text-muted-foreground" }, [
                              createVNode("p", null, "类型：" + toDisplayString(unref(selectedNode).category || "未分类"), 1),
                              createVNode("p", null, "风险等级：" + toDisplayString(riskLevelLabels[unref(selectedNode).riskLevel] || "未知"), 1)
                            ]),
                            createVNode("div", { class: "mt-3 rounded-lg border border-border/50 bg-background/50 p-3" }, [
                              createVNode("p", { class: "text-[11px] uppercase tracking-[0.3em] text-muted-foreground" }, "关联节点"),
                              createVNode("ul", { class: "mt-2 space-y-1 text-xs text-muted-foreground" }, [
                                !unref(selectedNodeNeighbors).length ? (openBlock(), createBlock("li", { key: 0 }, "暂未发现关联")) : createCommentVNode("", true),
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedNodeNeighbors), (neighbor) => {
                                  return openBlock(), createBlock("li", {
                                    key: neighbor.name,
                                    class: "flex items-center justify-between"
                                  }, [
                                    createVNode("span", { class: "truncate" }, toDisplayString(neighbor.label), 1),
                                    createVNode(_component_Button, {
                                      size: "xs",
                                      variant: "ghost",
                                      class: "text-[11px]",
                                      onClick: ($event) => focusNode(neighbor.name)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("定位")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]);
                                }), 128))
                              ])
                            ])
                          ])) : (openBlock(), createBlock("p", {
                            key: 1,
                            class: "mt-3 text-xs text-muted-foreground"
                          }, "双击任何节点即可快速查看详情"))
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "hidden lg:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" }, [
                      createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-4" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "风险筛选"),
                        createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(riskFilterOptions, (option) => {
                            return createVNode(_component_Button, {
                              key: option.value,
                              size: "sm",
                              variant: unref(riskFilter) === option.value ? "default" : "outline",
                              class: "rounded-full",
                              onClick: ($event) => applyRiskFilter(option.value)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(option.label), 1)
                              ]),
                              _: 2
                            }, 1032, ["variant", "onClick"]);
                          }), 64))
                        ])
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-4" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "布局与互斥"),
                        createVNode("div", { class: "mt-3 space-y-3 text-xs text-muted-foreground" }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("span", null, "节点互斥强度"),
                            createVNode("span", { class: "font-semibold text-foreground" }, toDisplayString(unref(separationStrength)), 1)
                          ]),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => isRef(separationStrength) ? separationStrength.value = $event : null,
                            type: "range",
                            min: "40",
                            max: "100",
                            step: "5",
                            class: "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-black"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              unref(separationStrength),
                              void 0,
                              { number: true }
                            ]
                          ]),
                          createVNode("div", { class: "flex gap-2" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(layoutOptions, (mode) => {
                              return createVNode(_component_Button, {
                                key: mode.value,
                                size: "sm",
                                variant: unref(layoutMode) === mode.value ? "default" : "outline",
                                class: "flex-1",
                                onClick: ($event) => layoutMode.value = mode.value
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(mode.label), 1)
                                ]),
                                _: 2
                              }, 1032, ["variant", "onClick"]);
                            }), 64))
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-4" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "快捷操作"),
                        createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                          createVNode(_component_Button, {
                            size: "sm",
                            variant: "outline",
                            onClick: ($event) => highlightRisk("high")
                          }, {
                            default: withCtx(() => [
                              createTextVNode("聚焦高风险")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(_component_Button, {
                            size: "sm",
                            variant: "outline",
                            onClick: boostSeparation
                          }, {
                            default: withCtx(() => [
                              createTextVNode("增强互斥")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Button, {
                            size: "sm",
                            variant: "outline",
                            onClick: downloadGraphImage
                          }, {
                            default: withCtx(() => [
                              createTextVNode("导出图谱")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Button, {
                            size: "sm",
                            onClick: resetGraphView
                          }, {
                            default: withCtx(() => [
                              createTextVNode("重置视图")
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    unref(searchResults).length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "border border-dashed border-border/60 p-4 text-sm"
                    }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "搜索结果"),
                      createVNode("ul", { class: "mt-2 space-y-1" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(searchResults), (item) => {
                          return openBlock(), createBlock("li", {
                            key: item.id,
                            class: "flex items-center justify-between border-b border-border/40 py-2"
                          }, [
                            createVNode("div", null, [
                              createVNode("p", { class: "font-medium" }, toDisplayString(item.label), 1),
                              createVNode("p", { class: "text-xs text-muted-foreground" }, "类型：" + toDisplayString(item.type), 1)
                            ]),
                            createVNode(_component_Button, {
                              size: "sm",
                              variant: "ghost",
                              onClick: ($event) => focusNode(item.id)
                            }, {
                              default: withCtx(() => [
                                createTextVNode("定位")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CardHeader, null, {
                default: withCtx(() => [
                  createVNode(_component_CardTitle, null, {
                    default: withCtx(() => [
                      createTextVNode("图谱概览")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("实时呈现最新的风险关系网络")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-6" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1.15fr]" }, [
                    createVNode("div", { class: "relative overflow-hidden rounded-2xl" }, [
                      createVNode(_component_ClientOnly, null, {
                        default: withCtx(() => [
                          createVNode(unref(VChart), {
                            ref_key: "chartRef",
                            ref: chartRef,
                            class: "h-[340px] w-full rounded-2xl border border-border/80 bg-background/60 shadow-inner sm:h-[420px]",
                            option: unref(chartOptions),
                            autoresize: ""
                          }, null, 8, ["option"])
                        ]),
                        _: 1
                      }),
                      !unref(visibleGraph).nodes.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-background/70 text-xs text-muted-foreground"
                      }, [
                        createVNode("p", null, "当前筛选条件下暂无可展示的节点"),
                        createVNode("p", null, "可尝试调整过滤或提升互斥力度")
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-5 text-sm shadow-sm" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "图谱统计"),
                        createVNode("div", { class: "mt-3 grid grid-cols-2 gap-3 text-base font-semibold" }, [
                          createVNode("div", { class: "rounded-lg border border-border/60 bg-background/60 p-3 text-center" }, [
                            createVNode("p", { class: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground" }, "节点总数"),
                            createVNode("p", { class: "mt-1 text-2xl font-bold" }, toDisplayString(unref(metadata).nodes), 1)
                          ]),
                          createVNode("div", { class: "rounded-lg border border-border/60 bg-background/60 p-3 text-center" }, [
                            createVNode("p", { class: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground" }, "关系条数"),
                            createVNode("p", { class: "mt-1 text-2xl font-bold" }, toDisplayString(unref(metadata).links), 1)
                          ])
                        ])
                      ]),
                      createVNode(_component_Separator, { class: "my-4 opacity-70" }),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "风险分布"),
                        createVNode("div", { class: "mt-3 space-y-2" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(riskSummary), (stat) => {
                            return openBlock(), createBlock("div", {
                              key: stat.key,
                              class: "flex items-center justify-between rounded-lg border border-border/50 bg-background/40 px-3 py-2"
                            }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("span", {
                                  class: "h-2.5 w-2.5 rounded-full",
                                  style: { backgroundColor: stat.color }
                                }, null, 4),
                                createVNode("span", { class: "text-xs font-semibold" }, toDisplayString(stat.label), 1)
                              ]),
                              createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(stat.count) + " · " + toDisplayString(stat.percent) + "%", 1)
                            ]);
                          }), 128))
                        ])
                      ]),
                      createVNode(_component_Separator, { class: "my-4 opacity-70" }),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "节点详情"),
                        unref(selectedNode) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "mt-3 space-y-2"
                        }, [
                          createVNode("p", { class: "text-base font-semibold" }, toDisplayString(unref(selectedNode).label), 1),
                          createVNode("div", { class: "text-xs text-muted-foreground" }, [
                            createVNode("p", null, "类型：" + toDisplayString(unref(selectedNode).category || "未分类"), 1),
                            createVNode("p", null, "风险等级：" + toDisplayString(riskLevelLabels[unref(selectedNode).riskLevel] || "未知"), 1)
                          ]),
                          createVNode("div", { class: "mt-3 rounded-lg border border-border/50 bg-background/50 p-3" }, [
                            createVNode("p", { class: "text-[11px] uppercase tracking-[0.3em] text-muted-foreground" }, "关联节点"),
                            createVNode("ul", { class: "mt-2 space-y-1 text-xs text-muted-foreground" }, [
                              !unref(selectedNodeNeighbors).length ? (openBlock(), createBlock("li", { key: 0 }, "暂未发现关联")) : createCommentVNode("", true),
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(selectedNodeNeighbors), (neighbor) => {
                                return openBlock(), createBlock("li", {
                                  key: neighbor.name,
                                  class: "flex items-center justify-between"
                                }, [
                                  createVNode("span", { class: "truncate" }, toDisplayString(neighbor.label), 1),
                                  createVNode(_component_Button, {
                                    size: "xs",
                                    variant: "ghost",
                                    class: "text-[11px]",
                                    onClick: ($event) => focusNode(neighbor.name)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("定位")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]);
                              }), 128))
                            ])
                          ])
                        ])) : (openBlock(), createBlock("p", {
                          key: 1,
                          class: "mt-3 text-xs text-muted-foreground"
                        }, "双击任何节点即可快速查看详情"))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "hidden lg:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" }, [
                    createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-4" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "风险筛选"),
                      createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(riskFilterOptions, (option) => {
                          return createVNode(_component_Button, {
                            key: option.value,
                            size: "sm",
                            variant: unref(riskFilter) === option.value ? "default" : "outline",
                            class: "rounded-full",
                            onClick: ($event) => applyRiskFilter(option.value)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(option.label), 1)
                            ]),
                            _: 2
                          }, 1032, ["variant", "onClick"]);
                        }), 64))
                      ])
                    ]),
                    createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-4" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "布局与互斥"),
                      createVNode("div", { class: "mt-3 space-y-3 text-xs text-muted-foreground" }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("span", null, "节点互斥强度"),
                          createVNode("span", { class: "font-semibold text-foreground" }, toDisplayString(unref(separationStrength)), 1)
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => isRef(separationStrength) ? separationStrength.value = $event : null,
                          type: "range",
                          min: "40",
                          max: "100",
                          step: "5",
                          class: "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-black"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            unref(separationStrength),
                            void 0,
                            { number: true }
                          ]
                        ]),
                        createVNode("div", { class: "flex gap-2" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(layoutOptions, (mode) => {
                            return createVNode(_component_Button, {
                              key: mode.value,
                              size: "sm",
                              variant: unref(layoutMode) === mode.value ? "default" : "outline",
                              class: "flex-1",
                              onClick: ($event) => layoutMode.value = mode.value
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(mode.label), 1)
                              ]),
                              _: 2
                            }, 1032, ["variant", "onClick"]);
                          }), 64))
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "rounded-2xl border border-border/70 bg-card/80 p-4" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "快捷操作"),
                      createVNode("div", { class: "mt-3 flex flex-wrap gap-2" }, [
                        createVNode(_component_Button, {
                          size: "sm",
                          variant: "outline",
                          onClick: ($event) => highlightRisk("high")
                        }, {
                          default: withCtx(() => [
                            createTextVNode("聚焦高风险")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(_component_Button, {
                          size: "sm",
                          variant: "outline",
                          onClick: boostSeparation
                        }, {
                          default: withCtx(() => [
                            createTextVNode("增强互斥")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Button, {
                          size: "sm",
                          variant: "outline",
                          onClick: downloadGraphImage
                        }, {
                          default: withCtx(() => [
                            createTextVNode("导出图谱")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Button, {
                          size: "sm",
                          onClick: resetGraphView
                        }, {
                          default: withCtx(() => [
                            createTextVNode("重置视图")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  unref(searchResults).length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "border border-dashed border-border/60 p-4 text-sm"
                  }, [
                    createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "搜索结果"),
                    createVNode("ul", { class: "mt-2 space-y-1" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(searchResults), (item) => {
                        return openBlock(), createBlock("li", {
                          key: item.id,
                          class: "flex items-center justify-between border-b border-border/40 py-2"
                        }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium" }, toDisplayString(item.label), 1),
                            createVNode("p", { class: "text-xs text-muted-foreground" }, "类型：" + toDisplayString(item.type), 1)
                          ]),
                          createVNode(_component_Button, {
                            size: "sm",
                            variant: "ghost",
                            onClick: ($event) => focusNode(item.id)
                          }, {
                            default: withCtx(() => [
                              createTextVNode("定位")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(mobileFiltersOpen)) {
        _push(`<div class="fixed inset-0 z-40 flex flex-col bg-background/70 backdrop-blur-sm sm:hidden"><div class="flex-1 bg-black/40"></div><div class="rounded-t-3xl border border-border/70 bg-card p-6 shadow-2xl"><div class="flex items-center justify-between"><p class="text-sm font-semibold text-muted-foreground">筛选与布局</p>`);
        _push(ssrRenderComponent(_component_Button, {
          variant: "ghost",
          size: "sm",
          onClick: closeMobileFilters
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`关闭`);
            } else {
              return [
                createTextVNode("关闭")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-4 space-y-5 text-sm"><div><p class="text-xs uppercase tracking-widest text-muted-foreground">风险筛选</p><div class="mt-3 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(riskFilterOptions, (option) => {
          _push(ssrRenderComponent(_component_Button, {
            key: option.value,
            size: "sm",
            variant: unref(riskFilter) === option.value ? "default" : "outline",
            class: "rounded-full",
            onClick: ($event) => applyRiskFilter(option.value)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(option.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(option.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div><div><p class="text-xs uppercase tracking-widest text-muted-foreground">节点互斥强度</p><div class="mt-3 space-y-3"><div class="flex items-center justify-between"><span class="text-xs text-muted-foreground">当前值</span><span class="font-semibold text-foreground">${ssrInterpolate(unref(separationStrength))}</span></div><input${ssrRenderAttr("value", unref(separationStrength))} type="range" min="40" max="100" step="5" class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-black"></div></div><div><p class="text-xs uppercase tracking-widest text-muted-foreground">布局模式</p><div class="mt-3 flex gap-2"><!--[-->`);
        ssrRenderList(layoutOptions, (mode) => {
          _push(ssrRenderComponent(_component_Button, {
            key: mode.value,
            size: "sm",
            variant: unref(layoutMode) === mode.value ? "default" : "outline",
            class: "flex-1",
            onClick: ($event) => layoutMode.value = mode.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(mode.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(mode.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div><div><p class="text-xs uppercase tracking-widest text-muted-foreground">快捷操作</p><div class="mt-3 flex flex-wrap gap-2">`);
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          variant: "outline",
          class: "flex-1",
          onClick: ($event) => highlightRisk("high")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`聚焦高风险`);
            } else {
              return [
                createTextVNode("聚焦高风险")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          variant: "outline",
          class: "flex-1",
          onClick: boostSeparation
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`增强互斥`);
            } else {
              return [
                createTextVNode("增强互斥")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          variant: "outline",
          class: "flex-1",
          onClick: downloadGraphImage
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`导出图谱`);
            } else {
              return [
                createTextVNode("导出图谱")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Button, {
          size: "sm",
          class: "flex-1",
          onClick: resetGraphView
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`重置视图`);
            } else {
              return [
                createTextVNode("重置视图")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
        _push(ssrRenderComponent(_component_Button, {
          class: "mt-5 w-full",
          onClick: closeMobileFilters
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`完成`);
            } else {
              return [
                createTextVNode("完成")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/graph.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=graph-TEkp-2xc.js.map
