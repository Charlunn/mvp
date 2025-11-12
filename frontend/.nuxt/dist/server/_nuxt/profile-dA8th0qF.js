import { _ as _sfc_main$5 } from "./page-header-C0onwRJI.js";
import { _ as _sfc_main$6, a as _sfc_main$7, b as _sfc_main$8, c as _sfc_main$9, d as _sfc_main$a } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$b } from "./label-s03MuIA6.js";
import { _ as _sfc_main$c } from "./input-DmJdLXAM.js";
import { c as cn, _ as _sfc_main$d } from "./button-BNulVDON.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { u as useAuthStore, a as useNuxtApp, n as navigateTo } from "../server.mjs";
import { defineComponent, provide, mergeProps, useSSRContext, inject, unref, ref, reactive, computed, withCtx, createTextVNode, toDisplayString, createVNode, withModifiers, withDirectives, vModelSelect, vModelCheckbox, createBlock, openBlock, Fragment, renderList, createCommentVNode } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { useVModel } from "@vueuse/core";
import { _ as _sfc_main$e } from "./CapabilityRadar.client-JavyGd5l.js";
import { u as useStatsSync } from "./useStatsSync-DwhmJN9P.js";
import "clsx";
import "tailwind-merge";
import "@iconify/vue/dist/offline";
import "@iconify/vue";
import "./index-DmHgaGw0.js";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/defu/dist/defu.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/unctx/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/radix3/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ufo/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/destr/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ohash/dist/index.mjs";
import "axios";
import "echarts/core";
import "echarts/charts";
import "echarts/components";
import "echarts/renderers";
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Tabs",
  __ssrInlineRender: true,
  props: {
    defaultValue: {},
    modelValue: {},
    orientation: {},
    dir: {},
    activationMode: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      passive: true,
      defaultValue: props.defaultValue
    });
    provide("TabsContext", {
      modelValue,
      orientation: props.orientation ?? "horizontal",
      dir: props.dir ?? "ltr",
      activationMode: props.activationMode ?? "automatic"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ "data-orientation": __props.orientation }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/Tabs.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "TabsContent",
  __ssrInlineRender: true,
  props: {
    value: {}
  },
  setup(__props) {
    const props = __props;
    const context = inject("TabsContext");
    const isActive = () => context.modelValue.value === props.value;
    return (_ctx, _push, _parent, _attrs) => {
      if (isActive()) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/TabsContent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TabsList",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground")
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/TabsList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TabsTrigger",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const context = inject("TabsContext");
    const isActive = () => context.modelValue.value === props.value;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        "data-state": isActive() ? "active" : "inactive",
        disabled: __props.disabled,
        class: unref(cn)(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/tabs/TabsTrigger.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const { $api } = useNuxtApp();
    const { userStats } = useStatsSync();
    const profileLoading = ref(false);
    const latestSimulation = ref(null);
    const profileForm = reactive({
      nickname: "",
      email: "",
      phone_number: "",
      profile_visibility: "public",
      show_email: false,
      show_phone: false
    });
    const communityStats = ref({
      posts_published: 0,
      comments_written: 0,
      post_likes_received: 0,
      comment_likes_received: 0
    });
    const myPosts = ref([]);
    const myPostsLoading = ref(false);
    const postsPage = ref(1);
    const hasMorePosts = ref(false);
    const defaultStats = {
      quiz_attempts_count: 0,
      average_score: 0,
      best_score: 0,
      last_attempt: null
    };
    const stats = computed(() => userStats.value ?? defaultStats);
    const userInitials = computed(() => (profileForm.nickname || auth.user?.nickname || auth.user?.username || "U").trim().slice(0, 2));
    const accountRoleLabel = computed(() => auth.isAdmin ? "系统管理员" : "实战学员");
    const accountHighlights = computed(() => [
      { label: "当前身份", value: accountRoleLabel.value, icon: "lucide:user-check" },
      { label: "测验段位", value: "初级训练", icon: "lucide:activity" },
      { label: "安全邮箱", value: profileForm.email || "未填写", icon: "lucide:mail" }
    ]);
    const simulationRadarProfile = computed(() => latestSimulation.value?.capabilityProfile ?? null);
    const securityScore = computed(() => {
      let score = 40;
      if (profileForm.email) score += 20;
      if (profileForm.phone_number) score += 20;
      if (stats.value.quiz_attempts_count > 0) score += 20;
      return Math.min(score, 100);
    });
    const securityTasks = computed(() => [
      { label: "绑定邮箱", hint: "用于找回密码与接收安全预警", done: Boolean(profileForm.email) },
      { label: "绑定手机号", hint: "可启用二次验证与短信提醒", done: Boolean(profileForm.phone_number) },
      { label: "完成测验", hint: "最近 30 天至少完成 1 次", done: stats.value.quiz_attempts_count > 0 }
    ]);
    const growthTips = computed(() => {
      const tips = [];
      if ((stats.value.average_score || 0) < 70) tips.push("平均得分低于 70 分，建议复习课程。");
      if (!profileForm.phone_number) tips.push("尚未绑定手机号，建议绑定以提高安全性。");
      if (!stats.value.last_attempt) tips.push("缺少测验记录，建议完成一次测验。");
      if (!tips.length) tips.push("保持当前训练频率，挑战更高难度。");
      return tips;
    });
    const activityFeed = computed(() => {
      const feed = [];
      if (stats.value.last_attempt) {
        feed.push({
          title: `完成测验`,
          time: new Date(stats.value.last_attempt.created_at).toLocaleString("zh-CN"),
          status: "success"
        });
      }
      if (profileForm.email) {
        feed.push({ title: "邮箱已绑定", time: "实时生效", status: "success" });
      }
      return feed;
    });
    const saveProfile = async () => {
      profileLoading.value = true;
      try {
        await $api.put("/users/profile/", profileForm);
        (void 0).alert("资料已更新");
      } catch (error) {
        console.error("保存资料失败", error);
        (void 0).alert("保存失败，请稍后再试");
      } finally {
        profileLoading.value = false;
      }
    };
    const fetchMyPosts = async (loadMore = false) => {
      if (!auth.user?.username) return;
      myPostsLoading.value = true;
      const pageToFetch = loadMore ? postsPage.value + 1 : 1;
      try {
        const { data } = await $api.get("/community/posts/", {
          params: { author: auth.user.username, page: pageToFetch }
        });
        const results = data.results || [];
        if (loadMore) {
          myPosts.value.push(...results);
        } else {
          myPosts.value = results;
        }
        hasMorePosts.value = Boolean(data.next);
        postsPage.value = pageToFetch;
      } catch (error) {
        console.warn("加载个人帖子失败", error);
      } finally {
        myPostsLoading.value = false;
      }
    };
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("zh-CN");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$5;
      const _component_Card = _sfc_main$6;
      const _component_CardHeader = _sfc_main$7;
      const _component_CardTitle = _sfc_main$8;
      const _component_CardDescription = _sfc_main$9;
      const _component_CardContent = _sfc_main$a;
      const _component_Label = _sfc_main$b;
      const _component_Input = _sfc_main$c;
      const _component_Button = _sfc_main$d;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "用户主页",
        description: "掌握账号安全、训练表现与个人资料"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "border-border/70 bg-secondary/40" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, { class: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center gap-4"${_scopeId2}><div class="flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl font-semibold"${_scopeId2}>${ssrInterpolate(userInitials.value)}</div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_CardTitle, { class: "text-2xl" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(profileForm.nickname || unref(auth).user?.nickname || unref(auth).user?.username)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(profileForm.nickname || unref(auth).user?.nickname || unref(auth).user?.username), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`澄源反诈 · ${ssrInterpolate(accountRoleLabel.value)}`);
                      } else {
                        return [
                          createTextVNode("澄源反诈 · " + toDisplayString(accountRoleLabel.value), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div><div class="text-sm"${_scopeId2}><p class="text-muted-foreground"${_scopeId2}>安全指数</p><div class="relative mt-2 h-2 w-48 rounded-full bg-border"${_scopeId2}><span class="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all" style="${ssrRenderStyle({ width: securityScore.value + "%" })}"${_scopeId2}></span></div><p class="mt-1 text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(securityScore.value)} / 100</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      createVNode("div", { class: "flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl font-semibold" }, toDisplayString(userInitials.value), 1),
                      createVNode("div", null, [
                        createVNode(_component_CardTitle, { class: "text-2xl" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(profileForm.nickname || unref(auth).user?.nickname || unref(auth).user?.username), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("澄源反诈 · " + toDisplayString(accountRoleLabel.value), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    createVNode("div", { class: "text-sm" }, [
                      createVNode("p", { class: "text-muted-foreground" }, "安全指数"),
                      createVNode("div", { class: "relative mt-2 h-2 w-48 rounded-full bg-border" }, [
                        createVNode("span", {
                          class: "absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all",
                          style: { width: securityScore.value + "%" }
                        }, null, 4)
                      ]),
                      createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(securityScore.value) + " / 100", 1)
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CardHeader, { class: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex items-center gap-4" }, [
                    createVNode("div", { class: "flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl font-semibold" }, toDisplayString(userInitials.value), 1),
                    createVNode("div", null, [
                      createVNode(_component_CardTitle, { class: "text-2xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(profileForm.nickname || unref(auth).user?.nickname || unref(auth).user?.username), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("澄源反诈 · " + toDisplayString(accountRoleLabel.value), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  createVNode("div", { class: "text-sm" }, [
                    createVNode("p", { class: "text-muted-foreground" }, "安全指数"),
                    createVNode("div", { class: "relative mt-2 h-2 w-48 rounded-full bg-border" }, [
                      createVNode("span", {
                        class: "absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all",
                        style: { width: securityScore.value + "%" }
                      }, null, 4)
                    ]),
                    createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(securityScore.value) + " / 100", 1)
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$4), {
        "default-value": "profile",
        class: "w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "grid w-full grid-cols-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$1), { value: "profile" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`个人资料`);
                      } else {
                        return [
                          createTextVNode("个人资料")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$1), { value: "community" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`社区动态`);
                      } else {
                        return [
                          createTextVNode("社区动态")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$1), { value: "training" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`训练报告`);
                      } else {
                        return [
                          createTextVNode("训练报告")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$1), { value: "profile" }, {
                      default: withCtx(() => [
                        createTextVNode("个人资料")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$1), { value: "community" }, {
                      default: withCtx(() => [
                        createTextVNode("社区动态")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$1), { value: "training" }, {
                      default: withCtx(() => [
                        createTextVNode("训练报告")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              value: "profile",
              class: "mt-6"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 gap-6 lg:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`基本信息`);
                                  } else {
                                    return [
                                      createTextVNode("基本信息")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`更新昵称、联系方式，保持账号可恢复`);
                                  } else {
                                    return [
                                      createTextVNode("更新昵称、联系方式，保持账号可恢复")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("基本信息")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("更新昵称、联系方式，保持账号可恢复")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<form class="space-y-4"${_scopeId4}><div class="grid gap-4 md:grid-cols-2"${_scopeId4}><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_Label, { for: "nickname" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`昵称`);
                                  } else {
                                    return [
                                      createTextVNode("昵称")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_Input, {
                                id: "nickname",
                                modelValue: profileForm.nickname,
                                "onUpdate:modelValue": ($event) => profileForm.nickname = $event
                              }, null, _parent5, _scopeId4));
                              _push5(`</div><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_Label, { for: "username" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`账号`);
                                  } else {
                                    return [
                                      createTextVNode("账号")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_Input, {
                                id: "username",
                                value: unref(auth).user?.username,
                                disabled: ""
                              }, null, _parent5, _scopeId4));
                              _push5(`</div></div><div class="grid gap-4 md:grid-cols-2"${_scopeId4}><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_Label, { for: "email" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`邮箱`);
                                  } else {
                                    return [
                                      createTextVNode("邮箱")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_Input, {
                                id: "email",
                                modelValue: profileForm.email,
                                "onUpdate:modelValue": ($event) => profileForm.email = $event,
                                type: "email"
                              }, null, _parent5, _scopeId4));
                              _push5(`</div><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_Label, { for: "phone" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`手机号`);
                                  } else {
                                    return [
                                      createTextVNode("手机号")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_Input, {
                                id: "phone",
                                modelValue: profileForm.phone_number,
                                "onUpdate:modelValue": ($event) => profileForm.phone_number = $event
                              }, null, _parent5, _scopeId4));
                              _push5(`</div></div><div class="grid gap-4 md:grid-cols-2"${_scopeId4}><div${_scopeId4}>`);
                              _push5(ssrRenderComponent(_component_Label, { for: "visibility" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`主页可见性`);
                                  } else {
                                    return [
                                      createTextVNode("主页可见性")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<select class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"${_scopeId4}><option value="public"${ssrIncludeBooleanAttr(Array.isArray(profileForm.profile_visibility) ? ssrLooseContain(profileForm.profile_visibility, "public") : ssrLooseEqual(profileForm.profile_visibility, "public")) ? " selected" : ""}${_scopeId4}>公开</option><option value="private"${ssrIncludeBooleanAttr(Array.isArray(profileForm.profile_visibility) ? ssrLooseContain(profileForm.profile_visibility, "private") : ssrLooseEqual(profileForm.profile_visibility, "private")) ? " selected" : ""}${_scopeId4}>私密</option></select></div><div class="space-y-2 rounded-lg border border-dashed border-border/60 p-3"${_scopeId4}><label class="flex items-center gap-2 text-xs"${_scopeId4}><input${ssrIncludeBooleanAttr(Array.isArray(profileForm.show_email) ? ssrLooseContain(profileForm.show_email, null) : profileForm.show_email) ? " checked" : ""} type="checkbox"${_scopeId4}>公开邮箱</label><label class="flex items-center gap-2 text-xs"${_scopeId4}><input${ssrIncludeBooleanAttr(Array.isArray(profileForm.show_phone) ? ssrLooseContain(profileForm.show_phone, null) : profileForm.show_phone) ? " checked" : ""} type="checkbox"${_scopeId4}>公开手机号</label></div></div>`);
                              _push5(ssrRenderComponent(_component_Button, {
                                type: "submit",
                                class: "w-full",
                                disabled: profileLoading.value
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(profileLoading.value ? "保存中..." : "保存资料")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(profileLoading.value ? "保存中..." : "保存资料"), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</form>`);
                            } else {
                              return [
                                createVNode("form", {
                                  class: "space-y-4",
                                  onSubmit: withModifiers(saveProfile, ["prevent"])
                                }, [
                                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                    createVNode("div", null, [
                                      createVNode(_component_Label, { for: "nickname" }, {
                                        default: withCtx(() => [
                                          createTextVNode("昵称")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_Input, {
                                        id: "nickname",
                                        modelValue: profileForm.nickname,
                                        "onUpdate:modelValue": ($event) => profileForm.nickname = $event
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode(_component_Label, { for: "username" }, {
                                        default: withCtx(() => [
                                          createTextVNode("账号")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_Input, {
                                        id: "username",
                                        value: unref(auth).user?.username,
                                        disabled: ""
                                      }, null, 8, ["value"])
                                    ])
                                  ]),
                                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                    createVNode("div", null, [
                                      createVNode(_component_Label, { for: "email" }, {
                                        default: withCtx(() => [
                                          createTextVNode("邮箱")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_Input, {
                                        id: "email",
                                        modelValue: profileForm.email,
                                        "onUpdate:modelValue": ($event) => profileForm.email = $event,
                                        type: "email"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    createVNode("div", null, [
                                      createVNode(_component_Label, { for: "phone" }, {
                                        default: withCtx(() => [
                                          createTextVNode("手机号")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_Input, {
                                        id: "phone",
                                        modelValue: profileForm.phone_number,
                                        "onUpdate:modelValue": ($event) => profileForm.phone_number = $event
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ])
                                  ]),
                                  createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                    createVNode("div", null, [
                                      createVNode(_component_Label, { for: "visibility" }, {
                                        default: withCtx(() => [
                                          createTextVNode("主页可见性")
                                        ]),
                                        _: 1
                                      }),
                                      withDirectives(createVNode("select", {
                                        "onUpdate:modelValue": ($event) => profileForm.profile_visibility = $event,
                                        class: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                      }, [
                                        createVNode("option", { value: "public" }, "公开"),
                                        createVNode("option", { value: "private" }, "私密")
                                      ], 8, ["onUpdate:modelValue"]), [
                                        [vModelSelect, profileForm.profile_visibility]
                                      ])
                                    ]),
                                    createVNode("div", { class: "space-y-2 rounded-lg border border-dashed border-border/60 p-3" }, [
                                      createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                        withDirectives(createVNode("input", {
                                          "onUpdate:modelValue": ($event) => profileForm.show_email = $event,
                                          type: "checkbox"
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelCheckbox, profileForm.show_email]
                                        ]),
                                        createTextVNode("公开邮箱")
                                      ]),
                                      createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                        withDirectives(createVNode("input", {
                                          "onUpdate:modelValue": ($event) => profileForm.show_phone = $event,
                                          type: "checkbox"
                                        }, null, 8, ["onUpdate:modelValue"]), [
                                          [vModelCheckbox, profileForm.show_phone]
                                        ]),
                                        createTextVNode("公开手机号")
                                      ])
                                    ])
                                  ]),
                                  createVNode(_component_Button, {
                                    type: "submit",
                                    class: "w-full",
                                    disabled: profileLoading.value
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(profileLoading.value ? "保存中..." : "保存资料"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ], 32)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("基本信息")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("更新昵称、联系方式，保持账号可恢复")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              createVNode("form", {
                                class: "space-y-4",
                                onSubmit: withModifiers(saveProfile, ["prevent"])
                              }, [
                                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "nickname" }, {
                                      default: withCtx(() => [
                                        createTextVNode("昵称")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "nickname",
                                      modelValue: profileForm.nickname,
                                      "onUpdate:modelValue": ($event) => profileForm.nickname = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "username" }, {
                                      default: withCtx(() => [
                                        createTextVNode("账号")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "username",
                                      value: unref(auth).user?.username,
                                      disabled: ""
                                    }, null, 8, ["value"])
                                  ])
                                ]),
                                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "email" }, {
                                      default: withCtx(() => [
                                        createTextVNode("邮箱")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "email",
                                      modelValue: profileForm.email,
                                      "onUpdate:modelValue": ($event) => profileForm.email = $event,
                                      type: "email"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "phone" }, {
                                      default: withCtx(() => [
                                        createTextVNode("手机号")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "phone",
                                      modelValue: profileForm.phone_number,
                                      "onUpdate:modelValue": ($event) => profileForm.phone_number = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ])
                                ]),
                                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "visibility" }, {
                                      default: withCtx(() => [
                                        createTextVNode("主页可见性")
                                      ]),
                                      _: 1
                                    }),
                                    withDirectives(createVNode("select", {
                                      "onUpdate:modelValue": ($event) => profileForm.profile_visibility = $event,
                                      class: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    }, [
                                      createVNode("option", { value: "public" }, "公开"),
                                      createVNode("option", { value: "private" }, "私密")
                                    ], 8, ["onUpdate:modelValue"]), [
                                      [vModelSelect, profileForm.profile_visibility]
                                    ])
                                  ]),
                                  createVNode("div", { class: "space-y-2 rounded-lg border border-dashed border-border/60 p-3" }, [
                                    createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => profileForm.show_email = $event,
                                        type: "checkbox"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelCheckbox, profileForm.show_email]
                                      ]),
                                      createTextVNode("公开邮箱")
                                    ]),
                                    createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => profileForm.show_phone = $event,
                                        type: "checkbox"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelCheckbox, profileForm.show_phone]
                                      ]),
                                      createTextVNode("公开手机号")
                                    ])
                                  ])
                                ]),
                                createVNode(_component_Button, {
                                  type: "submit",
                                  class: "w-full",
                                  disabled: profileLoading.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(profileLoading.value ? "保存中..." : "保存资料"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["disabled"])
                              ], 32)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="space-y-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`安全清单`);
                                  } else {
                                    return [
                                      createTextVNode("安全清单")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`完善关键资料提升安全指数`);
                                  } else {
                                    return [
                                      createTextVNode("完善关键资料提升安全指数")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("安全清单")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("完善关键资料提升安全指数")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, { class: "space-y-3" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(securityTasks.value, (task) => {
                                _push5(`<div class="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"${_scopeId4}><div${_scopeId4}><p class="text-sm font-medium"${_scopeId4}>${ssrInterpolate(task.label)}</p><p class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(task.hint)}</p></div>`);
                                _push5(ssrRenderComponent(_component_Icon, {
                                  name: task.done ? "lucide:check-circle" : "lucide:circle",
                                  class: ["h-5 w-5", task.done ? "text-emerald-500" : "text-muted-foreground"]
                                }, null, _parent5, _scopeId4));
                                _push5(`</div>`);
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(securityTasks.value, (task) => {
                                  return openBlock(), createBlock("div", {
                                    key: task.label,
                                    class: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-sm font-medium" }, toDisplayString(task.label), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(task.hint), 1)
                                    ]),
                                    createVNode(_component_Icon, {
                                      name: task.done ? "lucide:check-circle" : "lucide:circle",
                                      class: ["h-5 w-5", task.done ? "text-emerald-500" : "text-muted-foreground"]
                                    }, null, 8, ["name", "class"])
                                  ]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("安全清单")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("完善关键资料提升安全指数")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "space-y-3" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(securityTasks.value, (task) => {
                                return openBlock(), createBlock("div", {
                                  key: task.label,
                                  class: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-sm font-medium" }, toDisplayString(task.label), 1),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(task.hint), 1)
                                  ]),
                                  createVNode(_component_Icon, {
                                    name: task.done ? "lucide:check-circle" : "lucide:circle",
                                    class: ["h-5 w-5", task.done ? "text-emerald-500" : "text-muted-foreground"]
                                  }, null, 8, ["name", "class"])
                                ]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`账号状态`);
                                  } else {
                                    return [
                                      createTextVNode("账号状态")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`同步登录、活跃度与最近记录`);
                                  } else {
                                    return [
                                      createTextVNode("同步登录、活跃度与最近记录")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("账号状态")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("同步登录、活跃度与最近记录")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, { class: "space-y-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(accountHighlights.value, (item) => {
                                _push5(`<div class="flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"${_scopeId4}><div${_scopeId4}><p class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(item.label)}</p><p class="mt-1 font-medium"${_scopeId4}>${ssrInterpolate(item.value)}</p></div>`);
                                _push5(ssrRenderComponent(_component_Icon, {
                                  name: item.icon,
                                  class: "h-4 w-4 text-muted-foreground"
                                }, null, _parent5, _scopeId4));
                                _push5(`</div>`);
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(accountHighlights.value, (item) => {
                                  return openBlock(), createBlock("div", {
                                    key: item.label,
                                    class: "flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.label), 1),
                                      createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(item.value), 1)
                                    ]),
                                    createVNode(_component_Icon, {
                                      name: item.icon,
                                      class: "h-4 w-4 text-muted-foreground"
                                    }, null, 8, ["name"])
                                  ]);
                                }), 128))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("账号状态")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("同步登录、活跃度与最近记录")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "space-y-4" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(accountHighlights.value, (item) => {
                                return openBlock(), createBlock("div", {
                                  key: item.label,
                                  class: "flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.label), 1),
                                    createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(item.value), 1)
                                  ]),
                                  createVNode(_component_Icon, {
                                    name: item.icon,
                                    class: "h-4 w-4 text-muted-foreground"
                                  }, null, 8, ["name"])
                                ]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, [
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("基本信息")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("更新昵称、联系方式，保持账号可恢复")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              createVNode("form", {
                                class: "space-y-4",
                                onSubmit: withModifiers(saveProfile, ["prevent"])
                              }, [
                                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "nickname" }, {
                                      default: withCtx(() => [
                                        createTextVNode("昵称")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "nickname",
                                      modelValue: profileForm.nickname,
                                      "onUpdate:modelValue": ($event) => profileForm.nickname = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "username" }, {
                                      default: withCtx(() => [
                                        createTextVNode("账号")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "username",
                                      value: unref(auth).user?.username,
                                      disabled: ""
                                    }, null, 8, ["value"])
                                  ])
                                ]),
                                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "email" }, {
                                      default: withCtx(() => [
                                        createTextVNode("邮箱")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "email",
                                      modelValue: profileForm.email,
                                      "onUpdate:modelValue": ($event) => profileForm.email = $event,
                                      type: "email"
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "phone" }, {
                                      default: withCtx(() => [
                                        createTextVNode("手机号")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Input, {
                                      id: "phone",
                                      modelValue: profileForm.phone_number,
                                      "onUpdate:modelValue": ($event) => profileForm.phone_number = $event
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ])
                                ]),
                                createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode(_component_Label, { for: "visibility" }, {
                                      default: withCtx(() => [
                                        createTextVNode("主页可见性")
                                      ]),
                                      _: 1
                                    }),
                                    withDirectives(createVNode("select", {
                                      "onUpdate:modelValue": ($event) => profileForm.profile_visibility = $event,
                                      class: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    }, [
                                      createVNode("option", { value: "public" }, "公开"),
                                      createVNode("option", { value: "private" }, "私密")
                                    ], 8, ["onUpdate:modelValue"]), [
                                      [vModelSelect, profileForm.profile_visibility]
                                    ])
                                  ]),
                                  createVNode("div", { class: "space-y-2 rounded-lg border border-dashed border-border/60 p-3" }, [
                                    createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => profileForm.show_email = $event,
                                        type: "checkbox"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelCheckbox, profileForm.show_email]
                                      ]),
                                      createTextVNode("公开邮箱")
                                    ]),
                                    createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                      withDirectives(createVNode("input", {
                                        "onUpdate:modelValue": ($event) => profileForm.show_phone = $event,
                                        type: "checkbox"
                                      }, null, 8, ["onUpdate:modelValue"]), [
                                        [vModelCheckbox, profileForm.show_phone]
                                      ]),
                                      createTextVNode("公开手机号")
                                    ])
                                  ])
                                ]),
                                createVNode(_component_Button, {
                                  type: "submit",
                                  class: "w-full",
                                  disabled: profileLoading.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(profileLoading.value ? "保存中..." : "保存资料"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["disabled"])
                              ], 32)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "space-y-6" }, [
                        createVNode(_component_Card, { class: "border-border/70" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("安全清单")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("完善关键资料提升安全指数")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardContent, { class: "space-y-3" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(securityTasks.value, (task) => {
                                  return openBlock(), createBlock("div", {
                                    key: task.label,
                                    class: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-sm font-medium" }, toDisplayString(task.label), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(task.hint), 1)
                                    ]),
                                    createVNode(_component_Icon, {
                                      name: task.done ? "lucide:check-circle" : "lucide:circle",
                                      class: ["h-5 w-5", task.done ? "text-emerald-500" : "text-muted-foreground"]
                                    }, null, 8, ["name", "class"])
                                  ]);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Card, { class: "border-border/70" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("账号状态")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("同步登录、活跃度与最近记录")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardContent, { class: "space-y-4" }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(accountHighlights.value, (item) => {
                                  return openBlock(), createBlock("div", {
                                    key: item.label,
                                    class: "flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                                  }, [
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.label), 1),
                                      createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(item.value), 1)
                                    ]),
                                    createVNode(_component_Icon, {
                                      name: item.icon,
                                      class: "h-4 w-4 text-muted-foreground"
                                    }, null, 8, ["name"])
                                  ]);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              value: "community",
              class: "mt-6"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 gap-6 lg:grid-cols-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`社区活跃度`);
                                  } else {
                                    return [
                                      createTextVNode("社区活跃度")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`你的发帖与互动数据总览`);
                                  } else {
                                    return [
                                      createTextVNode("你的发帖与互动数据总览")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("社区活跃度")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("你的发帖与互动数据总览")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, { class: "grid grid-cols-2 gap-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="rounded-lg bg-background/70 p-3"${_scopeId4}><p class="text-xs text-muted-foreground"${_scopeId4}>发布帖子</p><p class="mt-1 text-xl font-semibold"${_scopeId4}>${ssrInterpolate(communityStats.value.posts_published)}</p></div><div class="rounded-lg bg-background/70 p-3"${_scopeId4}><p class="text-xs text-muted-foreground"${_scopeId4}>参与评论</p><p class="mt-1 text-xl font-semibold"${_scopeId4}>${ssrInterpolate(communityStats.value.comments_written)}</p></div><div class="rounded-lg bg-background/70 p-3"${_scopeId4}><p class="text-xs text-muted-foreground"${_scopeId4}>帖子获赞</p><p class="mt-1 text-xl font-semibold"${_scopeId4}>${ssrInterpolate(communityStats.value.post_likes_received)}</p></div><div class="rounded-lg bg-background/70 p-3"${_scopeId4}><p class="text-xs text-muted-foreground"${_scopeId4}>评论获赞</p><p class="mt-1 text-xl font-semibold"${_scopeId4}>${ssrInterpolate(communityStats.value.comment_likes_received)}</p></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, "发布帖子"),
                                  createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.posts_published), 1)
                                ]),
                                createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, "参与评论"),
                                  createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comments_written), 1)
                                ]),
                                createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, "帖子获赞"),
                                  createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.post_likes_received), 1)
                                ]),
                                createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                  createVNode("p", { class: "text-xs text-muted-foreground" }, "评论获赞"),
                                  createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comment_likes_received), 1)
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("社区活跃度")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("你的发帖与互动数据总览")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "grid grid-cols-2 gap-4" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "发布帖子"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.posts_published), 1)
                              ]),
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "参与评论"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comments_written), 1)
                              ]),
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "帖子获赞"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.post_likes_received), 1)
                              ]),
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "评论获赞"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comment_likes_received), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`我的帖子`);
                                  } else {
                                    return [
                                      createTextVNode("我的帖子")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`已发布的全部帖子列表`);
                                  } else {
                                    return [
                                      createTextVNode("已发布的全部帖子列表")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("我的帖子")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("已发布的全部帖子列表")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (myPostsLoading.value && !myPosts.value.length) {
                                _push5(`<div class="text-sm text-muted-foreground"${_scopeId4}>加载中…</div>`);
                              } else if (!myPosts.value.length) {
                                _push5(`<div class="text-sm text-muted-foreground"${_scopeId4}>暂未发布任何帖子。</div>`);
                              } else {
                                _push5(`<div class="space-y-3"${_scopeId4}><!--[-->`);
                                ssrRenderList(myPosts.value, (post) => {
                                  _push5(`<div class="flex items-center justify-between gap-2 rounded-lg border border-border/70 p-3"${_scopeId4}><div class="min-w-0"${_scopeId4}><p class="truncate font-medium"${_scopeId4}>${ssrInterpolate(post.title)}</p><p class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(post.community_detail?.name || "社区")} · ${ssrInterpolate(formatDate(post.created_at))}</p></div>`);
                                  _push5(ssrRenderComponent(_component_Button, {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`查看`);
                                      } else {
                                        return [
                                          createTextVNode("查看")
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                });
                                _push5(`<!--]-->`);
                                if (hasMorePosts.value) {
                                  _push5(ssrRenderComponent(_component_Button, {
                                    class: "w-full",
                                    variant: "outline",
                                    disabled: myPostsLoading.value,
                                    onClick: ($event) => fetchMyPosts(true)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(myPostsLoading.value ? "加载中..." : "加载更多帖子")}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(myPostsLoading.value ? "加载中..." : "加载更多帖子"), 1)
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div>`);
                              }
                            } else {
                              return [
                                myPostsLoading.value && !myPosts.value.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "加载中…")) : !myPosts.value.length ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "text-sm text-muted-foreground"
                                }, "暂未发布任何帖子。")) : (openBlock(), createBlock("div", {
                                  key: 2,
                                  class: "space-y-3"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(myPosts.value, (post) => {
                                    return openBlock(), createBlock("div", {
                                      key: post.id,
                                      class: "flex items-center justify-between gap-2 rounded-lg border border-border/70 p-3"
                                    }, [
                                      createVNode("div", { class: "min-w-0" }, [
                                        createVNode("p", { class: "truncate font-medium" }, toDisplayString(post.title), 1),
                                        createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(post.community_detail?.name || "社区") + " · " + toDisplayString(formatDate(post.created_at)), 1)
                                      ]),
                                      createVNode(_component_Button, {
                                        variant: "ghost",
                                        size: "sm",
                                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("查看")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ]);
                                  }), 128)),
                                  hasMorePosts.value ? (openBlock(), createBlock(_component_Button, {
                                    key: 0,
                                    class: "w-full",
                                    variant: "outline",
                                    disabled: myPostsLoading.value,
                                    onClick: ($event) => fetchMyPosts(true)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(myPostsLoading.value ? "加载中..." : "加载更多帖子"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["disabled", "onClick"])) : createCommentVNode("", true)
                                ]))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("我的帖子")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("已发布的全部帖子列表")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              myPostsLoading.value && !myPosts.value.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "加载中…")) : !myPosts.value.length ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "text-sm text-muted-foreground"
                              }, "暂未发布任何帖子。")) : (openBlock(), createBlock("div", {
                                key: 2,
                                class: "space-y-3"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(myPosts.value, (post) => {
                                  return openBlock(), createBlock("div", {
                                    key: post.id,
                                    class: "flex items-center justify-between gap-2 rounded-lg border border-border/70 p-3"
                                  }, [
                                    createVNode("div", { class: "min-w-0" }, [
                                      createVNode("p", { class: "truncate font-medium" }, toDisplayString(post.title), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(post.community_detail?.name || "社区") + " · " + toDisplayString(formatDate(post.created_at)), 1)
                                    ]),
                                    createVNode(_component_Button, {
                                      variant: "ghost",
                                      size: "sm",
                                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("查看")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]);
                                }), 128)),
                                hasMorePosts.value ? (openBlock(), createBlock(_component_Button, {
                                  key: 0,
                                  class: "w-full",
                                  variant: "outline",
                                  disabled: myPostsLoading.value,
                                  onClick: ($event) => fetchMyPosts(true)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(myPostsLoading.value ? "加载中..." : "加载更多帖子"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["disabled", "onClick"])) : createCommentVNode("", true)
                              ]))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, [
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("社区活跃度")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("你的发帖与互动数据总览")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "grid grid-cols-2 gap-4" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "发布帖子"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.posts_published), 1)
                              ]),
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "参与评论"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comments_written), 1)
                              ]),
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "帖子获赞"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.post_likes_received), 1)
                              ]),
                              createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                                createVNode("p", { class: "text-xs text-muted-foreground" }, "评论获赞"),
                                createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comment_likes_received), 1)
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("我的帖子")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("已发布的全部帖子列表")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              myPostsLoading.value && !myPosts.value.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "加载中…")) : !myPosts.value.length ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "text-sm text-muted-foreground"
                              }, "暂未发布任何帖子。")) : (openBlock(), createBlock("div", {
                                key: 2,
                                class: "space-y-3"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(myPosts.value, (post) => {
                                  return openBlock(), createBlock("div", {
                                    key: post.id,
                                    class: "flex items-center justify-between gap-2 rounded-lg border border-border/70 p-3"
                                  }, [
                                    createVNode("div", { class: "min-w-0" }, [
                                      createVNode("p", { class: "truncate font-medium" }, toDisplayString(post.title), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(post.community_detail?.name || "社区") + " · " + toDisplayString(formatDate(post.created_at)), 1)
                                    ]),
                                    createVNode(_component_Button, {
                                      variant: "ghost",
                                      size: "sm",
                                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("查看")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]);
                                }), 128)),
                                hasMorePosts.value ? (openBlock(), createBlock(_component_Button, {
                                  key: 0,
                                  class: "w-full",
                                  variant: "outline",
                                  disabled: myPostsLoading.value,
                                  onClick: ($event) => fetchMyPosts(true)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(myPostsLoading.value ? "加载中..." : "加载更多帖子"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["disabled", "onClick"])) : createCommentVNode("", true)
                              ]))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              value: "training",
              class: "mt-6"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid grid-cols-1 gap-6 lg:grid-cols-2"${_scopeId2}><div class="space-y-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`AI 模拟总结`);
                                  } else {
                                    return [
                                      createTextVNode("AI 模拟总结")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`最近一次对话式演练表现`);
                                  } else {
                                    return [
                                      createTextVNode("最近一次对话式演练表现")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("AI 模拟总结")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("最近一次对话式演练表现")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (latestSimulation.value) {
                          _push4(ssrRenderComponent(_component_CardContent, { class: "space-y-3 text-sm" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="grid gap-4 sm:grid-cols-2"${_scopeId4}><div${_scopeId4}><p class="text-xs uppercase text-muted-foreground"${_scopeId4}>场景</p><p class="mt-1 font-medium"${_scopeId4}>${ssrInterpolate(latestSimulation.value.scenarioType)}</p></div><div${_scopeId4}><p class="text-xs uppercase text-muted-foreground"${_scopeId4}>难度</p><p class="mt-1 font-medium capitalize"${_scopeId4}>${ssrInterpolate(latestSimulation.value.difficulty)}</p></div></div><div class="rounded-xl border border-border/70 bg-muted/40 p-3 text-center"${_scopeId4}><p class="text-xs uppercase text-muted-foreground"${_scopeId4}>最终得分</p><p class="mt-2 text-3xl font-semibold"${_scopeId4}>${ssrInterpolate(latestSimulation.value.finalScore)}</p></div><p class="rounded-xl border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground"${_scopeId4}>${ssrInterpolate(latestSimulation.value.performanceAnalysis)}</p>`);
                              } else {
                                return [
                                  createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "场景"),
                                      createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.scenarioType), 1)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "难度"),
                                      createVNode("p", { class: "mt-1 font-medium capitalize" }, toDisplayString(latestSimulation.value.difficulty), 1)
                                    ])
                                  ]),
                                  createVNode("div", { class: "rounded-xl border border-border/70 bg-muted/40 p-3 text-center" }, [
                                    createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "最终得分"),
                                    createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(latestSimulation.value.finalScore), 1)
                                  ]),
                                  createVNode("p", { class: "rounded-xl border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground" }, toDisplayString(latestSimulation.value.performanceAnalysis), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(_component_CardContent, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<p class="text-muted-foreground"${_scopeId4}>暂无模拟记录。</p>`);
                              } else {
                                return [
                                  createVNode("p", { class: "text-muted-foreground" }, "暂无模拟记录。")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("AI 模拟总结")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("最近一次对话式演练表现")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          latestSimulation.value ? (openBlock(), createBlock(_component_CardContent, {
                            key: 0,
                            class: "space-y-3 text-sm"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                                createVNode("div", null, [
                                  createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "场景"),
                                  createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.scenarioType), 1)
                                ]),
                                createVNode("div", null, [
                                  createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "难度"),
                                  createVNode("p", { class: "mt-1 font-medium capitalize" }, toDisplayString(latestSimulation.value.difficulty), 1)
                                ])
                              ]),
                              createVNode("div", { class: "rounded-xl border border-border/70 bg-muted/40 p-3 text-center" }, [
                                createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "最终得分"),
                                createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(latestSimulation.value.finalScore), 1)
                              ]),
                              createVNode("p", { class: "rounded-xl border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground" }, toDisplayString(latestSimulation.value.performanceAnalysis), 1)
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_CardContent, { key: 1 }, {
                            default: withCtx(() => [
                              createVNode("p", { class: "text-muted-foreground" }, "暂无模拟记录。")
                            ]),
                            _: 1
                          }))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`成长建议`);
                                  } else {
                                    return [
                                      createTextVNode("成长建议")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`基于当前表现生成训练提示`);
                                  } else {
                                    return [
                                      createTextVNode("基于当前表现生成训练提示")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("成长建议")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("基于当前表现生成训练提示")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<ul class="list-disc space-y-2 pl-5 text-sm text-muted-foreground"${_scopeId4}><!--[-->`);
                              ssrRenderList(growthTips.value, (tip) => {
                                _push5(`<li${_scopeId4}>${ssrInterpolate(tip)}</li>`);
                              });
                              _push5(`<!--]--></ul>`);
                            } else {
                              return [
                                createVNode("ul", { class: "list-disc space-y-2 pl-5 text-sm text-muted-foreground" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(growthTips.value, (tip) => {
                                    return openBlock(), createBlock("li", { key: tip }, toDisplayString(tip), 1);
                                  }), 128))
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("成长建议")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("基于当前表现生成训练提示")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              createVNode("ul", { class: "list-disc space-y-2 pl-5 text-sm text-muted-foreground" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(growthTips.value, (tip) => {
                                  return openBlock(), createBlock("li", { key: tip }, toDisplayString(tip), 1);
                                }), 128))
                              ])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="space-y-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`能力雷达图`);
                                  } else {
                                    return [
                                      createTextVNode("能力雷达图")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`多维度评估反诈能力`);
                                  } else {
                                    return [
                                      createTextVNode("多维度评估反诈能力")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("能力雷达图")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("多维度评估反诈能力")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, { class: "p-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_sfc_main$e, {
                                profile: simulationRadarProfile.value,
                                height: "240px"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_sfc_main$e, {
                                  profile: simulationRadarProfile.value,
                                  height: "240px"
                                }, null, 8, ["profile"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("能力雷达图")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("多维度评估反诈能力")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "p-4" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$e, {
                                profile: simulationRadarProfile.value,
                                height: "240px"
                              }, null, 8, ["profile"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Card, { class: "border-border/70" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardHeader, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`账号活动记录`);
                                  } else {
                                    return [
                                      createTextVNode("账号活动记录")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_CardDescription, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`了解安全动作与训练轨迹`);
                                  } else {
                                    return [
                                      createTextVNode("了解安全动作与训练轨迹")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("账号活动记录")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("了解安全动作与训练轨迹")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardContent, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (!activityFeed.value.length) {
                                _push5(`<div class="text-sm text-muted-foreground"${_scopeId4}>暂无活动记录</div>`);
                              } else {
                                _push5(`<ul class="space-y-4"${_scopeId4}><!--[-->`);
                                ssrRenderList(activityFeed.value, (item) => {
                                  _push5(`<li class="relative pl-6 text-sm"${_scopeId4}><span class="${ssrRenderClass([item.status === "success" ? "bg-emerald-500" : "bg-muted-foreground", "absolute left-0 top-1 h-2 w-2 rounded-full"])}"${_scopeId4}></span><p class="font-medium"${_scopeId4}>${ssrInterpolate(item.title)}</p><p class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(item.time)}</p></li>`);
                                });
                                _push5(`<!--]--></ul>`);
                              }
                            } else {
                              return [
                                !activityFeed.value.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "暂无活动记录")) : (openBlock(), createBlock("ul", {
                                  key: 1,
                                  class: "space-y-4"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(activityFeed.value, (item) => {
                                    return openBlock(), createBlock("li", {
                                      key: item.title + item.time,
                                      class: "relative pl-6 text-sm"
                                    }, [
                                      createVNode("span", {
                                        class: ["absolute left-0 top-1 h-2 w-2 rounded-full", item.status === "success" ? "bg-emerald-500" : "bg-muted-foreground"]
                                      }, null, 2),
                                      createVNode("p", { class: "font-medium" }, toDisplayString(item.title), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.time), 1)
                                    ]);
                                  }), 128))
                                ]))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("账号活动记录")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("了解安全动作与训练轨迹")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              !activityFeed.value.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "暂无活动记录")) : (openBlock(), createBlock("ul", {
                                key: 1,
                                class: "space-y-4"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(activityFeed.value, (item) => {
                                  return openBlock(), createBlock("li", {
                                    key: item.title + item.time,
                                    class: "relative pl-6 text-sm"
                                  }, [
                                    createVNode("span", {
                                      class: ["absolute left-0 top-1 h-2 w-2 rounded-full", item.status === "success" ? "bg-emerald-500" : "bg-muted-foreground"]
                                    }, null, 2),
                                    createVNode("p", { class: "font-medium" }, toDisplayString(item.title), 1),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.time), 1)
                                  ]);
                                }), 128))
                              ]))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, [
                      createVNode("div", { class: "space-y-6" }, [
                        createVNode(_component_Card, { class: "border-border/70" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("AI 模拟总结")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("最近一次对话式演练表现")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            latestSimulation.value ? (openBlock(), createBlock(_component_CardContent, {
                              key: 0,
                              class: "space-y-3 text-sm"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "场景"),
                                    createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.scenarioType), 1)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "难度"),
                                    createVNode("p", { class: "mt-1 font-medium capitalize" }, toDisplayString(latestSimulation.value.difficulty), 1)
                                  ])
                                ]),
                                createVNode("div", { class: "rounded-xl border border-border/70 bg-muted/40 p-3 text-center" }, [
                                  createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "最终得分"),
                                  createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(latestSimulation.value.finalScore), 1)
                                ]),
                                createVNode("p", { class: "rounded-xl border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground" }, toDisplayString(latestSimulation.value.performanceAnalysis), 1)
                              ]),
                              _: 1
                            })) : (openBlock(), createBlock(_component_CardContent, { key: 1 }, {
                              default: withCtx(() => [
                                createVNode("p", { class: "text-muted-foreground" }, "暂无模拟记录。")
                              ]),
                              _: 1
                            }))
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Card, { class: "border-border/70" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("成长建议")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("基于当前表现生成训练提示")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardContent, null, {
                              default: withCtx(() => [
                                createVNode("ul", { class: "list-disc space-y-2 pl-5 text-sm text-muted-foreground" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(growthTips.value, (tip) => {
                                    return openBlock(), createBlock("li", { key: tip }, toDisplayString(tip), 1);
                                  }), 128))
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "space-y-6" }, [
                        createVNode(_component_Card, { class: "border-border/70" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("能力雷达图")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("多维度评估反诈能力")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardContent, { class: "p-4" }, {
                              default: withCtx(() => [
                                createVNode(_sfc_main$e, {
                                  profile: simulationRadarProfile.value,
                                  height: "240px"
                                }, null, 8, ["profile"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Card, { class: "border-border/70" }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("账号活动记录")
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode("了解安全动作与训练轨迹")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardContent, null, {
                              default: withCtx(() => [
                                !activityFeed.value.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "text-sm text-muted-foreground"
                                }, "暂无活动记录")) : (openBlock(), createBlock("ul", {
                                  key: 1,
                                  class: "space-y-4"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(activityFeed.value, (item) => {
                                    return openBlock(), createBlock("li", {
                                      key: item.title + item.time,
                                      class: "relative pl-6 text-sm"
                                    }, [
                                      createVNode("span", {
                                        class: ["absolute left-0 top-1 h-2 w-2 rounded-full", item.status === "success" ? "bg-emerald-500" : "bg-muted-foreground"]
                                      }, null, 2),
                                      createVNode("p", { class: "font-medium" }, toDisplayString(item.title), 1),
                                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.time), 1)
                                    ]);
                                  }), 128))
                                ]))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), { class: "grid w-full grid-cols-3" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$1), { value: "profile" }, {
                    default: withCtx(() => [
                      createTextVNode("个人资料")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$1), { value: "community" }, {
                    default: withCtx(() => [
                      createTextVNode("社区动态")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$1), { value: "training" }, {
                    default: withCtx(() => [
                      createTextVNode("训练报告")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), {
                value: "profile",
                class: "mt-6"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, [
                    createVNode(_component_Card, { class: "border-border/70" }, {
                      default: withCtx(() => [
                        createVNode(_component_CardHeader, null, {
                          default: withCtx(() => [
                            createVNode(_component_CardTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("基本信息")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardDescription, null, {
                              default: withCtx(() => [
                                createTextVNode("更新昵称、联系方式，保持账号可恢复")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardContent, null, {
                          default: withCtx(() => [
                            createVNode("form", {
                              class: "space-y-4",
                              onSubmit: withModifiers(saveProfile, ["prevent"])
                            }, [
                              createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                createVNode("div", null, [
                                  createVNode(_component_Label, { for: "nickname" }, {
                                    default: withCtx(() => [
                                      createTextVNode("昵称")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_Input, {
                                    id: "nickname",
                                    modelValue: profileForm.nickname,
                                    "onUpdate:modelValue": ($event) => profileForm.nickname = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", null, [
                                  createVNode(_component_Label, { for: "username" }, {
                                    default: withCtx(() => [
                                      createTextVNode("账号")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_Input, {
                                    id: "username",
                                    value: unref(auth).user?.username,
                                    disabled: ""
                                  }, null, 8, ["value"])
                                ])
                              ]),
                              createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                createVNode("div", null, [
                                  createVNode(_component_Label, { for: "email" }, {
                                    default: withCtx(() => [
                                      createTextVNode("邮箱")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_Input, {
                                    id: "email",
                                    modelValue: profileForm.email,
                                    "onUpdate:modelValue": ($event) => profileForm.email = $event,
                                    type: "email"
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                createVNode("div", null, [
                                  createVNode(_component_Label, { for: "phone" }, {
                                    default: withCtx(() => [
                                      createTextVNode("手机号")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_Input, {
                                    id: "phone",
                                    modelValue: profileForm.phone_number,
                                    "onUpdate:modelValue": ($event) => profileForm.phone_number = $event
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ])
                              ]),
                              createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                                createVNode("div", null, [
                                  createVNode(_component_Label, { for: "visibility" }, {
                                    default: withCtx(() => [
                                      createTextVNode("主页可见性")
                                    ]),
                                    _: 1
                                  }),
                                  withDirectives(createVNode("select", {
                                    "onUpdate:modelValue": ($event) => profileForm.profile_visibility = $event,
                                    class: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                  }, [
                                    createVNode("option", { value: "public" }, "公开"),
                                    createVNode("option", { value: "private" }, "私密")
                                  ], 8, ["onUpdate:modelValue"]), [
                                    [vModelSelect, profileForm.profile_visibility]
                                  ])
                                ]),
                                createVNode("div", { class: "space-y-2 rounded-lg border border-dashed border-border/60 p-3" }, [
                                  createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => profileForm.show_email = $event,
                                      type: "checkbox"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelCheckbox, profileForm.show_email]
                                    ]),
                                    createTextVNode("公开邮箱")
                                  ]),
                                  createVNode("label", { class: "flex items-center gap-2 text-xs" }, [
                                    withDirectives(createVNode("input", {
                                      "onUpdate:modelValue": ($event) => profileForm.show_phone = $event,
                                      type: "checkbox"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelCheckbox, profileForm.show_phone]
                                    ]),
                                    createTextVNode("公开手机号")
                                  ])
                                ])
                              ]),
                              createVNode(_component_Button, {
                                type: "submit",
                                class: "w-full",
                                disabled: profileLoading.value
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(profileLoading.value ? "保存中..." : "保存资料"), 1)
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ], 32)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("安全清单")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("完善关键资料提升安全指数")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "space-y-3" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(securityTasks.value, (task) => {
                                return openBlock(), createBlock("div", {
                                  key: task.label,
                                  class: "flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-sm font-medium" }, toDisplayString(task.label), 1),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(task.hint), 1)
                                  ]),
                                  createVNode(_component_Icon, {
                                    name: task.done ? "lucide:check-circle" : "lucide:circle",
                                    class: ["h-5 w-5", task.done ? "text-emerald-500" : "text-muted-foreground"]
                                  }, null, 8, ["name", "class"])
                                ]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("账号状态")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("同步登录、活跃度与最近记录")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "space-y-4" }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(accountHighlights.value, (item) => {
                                return openBlock(), createBlock("div", {
                                  key: item.label,
                                  class: "flex items-start justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                                }, [
                                  createVNode("div", null, [
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.label), 1),
                                    createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(item.value), 1)
                                  ]),
                                  createVNode(_component_Icon, {
                                    name: item.icon,
                                    class: "h-4 w-4 text-muted-foreground"
                                  }, null, 8, ["name"])
                                ]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), {
                value: "community",
                class: "mt-6"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, [
                    createVNode(_component_Card, { class: "border-border/70" }, {
                      default: withCtx(() => [
                        createVNode(_component_CardHeader, null, {
                          default: withCtx(() => [
                            createVNode(_component_CardTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("社区活跃度")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardDescription, null, {
                              default: withCtx(() => [
                                createTextVNode("你的发帖与互动数据总览")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardContent, { class: "grid grid-cols-2 gap-4" }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                              createVNode("p", { class: "text-xs text-muted-foreground" }, "发布帖子"),
                              createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.posts_published), 1)
                            ]),
                            createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                              createVNode("p", { class: "text-xs text-muted-foreground" }, "参与评论"),
                              createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comments_written), 1)
                            ]),
                            createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                              createVNode("p", { class: "text-xs text-muted-foreground" }, "帖子获赞"),
                              createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.post_likes_received), 1)
                            ]),
                            createVNode("div", { class: "rounded-lg bg-background/70 p-3" }, [
                              createVNode("p", { class: "text-xs text-muted-foreground" }, "评论获赞"),
                              createVNode("p", { class: "mt-1 text-xl font-semibold" }, toDisplayString(communityStats.value.comment_likes_received), 1)
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_Card, { class: "border-border/70" }, {
                      default: withCtx(() => [
                        createVNode(_component_CardHeader, null, {
                          default: withCtx(() => [
                            createVNode(_component_CardTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("我的帖子")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_CardDescription, null, {
                              default: withCtx(() => [
                                createTextVNode("已发布的全部帖子列表")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardContent, null, {
                          default: withCtx(() => [
                            myPostsLoading.value && !myPosts.value.length ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "text-sm text-muted-foreground"
                            }, "加载中…")) : !myPosts.value.length ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "text-sm text-muted-foreground"
                            }, "暂未发布任何帖子。")) : (openBlock(), createBlock("div", {
                              key: 2,
                              class: "space-y-3"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(myPosts.value, (post) => {
                                return openBlock(), createBlock("div", {
                                  key: post.id,
                                  class: "flex items-center justify-between gap-2 rounded-lg border border-border/70 p-3"
                                }, [
                                  createVNode("div", { class: "min-w-0" }, [
                                    createVNode("p", { class: "truncate font-medium" }, toDisplayString(post.title), 1),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(post.community_detail?.name || "社区") + " · " + toDisplayString(formatDate(post.created_at)), 1)
                                  ]),
                                  createVNode(_component_Button, {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("查看")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]);
                              }), 128)),
                              hasMorePosts.value ? (openBlock(), createBlock(_component_Button, {
                                key: 0,
                                class: "w-full",
                                variant: "outline",
                                disabled: myPostsLoading.value,
                                onClick: ($event) => fetchMyPosts(true)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(myPostsLoading.value ? "加载中..." : "加载更多帖子"), 1)
                                ]),
                                _: 1
                              }, 8, ["disabled", "onClick"])) : createCommentVNode("", true)
                            ]))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), {
                value: "training",
                class: "mt-6"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid grid-cols-1 gap-6 lg:grid-cols-2" }, [
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("AI 模拟总结")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("最近一次对话式演练表现")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          latestSimulation.value ? (openBlock(), createBlock(_component_CardContent, {
                            key: 0,
                            class: "space-y-3 text-sm"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                                createVNode("div", null, [
                                  createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "场景"),
                                  createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.scenarioType), 1)
                                ]),
                                createVNode("div", null, [
                                  createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "难度"),
                                  createVNode("p", { class: "mt-1 font-medium capitalize" }, toDisplayString(latestSimulation.value.difficulty), 1)
                                ])
                              ]),
                              createVNode("div", { class: "rounded-xl border border-border/70 bg-muted/40 p-3 text-center" }, [
                                createVNode("p", { class: "text-xs uppercase text-muted-foreground" }, "最终得分"),
                                createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(latestSimulation.value.finalScore), 1)
                              ]),
                              createVNode("p", { class: "rounded-xl border-dashed border-border/60 bg-background/80 p-3 text-muted-foreground" }, toDisplayString(latestSimulation.value.performanceAnalysis), 1)
                            ]),
                            _: 1
                          })) : (openBlock(), createBlock(_component_CardContent, { key: 1 }, {
                            default: withCtx(() => [
                              createVNode("p", { class: "text-muted-foreground" }, "暂无模拟记录。")
                            ]),
                            _: 1
                          }))
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("成长建议")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("基于当前表现生成训练提示")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              createVNode("ul", { class: "list-disc space-y-2 pl-5 text-sm text-muted-foreground" }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(growthTips.value, (tip) => {
                                  return openBlock(), createBlock("li", { key: tip }, toDisplayString(tip), 1);
                                }), 128))
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "space-y-6" }, [
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("能力雷达图")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("多维度评估反诈能力")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, { class: "p-4" }, {
                            default: withCtx(() => [
                              createVNode(_sfc_main$e, {
                                profile: simulationRadarProfile.value,
                                height: "240px"
                              }, null, 8, ["profile"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Card, { class: "border-border/70" }, {
                        default: withCtx(() => [
                          createVNode(_component_CardHeader, null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("账号活动记录")
                                ]),
                                _: 1
                              }),
                              createVNode(_component_CardDescription, null, {
                                default: withCtx(() => [
                                  createTextVNode("了解安全动作与训练轨迹")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardContent, null, {
                            default: withCtx(() => [
                              !activityFeed.value.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-muted-foreground"
                              }, "暂无活动记录")) : (openBlock(), createBlock("ul", {
                                key: 1,
                                class: "space-y-4"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(activityFeed.value, (item) => {
                                  return openBlock(), createBlock("li", {
                                    key: item.title + item.time,
                                    class: "relative pl-6 text-sm"
                                  }, [
                                    createVNode("span", {
                                      class: ["absolute left-0 top-1 h-2 w-2 rounded-full", item.status === "success" ? "bg-emerald-500" : "bg-muted-foreground"]
                                    }, null, 2),
                                    createVNode("p", { class: "font-medium" }, toDisplayString(item.title), 1),
                                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.time), 1)
                                  ]);
                                }), 128))
                              ]))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=profile-dA8th0qF.js.map
