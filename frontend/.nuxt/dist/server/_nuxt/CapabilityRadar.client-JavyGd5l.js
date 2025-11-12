import { b as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttrs } from "vue/server-renderer";
import { use } from "echarts/core";
import { RadarChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CapabilityRadar.client",
  __ssrInlineRender: true,
  props: {
    profile: {},
    height: {}
  },
  setup(__props) {
    use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer]);
    const props = __props;
    const capabilityDimensions = [
      { key: "risk_discernment", label: "风险识别" },
      { key: "info_protection", label: "信息保护" },
      { key: "response_speed", label: "响应速度" },
      { key: "emotional_control", label: "情绪稳定" },
      { key: "verification_skill", label: "核验能力" }
    ];
    const option = computed(() => {
      if (!props.profile) return null;
      const indicators = capabilityDimensions.map((item) => ({
        name: item.label,
        max: 100
      }));
      const values = capabilityDimensions.map((item) => props.profile?.[item.key] ?? 0);
      return {
        tooltip: {},
        radar: {
          indicator: indicators,
          splitArea: { areaStyle: { color: ["rgba(15,15,15,0.04)", "transparent"] } },
          axisName: { color: "#6b7280" }
        },
        series: [
          {
            type: "radar",
            symbol: "circle",
            symbolSize: 4,
            lineStyle: { color: "#0f0f0f" },
            areaStyle: { color: "rgba(15,15,15,0.15)" },
            data: [{ value: values }]
          }
        ]
      };
    });
    computed(() => props.height || "240px");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      if (option.value) {
        _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full items-center justify-center text-xs text-muted-foreground" }, _attrs))}> 暂无能力画像 </div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/simulation/CapabilityRadar.client.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=CapabilityRadar.client-JavyGd5l.js.map
