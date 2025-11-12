import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$1 } from "./badge-DhvO8LwD.js";
import { _ as _sfc_main$2 } from "./button-BNulVDON.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-p1nvN146.js";
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$7 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$8 } from "./label-s03MuIA6.js";
import { _ as _sfc_main$9 } from "./input-DmJdLXAM.js";
import { _ as _sfc_main$a } from "./textarea-BLn6_hn8.js";
import { _ as _sfc_main$b } from "./card-footer-BVBzFtgg.js";
import { d as useRoute, u as useAuthStore, a as useNuxtApp, n as navigateTo } from "../server.mjs";
import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, withModifiers, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import "@iconify/vue/dist/offline";
import "@iconify/vue";
import "./index-DmHgaGw0.js";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/defu/dist/defu.mjs";
import "clsx";
import "tailwind-merge";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/ufo/dist/index.mjs";
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const auth = useAuthStore();
    const { $api, $config } = useNuxtApp();
    const community = ref(null);
    const actionLoading = ref(false);
    const feedLoading = ref(false);
    const posts = ref([]);
    const hasMore = ref(false);
    const currentPage = ref(1);
    const createLoading = ref(false);
    const postForm = reactive({
      title: "",
      body: "",
      images: []
    });
    const isMember = computed(() => Boolean(community.value?.current_role));
    const emptyMessage = computed(() => {
      if (community.value?.is_private && !isMember.value) {
        return "加入社区后即可查看全部帖子";
      }
      return "暂无帖子，快来发布第一条内容吧";
    });
    const fetchCommunity = async () => {
      try {
        const { data } = await $api.get(`/community/communities/${route.params.slug}/`);
        community.value = data;
      } catch (error) {
        console.error("加载社区详情失败", error);
        community.value = null;
      }
    };
    const fetchPosts = async (page = 1, append = false) => {
      feedLoading.value = true;
      try {
        const { data } = await $api.get("/community/posts/", {
          params: { community: route.params.slug, page }
        });
        const results = Array.isArray(data) ? data : data.results || [];
        if (append) {
          posts.value = [...posts.value, ...results];
        } else {
          posts.value = results;
        }
        hasMore.value = Boolean(data?.next);
        currentPage.value = page;
      } catch (error) {
        console.error("加载社区帖子失败", error);
        if (!append) posts.value = [];
      } finally {
        feedLoading.value = false;
      }
    };
    const joinCommunity = async () => {
      if (!auth.isAuthenticated) {
        (void 0).alert("请先登录后再加入社区");
        return;
      }
      actionLoading.value = true;
      try {
        await $api.post(`/community/communities/${route.params.slug}/join/`);
        await fetchCommunity();
        await fetchPosts();
        (void 0).alert("已加入社区");
      } catch (error) {
        console.error("加入社区失败", error);
        (void 0).alert("加入失败，请稍后重试");
      } finally {
        actionLoading.value = false;
      }
    };
    const leaveCommunity = async () => {
      actionLoading.value = true;
      try {
        await $api.post(`/community/communities/${route.params.slug}/leave/`);
        await fetchCommunity();
        await fetchPosts();
        (void 0).alert("已退出社区");
      } catch (error) {
        console.error("退出社区失败", error);
        (void 0).alert("退出失败，请稍后重试");
      } finally {
        actionLoading.value = false;
      }
    };
    const handleFileChange = (event) => {
      const target = event.target;
      postForm.images = Array.from(target.files ?? []);
    };
    const submitPost = async () => {
      if (!postForm.title.trim() || !postForm.body.trim()) return;
      createLoading.value = true;
      try {
        const formData = new FormData();
        formData.append("community", String(community.value?.id ?? ""));
        formData.append("title", postForm.title);
        formData.append("body", postForm.body);
        postForm.images.forEach((file) => formData.append("images", file));
        await $api.post("/community/posts/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        postForm.title = "";
        postForm.body = "";
        postForm.images = [];
        await fetchPosts();
        (void 0).alert("帖子已发布");
      } catch (error) {
        console.error("发布帖子失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "发布失败，请稍后重试");
      } finally {
        createLoading.value = false;
      }
    };
    const toggleLike = async (post) => {
      if (!auth.isAuthenticated) {
        (void 0).alert("请先登录后再点赞");
        return;
      }
      try {
        const { data } = await $api.post(`/community/posts/${post.id}/like/`);
        post.is_liked = Boolean(data?.liked);
        if (typeof data?.like_count === "number") {
          post.like_count = data.like_count;
        }
      } catch (error) {
        console.error("点赞失败", error);
      }
    };
    const loadMore = () => {
      if (!hasMore.value || feedLoading.value) return;
      fetchPosts(currentPage.value + 1, true);
    };
    const refreshPosts = () => fetchPosts(1, false);
    const resolveMedia = (path) => {
      if (!path) return "";
      if (path.startsWith("http")) return path;
      const base = $config.public.apiBase?.replace(/\/$/, "") ?? "";
      return `${base}${path}`;
    };
    const formatDate = (value) => {
      if (!value) return "-";
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
      () => route.params.slug,
      async () => {
        await fetchCommunity();
        await fetchPosts();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_Badge = _sfc_main$1;
      const _component_Button = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Card = _sfc_main$3;
      const _component_CardHeader = _sfc_main$4;
      const _component_CardTitle = _sfc_main$5;
      const _component_CardDescription = _sfc_main$6;
      const _component_CardContent = _sfc_main$7;
      const _component_Label = _sfc_main$8;
      const _component_Input = _sfc_main$9;
      const _component_Textarea = _sfc_main$a;
      const _component_CardFooter = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="rounded-2xl border border-border/70 bg-secondary/30 p-6">`);
      if (unref(community)) {
        _push(`<div class="space-y-4"><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 class="text-2xl font-semibold">${ssrInterpolate(unref(community).name)}</h1><p class="mt-1 max-w-2xl text-sm text-muted-foreground">${ssrInterpolate(unref(community).description || "这个社区还没有简介。")}</p></div><div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span class="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:users",
          class: "h-4 w-4"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(community).members_count)} 名成员 </span>`);
        if (unref(community).is_private) {
          _push(`<span class="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "lucide:lock",
            class: "h-4 w-4"
          }, null, _parent));
          _push(` 私密社区 </span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(community).current_role === "moderator") {
          _push(ssrRenderComponent(_component_Badge, { variant: "outline" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`社区管理员`);
              } else {
                return [
                  createTextVNode("社区管理员")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="flex flex-wrap items-center gap-3">`);
        if (!unref(isMember)) {
          _push(ssrRenderComponent(_component_Button, {
            disabled: unref(actionLoading),
            onClick: joinCommunity
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(actionLoading) ? "处理中…" : "加入社区")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(actionLoading) ? "处理中…" : "加入社区"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(_component_Button, {
            variant: "outline",
            disabled: unref(actionLoading),
            onClick: leaveCommunity
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(actionLoading) ? "处理中…" : "退出社区")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(actionLoading) ? "处理中…" : "退出社区"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/community",
          class: "text-sm text-muted-foreground hover:text-foreground"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` 返回社区广场 `);
            } else {
              return [
                createTextVNode(" 返回社区广场 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="text-sm text-muted-foreground">正在加载社区信息…</div>`);
      }
      _push(`</div><section class="grid gap-6 lg:grid-cols-[2fr_1fr]"><div class="space-y-4">`);
      if (unref(auth).isAuthenticated && unref(isMember)) {
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`分享新帖子`);
                        } else {
                          return [
                            createTextVNode("分享新帖子")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`与社区成员交流实战经验`);
                        } else {
                          return [
                            createTextVNode("与社区成员交流实战经验")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("分享新帖子")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("与社区成员交流实战经验")
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
                    _push3(`<form class="space-y-4"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "title" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`标题`);
                        } else {
                          return [
                            createTextVNode("标题")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "title",
                      modelValue: unref(postForm).title,
                      "onUpdate:modelValue": ($event) => unref(postForm).title = $event,
                      placeholder: "一句话概括你的观点",
                      required: ""
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "body" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`内容`);
                        } else {
                          return [
                            createTextVNode("内容")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Textarea, {
                      id: "body",
                      modelValue: unref(postForm).body,
                      "onUpdate:modelValue": ($event) => unref(postForm).body = $event,
                      rows: "4",
                      placeholder: "详细描述你的案例或问题",
                      required: ""
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { class: "mb-1 block text-sm font-medium text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`上传图片（可选）`);
                        } else {
                          return [
                            createTextVNode("上传图片（可选）")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<input type="file" multiple accept="image/*" class="w-full text-sm"${_scopeId2}>`);
                    if (unref(postForm).images.length) {
                      _push3(`<p class="mt-2 text-xs text-muted-foreground"${_scopeId2}>已选择 ${ssrInterpolate(unref(postForm).images.length)} 张图片</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="flex justify-end"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      type: "submit",
                      disabled: unref(createLoading)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(createLoading) ? "发布中…" : "发布")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(createLoading) ? "发布中…" : "发布"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div></form>`);
                  } else {
                    return [
                      createVNode("form", {
                        class: "space-y-4",
                        onSubmit: withModifiers(submitPost, ["prevent"])
                      }, [
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "title" }, {
                            default: withCtx(() => [
                              createTextVNode("标题")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Input, {
                            id: "title",
                            modelValue: unref(postForm).title,
                            "onUpdate:modelValue": ($event) => unref(postForm).title = $event,
                            placeholder: "一句话概括你的观点",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "body" }, {
                            default: withCtx(() => [
                              createTextVNode("内容")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Textarea, {
                            id: "body",
                            modelValue: unref(postForm).body,
                            "onUpdate:modelValue": ($event) => unref(postForm).body = $event,
                            rows: "4",
                            placeholder: "详细描述你的案例或问题",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, { class: "mb-1 block text-sm font-medium text-muted-foreground" }, {
                            default: withCtx(() => [
                              createTextVNode("上传图片（可选）")
                            ]),
                            _: 1
                          }),
                          createVNode("input", {
                            type: "file",
                            multiple: "",
                            accept: "image/*",
                            class: "w-full text-sm",
                            onChange: handleFileChange
                          }, null, 32),
                          unref(postForm).images.length ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-2 text-xs text-muted-foreground"
                          }, "已选择 " + toDisplayString(unref(postForm).images.length) + " 张图片", 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex justify-end" }, [
                          createVNode(_component_Button, {
                            type: "submit",
                            disabled: unref(createLoading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(createLoading) ? "发布中…" : "发布"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ])
                      ], 32)
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
                        createTextVNode("分享新帖子")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("与社区成员交流实战经验")
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
                      onSubmit: withModifiers(submitPost, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "title" }, {
                          default: withCtx(() => [
                            createTextVNode("标题")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "title",
                          modelValue: unref(postForm).title,
                          "onUpdate:modelValue": ($event) => unref(postForm).title = $event,
                          placeholder: "一句话概括你的观点",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "body" }, {
                          default: withCtx(() => [
                            createTextVNode("内容")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Textarea, {
                          id: "body",
                          modelValue: unref(postForm).body,
                          "onUpdate:modelValue": ($event) => unref(postForm).body = $event,
                          rows: "4",
                          placeholder: "详细描述你的案例或问题",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { class: "mb-1 block text-sm font-medium text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("上传图片（可选）")
                          ]),
                          _: 1
                        }),
                        createVNode("input", {
                          type: "file",
                          multiple: "",
                          accept: "image/*",
                          class: "w-full text-sm",
                          onChange: handleFileChange
                        }, null, 32),
                        unref(postForm).images.length ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-2 text-xs text-muted-foreground"
                        }, "已选择 " + toDisplayString(unref(postForm).images.length) + " 张图片", 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex justify-end" }, [
                        createVNode(_component_Button, {
                          type: "submit",
                          disabled: unref(createLoading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(createLoading) ? "发布中…" : "发布"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ], 32)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (unref(community) && unref(community).is_private && !unref(isMember)) {
        _push(ssrRenderComponent(_component_Card, { class: "border border-dashed border-border/70 bg-muted/20" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`加入后查看讨论`);
                        } else {
                          return [
                            createTextVNode("加入后查看讨论")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`这是一个私密社区，成员加入后可访问全部内容`);
                        } else {
                          return [
                            createTextVNode("这是一个私密社区，成员加入后可访问全部内容")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("加入后查看讨论")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("这是一个私密社区，成员加入后可访问全部内容")
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
                    _push3(ssrRenderComponent(_component_Button, {
                      class: "w-full",
                      disabled: unref(actionLoading),
                      onClick: joinCommunity
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`申请加入`);
                        } else {
                          return [
                            createTextVNode("申请加入")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Button, {
                        class: "w-full",
                        disabled: unref(actionLoading),
                        onClick: joinCommunity
                      }, {
                        default: withCtx(() => [
                          createTextVNode("申请加入")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
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
                        createTextVNode("加入后查看讨论")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("这是一个私密社区，成员加入后可访问全部内容")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, null, {
                  default: withCtx(() => [
                    createVNode(_component_Button, {
                      class: "w-full",
                      disabled: unref(actionLoading),
                      onClick: joinCommunity
                    }, {
                      default: withCtx(() => [
                        createTextVNode("申请加入")
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold">社区动态</h2>`);
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        size: "sm",
        disabled: unref(feedLoading),
        onClick: refreshPosts
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:refresh-cw",
              class: "mr-1 h-4 w-4"
            }, null, _parent2, _scopeId));
            _push2(`刷新 `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:refresh-cw",
                class: "mr-1 h-4 w-4"
              }),
              createTextVNode("刷新 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(feedLoading) && !unref(posts).length) {
        _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground"> 正在加载帖子… </div>`);
      } else if (!unref(posts).length) {
        _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">${ssrInterpolate(unref(emptyMessage))}</div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(posts), (post) => {
          _push(ssrRenderComponent(_component_Card, {
            key: post.id,
            class: "border border-border/70"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_CardHeader, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_CardTitle, { class: "text-xl" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(post.title)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(post.title), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_CardDescription, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_NuxtLink, {
                              to: `/users/${post.author.username}`,
                              class: "font-medium hover:underline"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(post.author.nickname || post.author.username)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(` · ${ssrInterpolate(formatDate(post.created_at))}`);
                          } else {
                            return [
                              createVNode(_component_NuxtLink, {
                                to: `/users/${post.author.username}`,
                                class: "font-medium hover:underline"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"]),
                              createTextVNode(" · " + toDisplayString(formatDate(post.created_at)), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_CardTitle, { class: "text-xl" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(post.title), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, {
                              to: `/users/${post.author.username}`,
                              class: "font-medium hover:underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
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
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-4" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<p class="whitespace-pre-line text-sm leading-relaxed"${_scopeId2}>${ssrInterpolate(post.body)}</p>`);
                      if (post.images.length) {
                        _push3(`<div class="grid gap-3 md:grid-cols-2"${_scopeId2}><!--[-->`);
                        ssrRenderList(post.images, (image) => {
                          _push3(`<img${ssrRenderAttr("src", resolveMedia(image.image))} class="h-48 w-full rounded-lg object-cover"${_scopeId2}>`);
                        });
                        _push3(`<!--]--></div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        createVNode("p", { class: "whitespace-pre-line text-sm leading-relaxed" }, toDisplayString(post.body), 1),
                        post.images.length ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-3 md:grid-cols-2"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(post.images, (image) => {
                            return openBlock(), createBlock("img", {
                              key: image.id,
                              src: resolveMedia(image.image),
                              class: "h-48 w-full rounded-lg object-cover"
                            }, null, 8, ["src"]);
                          }), 128))
                        ])) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_CardFooter, { class: "flex items-center justify-between text-sm text-muted-foreground" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center gap-4"${_scopeId2}><button class="${ssrRenderClass([post.is_liked ? "text-primary" : "", "flex items-center gap-1"])}"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Icon, {
                        name: post.is_liked ? "lucide:heart" : "lucide:heart-off",
                        class: "h-4 w-4"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>${ssrInterpolate(post.like_count)}</span></button><div class="flex items-center gap-1"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Icon, {
                        name: "lucide:message-square",
                        class: "h-4 w-4"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span${_scopeId2}>${ssrInterpolate(post.comment_count)}</span></div></div>`);
                      _push3(ssrRenderComponent(_component_Button, {
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/posts/${post.id}`)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`查看详情`);
                          } else {
                            return [
                              createTextVNode("查看详情")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center gap-4" }, [
                          createVNode("button", {
                            class: ["flex items-center gap-1", post.is_liked ? "text-primary" : ""],
                            onClick: ($event) => toggleLike(post)
                          }, [
                            createVNode(_component_Icon, {
                              name: post.is_liked ? "lucide:heart" : "lucide:heart-off",
                              class: "h-4 w-4"
                            }, null, 8, ["name"]),
                            createVNode("span", null, toDisplayString(post.like_count), 1)
                          ], 10, ["onClick"]),
                          createVNode("div", { class: "flex items-center gap-1" }, [
                            createVNode(_component_Icon, {
                              name: "lucide:message-square",
                              class: "h-4 w-4"
                            }),
                            createVNode("span", null, toDisplayString(post.comment_count), 1)
                          ])
                        ]),
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
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_CardHeader, null, {
                    default: withCtx(() => [
                      createVNode(_component_CardTitle, { class: "text-xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(post.title), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, {
                            to: `/users/${post.author.username}`,
                            class: "font-medium hover:underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
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
                  createVNode(_component_CardContent, { class: "space-y-4" }, {
                    default: withCtx(() => [
                      createVNode("p", { class: "whitespace-pre-line text-sm leading-relaxed" }, toDisplayString(post.body), 1),
                      post.images.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-3 md:grid-cols-2"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(post.images, (image) => {
                          return openBlock(), createBlock("img", {
                            key: image.id,
                            src: resolveMedia(image.image),
                            class: "h-48 w-full rounded-lg object-cover"
                          }, null, 8, ["src"]);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024),
                  createVNode(_component_CardFooter, { class: "flex items-center justify-between text-sm text-muted-foreground" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("button", {
                          class: ["flex items-center gap-1", post.is_liked ? "text-primary" : ""],
                          onClick: ($event) => toggleLike(post)
                        }, [
                          createVNode(_component_Icon, {
                            name: post.is_liked ? "lucide:heart" : "lucide:heart-off",
                            class: "h-4 w-4"
                          }, null, 8, ["name"]),
                          createVNode("span", null, toDisplayString(post.like_count), 1)
                        ], 10, ["onClick"]),
                        createVNode("div", { class: "flex items-center gap-1" }, [
                          createVNode(_component_Icon, {
                            name: "lucide:message-square",
                            class: "h-4 w-4"
                          }),
                          createVNode("span", null, toDisplayString(post.comment_count), 1)
                        ])
                      ]),
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
          }, _parent));
        });
        _push(`<!--]-->`);
        if (unref(hasMore)) {
          _push(`<div class="flex justify-center">`);
          _push(ssrRenderComponent(_component_Button, {
            variant: "outline",
            disabled: unref(feedLoading),
            onClick: loadMore
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(feedLoading) ? "加载中…" : "加载更多")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(feedLoading) ? "加载中…" : "加载更多"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div><aside class="space-y-4">`);
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`社区概览`);
                      } else {
                        return [
                          createTextVNode("社区概览")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`掌握成员结构与互动情况`);
                      } else {
                        return [
                          createTextVNode("掌握成员结构与互动情况")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("社区概览")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("掌握成员结构与互动情况")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-3 text-sm text-muted-foreground" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p${_scopeId2}><strong class="text-foreground"${_scopeId2}>成员数：</strong>${ssrInterpolate(unref(community)?.members_count ?? 0)}</p><p${_scopeId2}><strong class="text-foreground"${_scopeId2}>创建时间：</strong>${ssrInterpolate(unref(community) ? formatDate(unref(community).created_at) : "-")}</p><p${_scopeId2}><strong class="text-foreground"${_scopeId2}>管理员：</strong>${ssrInterpolate(unref(community)?.current_role === "moderator" ? "你是管理员" : "由平台指定")}</p><p${_scopeId2}><strong class="text-foreground"${_scopeId2}>访问权限：</strong>${ssrInterpolate(unref(community)?.is_private ? "需要加入后访问" : "公开社区")}</p>`);
                } else {
                  return [
                    createVNode("p", null, [
                      createVNode("strong", { class: "text-foreground" }, "成员数："),
                      createTextVNode(toDisplayString(unref(community)?.members_count ?? 0), 1)
                    ]),
                    createVNode("p", null, [
                      createVNode("strong", { class: "text-foreground" }, "创建时间："),
                      createTextVNode(toDisplayString(unref(community) ? formatDate(unref(community).created_at) : "-"), 1)
                    ]),
                    createVNode("p", null, [
                      createVNode("strong", { class: "text-foreground" }, "管理员："),
                      createTextVNode(toDisplayString(unref(community)?.current_role === "moderator" ? "你是管理员" : "由平台指定"), 1)
                    ]),
                    createVNode("p", null, [
                      createVNode("strong", { class: "text-foreground" }, "访问权限："),
                      createTextVNode(toDisplayString(unref(community)?.is_private ? "需要加入后访问" : "公开社区"), 1)
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
                      createTextVNode("社区概览")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("掌握成员结构与互动情况")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-3 text-sm text-muted-foreground" }, {
                default: withCtx(() => [
                  createVNode("p", null, [
                    createVNode("strong", { class: "text-foreground" }, "成员数："),
                    createTextVNode(toDisplayString(unref(community)?.members_count ?? 0), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("strong", { class: "text-foreground" }, "创建时间："),
                    createTextVNode(toDisplayString(unref(community) ? formatDate(unref(community).created_at) : "-"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("strong", { class: "text-foreground" }, "管理员："),
                    createTextVNode(toDisplayString(unref(community)?.current_role === "moderator" ? "你是管理员" : "由平台指定"), 1)
                  ]),
                  createVNode("p", null, [
                    createVNode("strong", { class: "text-foreground" }, "访问权限："),
                    createTextVNode(toDisplayString(unref(community)?.is_private ? "需要加入后访问" : "公开社区"), 1)
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/70 bg-muted/30" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`互动提示`);
                      } else {
                        return [
                          createTextVNode("互动提示")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`管理员可删除违规内容，维护社区秩序`);
                      } else {
                        return [
                          createTextVNode("管理员可删除违规内容，维护社区秩序")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("互动提示")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("管理员可删除违规内容，维护社区秩序")
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
                  _push3(`<p${_scopeId2}>· 建议使用案例+提示的结构分享信息。</p><p${_scopeId2}>· 如发现诈骗线索，可@社区管理员标记处理。</p><p${_scopeId2}>· 积极参与讨论可提升个人资料中的社区活跃度。</p>`);
                } else {
                  return [
                    createVNode("p", null, "· 建议使用案例+提示的结构分享信息。"),
                    createVNode("p", null, "· 如发现诈骗线索，可@社区管理员标记处理。"),
                    createVNode("p", null, "· 积极参与讨论可提升个人资料中的社区活跃度。")
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
                      createTextVNode("互动提示")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("管理员可删除违规内容，维护社区秩序")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-2 text-xs text-muted-foreground" }, {
                default: withCtx(() => [
                  createVNode("p", null, "· 建议使用案例+提示的结构分享信息。"),
                  createVNode("p", null, "· 如发现诈骗线索，可@社区管理员标记处理。"),
                  createVNode("p", null, "· 积极参与讨论可提升个人资料中的社区活跃度。")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_slug_-OJs1TL1Z.js.map
