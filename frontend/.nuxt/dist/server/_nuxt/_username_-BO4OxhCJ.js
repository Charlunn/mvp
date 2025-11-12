import { _ as _sfc_main$1 } from "./page-header-C0onwRJI.js";
import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$4, c as _sfc_main$5, d as _sfc_main$7 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$6 } from "./badge-DhvO8LwD.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-p1nvN146.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$8 } from "./card-footer-BVBzFtgg.js";
import { _ as _sfc_main$9 } from "./button-BNulVDON.js";
import { d as useRoute, a as useNuxtApp, n as navigateTo } from "../server.mjs";
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ufo/dist/index.mjs";
import "@iconify/vue/dist/offline";
import "@iconify/vue";
import "./index-DmHgaGw0.js";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[username]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { $api } = useNuxtApp();
    const profile = ref(null);
    const profileError = ref(null);
    const posts = ref([]);
    const postsLoading = ref(false);
    const postsError = ref(null);
    const visibilityLabel = computed(() => {
      if (!profile.value) return "未知";
      switch (profile.value.profile_visibility) {
        case "private":
          return "私密主页";
        case "friends":
          return "半公开";
        default:
          return "公开主页";
      }
    });
    const fetchProfile = async () => {
      profileError.value = null;
      try {
        const { data } = await $api.get(`/community/users/${route.params.username}/`);
        profile.value = data;
      } catch (error) {
        const axiosError = error;
        profile.value = null;
        profileError.value = axiosError.response?.data?.detail || "无法获取该用户信息";
      }
    };
    const fetchPosts = async () => {
      postsLoading.value = true;
      postsError.value = null;
      try {
        const { data } = await $api.get(`/community/users/${route.params.username}/posts/`);
        posts.value = Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        const axiosError = error;
        posts.value = [];
        postsError.value = axiosError.response?.data?.detail || "无法获取帖子列表";
      } finally {
        postsLoading.value = false;
      }
    };
    const formatDate = (value) => {
      try {
        return new Date(value).toLocaleString("zh-CN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch (error) {
        return value;
      }
    };
    watch(
      () => route.params.username,
      async () => {
        await fetchProfile();
        await fetchPosts();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$3;
      const _component_CardTitle = _sfc_main$4;
      const _component_CardDescription = _sfc_main$5;
      const _component_Badge = _sfc_main$6;
      const _component_CardContent = _sfc_main$7;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      const _component_CardFooter = _sfc_main$8;
      const _component_Button = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "社区名片",
        description: "查看用户在社区内的贡献与动态"
      }, null, _parent));
      if (unref(profile)) {
        _push(`<div class="grid gap-6 lg:grid-cols-[2fr_1fr]"><section class="space-y-6">`);
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, { class: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_CardTitle, { class: "text-2xl" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(profile).nickname || unref(profile).username)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(profile).nickname || unref(profile).username), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, { class: "text-sm" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(profile).is_self ? "这是你的公共主页" : `@${unref(profile).username}`)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(profile).is_self ? "这是你的公共主页" : `@${unref(profile).username}`), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div><div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Badge, { variant: "outline" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(visibilityLabel))}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(visibilityLabel)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Badge, { variant: "outline" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`帖子 ${ssrInterpolate(unref(profile).community_stats.posts_published)}`);
                        } else {
                          return [
                            createTextVNode("帖子 " + toDisplayString(unref(profile).community_stats.posts_published), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Badge, { variant: "outline" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`评论 ${ssrInterpolate(unref(profile).community_stats.comments_written)}`);
                        } else {
                          return [
                            createTextVNode("评论 " + toDisplayString(unref(profile).community_stats.comments_written), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", null, [
                        createVNode(_component_CardTitle, { class: "text-2xl" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(profile).nickname || unref(profile).username), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, { class: "text-sm" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(profile).is_self ? "这是你的公共主页" : `@${unref(profile).username}`), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground" }, [
                        createVNode(_component_Badge, { variant: "outline" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(visibilityLabel)), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Badge, { variant: "outline" }, {
                          default: withCtx(() => [
                            createTextVNode("帖子 " + toDisplayString(unref(profile).community_stats.posts_published), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Badge, { variant: "outline" }, {
                          default: withCtx(() => [
                            createTextVNode("评论 " + toDisplayString(unref(profile).community_stats.comments_written), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-3 text-sm" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="grid gap-4 md:grid-cols-2"${_scopeId2}><div${_scopeId2}><p class="text-xs text-muted-foreground"${_scopeId2}>邮箱</p><p${_scopeId2}>${ssrInterpolate(unref(profile).email || "未公开")}</p></div><div${_scopeId2}><p class="text-xs text-muted-foreground"${_scopeId2}>手机号</p><p${_scopeId2}>${ssrInterpolate(unref(profile).phone_number || "未公开")}</p></div><div${_scopeId2}><p class="text-xs text-muted-foreground"${_scopeId2}>帖子获赞</p><p${_scopeId2}>${ssrInterpolate(unref(profile).community_stats.post_likes_received)}</p></div><div${_scopeId2}><p class="text-xs text-muted-foreground"${_scopeId2}>评论获赞</p><p${_scopeId2}>${ssrInterpolate(unref(profile).community_stats.comment_likes_received)}</p></div></div><div class="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground"${_scopeId2}><p${_scopeId2}>隐私设置： `);
                    if (unref(profile).profile_visibility === "private") {
                      _push3(`<span${_scopeId2}>仅本人可见</span>`);
                    } else if (unref(profile).profile_visibility === "friends") {
                      _push3(`<span${_scopeId2}>仅授权用户可见</span>`);
                    } else {
                      _push3(`<span${_scopeId2}>公开主页</span>`);
                    }
                    _push3(`</p><p${_scopeId2}>展示邮箱：${ssrInterpolate(unref(profile).show_email ? "是" : "否")} · 展示手机号：${ssrInterpolate(unref(profile).show_phone ? "是" : "否")}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs text-muted-foreground" }, "邮箱"),
                          createVNode("p", null, toDisplayString(unref(profile).email || "未公开"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs text-muted-foreground" }, "手机号"),
                          createVNode("p", null, toDisplayString(unref(profile).phone_number || "未公开"), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs text-muted-foreground" }, "帖子获赞"),
                          createVNode("p", null, toDisplayString(unref(profile).community_stats.post_likes_received), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "text-xs text-muted-foreground" }, "评论获赞"),
                          createVNode("p", null, toDisplayString(unref(profile).community_stats.comment_likes_received), 1)
                        ])
                      ]),
                      createVNode("div", { class: "rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground" }, [
                        createVNode("p", null, [
                          createTextVNode("隐私设置： "),
                          unref(profile).profile_visibility === "private" ? (openBlock(), createBlock("span", { key: 0 }, "仅本人可见")) : unref(profile).profile_visibility === "friends" ? (openBlock(), createBlock("span", { key: 1 }, "仅授权用户可见")) : (openBlock(), createBlock("span", { key: 2 }, "公开主页"))
                        ]),
                        createVNode("p", null, "展示邮箱：" + toDisplayString(unref(profile).show_email ? "是" : "否") + " · 展示手机号：" + toDisplayString(unref(profile).show_phone ? "是" : "否"), 1)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_CardHeader, { class: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" }, {
                  default: withCtx(() => [
                    createVNode("div", null, [
                      createVNode(_component_CardTitle, { class: "text-2xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(profile).nickname || unref(profile).username), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, { class: "text-sm" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(profile).is_self ? "这是你的公共主页" : `@${unref(profile).username}`), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground" }, [
                      createVNode(_component_Badge, { variant: "outline" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(visibilityLabel)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Badge, { variant: "outline" }, {
                        default: withCtx(() => [
                          createTextVNode("帖子 " + toDisplayString(unref(profile).community_stats.posts_published), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Badge, { variant: "outline" }, {
                        default: withCtx(() => [
                          createTextVNode("评论 " + toDisplayString(unref(profile).community_stats.comments_written), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, { class: "space-y-3 text-sm" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "grid gap-4 md:grid-cols-2" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-muted-foreground" }, "邮箱"),
                        createVNode("p", null, toDisplayString(unref(profile).email || "未公开"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-muted-foreground" }, "手机号"),
                        createVNode("p", null, toDisplayString(unref(profile).phone_number || "未公开"), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-muted-foreground" }, "帖子获赞"),
                        createVNode("p", null, toDisplayString(unref(profile).community_stats.post_likes_received), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-muted-foreground" }, "评论获赞"),
                        createVNode("p", null, toDisplayString(unref(profile).community_stats.comment_likes_received), 1)
                      ])
                    ]),
                    createVNode("div", { class: "rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground" }, [
                      createVNode("p", null, [
                        createTextVNode("隐私设置： "),
                        unref(profile).profile_visibility === "private" ? (openBlock(), createBlock("span", { key: 0 }, "仅本人可见")) : unref(profile).profile_visibility === "friends" ? (openBlock(), createBlock("span", { key: 1 }, "仅授权用户可见")) : (openBlock(), createBlock("span", { key: 2 }, "公开主页"))
                      ]),
                      createVNode("p", null, "展示邮箱：" + toDisplayString(unref(profile).show_email ? "是" : "否") + " · 展示手机号：" + toDisplayString(unref(profile).show_phone ? "是" : "否"), 1)
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`最近发表`);
                        } else {
                          return [
                            createTextVNode("最近发表")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`浏览该用户最近的帖子与互动`);
                        } else {
                          return [
                            createTextVNode("浏览该用户最近的帖子与互动")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("最近发表")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("浏览该用户最近的帖子与互动")
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
                    if (unref(postsError)) {
                      _push3(`<div class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"${_scopeId2}>${ssrInterpolate(unref(postsError))}</div>`);
                    } else if (unref(postsLoading)) {
                      _push3(`<div class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"${_scopeId2}> 正在加载帖子… </div>`);
                    } else if (!unref(posts).length) {
                      _push3(`<div class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"${_scopeId2}> 暂无帖子。 </div>`);
                    } else {
                      _push3(`<div class="space-y-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(posts), (post) => {
                        _push3(ssrRenderComponent(_component_Card, {
                          key: post.id,
                          class: "border border-border/70"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(ssrRenderComponent(_component_CardHeader, null, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`${ssrInterpolate(post.title)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(post.title), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                    _push5(ssrRenderComponent(_component_CardDescription, null, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(` 发布于 `);
                                          _push6(ssrRenderComponent(_component_NuxtLink, {
                                            to: `/community/${post.community_detail.slug}`,
                                            class: "font-medium hover:underline"
                                          }, {
                                            default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                              if (_push7) {
                                                _push7(`${ssrInterpolate(post.community_detail.name)}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(post.community_detail.name), 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent6, _scopeId5));
                                          _push6(` · ${ssrInterpolate(formatDate(post.created_at))}`);
                                        } else {
                                          return [
                                            createTextVNode(" 发布于 "),
                                            createVNode(_component_NuxtLink, {
                                              to: `/community/${post.community_detail.slug}`,
                                              class: "font-medium hover:underline"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(post.community_detail.name), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["to"]),
                                            createTextVNode(" · " + toDisplayString(formatDate(post.created_at)), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(_component_CardTitle, { class: "text-lg" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(post.title), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_CardDescription, null, {
                                        default: withCtx(() => [
                                          createTextVNode(" 发布于 "),
                                          createVNode(_component_NuxtLink, {
                                            to: `/community/${post.community_detail.slug}`,
                                            class: "font-medium hover:underline"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(post.community_detail.name), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["to"]),
                                          createTextVNode(" · " + toDisplayString(formatDate(post.created_at)), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                              _push4(ssrRenderComponent(_component_CardContent, { class: "space-y-3 text-sm" }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`<p class="line-clamp-3 whitespace-pre-line leading-relaxed"${_scopeId4}>${ssrInterpolate(post.body)}</p><div class="flex items-center gap-4 text-muted-foreground"${_scopeId4}><span class="flex items-center gap-1"${_scopeId4}>`);
                                    _push5(ssrRenderComponent(_component_Icon, {
                                      name: "lucide:heart",
                                      class: "h-4 w-4"
                                    }, null, _parent5, _scopeId4));
                                    _push5(`${ssrInterpolate(post.like_count)}</span><span class="flex items-center gap-1"${_scopeId4}>`);
                                    _push5(ssrRenderComponent(_component_Icon, {
                                      name: "lucide:message-square",
                                      class: "h-4 w-4"
                                    }, null, _parent5, _scopeId4));
                                    _push5(`${ssrInterpolate(post.comment_count)}</span></div>`);
                                  } else {
                                    return [
                                      createVNode("p", { class: "line-clamp-3 whitespace-pre-line leading-relaxed" }, toDisplayString(post.body), 1),
                                      createVNode("div", { class: "flex items-center gap-4 text-muted-foreground" }, [
                                        createVNode("span", { class: "flex items-center gap-1" }, [
                                          createVNode(_component_Icon, {
                                            name: "lucide:heart",
                                            class: "h-4 w-4"
                                          }),
                                          createTextVNode(toDisplayString(post.like_count), 1)
                                        ]),
                                        createVNode("span", { class: "flex items-center gap-1" }, [
                                          createVNode(_component_Icon, {
                                            name: "lucide:message-square",
                                            class: "h-4 w-4"
                                          }),
                                          createTextVNode(toDisplayString(post.comment_count), 1)
                                        ])
                                      ])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                              _push4(ssrRenderComponent(_component_CardFooter, null, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(_component_Button, {
                                      variant: "ghost",
                                      size: "sm",
                                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`查看详情`);
                                        } else {
                                          return [
                                            createTextVNode("查看详情")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(_component_Button, {
                                        variant: "ghost",
                                        size: "sm",
                                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("查看详情")
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            } else {
                              return [
                                createVNode(_component_CardHeader, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_CardTitle, { class: "text-lg" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(post.title), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_CardDescription, null, {
                                      default: withCtx(() => [
                                        createTextVNode(" 发布于 "),
                                        createVNode(_component_NuxtLink, {
                                          to: `/community/${post.community_detail.slug}`,
                                          class: "font-medium hover:underline"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(post.community_detail.name), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["to"]),
                                        createTextVNode(" · " + toDisplayString(formatDate(post.created_at)), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_CardContent, { class: "space-y-3 text-sm" }, {
                                  default: withCtx(() => [
                                    createVNode("p", { class: "line-clamp-3 whitespace-pre-line leading-relaxed" }, toDisplayString(post.body), 1),
                                    createVNode("div", { class: "flex items-center gap-4 text-muted-foreground" }, [
                                      createVNode("span", { class: "flex items-center gap-1" }, [
                                        createVNode(_component_Icon, {
                                          name: "lucide:heart",
                                          class: "h-4 w-4"
                                        }),
                                        createTextVNode(toDisplayString(post.like_count), 1)
                                      ]),
                                      createVNode("span", { class: "flex items-center gap-1" }, [
                                        createVNode(_component_Icon, {
                                          name: "lucide:message-square",
                                          class: "h-4 w-4"
                                        }),
                                        createTextVNode(toDisplayString(post.comment_count), 1)
                                      ])
                                    ])
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_CardFooter, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_Button, {
                                      variant: "ghost",
                                      size: "sm",
                                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("查看详情")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      });
                      _push3(`<!--]--></div>`);
                    }
                  } else {
                    return [
                      unref(postsError) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                      }, toDisplayString(unref(postsError)), 1)) : unref(postsLoading) ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                      }, " 正在加载帖子… ")) : !unref(posts).length ? (openBlock(), createBlock("div", {
                        key: 2,
                        class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                      }, " 暂无帖子。 ")) : (openBlock(), createBlock("div", {
                        key: 3,
                        class: "space-y-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(posts), (post) => {
                          return openBlock(), createBlock(_component_Card, {
                            key: post.id,
                            class: "border border-border/70"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_CardHeader, null, {
                                default: withCtx(() => [
                                  createVNode(_component_CardTitle, { class: "text-lg" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(post.title), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(_component_CardDescription, null, {
                                    default: withCtx(() => [
                                      createTextVNode(" 发布于 "),
                                      createVNode(_component_NuxtLink, {
                                        to: `/community/${post.community_detail.slug}`,
                                        class: "font-medium hover:underline"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(post.community_detail.name), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["to"]),
                                      createTextVNode(" · " + toDisplayString(formatDate(post.created_at)), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_CardContent, { class: "space-y-3 text-sm" }, {
                                default: withCtx(() => [
                                  createVNode("p", { class: "line-clamp-3 whitespace-pre-line leading-relaxed" }, toDisplayString(post.body), 1),
                                  createVNode("div", { class: "flex items-center gap-4 text-muted-foreground" }, [
                                    createVNode("span", { class: "flex items-center gap-1" }, [
                                      createVNode(_component_Icon, {
                                        name: "lucide:heart",
                                        class: "h-4 w-4"
                                      }),
                                      createTextVNode(toDisplayString(post.like_count), 1)
                                    ]),
                                    createVNode("span", { class: "flex items-center gap-1" }, [
                                      createVNode(_component_Icon, {
                                        name: "lucide:message-square",
                                        class: "h-4 w-4"
                                      }),
                                      createTextVNode(toDisplayString(post.comment_count), 1)
                                    ])
                                  ])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_CardFooter, null, {
                                default: withCtx(() => [
                                  createVNode(_component_Button, {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("查看详情")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
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
                        createTextVNode("最近发表")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("浏览该用户最近的帖子与互动")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, null, {
                  default: withCtx(() => [
                    unref(postsError) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                    }, toDisplayString(unref(postsError)), 1)) : unref(postsLoading) ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                    }, " 正在加载帖子… ")) : !unref(posts).length ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                    }, " 暂无帖子。 ")) : (openBlock(), createBlock("div", {
                      key: 3,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(posts), (post) => {
                        return openBlock(), createBlock(_component_Card, {
                          key: post.id,
                          class: "border border-border/70"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_CardHeader, null, {
                              default: withCtx(() => [
                                createVNode(_component_CardTitle, { class: "text-lg" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(post.title), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(_component_CardDescription, null, {
                                  default: withCtx(() => [
                                    createTextVNode(" 发布于 "),
                                    createVNode(_component_NuxtLink, {
                                      to: `/community/${post.community_detail.slug}`,
                                      class: "font-medium hover:underline"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(post.community_detail.name), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["to"]),
                                    createTextVNode(" · " + toDisplayString(formatDate(post.created_at)), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_CardContent, { class: "space-y-3 text-sm" }, {
                              default: withCtx(() => [
                                createVNode("p", { class: "line-clamp-3 whitespace-pre-line leading-relaxed" }, toDisplayString(post.body), 1),
                                createVNode("div", { class: "flex items-center gap-4 text-muted-foreground" }, [
                                  createVNode("span", { class: "flex items-center gap-1" }, [
                                    createVNode(_component_Icon, {
                                      name: "lucide:heart",
                                      class: "h-4 w-4"
                                    }),
                                    createTextVNode(toDisplayString(post.like_count), 1)
                                  ]),
                                  createVNode("span", { class: "flex items-center gap-1" }, [
                                    createVNode(_component_Icon, {
                                      name: "lucide:message-square",
                                      class: "h-4 w-4"
                                    }),
                                    createTextVNode(toDisplayString(post.comment_count), 1)
                                  ])
                                ])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_CardFooter, null, {
                              default: withCtx(() => [
                                createVNode(_component_Button, {
                                  variant: "ghost",
                                  size: "sm",
                                  onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("查看详情")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]))
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section><aside class="space-y-4">`);
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70 bg-secondary/20" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`社区积分`);
                        } else {
                          return [
                            createTextVNode("社区积分")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`统计来自公开互动的数据`);
                        } else {
                          return [
                            createTextVNode("统计来自公开互动的数据")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("社区积分")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("统计来自公开互动的数据")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-2 text-sm" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p${_scopeId2}>帖子数量：${ssrInterpolate(unref(profile).community_stats.posts_published)}</p><p${_scopeId2}>评论数量：${ssrInterpolate(unref(profile).community_stats.comments_written)}</p><p${_scopeId2}>帖子获赞：${ssrInterpolate(unref(profile).community_stats.post_likes_received)}</p><p${_scopeId2}>评论获赞：${ssrInterpolate(unref(profile).community_stats.comment_likes_received)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, "帖子数量：" + toDisplayString(unref(profile).community_stats.posts_published), 1),
                      createVNode("p", null, "评论数量：" + toDisplayString(unref(profile).community_stats.comments_written), 1),
                      createVNode("p", null, "帖子获赞：" + toDisplayString(unref(profile).community_stats.post_likes_received), 1),
                      createVNode("p", null, "评论获赞：" + toDisplayString(unref(profile).community_stats.comment_likes_received), 1)
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
                        createTextVNode("社区积分")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("统计来自公开互动的数据")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, { class: "space-y-2 text-sm" }, {
                  default: withCtx(() => [
                    createVNode("p", null, "帖子数量：" + toDisplayString(unref(profile).community_stats.posts_published), 1),
                    createVNode("p", null, "评论数量：" + toDisplayString(unref(profile).community_stats.comments_written), 1),
                    createVNode("p", null, "帖子获赞：" + toDisplayString(unref(profile).community_stats.post_likes_received), 1),
                    createVNode("p", null, "评论获赞：" + toDisplayString(unref(profile).community_stats.comment_likes_received), 1)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`互动力度`);
                        } else {
                          return [
                            createTextVNode("互动力度")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`了解该用户在社区的参与趋势`);
                        } else {
                          return [
                            createTextVNode("了解该用户在社区的参与趋势")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("互动力度")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("了解该用户在社区的参与趋势")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-2 text-xs text-muted-foreground" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p${_scopeId2}>· 若主页设为私密，只有本人及管理员可见详细资料。</p><p${_scopeId2}>· 帖子与评论获赞越多，可信度越高。</p><p${_scopeId2}>· 设置隐私字段可控制邮箱和手机号是否公开。</p>`);
                  } else {
                    return [
                      createVNode("p", null, "· 若主页设为私密，只有本人及管理员可见详细资料。"),
                      createVNode("p", null, "· 帖子与评论获赞越多，可信度越高。"),
                      createVNode("p", null, "· 设置隐私字段可控制邮箱和手机号是否公开。")
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
                        createTextVNode("互动力度")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("了解该用户在社区的参与趋势")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, { class: "space-y-2 text-xs text-muted-foreground" }, {
                  default: withCtx(() => [
                    createVNode("p", null, "· 若主页设为私密，只有本人及管理员可见详细资料。"),
                    createVNode("p", null, "· 帖子与评论获赞越多，可信度越高。"),
                    createVNode("p", null, "· 设置隐私字段可控制邮箱和手机号是否公开。")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</aside></div>`);
      } else {
        _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">${ssrInterpolate(unref(profileError) || "正在加载用户资料…")}</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users/[username].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_username_-BO4OxhCJ.js.map
