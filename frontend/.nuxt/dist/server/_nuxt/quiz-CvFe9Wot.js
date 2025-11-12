import { _ as _sfc_main$1 } from "./page-header-C0onwRJI.js";
import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$4, c as _sfc_main$5, d as _sfc_main$6 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$7 } from "./button-BNulVDON.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { _ as _sfc_main$8 } from "./card-footer-BVBzFtgg.js";
import { _ as _sfc_main$9 } from "./label-s03MuIA6.js";
import { _ as _sfc_main$a } from "./textarea-BLn6_hn8.js";
import { defineComponent, ref, reactive, computed, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, withDirectives, vModelRadio, withModifiers, vModelSelect, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain } from "vue/server-renderer";
import { u as useAuthStore, a as useNuxtApp } from "../server.mjs";
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
const QUESTION_BATCH_SIZE = 5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "quiz",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const { $api } = useNuxtApp();
    const { quizStats, refreshAllStats } = useStatsSync();
    const levels = [
      { value: "beginner", label: "初级", icon: "lucide:leaf" },
      { value: "intermediate", label: "中级", icon: "lucide:kanban" },
      { value: "advanced", label: "高级", icon: "lucide:zap" }
    ];
    const levelMap = {
      beginner: "初级训练",
      intermediate: "中级训练",
      advanced: "高级训练"
    };
    const selectedLevel = ref("beginner");
    const questions = ref([]);
    const answers = reactive({});
    const loading = ref(true);
    const submitting = ref(false);
    const result = ref(null);
    const sessionMeta = ref(null);
    const sessionError = ref(null);
    const defaultQuizStats = {
      total_attempts: 0,
      average_score: 0,
      best_score: 0,
      level_stats: {},
      recent_attempts: []
    };
    const stats = computed(() => quizStats.value ?? defaultQuizStats);
    const newQuestion = reactive({
      text: "",
      level: "beginner",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A"
    });
    const adminQuestions = ref([]);
    const adminSaving = ref(false);
    const normalizeListResponse = (payload) => {
      if (Array.isArray(payload)) {
        return payload;
      }
      if (payload && Array.isArray(payload.results)) {
        return payload.results;
      }
      return [];
    };
    const resetAnswers = () => {
      Object.keys(answers).forEach((key) => delete answers[Number(key)]);
    };
    const resetSessionState = () => {
      sessionMeta.value = null;
      sessionError.value = null;
      questions.value = [];
      resetAnswers();
    };
    const answeredCount = computed(
      () => questions.value.reduce((count, question) => answers[question.id] ? count + 1 : count, 0)
    );
    const canSubmit = computed(
      () => !loading.value && !!sessionMeta.value && questions.value.length > 0 && answeredCount.value === questions.value.length
    );
    const progressCopy = computed(() => {
      if (loading.value) {
        return "正在为你抽取本轮题目...";
      }
      if (!sessionMeta.value) {
        return "选择难度后点击“开始本轮答题”，系统会随机抽题";
      }
      if (!questions.value.length) {
        return sessionError.value || "当前难度暂无题目，试试重新抽题或切换难度";
      }
      if (!answeredCount.value) {
        return `本轮共有 ${questions.value.length} 题，等待作答`;
      }
      if (answeredCount.value < questions.value.length) {
        return `已完成 ${answeredCount.value}/${questions.value.length} 题，继续加油`;
      }
      return "全部题目已完成作答，可以提交";
    });
    const emptyStateMessage = computed(
      () => sessionError.value || "当前难度暂无可用题目，试试重新抽题或切换到其他难度。"
    );
    const shapeQuestion = (q) => ({
      ...q,
      options: [
        { label: q.option_a, value: "A" },
        { label: q.option_b, value: "B" },
        { label: q.option_c, value: "C" },
        { label: q.option_d, value: "D" }
      ]
    });
    const changeLevel = (value) => {
      selectedLevel.value = value;
      result.value = null;
      resetSessionState();
    };
    const startSession = async () => {
      loading.value = true;
      result.value = null;
      resetSessionState();
      try {
        const { data } = await $api.post("/quiz/start/", {
          level: selectedLevel.value,
          limit: QUESTION_BATCH_SIZE
        });
        const items = data?.questions ?? [];
        questions.value = items.map((item) => shapeQuestion(item));
        sessionMeta.value = {
          id: data.session_id,
          level: data.level,
          total_questions: data.total_questions
        };
      } catch (error) {
        console.error("Failed to start quiz session", error);
        sessionMeta.value = null;
        questions.value = [];
        sessionError.value = error?.response?.data?.detail ?? "创建测验失败，请稍后重试";
      } finally {
        loading.value = false;
      }
    };
    const submitQuiz = async () => {
      if (!canSubmit.value || !sessionMeta.value) {
        return;
      }
      submitting.value = true;
      try {
        const payload = {
          level: sessionMeta.value.level,
          session_id: sessionMeta.value.id,
          answers: { ...answers }
        };
        const { data } = await $api.post("/quiz/submit/", payload);
        result.value = data;
        resetSessionState();
        try {
          await refreshAllStats();
        } catch (error) {
          console.warn("Failed to refresh stats after submission", error);
        }
      } finally {
        submitting.value = false;
      }
    };
    const loadAdminQuestions = async () => {
      if (!auth.isAdmin) return;
      const { data } = await $api.get("/quiz/admin/questions/", { params: { limit: 5 } });
      adminQuestions.value = normalizeListResponse(data).slice(0, 5);
    };
    const createQuestion = async () => {
      adminSaving.value = true;
      try {
        await $api.post("/quiz/admin/questions/", newQuestion);
        Object.assign(newQuestion, {
          text: "",
          level: "beginner",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_answer: "A"
        });
        loadAdminQuestions();
      } finally {
        adminSaving.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$3;
      const _component_CardTitle = _sfc_main$4;
      const _component_CardDescription = _sfc_main$5;
      const _component_CardContent = _sfc_main$6;
      const _component_Button = _sfc_main$7;
      const _component_Icon = __nuxt_component_1;
      const _component_CardFooter = _sfc_main$8;
      const _component_Label = _sfc_main$9;
      const _component_Textarea = _sfc_main$a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "知识测验",
        description: "选择难度、回答问题并获得实时得分。"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`答题区域`);
                      } else {
                        return [
                          createTextVNode("答题区域")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`黑白分明的题目卡片帮助你聚焦内容。`);
                      } else {
                        return [
                          createTextVNode("黑白分明的题目卡片帮助你聚焦内容。")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("答题区域")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("黑白分明的题目卡片帮助你聚焦内容。")
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
                  _push3(`<div class="flex flex-wrap gap-3"${_scopeId2}><!--[-->`);
                  ssrRenderList(levels, (level) => {
                    _push3(ssrRenderComponent(_component_Button, {
                      key: level.value,
                      variant: unref(selectedLevel) === level.value ? "default" : "outline",
                      class: "gap-2",
                      onClick: ($event) => changeLevel(level.value)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_Icon, {
                            name: level.icon,
                            class: "h-4 w-4"
                          }, null, _parent4, _scopeId3));
                          _push4(` ${ssrInterpolate(level.label)}`);
                        } else {
                          return [
                            createVNode(_component_Icon, {
                              name: level.icon,
                              class: "h-4 w-4"
                            }, null, 8, ["name"]),
                            createTextVNode(" " + toDisplayString(level.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "secondary",
                    size: "sm",
                    class: "gap-2",
                    disabled: unref(loading),
                    onClick: startSession
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: unref(sessionMeta) ? "lucide:refresh-cw" : "lucide:play",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(sessionMeta) ? "重新抽题" : "开始本轮答题")}`);
                      } else {
                        return [
                          createVNode(_component_Icon, {
                            name: unref(sessionMeta) ? "lucide:refresh-cw" : "lucide:play",
                            class: "h-4 w-4"
                          }, null, 8, ["name"]),
                          createTextVNode(" " + toDisplayString(unref(sessionMeta) ? "重新抽题" : "开始本轮答题"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  if (unref(sessionMeta)) {
                    _push3(`<div class="flex items-center gap-3 rounded-lg border border-border/70 bg-secondary/30 px-4 py-3 text-sm text-muted-foreground"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: "lucide:timer",
                      class: "h-4 w-4"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div${_scopeId2}><p${_scopeId2}>当前会话：${ssrInterpolate(levelMap[unref(sessionMeta).level])} · ${ssrInterpolate(unref(sessionMeta).total_questions)} 题</p><p class="text-xs"${_scopeId2}>完成本轮后再提交答案，系统会刷新整体统计</p></div></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  if (unref(loading)) {
                    _push3(`<div class="space-y-3"${_scopeId2}><div class="h-24 rounded-md border border-dashed border-border/60"${_scopeId2}></div><div class="h-24 rounded-md border border-dashed border-border/60"${_scopeId2}></div><div class="h-24 rounded-md border border-dashed border-border/60"${_scopeId2}></div></div>`);
                  } else {
                    _push3(`<div${_scopeId2}>`);
                    if (unref(questions).length) {
                      _push3(`<div class="space-y-4"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(questions), (question) => {
                        _push3(`<div class="rounded-xl border border-border/80 bg-card p-4"${_scopeId2}><p class="text-sm uppercase tracking-widest text-muted-foreground"${_scopeId2}>${ssrInterpolate(levelMap[question.level])}</p><p class="mt-2 text-base font-medium"${_scopeId2}>${ssrInterpolate(question.text)}</p><div class="mt-3 grid gap-2"${_scopeId2}><!--[-->`);
                        ssrRenderList(question.options, (option) => {
                          _push3(`<label class="flex cursor-pointer items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-secondary"${_scopeId2}><div class="flex items-center gap-3"${_scopeId2}><input type="radio"${ssrRenderAttr("name", "question-" + question.id)}${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(ssrLooseEqual(unref(answers)[question.id], option.value)) ? " checked" : ""}${ssrIncludeBooleanAttr(!unref(sessionMeta)) ? " disabled" : ""} class="accent-black"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(option.label)}</span></div><span class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(option.value)}</span></label>`);
                        });
                        _push3(`<!--]--></div></div>`);
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<div class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/10 p-6 text-center text-sm text-muted-foreground"${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Icon, {
                        name: "lucide:sparkles",
                        class: "h-6 w-6 text-muted-foreground"
                      }, null, _parent3, _scopeId2));
                      _push3(`<p${_scopeId2}>${ssrInterpolate(unref(emptyStateMessage))}</p>`);
                      _push3(ssrRenderComponent(_component_Button, {
                        size: "sm",
                        variant: "outline",
                        class: "gap-2",
                        onClick: startSession
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_Icon, {
                              name: "lucide:refresh-cw",
                              class: "h-4 w-4"
                            }, null, _parent4, _scopeId3));
                            _push4(` 重新加载题目 `);
                          } else {
                            return [
                              createVNode(_component_Icon, {
                                name: "lucide:refresh-cw",
                                class: "h-4 w-4"
                              }),
                              createTextVNode(" 重新加载题目 ")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                      if (unref(auth).isAdmin) {
                        _push3(`<p class="text-xs"${_scopeId2}> 作为管理员，你也可以在下方快速录入新题 </p>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    }
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(), createBlock(Fragment, null, renderList(levels, (level) => {
                        return createVNode(_component_Button, {
                          key: level.value,
                          variant: unref(selectedLevel) === level.value ? "default" : "outline",
                          class: "gap-2",
                          onClick: ($event) => changeLevel(level.value)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_Icon, {
                              name: level.icon,
                              class: "h-4 w-4"
                            }, null, 8, ["name"]),
                            createTextVNode(" " + toDisplayString(level.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["variant", "onClick"]);
                      }), 64)),
                      createVNode(_component_Button, {
                        variant: "secondary",
                        size: "sm",
                        class: "gap-2",
                        disabled: unref(loading),
                        onClick: startSession
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: unref(sessionMeta) ? "lucide:refresh-cw" : "lucide:play",
                            class: "h-4 w-4"
                          }, null, 8, ["name"]),
                          createTextVNode(" " + toDisplayString(unref(sessionMeta) ? "重新抽题" : "开始本轮答题"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    unref(sessionMeta) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-3 rounded-lg border border-border/70 bg-secondary/30 px-4 py-3 text-sm text-muted-foreground"
                    }, [
                      createVNode(_component_Icon, {
                        name: "lucide:timer",
                        class: "h-4 w-4"
                      }),
                      createVNode("div", null, [
                        createVNode("p", null, "当前会话：" + toDisplayString(levelMap[unref(sessionMeta).level]) + " · " + toDisplayString(unref(sessionMeta).total_questions) + " 题", 1),
                        createVNode("p", { class: "text-xs" }, "完成本轮后再提交答案，系统会刷新整体统计")
                      ])
                    ])) : createCommentVNode("", true),
                    unref(loading) ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "space-y-3"
                    }, [
                      createVNode("div", { class: "h-24 rounded-md border border-dashed border-border/60" }),
                      createVNode("div", { class: "h-24 rounded-md border border-dashed border-border/60" }),
                      createVNode("div", { class: "h-24 rounded-md border border-dashed border-border/60" })
                    ])) : (openBlock(), createBlock("div", { key: 2 }, [
                      unref(questions).length ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-4"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(questions), (question) => {
                          return openBlock(), createBlock("div", {
                            key: question.id,
                            class: "rounded-xl border border-border/80 bg-card p-4"
                          }, [
                            createVNode("p", { class: "text-sm uppercase tracking-widest text-muted-foreground" }, toDisplayString(levelMap[question.level]), 1),
                            createVNode("p", { class: "mt-2 text-base font-medium" }, toDisplayString(question.text), 1),
                            createVNode("div", { class: "mt-3 grid gap-2" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(question.options, (option) => {
                                return openBlock(), createBlock("label", {
                                  key: option.value,
                                  class: "flex cursor-pointer items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-secondary"
                                }, [
                                  createVNode("div", { class: "flex items-center gap-3" }, [
                                    withDirectives(createVNode("input", {
                                      type: "radio",
                                      name: "question-" + question.id,
                                      value: option.value,
                                      "onUpdate:modelValue": ($event) => unref(answers)[question.id] = $event,
                                      disabled: !unref(sessionMeta),
                                      class: "accent-black"
                                    }, null, 8, ["name", "value", "onUpdate:modelValue", "disabled"]), [
                                      [vModelRadio, unref(answers)[question.id]]
                                    ]),
                                    createVNode("span", null, toDisplayString(option.label), 1)
                                  ]),
                                  createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(option.value), 1)
                                ]);
                              }), 128))
                            ])
                          ]);
                        }), 128))
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/10 p-6 text-center text-sm text-muted-foreground"
                      }, [
                        createVNode(_component_Icon, {
                          name: "lucide:sparkles",
                          class: "h-6 w-6 text-muted-foreground"
                        }),
                        createVNode("p", null, toDisplayString(unref(emptyStateMessage)), 1),
                        createVNode(_component_Button, {
                          size: "sm",
                          variant: "outline",
                          class: "gap-2",
                          onClick: startSession
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_Icon, {
                              name: "lucide:refresh-cw",
                              class: "h-4 w-4"
                            }),
                            createTextVNode(" 重新加载题目 ")
                          ]),
                          _: 1
                        }),
                        unref(auth).isAdmin ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-xs"
                        }, " 作为管理员，你也可以在下方快速录入新题 ")) : createCommentVNode("", true)
                      ]))
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardFooter, { class: "flex flex-col gap-3 border-t border-border/60 pt-4 md:flex-row md:items-center md:justify-between" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>${ssrInterpolate(unref(progressCopy))}</p><div class="flex items-center gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    class: "gap-2",
                    disabled: unref(submitting) || !unref(canSubmit),
                    variant: unref(canSubmit) ? "default" : "secondary",
                    onClick: submitQuiz
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "lucide:send",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(unref(submitting) ? "提交中..." : "提交答案")}`);
                      } else {
                        return [
                          createVNode(_component_Icon, {
                            name: "lucide:send",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(unref(submitting) ? "提交中..." : "提交答案"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(result)) {
                    _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}> 得分 ${ssrInterpolate(unref(result).score)}，正确 ${ssrInterpolate(unref(result).correct_answers)}/${ssrInterpolate(unref(result).total_questions)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(unref(progressCopy)), 1),
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode(_component_Button, {
                        class: "gap-2",
                        disabled: unref(submitting) || !unref(canSubmit),
                        variant: unref(canSubmit) ? "default" : "secondary",
                        onClick: submitQuiz
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: "lucide:send",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(unref(submitting) ? "提交中..." : "提交答案"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled", "variant"]),
                      unref(result) ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-muted-foreground"
                      }, " 得分 " + toDisplayString(unref(result).score) + "，正确 " + toDisplayString(unref(result).correct_answers) + "/" + toDisplayString(unref(result).total_questions), 1)) : createCommentVNode("", true)
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
                      createTextVNode("答题区域")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("黑白分明的题目卡片帮助你聚焦内容。")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-4" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex flex-wrap gap-3" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(levels, (level) => {
                      return createVNode(_component_Button, {
                        key: level.value,
                        variant: unref(selectedLevel) === level.value ? "default" : "outline",
                        class: "gap-2",
                        onClick: ($event) => changeLevel(level.value)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: level.icon,
                            class: "h-4 w-4"
                          }, null, 8, ["name"]),
                          createTextVNode(" " + toDisplayString(level.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["variant", "onClick"]);
                    }), 64)),
                    createVNode(_component_Button, {
                      variant: "secondary",
                      size: "sm",
                      class: "gap-2",
                      disabled: unref(loading),
                      onClick: startSession
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Icon, {
                          name: unref(sessionMeta) ? "lucide:refresh-cw" : "lucide:play",
                          class: "h-4 w-4"
                        }, null, 8, ["name"]),
                        createTextVNode(" " + toDisplayString(unref(sessionMeta) ? "重新抽题" : "开始本轮答题"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  unref(sessionMeta) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center gap-3 rounded-lg border border-border/70 bg-secondary/30 px-4 py-3 text-sm text-muted-foreground"
                  }, [
                    createVNode(_component_Icon, {
                      name: "lucide:timer",
                      class: "h-4 w-4"
                    }),
                    createVNode("div", null, [
                      createVNode("p", null, "当前会话：" + toDisplayString(levelMap[unref(sessionMeta).level]) + " · " + toDisplayString(unref(sessionMeta).total_questions) + " 题", 1),
                      createVNode("p", { class: "text-xs" }, "完成本轮后再提交答案，系统会刷新整体统计")
                    ])
                  ])) : createCommentVNode("", true),
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "space-y-3"
                  }, [
                    createVNode("div", { class: "h-24 rounded-md border border-dashed border-border/60" }),
                    createVNode("div", { class: "h-24 rounded-md border border-dashed border-border/60" }),
                    createVNode("div", { class: "h-24 rounded-md border border-dashed border-border/60" })
                  ])) : (openBlock(), createBlock("div", { key: 2 }, [
                    unref(questions).length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(questions), (question) => {
                        return openBlock(), createBlock("div", {
                          key: question.id,
                          class: "rounded-xl border border-border/80 bg-card p-4"
                        }, [
                          createVNode("p", { class: "text-sm uppercase tracking-widest text-muted-foreground" }, toDisplayString(levelMap[question.level]), 1),
                          createVNode("p", { class: "mt-2 text-base font-medium" }, toDisplayString(question.text), 1),
                          createVNode("div", { class: "mt-3 grid gap-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(question.options, (option) => {
                              return openBlock(), createBlock("label", {
                                key: option.value,
                                class: "flex cursor-pointer items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-secondary"
                              }, [
                                createVNode("div", { class: "flex items-center gap-3" }, [
                                  withDirectives(createVNode("input", {
                                    type: "radio",
                                    name: "question-" + question.id,
                                    value: option.value,
                                    "onUpdate:modelValue": ($event) => unref(answers)[question.id] = $event,
                                    disabled: !unref(sessionMeta),
                                    class: "accent-black"
                                  }, null, 8, ["name", "value", "onUpdate:modelValue", "disabled"]), [
                                    [vModelRadio, unref(answers)[question.id]]
                                  ]),
                                  createVNode("span", null, toDisplayString(option.label), 1)
                                ]),
                                createVNode("span", { class: "text-xs text-muted-foreground" }, toDisplayString(option.value), 1)
                              ]);
                            }), 128))
                          ])
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/10 p-6 text-center text-sm text-muted-foreground"
                    }, [
                      createVNode(_component_Icon, {
                        name: "lucide:sparkles",
                        class: "h-6 w-6 text-muted-foreground"
                      }),
                      createVNode("p", null, toDisplayString(unref(emptyStateMessage)), 1),
                      createVNode(_component_Button, {
                        size: "sm",
                        variant: "outline",
                        class: "gap-2",
                        onClick: startSession
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: "lucide:refresh-cw",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" 重新加载题目 ")
                        ]),
                        _: 1
                      }),
                      unref(auth).isAdmin ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs"
                      }, " 作为管理员，你也可以在下方快速录入新题 ")) : createCommentVNode("", true)
                    ]))
                  ]))
                ]),
                _: 1
              }),
              createVNode(_component_CardFooter, { class: "flex flex-col gap-3 border-t border-border/60 pt-4 md:flex-row md:items-center md:justify-between" }, {
                default: withCtx(() => [
                  createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(unref(progressCopy)), 1),
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode(_component_Button, {
                      class: "gap-2",
                      disabled: unref(submitting) || !unref(canSubmit),
                      variant: unref(canSubmit) ? "default" : "secondary",
                      onClick: submitQuiz
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Icon, {
                          name: "lucide:send",
                          class: "h-4 w-4"
                        }),
                        createTextVNode(" " + toDisplayString(unref(submitting) ? "提交中..." : "提交答案"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled", "variant"]),
                    unref(result) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground"
                    }, " 得分 " + toDisplayString(unref(result).score) + "，正确 " + toDisplayString(unref(result).correct_answers) + "/" + toDisplayString(unref(result).total_questions), 1)) : createCommentVNode("", true)
                  ])
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
                        _push4(`测验统计`);
                      } else {
                        return [
                          createTextVNode("测验统计")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`了解你的进步趋势。`);
                      } else {
                        return [
                          createTextVNode("了解你的进步趋势。")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("测验统计")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("了解你的进步趋势。")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, { class: "grid gap-4 md:grid-cols-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="rounded-xl border border-border/60 p-4"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>总次数</p><p class="mt-2 text-3xl font-semibold"${_scopeId2}>${ssrInterpolate(unref(stats).total_attempts)}</p></div><div class="rounded-xl border border-border/60 p-4"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>平均分</p><p class="mt-2 text-3xl font-semibold"${_scopeId2}>${ssrInterpolate(unref(stats).average_score)}%</p></div><div class="rounded-xl border border-border/60 p-4"${_scopeId2}><p class="text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>最佳成绩</p><p class="mt-2 text-3xl font-semibold"${_scopeId2}>${ssrInterpolate(unref(stats).best_score)}%</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "rounded-xl border border-border/60 p-4" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "总次数"),
                      createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(unref(stats).total_attempts), 1)
                    ]),
                    createVNode("div", { class: "rounded-xl border border-border/60 p-4" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "平均分"),
                      createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(unref(stats).average_score) + "%", 1)
                    ]),
                    createVNode("div", { class: "rounded-xl border border-border/60 p-4" }, [
                      createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "最佳成绩"),
                      createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(unref(stats).best_score) + "%", 1)
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
                      createTextVNode("测验统计")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("了解你的进步趋势。")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "grid gap-4 md:grid-cols-3" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "rounded-xl border border-border/60 p-4" }, [
                    createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "总次数"),
                    createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(unref(stats).total_attempts), 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-border/60 p-4" }, [
                    createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "平均分"),
                    createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(unref(stats).average_score) + "%", 1)
                  ]),
                  createVNode("div", { class: "rounded-xl border border-border/60 p-4" }, [
                    createVNode("p", { class: "text-xs uppercase tracking-widest text-muted-foreground" }, "最佳成绩"),
                    createVNode("p", { class: "mt-2 text-3xl font-semibold" }, toDisplayString(unref(stats).best_score) + "%", 1)
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(auth).isAdmin) {
        _push(ssrRenderComponent(_component_Card, { class: "border border-border/80" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CardHeader, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_CardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`管理员：快速扩展题库`);
                        } else {
                          return [
                            createTextVNode("管理员：快速扩展题库")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_CardDescription, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`黑白控制台内即可录入新题。`);
                        } else {
                          return [
                            createTextVNode("黑白控制台内即可录入新题。")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_CardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("管理员：快速扩展题库")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CardDescription, null, {
                        default: withCtx(() => [
                          createTextVNode("黑白控制台内即可录入新题。")
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_CardContent, { class: "grid gap-6 md:grid-cols-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<form class="space-y-3"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`题目内容`);
                        } else {
                          return [
                            createTextVNode("题目内容")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Textarea, {
                      modelValue: unref(newQuestion).text,
                      "onUpdate:modelValue": ($event) => unref(newQuestion).text = $event,
                      required: "",
                      placeholder: "描述一个诈骗场景"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="grid grid-cols-2 gap-3"${_scopeId2}><!--[-->`);
                    ssrRenderList(["A", "B", "C", "D"], (option) => {
                      _push3(`<div${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_Label, null, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`选项 ${ssrInterpolate(option)}`);
                          } else {
                            return [
                              createTextVNode("选项 " + toDisplayString(option), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(_component_Textarea, {
                        modelValue: unref(newQuestion)["option_" + option.toLowerCase()],
                        "onUpdate:modelValue": ($event) => unref(newQuestion)["option_" + option.toLowerCase()] = $event,
                        rows: "2",
                        required: ""
                      }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    });
                    _push3(`<!--]--></div><div class="grid grid-cols-2 gap-3"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`难度`);
                        } else {
                          return [
                            createTextVNode("难度")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<select class="w-full rounded-md border border-border bg-background p-2 text-sm"${_scopeId2}><option value="beginner"${ssrIncludeBooleanAttr(Array.isArray(unref(newQuestion).level) ? ssrLooseContain(unref(newQuestion).level, "beginner") : ssrLooseEqual(unref(newQuestion).level, "beginner")) ? " selected" : ""}${_scopeId2}>初级</option><option value="intermediate"${ssrIncludeBooleanAttr(Array.isArray(unref(newQuestion).level) ? ssrLooseContain(unref(newQuestion).level, "intermediate") : ssrLooseEqual(unref(newQuestion).level, "intermediate")) ? " selected" : ""}${_scopeId2}>中级</option><option value="advanced"${ssrIncludeBooleanAttr(Array.isArray(unref(newQuestion).level) ? ssrLooseContain(unref(newQuestion).level, "advanced") : ssrLooseEqual(unref(newQuestion).level, "advanced")) ? " selected" : ""}${_scopeId2}>高级</option></select></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`正确答案`);
                        } else {
                          return [
                            createTextVNode("正确答案")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<select class="w-full rounded-md border border-border bg-background p-2 text-sm"${_scopeId2}><!--[-->`);
                    ssrRenderList(["A", "B", "C", "D"], (option) => {
                      _push3(`<option${ssrRenderAttr("value", option)}${ssrIncludeBooleanAttr(Array.isArray(unref(newQuestion).correct_answer) ? ssrLooseContain(unref(newQuestion).correct_answer, option) : ssrLooseEqual(unref(newQuestion).correct_answer, option)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(option)}</option>`);
                    });
                    _push3(`<!--]--></select></div></div>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      type: "submit",
                      class: "w-full",
                      disabled: unref(adminSaving)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(unref(adminSaving) ? "保存中..." : "新增题目")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(unref(adminSaving) ? "保存中..." : "新增题目"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</form><div class="space-y-3"${_scopeId2}><p class="text-sm text-muted-foreground"${_scopeId2}>最近录入题目</p><!--[-->`);
                    ssrRenderList(unref(adminQuestions), (item) => {
                      _push3(`<div class="rounded-lg border border-border/70 p-3 text-sm"${_scopeId2}><p class="font-medium"${_scopeId2}>${ssrInterpolate(item.text)}</p><p class="text-xs text-muted-foreground mt-1"${_scopeId2}>正确答案：${ssrInterpolate(item.correct_answer)} · 难度：${ssrInterpolate(levelMap[item.level])}</p></div>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    return [
                      createVNode("form", {
                        class: "space-y-3",
                        onSubmit: withModifiers(createQuestion, ["prevent"])
                      }, [
                        createVNode("div", null, [
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode("题目内容")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Textarea, {
                            modelValue: unref(newQuestion).text,
                            "onUpdate:modelValue": ($event) => unref(newQuestion).text = $event,
                            required: "",
                            placeholder: "描述一个诈骗场景"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(["A", "B", "C", "D"], (option) => {
                            return createVNode("div", { key: option }, [
                              createVNode(_component_Label, null, {
                                default: withCtx(() => [
                                  createTextVNode("选项 " + toDisplayString(option), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(_component_Textarea, {
                                modelValue: unref(newQuestion)["option_" + option.toLowerCase()],
                                "onUpdate:modelValue": ($event) => unref(newQuestion)["option_" + option.toLowerCase()] = $event,
                                rows: "2",
                                required: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]);
                          }), 64))
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                          createVNode("div", null, [
                            createVNode(_component_Label, null, {
                              default: withCtx(() => [
                                createTextVNode("难度")
                              ]),
                              _: 1
                            }),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => unref(newQuestion).level = $event,
                              class: "w-full rounded-md border border-border bg-background p-2 text-sm"
                            }, [
                              createVNode("option", { value: "beginner" }, "初级"),
                              createVNode("option", { value: "intermediate" }, "中级"),
                              createVNode("option", { value: "advanced" }, "高级")
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, unref(newQuestion).level]
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode(_component_Label, null, {
                              default: withCtx(() => [
                                createTextVNode("正确答案")
                              ]),
                              _: 1
                            }),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => unref(newQuestion).correct_answer = $event,
                              class: "w-full rounded-md border border-border bg-background p-2 text-sm"
                            }, [
                              (openBlock(), createBlock(Fragment, null, renderList(["A", "B", "C", "D"], (option) => {
                                return createVNode("option", {
                                  key: option,
                                  value: option
                                }, toDisplayString(option), 9, ["value"]);
                              }), 64))
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, unref(newQuestion).correct_answer]
                            ])
                          ])
                        ]),
                        createVNode(_component_Button, {
                          type: "submit",
                          class: "w-full",
                          disabled: unref(adminSaving)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(adminSaving) ? "保存中..." : "新增题目"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ], 32),
                      createVNode("div", { class: "space-y-3" }, [
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "最近录入题目"),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(adminQuestions), (item) => {
                          return openBlock(), createBlock("div", {
                            key: item.id,
                            class: "rounded-lg border border-border/70 p-3 text-sm"
                          }, [
                            createVNode("p", { class: "font-medium" }, toDisplayString(item.text), 1),
                            createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, "正确答案：" + toDisplayString(item.correct_answer) + " · 难度：" + toDisplayString(levelMap[item.level]), 1)
                          ]);
                        }), 128))
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
                        createTextVNode("管理员：快速扩展题库")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("黑白控制台内即可录入新题。")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(_component_CardContent, { class: "grid gap-6 md:grid-cols-2" }, {
                  default: withCtx(() => [
                    createVNode("form", {
                      class: "space-y-3",
                      onSubmit: withModifiers(createQuestion, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("题目内容")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Textarea, {
                          modelValue: unref(newQuestion).text,
                          "onUpdate:modelValue": ($event) => unref(newQuestion).text = $event,
                          required: "",
                          placeholder: "描述一个诈骗场景"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(["A", "B", "C", "D"], (option) => {
                          return createVNode("div", { key: option }, [
                            createVNode(_component_Label, null, {
                              default: withCtx(() => [
                                createTextVNode("选项 " + toDisplayString(option), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_Textarea, {
                              modelValue: unref(newQuestion)["option_" + option.toLowerCase()],
                              "onUpdate:modelValue": ($event) => unref(newQuestion)["option_" + option.toLowerCase()] = $event,
                              rows: "2",
                              required: ""
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]);
                        }), 64))
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                        createVNode("div", null, [
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode("难度")
                            ]),
                            _: 1
                          }),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => unref(newQuestion).level = $event,
                            class: "w-full rounded-md border border-border bg-background p-2 text-sm"
                          }, [
                            createVNode("option", { value: "beginner" }, "初级"),
                            createVNode("option", { value: "intermediate" }, "中级"),
                            createVNode("option", { value: "advanced" }, "高级")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(newQuestion).level]
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode("正确答案")
                            ]),
                            _: 1
                          }),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => unref(newQuestion).correct_answer = $event,
                            class: "w-full rounded-md border border-border bg-background p-2 text-sm"
                          }, [
                            (openBlock(), createBlock(Fragment, null, renderList(["A", "B", "C", "D"], (option) => {
                              return createVNode("option", {
                                key: option,
                                value: option
                              }, toDisplayString(option), 9, ["value"]);
                            }), 64))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(newQuestion).correct_answer]
                          ])
                        ])
                      ]),
                      createVNode(_component_Button, {
                        type: "submit",
                        class: "w-full",
                        disabled: unref(adminSaving)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(adminSaving) ? "保存中..." : "新增题目"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32),
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "最近录入题目"),
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(adminQuestions), (item) => {
                        return openBlock(), createBlock("div", {
                          key: item.id,
                          class: "rounded-lg border border-border/70 p-3 text-sm"
                        }, [
                          createVNode("p", { class: "font-medium" }, toDisplayString(item.text), 1),
                          createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, "正确答案：" + toDisplayString(item.correct_answer) + " · 难度：" + toDisplayString(levelMap[item.level]), 1)
                        ]);
                      }), 128))
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/quiz.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=quiz-CvFe9Wot.js.map
