import { _ as _sfc_main$1 } from "./button-BNulVDON.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$2, a as _sfc_main$3, c as _sfc_main$4, b as _sfc_main$5, d as _sfc_main$6 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$7 } from "./badge-DhvO8LwD.js";
import { u as useAuthStore, a as useNuxtApp, n as navigateTo } from "../server.mjs";
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$8 } from "./CapabilityRadar.client-JavyGd5l.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const { $api } = useNuxtApp();
    const { userStats, quizStats } = useStatsSync();
    const levelMap = {
      beginner: "初级训练",
      intermediate: "中级训练",
      advanced: "高级训练"
    };
    const quizLoading = ref(true);
    const aiScore = ref("-");
    const latestSimulation = ref(null);
    const totalAttempts = computed(() => userStats.value?.quiz_attempts_count ?? 0);
    const averageScore = computed(() => quizStats.value?.average_score ?? 0);
    const bestScore = computed(() => quizStats.value?.best_score ?? 0);
    const recentAttempts = computed(() => quizStats.value?.recent_attempts ?? []);
    const formatDate = (value) => {
      return new Date(value).toLocaleString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const simulationRadarProfile = computed(() => latestSimulation.value?.capabilityProfile ?? null);
    const formatPercentValue = (value) => {
      const numeric = typeof value === "number" && Number.isFinite(value) ? value : 0;
      const fixed = numeric.toFixed(2);
      return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
    };
    const statCards = computed(() => [
      {
        label: "累计测验次数",
        value: quizLoading.value ? "-" : totalAttempts.value.toString(),
        hint: "包含所有历史答题"
      },
      {
        label: "平均得分",
        value: quizLoading.value ? "-" : `${formatPercentValue(averageScore.value)}%`,
        hint: "最近测验平均成绩"
      },
      {
        label: "最佳成绩",
        value: quizLoading.value ? "-" : `${formatPercentValue(bestScore.value)}%`,
        hint: "历史最高成绩"
      },
      {
        label: "AI 模拟得分",
        value: aiScore.value,
        hint: "最近一次 AI 场景"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$1;
      const _component_Icon = __nuxt_component_1;
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$3;
      const _component_CardDescription = _sfc_main$4;
      const _component_CardTitle = _sfc_main$5;
      const _component_CardContent = _sfc_main$6;
      const _component_Badge = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><section class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm uppercase tracking-widest text-muted-foreground">MVP / Dashboard</p><h1 class="mt-1 text-3xl font-semibold">欢迎回来，${ssrInterpolate(unref(auth).user?.nickname || unref(auth).user?.username)}</h1></div><div class="flex gap-3">`);
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        class: "gap-2",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/profile")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:user",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` 我的主页 `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:user",
                class: "h-4 w-4"
              }),
              createTextVNode(" 我的主页 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Button, {
        class: "gap-2",
        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/quiz")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:play",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(` 开始测验 `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:play",
                class: "h-4 w-4"
              }),
              createTextVNode(" 开始测验 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="grid gap-4 md:grid-cols-4"><!--[-->`);
      ssrRenderList(statCards.value, (item) => {
        _push(ssrRenderComponent(_component_Card, {
          key: item.label,
          class: "border border-border/80"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, { class: "space-y-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardTitle, { class: "text-3xl" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.value)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.value), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`<p class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(item.hint)}</p>`);
                  } else {
                    return [
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.label), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_CardTitle, { class: "text-3xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.value), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.hint), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_CardHeader, { class: "space-y-2" }, {
                  default: withCtx(() => [
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.label), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_component_CardTitle, { class: "text-3xl" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.value), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(item.hint), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></section><section class="grid gap-6 lg:grid-cols-2">`);
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`个人测验概况`);
                      } else {
                        return [
                          createTextVNode("个人测验概况")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`最近 5 次测验表现（按时间倒序）`);
                      } else {
                        return [
                          createTextVNode("最近 5 次测验表现（按时间倒序）")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("个人测验概况")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("最近 5 次测验表现（按时间倒序）")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (quizLoading.value) {
                    _push3(`<div class="text-sm text-muted-foreground"${_scopeId2}>加载中...</div>`);
                  } else {
                    _push3(`<div class="space-y-4"${_scopeId2}><!--[-->`);
                    ssrRenderList(recentAttempts.value, (attempt) => {
                      _push3(`<div class="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"${_scopeId2}><div${_scopeId2}><p class="font-medium"${_scopeId2}>${ssrInterpolate(levelMap[attempt.level] || "未知等级")}</p><p class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(formatDate(attempt.created_at))}</p></div>`);
                      _push3(ssrRenderComponent(_component_Badge, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(attempt.score)} 分`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(attempt.score) + " 分", 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    });
                    _push3(`<!--]-->`);
                    if (!recentAttempts.value.length) {
                      _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>暂无测验记录，先去完成一场测验吧。</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    quizLoading.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-muted-foreground"
                    }, "加载中...")) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(recentAttempts.value, (attempt) => {
                        return openBlock(), createBlock("div", {
                          key: attempt.created_at,
                          class: "flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
                        }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "font-medium" }, toDisplayString(levelMap[attempt.level] || "未知等级"), 1),
                            createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(formatDate(attempt.created_at)), 1)
                          ]),
                          createVNode(_component_Badge, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(attempt.score) + " 分", 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]);
                      }), 128)),
                      !recentAttempts.value.length ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-muted-foreground"
                      }, "暂无测验记录，先去完成一场测验吧。")) : createCommentVNode("", true)
                    ]))
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
                      createTextVNode("个人测验概况")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("最近 5 次测验表现（按时间倒序）")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  quizLoading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-sm text-muted-foreground"
                  }, "加载中...")) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(recentAttempts.value, (attempt) => {
                      return openBlock(), createBlock("div", {
                        key: attempt.created_at,
                        class: "flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
                      }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "font-medium" }, toDisplayString(levelMap[attempt.level] || "未知等级"), 1),
                          createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(formatDate(attempt.created_at)), 1)
                        ]),
                        createVNode(_component_Badge, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(attempt.score) + " 分", 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]);
                    }), 128)),
                    !recentAttempts.value.length ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground"
                    }, "暂无测验记录，先去完成一场测验吧。")) : createCommentVNode("", true)
                  ]))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`系统快捷入口`);
                      } else {
                        return [
                          createTextVNode("系统快捷入口")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`快速跳转到核心 MVP 功能`);
                      } else {
                        return [
                          createTextVNode("快速跳转到核心 MVP 功能")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("系统快捷入口")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("快速跳转到核心 MVP 功能")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="grid gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "outline",
                    class: "justify-between",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/simulation")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>AI 场景模拟</span>`);
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "lucide:bot",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("span", null, "AI 场景模拟"),
                          createVNode(_component_Icon, {
                            name: "lucide:bot",
                            class: "h-4 w-4"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "outline",
                    class: "justify-between",
                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/graph")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span${_scopeId3}>知识图谱可视化</span>`);
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "lucide:network",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode("span", null, "知识图谱可视化"),
                          createVNode(_component_Icon, {
                            name: "lucide:network",
                            class: "h-4 w-4"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(auth).isAdmin) {
                    _push3(ssrRenderComponent(_component_Button, {
                      variant: "outline",
                      class: "justify-between",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/admin/questions")
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<span${_scopeId3}>题库管理（管理员）</span>`);
                          _push4(ssrRenderComponent(_component_Icon, {
                            name: "lucide:shield",
                            class: "h-4 w-4"
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode("span", null, "题库管理（管理员）"),
                            createVNode(_component_Icon, {
                              name: "lucide:shield",
                              class: "h-4 w-4"
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "grid gap-3" }, [
                      createVNode(_component_Button, {
                        variant: "outline",
                        class: "justify-between",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/simulation")
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, "AI 场景模拟"),
                          createVNode(_component_Icon, {
                            name: "lucide:bot",
                            class: "h-4 w-4"
                          })
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_Button, {
                        variant: "outline",
                        class: "justify-between",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/graph")
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, "知识图谱可视化"),
                          createVNode(_component_Icon, {
                            name: "lucide:network",
                            class: "h-4 w-4"
                          })
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      unref(auth).isAdmin ? (openBlock(), createBlock(_component_Button, {
                        key: 0,
                        variant: "outline",
                        class: "justify-between",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/admin/questions")
                      }, {
                        default: withCtx(() => [
                          createVNode("span", null, "题库管理（管理员）"),
                          createVNode(_component_Icon, {
                            name: "lucide:shield",
                            class: "h-4 w-4"
                          })
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true)
                    ])
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
                      createTextVNode("系统快捷入口")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("快速跳转到核心 MVP 功能")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid gap-3" }, [
                    createVNode(_component_Button, {
                      variant: "outline",
                      class: "justify-between",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/simulation")
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, "AI 场景模拟"),
                        createVNode(_component_Icon, {
                          name: "lucide:bot",
                          class: "h-4 w-4"
                        })
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_Button, {
                      variant: "outline",
                      class: "justify-between",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/graph")
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, "知识图谱可视化"),
                        createVNode(_component_Icon, {
                          name: "lucide:network",
                          class: "h-4 w-4"
                        })
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    unref(auth).isAdmin ? (openBlock(), createBlock(_component_Button, {
                      key: 0,
                      variant: "outline",
                      class: "justify-between",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/admin/questions")
                    }, {
                      default: withCtx(() => [
                        createVNode("span", null, "题库管理（管理员）"),
                        createVNode(_component_Icon, {
                          name: "lucide:shield",
                          class: "h-4 w-4"
                        })
                      ]),
                      _: 1
                    }, 8, ["onClick"])) : createCommentVNode("", true)
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section><section class="grid gap-6 lg:grid-cols-2">`);
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`最新 AI 场景模拟`);
                      } else {
                        return [
                          createTextVNode("最新 AI 场景模拟")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`回顾最近一次对话式演练`);
                      } else {
                        return [
                          createTextVNode("回顾最近一次对话式演练")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("最新 AI 场景模拟")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("回顾最近一次对话式演练")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (latestSimulation.value) {
                    _push3(`<div class="space-y-4"${_scopeId2}><div class="grid gap-4 sm:grid-cols-2"${_scopeId2}><div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>场景类别</p><p class="mt-1 font-medium"${_scopeId2}>${ssrInterpolate(latestSimulation.value.scenarioType)}</p></div><div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>难度</p><p class="mt-1 font-medium capitalize"${_scopeId2}>${ssrInterpolate(latestSimulation.value.difficulty)}</p></div><div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>模式</p><p class="mt-1 font-medium"${_scopeId2}>${ssrInterpolate(latestSimulation.value.mode)}</p></div><div${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>对话轮次</p><p class="mt-1 font-medium"${_scopeId2}>${ssrInterpolate(latestSimulation.value.conversationRounds)}</p></div></div><div class="grid gap-4 sm:grid-cols-2"${_scopeId2}><div class="rounded-xl border border-border/70 p-4 text-center"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>最终得分</p><p class="mt-2 text-3xl font-semibold"${_scopeId2}>${ssrInterpolate(latestSimulation.value.finalScore)} 分</p></div><div class="rounded-xl border border-border/70 p-4 text-center"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>结束原因</p><p class="mt-2 text-base font-medium"${_scopeId2}>${ssrInterpolate(latestSimulation.value.endReasonLabel)}</p></div></div><div class="rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-sm"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>表现综述</p><p class="mt-2 text-muted-foreground"${_scopeId2}>${ssrInterpolate(latestSimulation.value.performanceAnalysis)}</p></div></div>`);
                  } else {
                    _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}> 暂无模拟记录，前往 AI 场景模拟体验一场完整的对话演练。 </p>`);
                  }
                } else {
                  return [
                    latestSimulation.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "场景类别"),
                          createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.scenarioType), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "难度"),
                          createVNode("p", { class: "mt-1 font-medium capitalize" }, toDisplayString(latestSimulation.value.difficulty), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "模式"),
                          createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.mode), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "对话轮次"),
                          createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.conversationRounds), 1)
                        ])
                      ]),
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                        createVNode("div", { class: "rounded-xl border border-border/70 p-4 text-center" }, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "最终得分"),
                          createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(latestSimulation.value.finalScore) + " 分", 1)
                        ]),
                        createVNode("div", { class: "rounded-xl border border-border/70 p-4 text-center" }, [
                          createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "结束原因"),
                          createVNode("p", { class: "mt-2 text-base font-medium" }, toDisplayString(latestSimulation.value.endReasonLabel), 1)
                        ])
                      ]),
                      createVNode("div", { class: "rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-sm" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "表现综述"),
                        createVNode("p", { class: "mt-2 text-muted-foreground" }, toDisplayString(latestSimulation.value.performanceAnalysis), 1)
                      ])
                    ])) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-sm text-muted-foreground"
                    }, " 暂无模拟记录，前往 AI 场景模拟体验一场完整的对话演练。 "))
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
                      createTextVNode("最新 AI 场景模拟")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("回顾最近一次对话式演练")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  latestSimulation.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "场景类别"),
                        createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.scenarioType), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "难度"),
                        createVNode("p", { class: "mt-1 font-medium capitalize" }, toDisplayString(latestSimulation.value.difficulty), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "模式"),
                        createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.mode), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "对话轮次"),
                        createVNode("p", { class: "mt-1 font-medium" }, toDisplayString(latestSimulation.value.conversationRounds), 1)
                      ])
                    ]),
                    createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                      createVNode("div", { class: "rounded-xl border border-border/70 p-4 text-center" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "最终得分"),
                        createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(latestSimulation.value.finalScore) + " 分", 1)
                      ]),
                      createVNode("div", { class: "rounded-xl border border-border/70 p-4 text-center" }, [
                        createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "结束原因"),
                        createVNode("p", { class: "mt-2 text-base font-medium" }, toDisplayString(latestSimulation.value.endReasonLabel), 1)
                      ])
                    ]),
                    createVNode("div", { class: "rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-sm" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "表现综述"),
                      createVNode("p", { class: "mt-2 text-muted-foreground" }, toDisplayString(latestSimulation.value.performanceAnalysis), 1)
                    ])
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-sm text-muted-foreground"
                  }, " 暂无模拟记录，前往 AI 场景模拟体验一场完整的对话演练。 "))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`能力雷达图`);
                      } else {
                        return [
                          createTextVNode("能力雷达图")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`从多个维度评估反诈能力`);
                      } else {
                        return [
                          createTextVNode("从多个维度评估反诈能力")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
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
                        createTextVNode("从多个维度评估反诈能力")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, { class: "p-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$8, {
                    profile: simulationRadarProfile.value,
                    height: "320px"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$8, {
                      profile: simulationRadarProfile.value,
                      height: "320px"
                    }, null, 8, ["profile"])
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
                      createTextVNode("能力雷达图")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("从多个维度评估反诈能力")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "p-4" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$8, {
                    profile: simulationRadarProfile.value,
                    height: "320px"
                  }, null, 8, ["profile"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CMlvxKbY.js.map
