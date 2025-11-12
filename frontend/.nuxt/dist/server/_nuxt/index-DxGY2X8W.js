import { _ as _sfc_main$2 } from "./page-header-C0onwRJI.js";
import { _ as _sfc_main$3 } from "./label-s03MuIA6.js";
import { c as cn, _ as _sfc_main$4 } from "./button-BNulVDON.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$5, a as _sfc_main$6, b as _sfc_main$7, c as _sfc_main$8, d as _sfc_main$9 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$a } from "./input-DmJdLXAM.js";
import { _ as _sfc_main$b } from "./textarea-BLn6_hn8.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-p1nvN146.js";
import { _ as _sfc_main$c } from "./card-footer-BVBzFtgg.js";
import { defineComponent, unref, mergeProps, withCtx, createVNode, useSSRContext, ref, reactive, watch, resolveComponent, createTextVNode, toDisplayString, withModifiers, withDirectives, createBlock, openBlock, Fragment, renderList, vModelSelect, createCommentVNode, isRef } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { SwitchRoot, SwitchThumb } from "radix-vue";
import { a as useNuxtApp, u as useAuthStore, n as navigateTo } from "../server.mjs";
import "clsx";
import "tailwind-merge";
import "@iconify/vue/dist/offline";
import "@iconify/vue";
import "./index-DmHgaGw0.js";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/defu/dist/defu.mjs";
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "switch",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SwitchRoot), mergeProps(_ctx.$attrs, {
        class: unref(cn)("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SwitchThumb), {
              class: unref(cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SwitchThumb), {
                class: unref(cn)("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
              }, null, 8, ["class"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/switch.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $api, $config } = useNuxtApp();
    const auth = useAuthStore();
    const hotPosts = ref([]);
    const hotPostsLoading = ref(true);
    const posts = ref([]);
    const feedLoading = ref(false);
    const currentPage = ref(1);
    const hasMore = ref(false);
    const createLoading = ref(false);
    const showCreateCommunityDialog = ref(false);
    const createCommunityLoading = ref(false);
    const communities = ref([]);
    const communitiesLoading = ref(false);
    const selectedCommunity = ref("");
    const createCommunityForm = reactive({
      name: "",
      slug: "",
      description: "",
      is_private: false
    });
    const createCommunity = async () => {
      createCommunityLoading.value = true;
      try {
        await $api.post("/community/communities/", createCommunityForm);
        (void 0).alert("社区创建成功！");
        showCreateCommunityDialog.value = false;
        createCommunityForm.name = "";
        createCommunityForm.slug = "";
        createCommunityForm.description = "";
        createCommunityForm.is_private = false;
        await fetchCommunities();
      } catch (error) {
        console.error("创建社区失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "创建社区失败，请稍后重试");
      } finally {
        createCommunityLoading.value = false;
      }
    };
    const postForm = reactive({
      community: "",
      title: "",
      body: "",
      images: []
    });
    const fileInput = ref(null);
    const triggerFileInput = () => {
      fileInput.value?.click();
    };
    const fetchCommunities = async () => {
      communitiesLoading.value = true;
      try {
        const { data } = await $api.get("/community/communities/", { params: { page_size: 100 } });
        const results = Array.isArray(data) ? data : data.results || [];
        communities.value = results;
        if (!selectedCommunity.value && results.length === 1) {
          selectedCommunity.value = String(results[0].id);
        }
        if (!postForm.community) {
          if (selectedCommunity.value) {
            postForm.community = selectedCommunity.value;
          } else if (results.length === 1) {
            postForm.community = String(results[0].id);
          }
        }
        if (!results.length) {
          (void 0).alert("未找到任何社区，无法发布帖子。请联系管理员");
        }
      } catch (error) {
        console.error("加载社区列表失败", error);
        (void 0).alert("加载社区列表失败，请稍后重试");
      } finally {
        communitiesLoading.value = false;
      }
    };
    const fetchPosts = async (page = 1, append = false) => {
      feedLoading.value = true;
      try {
        const params = { page };
        if (selectedCommunity.value) {
          params.community = selectedCommunity.value;
        }
        const { data } = await $api.get("/community/posts/", { params });
        const results = Array.isArray(data) ? data : data.results || [];
        if (append) {
          posts.value = [...posts.value, ...results];
        } else {
          posts.value = results;
        }
        hasMore.value = Boolean(data?.next);
        currentPage.value = page;
      } catch (error) {
        console.error("加载帖子失败", error);
      } finally {
        feedLoading.value = false;
      }
    };
    const refreshPosts = () => fetchPosts(1, false);
    const loadMore = () => {
      if (feedLoading.value || !hasMore.value) return;
      fetchPosts(currentPage.value + 1, true);
    };
    const clearCommunityFilter = () => {
      selectedCommunity.value = "";
    };
    const handleFileChange = (event) => {
      const target = event.target;
      postForm.images = Array.from(target.files ?? []);
    };
    const submitPost = async () => {
      if (!postForm.title.trim() || !postForm.body.trim()) {
        (void 0).alert("标题和内容不能为空");
        return;
      }
      if (!postForm.community) {
        (void 0).alert("请先选择要发布到的社区");
        return;
      }
      createLoading.value = true;
      try {
        const formData = new FormData();
        formData.append("community", postForm.community);
        formData.append("title", postForm.title);
        formData.append("body", postForm.body);
        postForm.images.forEach((file) => formData.append("images", file));
        await $api.post("/community/posts/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        (void 0).alert("帖子已发布");
        postForm.title = "";
        postForm.body = "";
        postForm.images = [];
        postForm.community = selectedCommunity.value || "";
        await refreshPosts();
      } catch (error) {
        console.error("发布帖子失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "发布失败，请稍后重试");
      } finally {
        createLoading.value = false;
      }
    };
    const goToPost = (postId, event) => {
      const target = event.target;
      if (target.closest("a, button")) {
        return;
      }
      navigateTo(`/community/posts/${postId}`);
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
    const resolveMedia = (path) => {
      if (!path) return "";
      if (path.startsWith("http")) return path;
      const base = $config.public.apiBase?.replace(/\/$/, "") ?? "";
      return `${base}${path}`;
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
    watch(selectedCommunity, () => {
      refreshPosts();
      if (selectedCommunity.value) {
        postForm.community = selectedCommunity.value;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$2;
      const _component_Label = _sfc_main$3;
      const _component_Button = _sfc_main$4;
      const _component_Icon = __nuxt_component_1;
      const _component_Card = _sfc_main$5;
      const _component_CardHeader = _sfc_main$6;
      const _component_CardTitle = _sfc_main$7;
      const _component_CardDescription = _sfc_main$8;
      const _component_CardContent = _sfc_main$9;
      const _component_Input = _sfc_main$a;
      const _component_Textarea = _sfc_main$b;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CardFooter = _sfc_main$c;
      const _component_Dialog = resolveComponent("Dialog");
      const _component_DialogContent = resolveComponent("DialogContent");
      const _component_DialogHeader = resolveComponent("DialogHeader");
      const _component_DialogTitle = resolveComponent("DialogTitle");
      const _component_DialogDescription = resolveComponent("DialogDescription");
      const _component_Switch = _sfc_main$1;
      const _component_DialogFooter = resolveComponent("DialogFooter");
      _push(`<!--[--><div class="space-y-6">`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "社区广场",
        description: "与反诈同行者分享经验、讨论案例，构建可信赖的知识社区"
      }, null, _parent));
      _push(`<div class="rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 py-3 text-sm"><div class="flex flex-wrap items-center gap-3"><div class="flex flex-col">`);
      _push(ssrRenderComponent(_component_Label, {
        for: "community-filter",
        class: "text-sm font-medium text-muted-foreground"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`筛选社区`);
          } else {
            return [
              createTextVNode("筛选社区")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<select id="community-filter" class="mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"${ssrIncludeBooleanAttr(unref(communitiesLoading)) ? " disabled" : ""}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCommunity)) ? ssrLooseContain(unref(selectedCommunity), "") : ssrLooseEqual(unref(selectedCommunity), "")) ? " selected" : ""}>全部社区</option><!--[-->`);
      ssrRenderList(unref(communities), (community) => {
        _push(`<option${ssrRenderAttr("value", String(community.id))}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCommunity)) ? ssrLooseContain(unref(selectedCommunity), String(community.id)) : ssrLooseEqual(unref(selectedCommunity), String(community.id))) ? " selected" : ""}>${ssrInterpolate(community.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="flex items-center gap-2 text-xs text-muted-foreground">`);
      if (unref(communitiesLoading)) {
        _push(`<span>正在加载社区...</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(selectedCommunity)) {
        _push(ssrRenderComponent(_component_Button, {
          variant: "ghost",
          size: "sm",
          onClick: clearCommunityFilter
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`清除筛选`);
            } else {
              return [
                createTextVNode("清除筛选")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
      if (unref(auth).isAuthenticated && unref(auth).user?.is_staff) {
        _push(`<div class="flex justify-end">`);
        _push(ssrRenderComponent(_component_Button, {
          onClick: ($event) => showCreateCommunityDialog.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: "lucide:plus",
                class: "mr-2 h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` 创建新社区 `);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: "lucide:plus",
                  class: "mr-2 h-4 w-4"
                }),
                createTextVNode(" 创建新社区 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="grid gap-6 lg:grid-cols-[2fr_1fr]"><div class="space-y-4">`);
      if (unref(auth).isAuthenticated) {
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70 bg-secondary/30" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`发表新帖`);
                        } else {
                          return [
                            createTextVNode("发表新帖")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`分享最新的防骗提示或求助讨论，让更多人及时警觉`);
                        } else {
                          return [
                            createTextVNode("分享最新的防骗提示或求助讨论，让更多人及时警觉")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("发表新帖")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("分享最新的防骗提示或求助讨论，让更多人及时警觉")
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
                    _push3(`<form class="space-y-4"${_scopeId2}><div class="grid gap-4"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "post-community" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`发布到社区`);
                        } else {
                          return [
                            createTextVNode("发布到社区")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<select id="post-community" class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"${ssrIncludeBooleanAttr(unref(communitiesLoading) || !unref(communities).length) ? " disabled" : ""} required${_scopeId2}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(postForm).community) ? ssrLooseContain(unref(postForm).community, "") : ssrLooseEqual(unref(postForm).community, "")) ? " selected" : ""}${_scopeId2}>请选择社区</option><!--[-->`);
                    ssrRenderList(unref(communities), (community) => {
                      _push3(`<option${ssrRenderAttr("value", String(community.id))}${ssrIncludeBooleanAttr(Array.isArray(unref(postForm).community) ? ssrLooseContain(unref(postForm).community, String(community.id)) : ssrLooseEqual(unref(postForm).community, String(community.id))) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(community.name)}</option>`);
                    });
                    _push3(`<!--]--></select><p class="mt-1 text-xs text-muted-foreground"${_scopeId2}>只有选择了社区，帖子才能发布。</p></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "title" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`帖子标题`);
                        } else {
                          return [
                            createTextVNode("帖子标题")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "title",
                      modelValue: unref(postForm).title,
                      "onUpdate:modelValue": ($event) => unref(postForm).title = $event,
                      placeholder: "一句话总结你的观点",
                      required: ""
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div${_scopeId2}>`);
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
                      placeholder: "分享你的反诈经验、风险提示或求助问题",
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
                    _push3(`<input type="file" multiple accept="image/*" class="hidden"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      type: "button",
                      variant: "outline",
                      onClick: triggerFileInput
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_Icon, {
                            name: "lucide:upload",
                            class: "mr-2 h-4 w-4"
                          }, null, _parent4, _scopeId3));
                          _push4(` 选择图片 `);
                        } else {
                          return [
                            createVNode(_component_Icon, {
                              name: "lucide:upload",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" 选择图片 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (unref(postForm).images.length) {
                      _push3(`<p class="mt-2 text-xs text-muted-foreground"${_scopeId2}> 已选择 ${ssrInterpolate(unref(postForm).images.length)} 张图片 </p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="flex items-center justify-end gap-3"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      type: "submit",
                      disabled: unref(createLoading)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(createLoading) ? "发布中..." : "发布帖子")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(createLoading) ? "发布中..." : "发布帖子"), 1)
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
                        createVNode("div", { class: "grid gap-4" }, [
                          createVNode("div", null, [
                            createVNode(_component_Label, { for: "post-community" }, {
                              default: withCtx(() => [
                                createTextVNode("发布到社区")
                              ]),
                              _: 1
                            }),
                            withDirectives(createVNode("select", {
                              id: "post-community",
                              "onUpdate:modelValue": ($event) => unref(postForm).community = $event,
                              class: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                              disabled: unref(communitiesLoading) || !unref(communities).length,
                              required: ""
                            }, [
                              createVNode("option", {
                                value: "",
                                disabled: ""
                              }, "请选择社区"),
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(communities), (community) => {
                                return openBlock(), createBlock("option", {
                                  key: community.id,
                                  value: String(community.id)
                                }, toDisplayString(community.name), 9, ["value"]);
                              }), 128))
                            ], 8, ["onUpdate:modelValue", "disabled"]), [
                              [vModelSelect, unref(postForm).community]
                            ]),
                            createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, "只有选择了社区，帖子才能发布。")
                          ]),
                          createVNode("div", null, [
                            createVNode(_component_Label, { for: "title" }, {
                              default: withCtx(() => [
                                createTextVNode("帖子标题")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_Input, {
                              id: "title",
                              modelValue: unref(postForm).title,
                              "onUpdate:modelValue": ($event) => unref(postForm).title = $event,
                              placeholder: "一句话总结你的观点",
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ])
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
                            placeholder: "分享你的反诈经验、风险提示或求助问题",
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
                            ref_key: "fileInput",
                            ref: fileInput,
                            type: "file",
                            multiple: "",
                            accept: "image/*",
                            class: "hidden",
                            onChange: handleFileChange
                          }, null, 544),
                          createVNode(_component_Button, {
                            type: "button",
                            variant: "outline",
                            onClick: triggerFileInput
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_Icon, {
                                name: "lucide:upload",
                                class: "mr-2 h-4 w-4"
                              }),
                              createTextVNode(" 选择图片 ")
                            ]),
                            _: 1
                          }),
                          unref(postForm).images.length ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-2 text-xs text-muted-foreground"
                          }, " 已选择 " + toDisplayString(unref(postForm).images.length) + " 张图片 ", 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center justify-end gap-3" }, [
                          createVNode(_component_Button, {
                            type: "submit",
                            disabled: unref(createLoading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(createLoading) ? "发布中..." : "发布帖子"), 1)
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
                        createTextVNode("发表新帖")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("分享最新的防骗提示或求助讨论，让更多人及时警觉")
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
                      createVNode("div", { class: "grid gap-4" }, [
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "post-community" }, {
                            default: withCtx(() => [
                              createTextVNode("发布到社区")
                            ]),
                            _: 1
                          }),
                          withDirectives(createVNode("select", {
                            id: "post-community",
                            "onUpdate:modelValue": ($event) => unref(postForm).community = $event,
                            class: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                            disabled: unref(communitiesLoading) || !unref(communities).length,
                            required: ""
                          }, [
                            createVNode("option", {
                              value: "",
                              disabled: ""
                            }, "请选择社区"),
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(communities), (community) => {
                              return openBlock(), createBlock("option", {
                                key: community.id,
                                value: String(community.id)
                              }, toDisplayString(community.name), 9, ["value"]);
                            }), 128))
                          ], 8, ["onUpdate:modelValue", "disabled"]), [
                            [vModelSelect, unref(postForm).community]
                          ]),
                          createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, "只有选择了社区，帖子才能发布。")
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "title" }, {
                            default: withCtx(() => [
                              createTextVNode("帖子标题")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Input, {
                            id: "title",
                            modelValue: unref(postForm).title,
                            "onUpdate:modelValue": ($event) => unref(postForm).title = $event,
                            placeholder: "一句话总结你的观点",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
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
                          placeholder: "分享你的反诈经验、风险提示或求助问题",
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
                          ref_key: "fileInput",
                          ref: fileInput,
                          type: "file",
                          multiple: "",
                          accept: "image/*",
                          class: "hidden",
                          onChange: handleFileChange
                        }, null, 544),
                        createVNode(_component_Button, {
                          type: "button",
                          variant: "outline",
                          onClick: triggerFileInput
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_Icon, {
                              name: "lucide:upload",
                              class: "mr-2 h-4 w-4"
                            }),
                            createTextVNode(" 选择图片 ")
                          ]),
                          _: 1
                        }),
                        unref(postForm).images.length ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-2 text-xs text-muted-foreground"
                        }, " 已选择 " + toDisplayString(unref(postForm).images.length) + " 张图片 ", 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex items-center justify-end gap-3" }, [
                        createVNode(_component_Button, {
                          type: "submit",
                          disabled: unref(createLoading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(createLoading) ? "发布中..." : "发布帖子"), 1)
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
      } else {
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70 bg-muted/30" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`登录后参与讨论`);
                        } else {
                          return [
                            createTextVNode("登录后参与讨论")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`登录账号即可发帖、点赞和评论`);
                        } else {
                          return [
                            createTextVNode("登录账号即可发帖、点赞和评论")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("登录后参与讨论")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("登录账号即可发帖、点赞和评论")
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
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/login")
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`前往登录`);
                        } else {
                          return [
                            createTextVNode("前往登录")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Button, {
                        class: "w-full",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/login")
                      }, {
                        default: withCtx(() => [
                          createTextVNode("前往登录")
                        ]),
                        _: 1
                      }, 8, ["onClick"])
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
                        createTextVNode("登录后参与讨论")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("登录账号即可发帖、点赞和评论")
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
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/login")
                    }, {
                      default: withCtx(() => [
                        createTextVNode("前往登录")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold">社区热帖</h2>`);
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
            _push2(` 刷新 `);
          } else {
            return [
              createVNode(_component_Icon, {
                name: "lucide:refresh-cw",
                class: "mr-1 h-4 w-4"
              }),
              createTextVNode(" 刷新 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(feedLoading) && !unref(posts).length) {
        _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground"> 正在加载社区内容... </div>`);
      } else if (!unref(posts).length) {
        _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground"> 暂无帖子，成为第一位分享者吧！ </div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(posts), (post) => {
          _push(ssrRenderComponent(_component_Card, {
            key: post.id,
            class: "cursor-pointer border border-border/70 transition-colors hover:bg-muted/50",
            onClick: ($event) => goToPost(post.id, $event)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_CardHeader, { class: "space-y-1" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center justify-between text-xs text-muted-foreground"${_scopeId2}><div${_scopeId2}> 发布于 `);
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        to: `/community/${post.community_detail.slug}`,
                        class: "font-medium text-foreground hover:underline"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(post.community_detail.name)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(post.community_detail.name), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`</div><span${_scopeId2}>${ssrInterpolate(formatDate(post.created_at))}</span></div>`);
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
                            _push4(` 由 `);
                            _push4(ssrRenderComponent(_component_NuxtLink, {
                              to: `/users/${post.author.username}`,
                              class: "font-medium text-foreground hover:underline"
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
                            _push4(` 发布 `);
                          } else {
                            return [
                              createTextVNode(" 由 "),
                              createVNode(_component_NuxtLink, {
                                to: `/users/${post.author.username}`,
                                class: "font-medium text-foreground hover:underline"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"]),
                              createTextVNode(" 发布 ")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center justify-between text-xs text-muted-foreground" }, [
                          createVNode("div", null, [
                            createTextVNode(" 发布于 "),
                            createVNode(_component_NuxtLink, {
                              to: `/community/${post.community_detail.slug}`,
                              class: "font-medium text-foreground hover:underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(post.community_detail.name), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"])
                          ]),
                          createVNode("span", null, toDisplayString(formatDate(post.created_at)), 1)
                        ]),
                        createVNode(_component_CardTitle, { class: "text-xl" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(post.title), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode(" 由 "),
                            createVNode(_component_NuxtLink, {
                              to: `/users/${post.author.username}`,
                              class: "font-medium text-foreground hover:underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]),
                            createTextVNode(" 发布 ")
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
                          _push3(`<img${ssrRenderAttr("src", resolveMedia(image.image))} class="h-48 w-full rounded-lg object-cover" alt="帖子图片"${_scopeId2}>`);
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
                              class: "h-48 w-full rounded-lg object-cover",
                              alt: "帖子图片"
                            }, null, 8, ["src"]);
                          }), 128))
                        ])) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_CardFooter, { class: "flex items-center justify-between gap-4 text-sm" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex items-center gap-4 text-muted-foreground"${_scopeId2}><button class="${ssrRenderClass([post.is_liked ? "text-primary" : "", "flex items-center gap-1"])}"${_scopeId2}>`);
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
                    } else {
                      return [
                        createVNode("div", { class: "flex items-center gap-4 text-muted-foreground" }, [
                          createVNode("button", {
                            class: ["flex items-center gap-1", post.is_liked ? "text-primary" : ""],
                            onClick: withModifiers(($event) => toggleLike(post), ["stop"])
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
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_CardHeader, { class: "space-y-1" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-center justify-between text-xs text-muted-foreground" }, [
                        createVNode("div", null, [
                          createTextVNode(" 发布于 "),
                          createVNode(_component_NuxtLink, {
                            to: `/community/${post.community_detail.slug}`,
                            class: "font-medium text-foreground hover:underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(post.community_detail.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"])
                        ]),
                        createVNode("span", null, toDisplayString(formatDate(post.created_at)), 1)
                      ]),
                      createVNode(_component_CardTitle, { class: "text-xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(post.title), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode(" 由 "),
                          createVNode(_component_NuxtLink, {
                            to: `/users/${post.author.username}`,
                            class: "font-medium text-foreground hover:underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(post.author.nickname || post.author.username), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          createTextVNode(" 发布 ")
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
                            class: "h-48 w-full rounded-lg object-cover",
                            alt: "帖子图片"
                          }, null, 8, ["src"]);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024),
                  createVNode(_component_CardFooter, { class: "flex items-center justify-between gap-4 text-sm" }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex items-center gap-4 text-muted-foreground" }, [
                        createVNode("button", {
                          class: ["flex items-center gap-1", post.is_liked ? "text-primary" : ""],
                          onClick: withModifiers(($event) => toggleLike(post), ["stop"])
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
                      ])
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
                _push2(`${ssrInterpolate(unref(feedLoading) ? "加载中..." : "加载更多")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(feedLoading) ? "加载中..." : "加载更多"), 1)
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
                        _push4(`推荐热帖`);
                      } else {
                        return [
                          createTextVNode("推荐热帖")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`看看大家都在讨论什么`);
                      } else {
                        return [
                          createTextVNode("看看大家都在讨论什么")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("推荐热帖")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("看看大家都在讨论什么")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-3 text-sm" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(hotPostsLoading)) {
                    _push3(`<div class="text-muted-foreground"${_scopeId2}>加载中...</div>`);
                  } else if (!unref(hotPosts).length) {
                    _push3(`<div class="text-muted-foreground"${_scopeId2}>暂无热帖</div>`);
                  } else {
                    _push3(`<div class="space-y-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(hotPosts), (post) => {
                      _push3(`<div class="rounded-lg border border-border/70 bg-background/80 p-3"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        to: `/community/posts/${post.id}`,
                        class: "font-medium hover:underline"
                      }, {
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
                      _push3(`<p class="mt-1 text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(post.like_count)} 人点赞 · ${ssrInterpolate(post.comment_count)} 条评论 </p></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  }
                } else {
                  return [
                    unref(hotPostsLoading) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-muted-foreground"
                    }, "加载中...")) : !unref(hotPosts).length ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-muted-foreground"
                    }, "暂无热帖")) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "space-y-3"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(hotPosts), (post) => {
                        return openBlock(), createBlock("div", {
                          key: post.id,
                          class: "rounded-lg border border-border/70 bg-background/80 p-3"
                        }, [
                          createVNode(_component_NuxtLink, {
                            to: `/community/posts/${post.id}`,
                            class: "font-medium hover:underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(post.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(post.like_count) + " 人点赞 · " + toDisplayString(post.comment_count) + " 条评论 ", 1)
                        ]);
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
                      createTextVNode("推荐热帖")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("看看大家都在讨论什么")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-3 text-sm" }, {
                default: withCtx(() => [
                  unref(hotPostsLoading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-muted-foreground"
                  }, "加载中...")) : !unref(hotPosts).length ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-muted-foreground"
                  }, "暂无热帖")) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "space-y-3"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(hotPosts), (post) => {
                      return openBlock(), createBlock("div", {
                        key: post.id,
                        class: "rounded-lg border border-border/70 bg-background/80 p-3"
                      }, [
                        createVNode(_component_NuxtLink, {
                          to: `/community/posts/${post.id}`,
                          class: "font-medium hover:underline"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(post.title), 1)
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        createVNode("p", { class: "mt-1 text-xs text-muted-foreground" }, toDisplayString(post.like_count) + " 人点赞 · " + toDisplayString(post.comment_count) + " 条评论 ", 1)
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
      }, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/70 bg-secondary/20" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`社区守则`);
                      } else {
                        return [
                          createTextVNode("社区守则")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`共建高质量、可信的防诈空间`);
                      } else {
                        return [
                          createTextVNode("共建高质量、可信的防诈空间")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("社区守则")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("共建高质量、可信的防诈空间")
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
                  _push3(`<p${_scopeId2}>· 分享真实有效的反诈经验和案例，避免传播未经验证的信息。</p><p${_scopeId2}>· 尊重其他用户的隐私，不公开个人敏感数据。</p><p${_scopeId2}>· 对异常内容使用举报或提醒社区管理员处理。</p>`);
                } else {
                  return [
                    createVNode("p", null, "· 分享真实有效的反诈经验和案例，避免传播未经验证的信息。"),
                    createVNode("p", null, "· 尊重其他用户的隐私，不公开个人敏感数据。"),
                    createVNode("p", null, "· 对异常内容使用举报或提醒社区管理员处理。")
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
                      createTextVNode("社区守则")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("共建高质量、可信的防诈空间")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-2 text-xs text-muted-foreground" }, {
                default: withCtx(() => [
                  createVNode("p", null, "· 分享真实有效的反诈经验和案例，避免传播未经验证的信息。"),
                  createVNode("p", null, "· 尊重其他用户的隐私，不公开个人敏感数据。"),
                  createVNode("p", null, "· 对异常内容使用举报或提醒社区管理员处理。")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside></section></div>`);
      _push(ssrRenderComponent(_component_Dialog, {
        open: unref(showCreateCommunityDialog),
        "onUpdate:open": ($event) => isRef(showCreateCommunityDialog) ? showCreateCommunityDialog.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_DialogContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_DialogHeader, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_DialogTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`创建新社区`);
                            } else {
                              return [
                                createTextVNode("创建新社区")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_DialogDescription, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`填写社区信息以创建一个新的反诈讨论空间`);
                            } else {
                              return [
                                createTextVNode("填写社区信息以创建一个新的反诈讨论空间")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_DialogTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("创建新社区")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_DialogDescription, null, {
                            default: withCtx(() => [
                              createTextVNode("填写社区信息以创建一个新的反诈讨论空间")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<form class="grid gap-4 py-4"${_scopeId2}><div class="grid grid-cols-4 items-center gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, {
                    for: "community-name",
                    class: "text-right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`名称`);
                      } else {
                        return [
                          createTextVNode("名称")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Input, {
                    id: "community-name",
                    modelValue: unref(createCommunityForm).name,
                    "onUpdate:modelValue": ($event) => unref(createCommunityForm).name = $event,
                    class: "col-span-3",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-4 items-center gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, {
                    for: "community-slug",
                    class: "text-right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Slug`);
                      } else {
                        return [
                          createTextVNode("Slug")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Input, {
                    id: "community-slug",
                    modelValue: unref(createCommunityForm).slug,
                    "onUpdate:modelValue": ($event) => unref(createCommunityForm).slug = $event,
                    class: "col-span-3",
                    required: ""
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-4 items-center gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, {
                    for: "community-description",
                    class: "text-right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`描述`);
                      } else {
                        return [
                          createTextVNode("描述")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Textarea, {
                    id: "community-description",
                    modelValue: unref(createCommunityForm).description,
                    "onUpdate:modelValue": ($event) => unref(createCommunityForm).description = $event,
                    class: "col-span-3"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="grid grid-cols-4 items-center gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, {
                    for: "community-private",
                    class: "text-right"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`私有社区`);
                      } else {
                        return [
                          createTextVNode("私有社区")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Switch, {
                    id: "community-private",
                    checked: unref(createCommunityForm).is_private,
                    "onUpdate:checked": ($event) => unref(createCommunityForm).is_private = $event,
                    class: "col-span-3"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_component_DialogFooter, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Button, {
                          type: "submit",
                          disabled: unref(createCommunityLoading)
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(createCommunityLoading) ? "创建中..." : "创建社区")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(createCommunityLoading) ? "创建中..." : "创建社区"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Button, {
                            type: "submit",
                            disabled: unref(createCommunityLoading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(createCommunityLoading) ? "创建中..." : "创建社区"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode(_component_DialogHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_DialogTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("创建新社区")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_DialogDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("填写社区信息以创建一个新的反诈讨论空间")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("form", {
                      class: "grid gap-4 py-4",
                      onSubmit: withModifiers(createCommunity, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                        createVNode(_component_Label, {
                          for: "community-name",
                          class: "text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("名称")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "community-name",
                          modelValue: unref(createCommunityForm).name,
                          "onUpdate:modelValue": ($event) => unref(createCommunityForm).name = $event,
                          class: "col-span-3",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                        createVNode(_component_Label, {
                          for: "community-slug",
                          class: "text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Slug")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "community-slug",
                          modelValue: unref(createCommunityForm).slug,
                          "onUpdate:modelValue": ($event) => unref(createCommunityForm).slug = $event,
                          class: "col-span-3",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                        createVNode(_component_Label, {
                          for: "community-description",
                          class: "text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("描述")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Textarea, {
                          id: "community-description",
                          modelValue: unref(createCommunityForm).description,
                          "onUpdate:modelValue": ($event) => unref(createCommunityForm).description = $event,
                          class: "col-span-3"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                        createVNode(_component_Label, {
                          for: "community-private",
                          class: "text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("私有社区")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Switch, {
                          id: "community-private",
                          checked: unref(createCommunityForm).is_private,
                          "onUpdate:checked": ($event) => unref(createCommunityForm).is_private = $event,
                          class: "col-span-3"
                        }, null, 8, ["checked", "onUpdate:checked"])
                      ]),
                      createVNode(_component_DialogFooter, null, {
                        default: withCtx(() => [
                          createVNode(_component_Button, {
                            type: "submit",
                            disabled: unref(createCommunityLoading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(createCommunityLoading) ? "创建中..." : "创建社区"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      })
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_DialogContent, null, {
                default: withCtx(() => [
                  createVNode(_component_DialogHeader, null, {
                    default: withCtx(() => [
                      createVNode(_component_DialogTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("创建新社区")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_DialogDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("填写社区信息以创建一个新的反诈讨论空间")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("form", {
                    class: "grid gap-4 py-4",
                    onSubmit: withModifiers(createCommunity, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                      createVNode(_component_Label, {
                        for: "community-name",
                        class: "text-right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("名称")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "community-name",
                        modelValue: unref(createCommunityForm).name,
                        "onUpdate:modelValue": ($event) => unref(createCommunityForm).name = $event,
                        class: "col-span-3",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                      createVNode(_component_Label, {
                        for: "community-slug",
                        class: "text-right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Slug")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "community-slug",
                        modelValue: unref(createCommunityForm).slug,
                        "onUpdate:modelValue": ($event) => unref(createCommunityForm).slug = $event,
                        class: "col-span-3",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                      createVNode(_component_Label, {
                        for: "community-description",
                        class: "text-right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("描述")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Textarea, {
                        id: "community-description",
                        modelValue: unref(createCommunityForm).description,
                        "onUpdate:modelValue": ($event) => unref(createCommunityForm).description = $event,
                        class: "col-span-3"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "grid grid-cols-4 items-center gap-4" }, [
                      createVNode(_component_Label, {
                        for: "community-private",
                        class: "text-right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("私有社区")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Switch, {
                        id: "community-private",
                        checked: unref(createCommunityForm).is_private,
                        "onUpdate:checked": ($event) => unref(createCommunityForm).is_private = $event,
                        class: "col-span-3"
                      }, null, 8, ["checked", "onUpdate:checked"])
                    ]),
                    createVNode(_component_DialogFooter, null, {
                      default: withCtx(() => [
                        createVNode(_component_Button, {
                          type: "submit",
                          disabled: unref(createCommunityLoading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(createCommunityLoading) ? "创建中..." : "创建社区"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      _: 1
                    })
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DxGY2X8W.js.map
