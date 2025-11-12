import { _ as _sfc_main$4, a as _sfc_main$5, b as _sfc_main$6, c as _sfc_main$7, d as _sfc_main$8 } from "./card-content-BbSy3frX.js";
import { _ as __nuxt_component_0 } from "./nuxt-link-p1nvN146.js";
import { _ as _sfc_main$9 } from "./card-footer-BVBzFtgg.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$3 } from "./button-BNulVDON.js";
import { _ as _sfc_main$a } from "./label-s03MuIA6.js";
import { _ as _sfc_main$b } from "./input-DmJdLXAM.js";
import { _ as _sfc_main$2 } from "./textarea-BLn6_hn8.js";
import { d as useRoute, a as useNuxtApp, u as useAuthStore, n as navigateTo } from "../server.mjs";
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, isRef, useSSRContext, reactive, watch, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelSelect, withModifiers } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
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
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...{
    name: "CommentThread"
  },
  __name: "CommentThread",
  __ssrInlineRender: true,
  props: {
    comment: {},
    onLike: { type: Function },
    onReply: { type: Function },
    onDelete: { type: Function },
    formatDate: { type: Function },
    auth: {},
    depth: {}
  },
  setup(__props) {
    const props = __props;
    const replying = ref(false);
    const replyContent = ref("");
    const loading = ref(false);
    const isCollapsed = ref(false);
    const deleting = ref(false);
    const submitReply = async () => {
      if (!props.auth.isAuthenticated || !replyContent.value.trim()) return;
      loading.value = true;
      try {
        await props.onReply(props.comment.id, replyContent.value);
        replyContent.value = "";
        replying.value = false;
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Textarea = _sfc_main$2;
      const _component_Button = _sfc_main$3;
      const _component_CommentThread = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rounded-lg border border-border/70 p-4 text-sm relative" }, _attrs))}>`);
      if (__props.comment.replies?.length) {
        _push(`<button class="absolute left-0 top-0 h-full w-4 flex items-center justify-center text-muted-foreground hover:text-foreground">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: unref(isCollapsed) ? "lucide:plus" : "lucide:minus",
          class: "h-4 w-4"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div style="${ssrRenderStyle({ "margin-left": `${__props.comment.replies?.length ? 1.5 : 0}rem` })}"><div class="flex items-start justify-between"><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/users/${__props.comment.author.username}`,
        class: "font-medium hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.comment.author.nickname || __props.comment.author.username)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.comment.author.nickname || __props.comment.author.username), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="mt-1 text-xs text-muted-foreground">${ssrInterpolate(__props.formatDate(__props.comment.created_at))}</p></div><button class="${ssrRenderClass([__props.comment.is_liked ? "text-primary" : "text-muted-foreground", "flex items-center gap-1 text-xs"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: __props.comment.is_liked ? "lucide:heart" : "lucide:heart-off",
        class: "h-4 w-4"
      }, null, _parent));
      _push(`<span>${ssrInterpolate(__props.comment.like_count)}</span></button></div><p class="mt-3 whitespace-pre-line text-foreground">${ssrInterpolate(__props.comment.body)}</p><div class="mt-3 flex items-center gap-3 text-xs text-muted-foreground"><button class="hover:text-foreground">${ssrInterpolate(unref(replying) ? "取消回复" : "回复")}</button>`);
      if (__props.comment.can_moderate) {
        _push(`<button class="hover:text-destructive disabled:opacity-50"${ssrIncludeBooleanAttr(unref(deleting)) ? " disabled" : ""}>${ssrInterpolate(unref(deleting) ? "删除中..." : "删除")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(replying)) {
        _push(`<div class="mt-3 space-y-2">`);
        if (!__props.auth.isAuthenticated) {
          _push(`<p class="rounded-md border border-dashed border-border/70 p-2 text-xs"> 登录后才能回复。 </p>`);
        } else {
          _push(`<div class="space-y-2">`);
          _push(ssrRenderComponent(_component_Textarea, {
            modelValue: unref(replyContent),
            "onUpdate:modelValue": ($event) => isRef(replyContent) ? replyContent.value = $event : null,
            rows: "3",
            placeholder: "填写回复内容"
          }, null, _parent));
          _push(`<div class="flex justify-end">`);
          _push(ssrRenderComponent(_component_Button, {
            size: "sm",
            disabled: unref(loading),
            onClick: submitReply
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(loading) ? "提交中…" : "回复")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(loading) ? "提交中…" : "回复"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.comment.replies?.length) {
        _push(`<div class="mt-4 space-y-3 relative">`);
        if (props.depth > 0) {
          _push(`<div class="absolute left-0 top-0 h-full w-0.5 bg-border" style="${ssrRenderStyle({ "margin-left": `${(props.depth - 1) * 1.5}rem` })}"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div style="${ssrRenderStyle({ "padding-left": `${props.depth * 1.5}rem` })}">`);
        if (__props.comment.replies.length > 3) {
          _push(`<button class="text-xs text-muted-foreground hover:text-foreground">${ssrInterpolate(unref(isCollapsed) ? `展开 ${__props.comment.replies.length} 条回复` : "收起回复")}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(isCollapsed)) {
          _push(`<div><!--[-->`);
          ssrRenderList(__props.comment.replies, (reply) => {
            _push(ssrRenderComponent(_component_CommentThread, {
              key: reply.id,
              comment: reply,
              "on-like": __props.onLike,
              "on-reply": __props.onReply,
              "format-date": __props.formatDate,
              auth: __props.auth,
              depth: props.depth + 1
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/community/CommentThread.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { $api, $config } = useNuxtApp();
    const auth = useAuthStore();
    const post = ref(null);
    const loading = ref(true);
    const commentLoading = ref(false);
    const newComment = ref("");
    const communities = ref([]);
    const communitiesLoading = ref(false);
    const editing = ref(false);
    const editLoading = ref(false);
    const deleteLoading = ref(false);
    const editForm = reactive({
      title: "",
      body: "",
      community: ""
    });
    const fetchPost = async () => {
      loading.value = true;
      try {
        const { data } = await $api.get(`/community/posts/${route.params.id}/`);
        post.value = data;
      } catch (error) {
        console.error("加载帖子失败", error);
        post.value = null;
      } finally {
        loading.value = false;
      }
    };
    const submitComment = async () => {
      if (!post.value) return;
      commentLoading.value = true;
      try {
        await $api.post("/community/comments/", {
          post: post.value.id,
          body: newComment.value
        });
        newComment.value = "";
        await fetchPost();
      } catch (error) {
        console.error("发布评论失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "发布失败，请稍后重试");
      } finally {
        commentLoading.value = false;
      }
    };
    const handleReplySubmit = async (commentId, content) => {
      if (!post.value) return;
      try {
        await $api.post("/community/comments/", {
          post: post.value.id,
          parent: commentId,
          body: content
        });
        await fetchPost();
      } catch (error) {
        console.error("回复失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "回复失败，请稍后重试");
      }
    };
    const handleCommentLike = async (commentId) => {
      if (!auth.isAuthenticated) {
        (void 0).alert("请先登录后再点赞评论");
        return;
      }
      try {
        await $api.post(`/community/comments/${commentId}/like/`);
        await fetchPost();
      } catch (error) {
        console.error("评论点赞失败", error);
        (void 0).alert("操作失败，请稍后重试");
      }
    };
    const togglePostLike = async () => {
      if (!auth.isAuthenticated) {
        (void 0).alert("请先登录后再点赞");
        return;
      }
      if (!post.value) return;
      try {
        const { data } = await $api.post(`/community/posts/${post.value.id}/like/`);
        post.value.is_liked = Boolean(data?.liked);
        if (typeof data?.like_count === "number") {
          post.value.like_count = data.like_count;
        }
      } catch (error) {
        console.error("点赞失败", error);
      }
    };
    const startEdit = () => {
      if (!post.value) return;
      editForm.title = post.value.title;
      editForm.body = post.value.body;
      editForm.community = String(post.value.community_detail.id);
      editing.value = true;
    };
    const cancelEdit = () => {
      editing.value = false;
    };
    const submitEdit = async () => {
      if (!post.value) return;
      if (!editForm.title.trim() || !editForm.body.trim()) {
        (void 0).alert("标题和内容不能为空");
        return;
      }
      if (!editForm.community) {
        (void 0).alert("请选择要移动到的社区");
        return;
      }
      editLoading.value = true;
      try {
        await $api.patch(`/community/posts/${post.value.id}/`, {
          title: editForm.title,
          body: editForm.body,
          community: Number(editForm.community)
        });
        editing.value = false;
        await fetchPost();
        (void 0).alert("帖子已更新");
      } catch (error) {
        console.error("更新帖子失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "更新失败，请稍后重试");
      } finally {
        editLoading.value = false;
      }
    };
    const deleteCurrentPost = async () => {
      if (!post.value) return;
      if (!(void 0).confirm("确定删除该帖子吗？删除后将无法恢复。")) {
        return;
      }
      deleteLoading.value = true;
      try {
        await $api.delete(`/community/posts/${post.value.id}/`);
        (void 0).alert("帖子已删除");
        navigateTo("/community");
      } catch (error) {
        console.error("删除帖子失败", error);
        (void 0).alert("删除失败，请稍后重试");
      } finally {
        deleteLoading.value = false;
      }
    };
    const handleCommentDelete = async (commentId) => {
      if (!auth.isAuthenticated) {
        (void 0).alert("请先登录后再操作");
        return;
      }
      if (!(void 0).confirm("确定删除该评论吗？")) {
        return;
      }
      try {
        await $api.delete(`/community/comments/${commentId}/`);
        await fetchPost();
      } catch (error) {
        console.error("删除评论失败", error);
        const axiosError = error;
        (void 0).alert(axiosError.response?.data?.detail || "删除失败，请稍后重试");
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
    watch(
      () => route.params.id,
      async () => {
        await fetchPost();
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$4;
      const _component_CardHeader = _sfc_main$5;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CardTitle = _sfc_main$6;
      const _component_CardDescription = _sfc_main$7;
      const _component_CardContent = _sfc_main$8;
      const _component_CardFooter = _sfc_main$9;
      const _component_Icon = __nuxt_component_1;
      const _component_Button = _sfc_main$3;
      const _component_Label = _sfc_main$a;
      const _component_Input = _sfc_main$b;
      const _component_Textarea = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      if (unref(post)) {
        _push(`<div class="space-y-6">`);
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, { class: "space-y-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center justify-between text-xs text-muted-foreground"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: `/community/${unref(post).community_detail.slug}`,
                      class: "font-medium text-foreground hover:underline"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(post).community_detail.name)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(post).community_detail.name), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<span${_scopeId2}>${ssrInterpolate(formatDate(unref(post).created_at))}</span></div>`);
                    _push3(ssrRenderComponent(_component_CardTitle, { class: "text-2xl" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(post).title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(post).title), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_NuxtLink, {
                            to: `/users/${unref(post).author.username}`,
                            class: "font-medium text-foreground hover:underline"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(unref(post).author.nickname || unref(post).author.username)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(unref(post).author.nickname || unref(post).author.username), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(` 发布 `);
                        } else {
                          return [
                            createVNode(_component_NuxtLink, {
                              to: `/users/${unref(post).author.username}`,
                              class: "font-medium text-foreground hover:underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(post).author.nickname || unref(post).author.username), 1)
                              ]),
                              _: 1
                            }, 8, ["to"]),
                            createTextVNode(" 发布 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-between text-xs text-muted-foreground" }, [
                        createVNode(_component_NuxtLink, {
                          to: `/community/${unref(post).community_detail.slug}`,
                          class: "font-medium text-foreground hover:underline"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(post).community_detail.name), 1)
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        createVNode("span", null, toDisplayString(formatDate(unref(post).created_at)), 1)
                      ]),
                      createVNode(_component_CardTitle, { class: "text-2xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(post).title), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, {
                            to: `/users/${unref(post).author.username}`,
                            class: "font-medium text-foreground hover:underline"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(post).author.nickname || unref(post).author.username), 1)
                            ]),
                            _: 1
                          }, 8, ["to"]),
                          createTextVNode(" 发布 ")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-4" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p class="whitespace-pre-line text-sm leading-relaxed"${_scopeId2}>${ssrInterpolate(unref(post).body)}</p>`);
                    if (unref(post).images.length) {
                      _push3(`<div class="grid gap-3 md:grid-cols-2"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(post).images, (image) => {
                        _push3(`<img${ssrRenderAttr("src", resolveMedia(image.image))} class="h-64 w-full rounded-lg object-cover"${_scopeId2}>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode("p", { class: "whitespace-pre-line text-sm leading-relaxed" }, toDisplayString(unref(post).body), 1),
                      unref(post).images.length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "grid gap-3 md:grid-cols-2"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(post).images, (image) => {
                          return openBlock(), createBlock("img", {
                            key: image.id,
                            src: resolveMedia(image.image),
                            class: "h-64 w-full rounded-lg object-cover"
                          }, null, 8, ["src"]);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CardFooter, { class: "flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-4"${_scopeId2}><button class="${ssrRenderClass([unref(post).is_liked ? "text-primary" : "", "flex items-center gap-1"])}"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: unref(post).is_liked ? "lucide:heart" : "lucide:heart-off",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span${_scopeId2}>${ssrInterpolate(unref(post).like_count)}</span></button><div class="flex items-center gap-1"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "lucide:message-square",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span${_scopeId2}>${ssrInterpolate(unref(post).comment_count)}</span></div></div><div class="flex flex-wrap items-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      variant: "ghost",
                      size: "sm",
                      onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/${unref(post).community_detail.slug}`)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(` 返回社区 `);
                        } else {
                          return [
                            createTextVNode(" 返回社区 ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if (unref(post).can_moderate) {
                      _push3(ssrRenderComponent(_component_Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: startEdit
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` 编辑 / 移动 `);
                          } else {
                            return [
                              createTextVNode(" 编辑 / 移动 ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(post).can_moderate) {
                      _push3(ssrRenderComponent(_component_Button, {
                        variant: "destructive",
                        size: "sm",
                        disabled: unref(deleteLoading),
                        onClick: deleteCurrentPost
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(unref(deleteLoading) ? "删除中..." : "删除帖子")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(unref(deleteLoading) ? "删除中..." : "删除帖子"), 1)
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
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("button", {
                          class: ["flex items-center gap-1", unref(post).is_liked ? "text-primary" : ""],
                          onClick: togglePostLike
                        }, [
                          createVNode(_component_Icon, {
                            name: unref(post).is_liked ? "lucide:heart" : "lucide:heart-off",
                            class: "h-4 w-4"
                          }, null, 8, ["name"]),
                          createVNode("span", null, toDisplayString(unref(post).like_count), 1)
                        ], 2),
                        createVNode("div", { class: "flex items-center gap-1" }, [
                          createVNode(_component_Icon, {
                            name: "lucide:message-square",
                            class: "h-4 w-4"
                          }),
                          createVNode("span", null, toDisplayString(unref(post).comment_count), 1)
                        ])
                      ]),
                      createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                        createVNode(_component_Button, {
                          variant: "ghost",
                          size: "sm",
                          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/${unref(post).community_detail.slug}`)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" 返回社区 ")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        unref(post).can_moderate ? (openBlock(), createBlock(_component_Button, {
                          key: 0,
                          variant: "outline",
                          size: "sm",
                          onClick: startEdit
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" 编辑 / 移动 ")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        unref(post).can_moderate ? (openBlock(), createBlock(_component_Button, {
                          key: 1,
                          variant: "destructive",
                          size: "sm",
                          disabled: unref(deleteLoading),
                          onClick: deleteCurrentPost
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(deleteLoading) ? "删除中..." : "删除帖子"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_CardHeader, { class: "space-y-2" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center justify-between text-xs text-muted-foreground" }, [
                      createVNode(_component_NuxtLink, {
                        to: `/community/${unref(post).community_detail.slug}`,
                        class: "font-medium text-foreground hover:underline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(post).community_detail.name), 1)
                        ]),
                        _: 1
                      }, 8, ["to"]),
                      createVNode("span", null, toDisplayString(formatDate(unref(post).created_at)), 1)
                    ]),
                    createVNode(_component_CardTitle, { class: "text-2xl" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(post).title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, {
                          to: `/users/${unref(post).author.username}`,
                          class: "font-medium text-foreground hover:underline"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(post).author.nickname || unref(post).author.username), 1)
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        createTextVNode(" 发布 ")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, { class: "space-y-4" }, {
                  default: withCtx(() => [
                    createVNode("p", { class: "whitespace-pre-line text-sm leading-relaxed" }, toDisplayString(unref(post).body), 1),
                    unref(post).images.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid gap-3 md:grid-cols-2"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(post).images, (image) => {
                        return openBlock(), createBlock("img", {
                          key: image.id,
                          src: resolveMedia(image.image),
                          class: "h-64 w-full rounded-lg object-cover"
                        }, null, 8, ["src"]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }),
                createVNode(_component_CardFooter, { class: "flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center gap-4" }, [
                      createVNode("button", {
                        class: ["flex items-center gap-1", unref(post).is_liked ? "text-primary" : ""],
                        onClick: togglePostLike
                      }, [
                        createVNode(_component_Icon, {
                          name: unref(post).is_liked ? "lucide:heart" : "lucide:heart-off",
                          class: "h-4 w-4"
                        }, null, 8, ["name"]),
                        createVNode("span", null, toDisplayString(unref(post).like_count), 1)
                      ], 2),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        createVNode(_component_Icon, {
                          name: "lucide:message-square",
                          class: "h-4 w-4"
                        }),
                        createVNode("span", null, toDisplayString(unref(post).comment_count), 1)
                      ])
                    ]),
                    createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                      createVNode(_component_Button, {
                        variant: "ghost",
                        size: "sm",
                        onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))(`/community/${unref(post).community_detail.slug}`)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" 返回社区 ")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      unref(post).can_moderate ? (openBlock(), createBlock(_component_Button, {
                        key: 0,
                        variant: "outline",
                        size: "sm",
                        onClick: startEdit
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" 编辑 / 移动 ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      unref(post).can_moderate ? (openBlock(), createBlock(_component_Button, {
                        key: 1,
                        variant: "destructive",
                        size: "sm",
                        disabled: unref(deleteLoading),
                        onClick: deleteCurrentPost
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(deleteLoading) ? "删除中..." : "删除帖子"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(editing)) {
          _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_CardHeader, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_CardTitle, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`编辑 / 移动帖子`);
                          } else {
                            return [
                              createTextVNode("编辑 / 移动帖子")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_CardDescription, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`更新帖子内容或调整所属社区。`);
                          } else {
                            return [
                              createTextVNode("更新帖子内容或调整所属社区。")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("编辑 / 移动帖子")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("更新帖子内容或调整所属社区。")
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(ssrRenderComponent(_component_CardContent, { class: "space-y-4" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Label, { for: "edit-community" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`选择社区`);
                          } else {
                            return [
                              createTextVNode("选择社区")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`<select id="edit-community" class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"${ssrIncludeBooleanAttr(unref(communitiesLoading) || !unref(communities).length) ? " disabled" : ""} required${_scopeId2}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).community) ? ssrLooseContain(unref(editForm).community, "") : ssrLooseEqual(unref(editForm).community, "")) ? " selected" : ""}${_scopeId2}>请选择社区</option><!--[-->`);
                      ssrRenderList(unref(communities), (community) => {
                        _push3(`<option${ssrRenderAttr("value", String(community.id))}${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).community) ? ssrLooseContain(unref(editForm).community, String(community.id)) : ssrLooseEqual(unref(editForm).community, String(community.id))) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(community.name)}</option>`);
                      });
                      _push3(`<!--]--></select></div><div${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Label, { for: "edit-title" }, {
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
                        id: "edit-title",
                        modelValue: unref(editForm).title,
                        "onUpdate:modelValue": ($event) => unref(editForm).title = $event,
                        required: ""
                      }, null, _parent3, _scopeId2));
                      _push3(`</div><div${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Label, { for: "edit-body" }, {
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
                        id: "edit-body",
                        modelValue: unref(editForm).body,
                        "onUpdate:modelValue": ($event) => unref(editForm).body = $event,
                        rows: "4",
                        required: ""
                      }, null, _parent3, _scopeId2));
                      _push3(`</div><div class="flex flex-wrap items-center gap-2"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Button, {
                        disabled: unref(editLoading),
                        type: "button",
                        onClick: submitEdit
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(unref(editLoading) ? "保存中..." : "保存修改")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(unref(editLoading) ? "保存中..." : "保存修改"), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_Button, {
                        type: "button",
                        variant: "ghost",
                        onClick: cancelEdit
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`取消`);
                          } else {
                            return [
                              createTextVNode("取消")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      return [
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "edit-community" }, {
                            default: withCtx(() => [
                              createTextVNode("选择社区")
                            ]),
                            _: 1
                          }),
                          withDirectives(createVNode("select", {
                            id: "edit-community",
                            "onUpdate:modelValue": ($event) => unref(editForm).community = $event,
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
                            [vModelSelect, unref(editForm).community]
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "edit-title" }, {
                            default: withCtx(() => [
                              createTextVNode("标题")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Input, {
                            id: "edit-title",
                            modelValue: unref(editForm).title,
                            "onUpdate:modelValue": ($event) => unref(editForm).title = $event,
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "edit-body" }, {
                            default: withCtx(() => [
                              createTextVNode("内容")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Textarea, {
                            id: "edit-body",
                            modelValue: unref(editForm).body,
                            "onUpdate:modelValue": ($event) => unref(editForm).body = $event,
                            rows: "4",
                            required: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                          createVNode(_component_Button, {
                            disabled: unref(editLoading),
                            type: "button",
                            onClick: submitEdit
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(editLoading) ? "保存中..." : "保存修改"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"]),
                          createVNode(_component_Button, {
                            type: "button",
                            variant: "ghost",
                            onClick: cancelEdit
                          }, {
                            default: withCtx(() => [
                              createTextVNode("取消")
                            ]),
                            _: 1
                          })
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
                          createTextVNode("编辑 / 移动帖子")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("更新帖子内容或调整所属社区。")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardContent, { class: "space-y-4" }, {
                    default: withCtx(() => [
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "edit-community" }, {
                          default: withCtx(() => [
                            createTextVNode("选择社区")
                          ]),
                          _: 1
                        }),
                        withDirectives(createVNode("select", {
                          id: "edit-community",
                          "onUpdate:modelValue": ($event) => unref(editForm).community = $event,
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
                          [vModelSelect, unref(editForm).community]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "edit-title" }, {
                          default: withCtx(() => [
                            createTextVNode("标题")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "edit-title",
                          modelValue: unref(editForm).title,
                          "onUpdate:modelValue": ($event) => unref(editForm).title = $event,
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "edit-body" }, {
                          default: withCtx(() => [
                            createTextVNode("内容")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Textarea, {
                          id: "edit-body",
                          modelValue: unref(editForm).body,
                          "onUpdate:modelValue": ($event) => unref(editForm).body = $event,
                          rows: "4",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                        createVNode(_component_Button, {
                          disabled: unref(editLoading),
                          type: "button",
                          onClick: submitEdit
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(editLoading) ? "保存中..." : "保存修改"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        createVNode(_component_Button, {
                          type: "button",
                          variant: "ghost",
                          onClick: cancelEdit
                        }, {
                          default: withCtx(() => [
                            createTextVNode("取消")
                          ]),
                          _: 1
                        })
                      ])
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
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/70" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`发表评论`);
                        } else {
                          return [
                            createTextVNode("发表评论")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`保持友善、理性和务实的讨论氛围`);
                        } else {
                          return [
                            createTextVNode("保持友善、理性和务实的讨论氛围")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("发表评论")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("保持友善、理性和务实的讨论氛围")
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
                    if (!unref(auth).isAuthenticated) {
                      _push3(`<div class="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"${_scopeId2}> 登录后即可发表评论。`);
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        to: "/login",
                        class: "ml-1 text-foreground hover:underline"
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
                      _push3(`</div>`);
                    } else {
                      _push3(`<form class="space-y-4"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Textarea, {
                        modelValue: unref(newComment),
                        "onUpdate:modelValue": ($event) => isRef(newComment) ? newComment.value = $event : null,
                        rows: "4",
                        placeholder: "分享你的见解或补充案例",
                        required: ""
                      }, null, _parent3, _scopeId2));
                      _push3(`<div class="flex justify-end"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Button, {
                        type: "submit",
                        disabled: unref(commentLoading)
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(unref(commentLoading) ? "提交中…" : "发布评论")}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(unref(commentLoading) ? "提交中…" : "发布评论"), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      _push3(`</div></form>`);
                    }
                  } else {
                    return [
                      !unref(auth).isAuthenticated ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                      }, [
                        createTextVNode(" 登录后即可发表评论。"),
                        createVNode(_component_NuxtLink, {
                          to: "/login",
                          class: "ml-1 text-foreground hover:underline"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("前往登录")
                          ]),
                          _: 1
                        })
                      ])) : (openBlock(), createBlock("form", {
                        key: 1,
                        class: "space-y-4",
                        onSubmit: withModifiers(submitComment, ["prevent"])
                      }, [
                        createVNode(_component_Textarea, {
                          modelValue: unref(newComment),
                          "onUpdate:modelValue": ($event) => isRef(newComment) ? newComment.value = $event : null,
                          rows: "4",
                          placeholder: "分享你的见解或补充案例",
                          required: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("div", { class: "flex justify-end" }, [
                          createVNode(_component_Button, {
                            type: "submit",
                            disabled: unref(commentLoading)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(commentLoading) ? "提交中…" : "发布评论"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ])
                      ], 32))
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
                        createTextVNode("发表评论")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("保持友善、理性和务实的讨论氛围")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, null, {
                  default: withCtx(() => [
                    !unref(auth).isAuthenticated ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground"
                    }, [
                      createTextVNode(" 登录后即可发表评论。"),
                      createVNode(_component_NuxtLink, {
                        to: "/login",
                        class: "ml-1 text-foreground hover:underline"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("前往登录")
                        ]),
                        _: 1
                      })
                    ])) : (openBlock(), createBlock("form", {
                      key: 1,
                      class: "space-y-4",
                      onSubmit: withModifiers(submitComment, ["prevent"])
                    }, [
                      createVNode(_component_Textarea, {
                        modelValue: unref(newComment),
                        "onUpdate:modelValue": ($event) => isRef(newComment) ? newComment.value = $event : null,
                        rows: "4",
                        placeholder: "分享你的见解或补充案例",
                        required: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("div", { class: "flex justify-end" }, [
                        createVNode(_component_Button, {
                          type: "submit",
                          disabled: unref(commentLoading)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(commentLoading) ? "提交中…" : "发布评论"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ], 32))
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<section class="space-y-4"><h2 class="text-lg font-semibold">全部评论</h2>`);
        if (unref(loading)) {
          _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground"> 正在加载评论… </div>`);
        } else if (!unref(post).comments?.length) {
          _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground"> 暂无评论，欢迎抢先留言。 </div>`);
        } else {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(post).comments, (comment) => {
            _push(ssrRenderComponent(_sfc_main$1, {
              key: comment.id,
              comment,
              "on-like": handleCommentLike,
              "on-reply": handleReplySubmit,
              "on-delete": handleCommentDelete,
              "format-date": formatDate,
              auth: unref(auth),
              depth: 0
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`</section></div>`);
      } else {
        _push(`<div class="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground"> 正在加载帖子… </div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/community/posts/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-eBpu14bb.js.map
