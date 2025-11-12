import { defineComponent, mergeProps, unref, useSSRContext, ref, watch, computed, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, createTextVNode, renderSlot } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
import { _ as __nuxt_component_0 } from "./nuxt-link-p1nvN146.js";
import { u as useState, _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$3 } from "./button-BNulVDON.js";
import { a as useNuxtApp, u as useAuthStore, d as useRoute, n as navigateTo, _ as _export_sfc } from "../server.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ufo/dist/index.mjs";
import "@iconify/vue/dist/offline";
import "@iconify/vue";
import "./index-DmHgaGw0.js";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/defu/dist/defu.mjs";
import "clsx";
import "tailwind-merge";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/unctx/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/radix3/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/destr/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ohash/dist/index.mjs";
import "axios";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ThemeToggle",
  __ssrInlineRender: true,
  setup(__props) {
    const isDark = useState("mvp-theme", () => false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      _push(`<button${ssrRenderAttrs(mergeProps({ class: "flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-semibold transition hover:bg-secondary" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: unref(isDark) ? "lucide:moon" : "lucide:sun",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`</button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/ThemeToggle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
function useNotifications() {
  const { $api } = useNuxtApp();
  const auth = useAuthStore();
  const unreadCount = ref(0);
  let pollingTimer = null;
  async function fetchUnreadCount() {
    if (!auth.isAuthenticated) return;
    try {
      const { data } = await $api.get("/notifications/unread-count/");
      unreadCount.value = data.unread_count;
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  }
  function startPolling(interval = 6e4) {
    if (pollingTimer) {
      stopPolling();
    }
    pollingTimer = setInterval();
  }
  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }
  watch(() => auth.isAuthenticated, (isAuth) => {
    if (isAuth) {
      fetchUnreadCount();
      startPolling();
    } else {
      unreadCount.value = 0;
      stopPolling();
    }
  });
  return {
    unreadCount,
    fetchUnreadCount
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppShell",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const drawerOpen = ref(false);
    const auth = useAuthStore();
    const logoutLoading = ref(false);
    const { unreadCount } = useNotifications();
    const navItems = [
      { label: "概览", to: "/", icon: "lucide:layout-dashboard" },
      { label: "社区广场", to: "/community", icon: "lucide:users-round" },
      { label: "消息中心", to: "/notifications", icon: "lucide:bell" },
      { label: "知识测验", to: "/quiz", icon: "lucide:badge-check" },
      { label: "AI 场景模拟", to: "/simulation", icon: "lucide:bot" },
      { label: "知识图谱", to: "/graph", icon: "lucide:share-2" },
      { label: "个人主页", to: "/profile", icon: "lucide:user-round" }
    ];
    const isActive = (path) => {
      if (path === "/") {
        return route.path === "/";
      }
      return route.path.startsWith(path);
    };
    const userDisplayName = computed(() => auth.user?.nickname || auth.user?.username || "访客");
    const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const handleMobileAuthAction = () => {
      drawerOpen.value = false;
      handleAuthAction();
    };
    const handleAuthAction = async () => {
      if (!auth.isAuthenticated) {
        navigateTo("/login");
        return;
      }
      if (logoutLoading.value) return;
      logoutLoading.value = true;
      try {
        await auth.logout();
        navigateTo("/login");
      } finally {
        logoutLoading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_Button = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-background text-foreground min-h-screen md:grid md:grid-cols-[240px_1fr] md:items-start" }, _attrs))} data-v-bb8fb9a5><aside class="hidden md:flex md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto flex-col border-r border-border px-6 py-8 gap-8" data-v-bb8fb9a5><div data-v-bb8fb9a5><p class="text-sm uppercase tracking-[0.3em] text-muted-foreground" data-v-bb8fb9a5>VirifySpring</p><p class="text-lg font-semibold" data-v-bb8fb9a5>澄源</p></div><nav class="space-y-1" data-v-bb8fb9a5><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["flex items-center justify-between rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition hover:border-border hover:bg-secondary", isActive(item.to) ? "bg-secondary border-border text-foreground" : "text-muted-foreground"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center gap-2" data-v-bb8fb9a5${_scopeId}><span data-v-bb8fb9a5${_scopeId}>${ssrInterpolate(item.label)}</span>`);
              if (item.label === "消息中心" && unref(unreadCount) > 0) {
                _push2(`<span class="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-v-bb8fb9a5${_scopeId}>${ssrInterpolate(unref(unreadCount))}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: item.icon,
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "flex items-center gap-2" }, [
                  createVNode("span", null, toDisplayString(item.label), 1),
                  item.label === "消息中心" && unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  }, toDisplayString(unref(unreadCount)), 1)) : createCommentVNode("", true)
                ]),
                createVNode(_component_Icon, {
                  name: item.icon,
                  class: "h-4 w-4"
                }, null, 8, ["name"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="rounded-xl border border-border/70 bg-secondary/30 p-4 text-sm" data-v-bb8fb9a5><div class="flex items-start justify-between" data-v-bb8fb9a5><div data-v-bb8fb9a5><p class="text-xs uppercase tracking-wide text-muted-foreground" data-v-bb8fb9a5>登录状态</p><p class="mt-1 text-base font-semibold" data-v-bb8fb9a5>${ssrInterpolate(unref(userDisplayName))}</p></div><span class="${ssrRenderClass([unref(auth).isAuthenticated ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground", "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"])}" data-v-bb8fb9a5>${ssrInterpolate(unref(auth).isAuthenticated ? "在线" : "未登录")}</span></div><p class="mt-3 text-xs text-muted-foreground" data-v-bb8fb9a5>${ssrInterpolate(unref(auth).isAuthenticated ? "已连接至反诈风控系统，可直接使用所有功能。" : "访问受限，请先完成登录。")}</p>`);
      _push(ssrRenderComponent(_component_Button, {
        class: "mt-4 w-full justify-center gap-2",
        variant: "outline",
        size: "sm",
        disabled: unref(logoutLoading),
        onClick: handleAuthAction
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: unref(auth).isAuthenticated ? "lucide:log-out" : "lucide:log-in",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(unref(auth).isAuthenticated ? unref(logoutLoading) ? "正在退出" : "退出登录" : "前往登录")}`);
          } else {
            return [
              createVNode(_component_Icon, {
                name: unref(auth).isAuthenticated ? "lucide:log-out" : "lucide:log-in",
                class: "h-4 w-4"
              }, null, 8, ["name"]),
              createTextVNode(" " + toDisplayString(unref(auth).isAuthenticated ? unref(logoutLoading) ? "正在退出" : "退出登录" : "前往登录"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-auto text-xs text-muted-foreground" data-v-bb8fb9a5><p class="mt-1" data-v-bb8fb9a5>${ssrInterpolate(unref(today))}</p></div></aside><div class="flex flex-col min-h-screen" data-v-bb8fb9a5><header class="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden" data-v-bb8fb9a5><button class="text-sm font-semibold" data-v-bb8fb9a5> 菜单 </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "font-semibold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`澄源反诈平台`);
          } else {
            return [
              createTextVNode("澄源反诈平台")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-2" data-v-bb8fb9a5>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/notifications",
        class: "relative"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:bell",
              class: "h-5 w-5"
            }, null, _parent2, _scopeId));
            if (unref(unreadCount) > 0) {
              _push2(`<span class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center" data-v-bb8fb9a5${_scopeId}>${ssrInterpolate(unref(unreadCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:bell",
                class: "h-5 w-5"
              }),
              unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center"
              }, toDisplayString(unref(unreadCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div></header>`);
      if (unref(drawerOpen)) {
        _push(`<div class="md:hidden border-b border-border bg-background px-4 py-4 space-y-4" data-v-bb8fb9a5><nav class="space-y-1" data-v-bb8fb9a5><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.to,
            to: item.to,
            class: ["flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium", isActive(item.to) ? "bg-secondary text-foreground" : "text-muted-foreground"],
            onClick: ($event) => drawerOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span data-v-bb8fb9a5${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                if (item.label === "消息中心" && unref(unreadCount) > 0) {
                  _push2(`<span class="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center" data-v-bb8fb9a5${_scopeId}>${ssrInterpolate(unref(unreadCount))}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("span", null, toDisplayString(item.label), 1),
                  item.label === "消息中心" && unref(unreadCount) > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  }, toDisplayString(unref(unreadCount)), 1)) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></nav><div class="rounded-lg border border-border/80 p-3 text-sm" data-v-bb8fb9a5><p class="text-xs text-muted-foreground" data-v-bb8fb9a5>当前状态</p><div class="mt-1 flex items-center justify-between" data-v-bb8fb9a5><span class="font-medium" data-v-bb8fb9a5>${ssrInterpolate(unref(userDisplayName))}</span><span class="text-xs text-muted-foreground" data-v-bb8fb9a5>${ssrInterpolate(unref(auth).isAuthenticated ? "在线" : "未登录")}</span></div>`);
        _push(ssrRenderComponent(_component_Button, {
          class: "mt-3 w-full justify-center gap-2",
          size: "sm",
          variant: "outline",
          disabled: unref(logoutLoading),
          onClick: handleMobileAuthAction
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: unref(auth).isAuthenticated ? "lucide:log-out" : "lucide:log-in",
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(auth).isAuthenticated ? unref(logoutLoading) ? "正在退出" : "退出登录" : "前往登录")}`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: unref(auth).isAuthenticated ? "lucide:log-out" : "lucide:log-in",
                  class: "h-4 w-4"
                }, null, 8, ["name"]),
                createTextVNode(" " + toDisplayString(unref(auth).isAuthenticated ? unref(logoutLoading) ? "正在退出" : "退出登录" : "前往登录"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="flex-1 px-4 py-6 md:px-10" data-v-bb8fb9a5>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppShell.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppShell = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-bb8fb9a5"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppShell, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=default-BC-pg7nt.js.map
