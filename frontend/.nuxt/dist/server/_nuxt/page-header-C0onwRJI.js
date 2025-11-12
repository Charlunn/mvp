import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "page-header",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    eyebrow: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between" }, _attrs))}><div class="space-y-2">`);
      if (props.eyebrow) {
        _push(`<p class="text-sm font-medium uppercase tracking-wide text-primary/80">${ssrInterpolate(props.eyebrow)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">${ssrInterpolate(props.title)}</h1>`);
      if (props.description) {
        _push(`<p class="max-w-2xl text-base text-muted-foreground">${ssrInterpolate(props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (_ctx.$slots.actions) {
        _push(`<div class="flex flex-col gap-2 sm:flex-row">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/page-header.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=page-header-C0onwRJI.js.map
