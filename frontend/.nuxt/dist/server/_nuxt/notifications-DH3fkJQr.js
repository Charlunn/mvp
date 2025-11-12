import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { a as useNuxtApp } from "../server.mjs";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notifications",
  __ssrInlineRender: true,
  setup(__props) {
    const { $api } = useNuxtApp();
    const notifications = ref([]);
    const loading = ref(true);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto p-4" }, _attrs))}><h1 class="text-2xl font-bold mb-4">消息中心</h1>`);
      if (loading.value) {
        _push(`<div class="text-center">加载中...</div>`);
      } else if (error.value) {
        _push(`<div class="text-center text-red-500">加载失败</div>`);
      } else if (notifications.value.length === 0) {
        _push(`<div class="text-center text-gray-500">暂无消息</div>`);
      } else {
        _push(`<div><!--[-->`);
        ssrRenderList(notifications.value, (notification) => {
          _push(`<div class="${ssrRenderClass([{ "bg-gray-100 dark:bg-gray-800": notification.is_read }, "p-4 mb-4 border rounded-lg cursor-pointer"])}"><p><strong>${ssrInterpolate(notification.sender.nickname || notification.sender.username)}</strong> 在帖子 <strong>${ssrInterpolate(notification.post.title)}</strong> 中回复了你: </p><p class="text-gray-600 dark:text-gray-300">${ssrInterpolate(notification.comment.body)}</p><small class="text-gray-400">${ssrInterpolate(new Date(notification.created_at).toLocaleString())}</small></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=notifications-DH3fkJQr.js.map
