import { _ as _sfc_main$1 } from "./page-header-C0onwRJI.js";
import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$4, c as _sfc_main$5, d as _sfc_main$6 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$7 } from "./label-s03MuIA6.js";
import { _ as _sfc_main$8 } from "./textarea-BLn6_hn8.js";
import { _ as _sfc_main$9 } from "./button-BNulVDON.js";
import { _ as __nuxt_component_1 } from "./Icon-Br3kPo9U.js";
import { defineComponent, ref, reactive, computed, watch, nextTick, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, withDirectives, openBlock, Fragment, renderList, vModelSelect, withModifiers, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderStyle, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$a } from "./CapabilityRadar.client-JavyGd5l.js";
import { a as useNuxtApp } from "../server.mjs";
import "clsx";
import "tailwind-merge";
import "@iconify/vue/dist/offline";
import "@iconify/vue";
import "./index-DmHgaGw0.js";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/klona/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/hookable/dist/index.mjs";
import "E:/OneDrive/Desktop/mvp/frontend/node_modules/defu/dist/defu.mjs";
import "echarts/core";
import "echarts/charts";
import "echarts/components";
import "echarts/renderers";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "simulation",
  __ssrInlineRender: true,
  setup(__props) {
    const { $api } = useNuxtApp();
    const score = ref(50);
    const message = ref("");
    const conversation = ref([]);
    const chatBodyRef = ref(null);
    const chatLoading = ref(false);
    const endingEarly = ref(false);
    const sessionClosed = ref(false);
    const finalResult = ref(null);
    const latestResult = ref(null);
    const latestLoading = ref(false);
    const scenarioOptions = [
      { label: "杀猪盘 / 感情投资", value: "pig-butchering" },
      { label: "钓鱼链接 / 伪装客服", value: "phishing" },
      { label: "冒充公检法", value: "fake-customer-service" },
      { label: "投资理财骗局", value: "investment" },
      { label: "借贷与刷单", value: "loan" }
    ];
    const difficultyOptions = [
      { label: "入门", value: "easy" },
      { label: "进阶", value: "medium" },
      { label: "挑战", value: "hard" }
    ];
    const modeOptions = [
      { label: "混合博弈（提问 + 引诱）", value: "mixed" },
      { label: "纯诈骗话术", value: "pure_fake" }
    ];
    const scenario = reactive({
      type: scenarioOptions[0].value,
      difficulty: difficultyOptions[1].value,
      mode: modeOptions[0].value
    });
    const displayedResult = computed(() => finalResult.value ?? latestResult.value);
    const radarProfile = computed(() => displayedResult.value?.capabilityProfile ?? null);
    const scrollToBottom = () => {
      if (chatBodyRef.value) {
        chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight;
      }
    };
    const showToast = (text) => {
    };
    const extractErrorMessage = (error, fallback) => {
      const axiosError = error;
      const data = axiosError?.response?.data;
      if (typeof data === "string" && data.trim()) return data;
      if (data?.message) return Array.isArray(data.message) ? data.message[0] : data.message;
      if (data?.detail) return Array.isArray(data.detail) ? data.detail[0] : data.detail;
      return fallback;
    };
    const mapResultFromApi = (payload) => ({
      scenarioType: payload.scenario_type ?? scenario.type,
      difficulty: payload.difficulty ?? scenario.difficulty,
      mode: payload.mode ?? scenario.mode,
      finalScore: payload.final_score ?? 0,
      conversationRounds: payload.conversation_rounds ?? 0,
      endReasonLabel: payload.end_reason_label ?? "系统结束",
      performanceAnalysis: payload.performance_analysis ?? "",
      suggestions: payload.suggestions ?? "",
      updatedAt: payload.updated_at ?? (/* @__PURE__ */ new Date()).toISOString(),
      capabilityProfile: payload.capability_profile ?? void 0
    });
    const applyClosurePayload = (payload) => {
      sessionClosed.value = true;
      const mapped = mapResultFromApi(payload);
      score.value = mapped.finalScore;
      finalResult.value = mapped;
      latestResult.value = mapped;
    };
    const fetchLatestResult = async () => {
      latestLoading.value = true;
      try {
        const { data } = await $api.get("/chat/latest-result/");
        if (data.has_result) {
          latestResult.value = mapResultFromApi(data.data);
        } else {
          latestResult.value = null;
        }
      } catch (error) {
        console.warn("fetch latest result failed", error);
      } finally {
        latestLoading.value = false;
      }
    };
    const sendMessage = async () => {
      const content = message.value.trim();
      if (!content || chatLoading.value) return;
      if (sessionClosed.value) {
        return;
      }
      chatLoading.value = true;
      const historyPayload = conversation.value.map((item) => ({ role: item.role, content: item.content }));
      historyPayload.push({ role: "user", content });
      conversation.value.push({ role: "user", content });
      message.value = "";
      try {
        const { data } = await $api.post("/chat/scenario/stateless/", {
          message: content,
          scenario_type: scenario.type,
          difficulty: scenario.difficulty,
          mode: scenario.mode,
          history: historyPayload,
          current_score: score.value
        });
        conversation.value.push({
          role: "assistant",
          content: data.response || "AI 暂无回复，请稍后再试。"
        });
        if (data.session_closed) {
          applyClosurePayload(data);
        }
      } catch (error) {
        showToast(extractErrorMessage(error, "发送失败，请稍后重试"));
      } finally {
        chatLoading.value = false;
        nextTick(scrollToBottom);
      }
    };
    const endSessionEarly = async () => {
      if (!conversation.value.length || sessionClosed.value || chatLoading.value) return;
      chatLoading.value = true;
      endingEarly.value = true;
      try {
        const historyPayload = conversation.value.map((item) => ({ role: item.role, content: item.content }));
        const { data } = await $api.post("/chat/scenario/stateless/", {
          force_end: true,
          scenario_type: scenario.type,
          difficulty: scenario.difficulty,
          mode: scenario.mode,
          history: historyPayload,
          current_score: score.value
        });
        if (data.response) {
          conversation.value.push({ role: "assistant", content: data.response });
        }
        if (data.session_closed) {
          applyClosurePayload(data);
        }
      } catch (error) {
        showToast(extractErrorMessage(error, "结束失败，请稍后再试"));
      } finally {
        chatLoading.value = false;
        endingEarly.value = false;
        nextTick(scrollToBottom);
      }
    };
    const resetSession = async () => {
      if (chatLoading.value) return;
      try {
        await $api.post("/chat/scenario/stateless/", {
          reset: true,
          scenario_type: scenario.type,
          difficulty: scenario.difficulty,
          mode: scenario.mode
        });
      } catch (error) {
        console.warn("reset session failed", error);
      } finally {
        conversation.value = [];
        message.value = "";
        sessionClosed.value = false;
        finalResult.value = null;
        chatLoading.value = false;
        endingEarly.value = false;
        nextTick(scrollToBottom);
      }
    };
    watch(conversation, () => nextTick(scrollToBottom), { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$1;
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$3;
      const _component_CardTitle = _sfc_main$4;
      const _component_CardDescription = _sfc_main$5;
      const _component_CardContent = _sfc_main$6;
      const _component_Label = _sfc_main$7;
      const _component_Textarea = _sfc_main$8;
      const _component_Button = _sfc_main$9;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "AI 场景模拟",
        description: "选择高发诈骗场景，与 AI 角色进行多轮对练，及时总结识别要点。"
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
                        _push4(`对话操作台`);
                      } else {
                        return [
                          createTextVNode("对话操作台")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`配置场景与模式，AI 将模拟真实话术与你交互。`);
                      } else {
                        return [
                          createTextVNode("配置场景与模式，AI 将模拟真实话术与你交互。")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("对话操作台")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("配置场景与模式，AI 将模拟真实话术与你交互。")
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
                  _push3(`<div class="grid gap-4 md:grid-cols-3"${_scopeId2}><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`场景`);
                      } else {
                        return [
                          createTextVNode("场景")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<select class="w-full rounded-md border border-border bg-background p-2 text-sm"${ssrIncludeBooleanAttr(sessionClosed.value) ? " disabled" : ""}${_scopeId2}><!--[-->`);
                  ssrRenderList(scenarioOptions, (option) => {
                    _push3(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(scenario.type) ? ssrLooseContain(scenario.type, option.value) : ssrLooseEqual(scenario.type, option.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(option.label)}</option>`);
                  });
                  _push3(`<!--]--></select></div><div${_scopeId2}>`);
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
                  _push3(`<select class="w-full rounded-md border border-border bg-background p-2 text-sm"${ssrIncludeBooleanAttr(sessionClosed.value) ? " disabled" : ""}${_scopeId2}><!--[-->`);
                  ssrRenderList(difficultyOptions, (option) => {
                    _push3(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(scenario.difficulty) ? ssrLooseContain(scenario.difficulty, option.value) : ssrLooseEqual(scenario.difficulty, option.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(option.label)}</option>`);
                  });
                  _push3(`<!--]--></select></div><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`模式`);
                      } else {
                        return [
                          createTextVNode("模式")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<select class="w-full rounded-md border border-border bg-background p-2 text-sm"${ssrIncludeBooleanAttr(sessionClosed.value) ? " disabled" : ""}${_scopeId2}><!--[-->`);
                  ssrRenderList(modeOptions, (option) => {
                    _push3(`<option${ssrRenderAttr("value", option.value)}${ssrIncludeBooleanAttr(Array.isArray(scenario.mode) ? ssrLooseContain(scenario.mode, option.value) : ssrLooseEqual(scenario.mode, option.value)) ? " selected" : ""}${_scopeId2}>${ssrInterpolate(option.label)}</option>`);
                  });
                  _push3(`<!--]--></select></div></div><div class="rounded-2xl border border-border/70 bg-card p-4"${_scopeId2}><div class="flex items-center justify-between text-sm"${_scopeId2}><p class="font-medium"${_scopeId2}>对话得分进度</p>`);
                  if (sessionClosed.value && finalResult.value) {
                    _push3(`<div class="text-right"${_scopeId2}><p class="text-2xl font-semibold"${_scopeId2}>${ssrInterpolate(finalResult.value.finalScore)}<span class="text-base font-normal"${_scopeId2}> / 100</span></p><p class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(finalResult.value.endReasonLabel)}</p></div>`);
                  } else {
                    _push3(`<p class="text-xs text-muted-foreground"${_scopeId2}>完成演练后将显示本次综合得分</p>`);
                  }
                  _push3(`</div><div class="mt-2 h-2 rounded-full bg-muted"${_scopeId2}><div class="h-2 rounded-full bg-foreground transition-all" style="${ssrRenderStyle({ width: sessionClosed.value && finalResult.value ? finalResult.value.finalScore + "%" : "0%" })}"${_scopeId2}></div></div></div><div class="max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background/80 p-4 shadow-inner"${_scopeId2}><!--[-->`);
                  ssrRenderList(conversation.value, (item, index) => {
                    _push3(`<div class="${ssrRenderClass([item.role === "user" ? "ml-auto bg-foreground text-background" : "bg-secondary text-foreground", "max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed"])}"${_scopeId2}>${ssrInterpolate(item.content)}</div>`);
                  });
                  _push3(`<!--]-->`);
                  if (!conversation.value.length) {
                    _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}> 还没有任何消息，先向 AI 发起第一句对话吧。 </p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><form class="flex flex-col gap-3 md:flex-row"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Textarea, {
                    modelValue: message.value,
                    "onUpdate:modelValue": ($event) => message.value = $event,
                    rows: "3",
                    class: "flex-1",
                    disabled: sessionClosed.value,
                    placeholder: "描述你的想法、疑问或进一步追问，以锻炼甄别与拒绝能力。"
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="flex flex-col gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    type: "submit",
                    class: "gap-2",
                    disabled: chatLoading.value || !message.value.trim() || sessionClosed.value
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "lucide:message-circle",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(chatLoading.value && !endingEarly.value ? "发送中..." : "发送")}`);
                      } else {
                        return [
                          createVNode(_component_Icon, {
                            name: "lucide:message-circle",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(chatLoading.value && !endingEarly.value ? "发送中..." : "发送"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    type: "button",
                    variant: "outline",
                    disabled: chatLoading.value,
                    onClick: resetSession
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` 重置会话 `);
                      } else {
                        return [
                          createTextVNode(" 重置会话 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    type: "button",
                    variant: "secondary",
                    disabled: sessionClosed.value || !conversation.value.length || chatLoading.value,
                    onClick: endSessionEarly
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "lucide:flag",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(endingEarly.value ? "结算中..." : "提前结束")}`);
                      } else {
                        return [
                          createVNode(_component_Icon, {
                            name: "lucide:flag",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(endingEarly.value ? "结算中..." : "提前结束"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></form>`);
                  if (sessionClosed.value) {
                    _push3(`<p class="text-sm text-amber-600"${_scopeId2}> 本次演练已结束：${ssrInterpolate(finalResult.value?.endReasonLabel ?? "系统终止")}，可以重置后开启新的对话。 </p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                      createVNode("div", null, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("场景")
                          ]),
                          _: 1
                        }),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => scenario.type = $event,
                          class: "w-full rounded-md border border-border bg-background p-2 text-sm",
                          disabled: sessionClosed.value
                        }, [
                          (openBlock(), createBlock(Fragment, null, renderList(scenarioOptions, (option) => {
                            return createVNode("option", {
                              key: option.value,
                              value: option.value
                            }, toDisplayString(option.label), 9, ["value"]);
                          }), 64))
                        ], 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelSelect, scenario.type]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("难度")
                          ]),
                          _: 1
                        }),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => scenario.difficulty = $event,
                          class: "w-full rounded-md border border-border bg-background p-2 text-sm",
                          disabled: sessionClosed.value
                        }, [
                          (openBlock(), createBlock(Fragment, null, renderList(difficultyOptions, (option) => {
                            return createVNode("option", {
                              key: option.value,
                              value: option.value
                            }, toDisplayString(option.label), 9, ["value"]);
                          }), 64))
                        ], 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelSelect, scenario.difficulty]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("模式")
                          ]),
                          _: 1
                        }),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => scenario.mode = $event,
                          class: "w-full rounded-md border border-border bg-background p-2 text-sm",
                          disabled: sessionClosed.value
                        }, [
                          (openBlock(), createBlock(Fragment, null, renderList(modeOptions, (option) => {
                            return createVNode("option", {
                              key: option.value,
                              value: option.value
                            }, toDisplayString(option.label), 9, ["value"]);
                          }), 64))
                        ], 8, ["onUpdate:modelValue", "disabled"]), [
                          [vModelSelect, scenario.mode]
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "rounded-2xl border border-border/70 bg-card p-4" }, [
                      createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                        createVNode("p", { class: "font-medium" }, "对话得分进度"),
                        sessionClosed.value && finalResult.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-right"
                        }, [
                          createVNode("p", { class: "text-2xl font-semibold" }, [
                            createTextVNode(toDisplayString(finalResult.value.finalScore), 1),
                            createVNode("span", { class: "text-base font-normal" }, " / 100")
                          ]),
                          createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(finalResult.value.endReasonLabel), 1)
                        ])) : (openBlock(), createBlock("p", {
                          key: 1,
                          class: "text-xs text-muted-foreground"
                        }, "完成演练后将显示本次综合得分"))
                      ]),
                      createVNode("div", { class: "mt-2 h-2 rounded-full bg-muted" }, [
                        createVNode("div", {
                          class: "h-2 rounded-full bg-foreground transition-all",
                          style: { width: sessionClosed.value && finalResult.value ? finalResult.value.finalScore + "%" : "0%" }
                        }, null, 4)
                      ])
                    ]),
                    createVNode("div", {
                      ref_key: "chatBodyRef",
                      ref: chatBodyRef,
                      class: "max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background/80 p-4 shadow-inner"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(conversation.value, (item, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: ["max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed", item.role === "user" ? "ml-auto bg-foreground text-background" : "bg-secondary text-foreground"]
                        }, toDisplayString(item.content), 3);
                      }), 128)),
                      !conversation.value.length ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-muted-foreground"
                      }, " 还没有任何消息，先向 AI 发起第一句对话吧。 ")) : createCommentVNode("", true)
                    ], 512),
                    createVNode("form", {
                      class: "flex flex-col gap-3 md:flex-row",
                      onSubmit: withModifiers(sendMessage, ["prevent"])
                    }, [
                      createVNode(_component_Textarea, {
                        modelValue: message.value,
                        "onUpdate:modelValue": ($event) => message.value = $event,
                        rows: "3",
                        class: "flex-1",
                        disabled: sessionClosed.value,
                        placeholder: "描述你的想法、疑问或进一步追问，以锻炼甄别与拒绝能力。"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                      createVNode("div", { class: "flex flex-col gap-2" }, [
                        createVNode(_component_Button, {
                          type: "submit",
                          class: "gap-2",
                          disabled: chatLoading.value || !message.value.trim() || sessionClosed.value
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_Icon, {
                              name: "lucide:message-circle",
                              class: "h-4 w-4"
                            }),
                            createTextVNode(" " + toDisplayString(chatLoading.value && !endingEarly.value ? "发送中..." : "发送"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        createVNode(_component_Button, {
                          type: "button",
                          variant: "outline",
                          disabled: chatLoading.value,
                          onClick: resetSession
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" 重置会话 ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        createVNode(_component_Button, {
                          type: "button",
                          variant: "secondary",
                          disabled: sessionClosed.value || !conversation.value.length || chatLoading.value,
                          onClick: endSessionEarly
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_Icon, {
                              name: "lucide:flag",
                              class: "h-4 w-4"
                            }),
                            createTextVNode(" " + toDisplayString(endingEarly.value ? "结算中..." : "提前结束"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ])
                    ], 32),
                    sessionClosed.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-amber-600"
                    }, " 本次演练已结束：" + toDisplayString(finalResult.value?.endReasonLabel ?? "系统终止") + "，可以重置后开启新的对话。 ", 1)) : createCommentVNode("", true)
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
                      createTextVNode("对话操作台")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("配置场景与模式，AI 将模拟真实话术与你交互。")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-4" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "grid gap-4 md:grid-cols-3" }, [
                    createVNode("div", null, [
                      createVNode(_component_Label, null, {
                        default: withCtx(() => [
                          createTextVNode("场景")
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => scenario.type = $event,
                        class: "w-full rounded-md border border-border bg-background p-2 text-sm",
                        disabled: sessionClosed.value
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(scenarioOptions, (option) => {
                          return createVNode("option", {
                            key: option.value,
                            value: option.value
                          }, toDisplayString(option.label), 9, ["value"]);
                        }), 64))
                      ], 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelSelect, scenario.type]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_Label, null, {
                        default: withCtx(() => [
                          createTextVNode("难度")
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => scenario.difficulty = $event,
                        class: "w-full rounded-md border border-border bg-background p-2 text-sm",
                        disabled: sessionClosed.value
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(difficultyOptions, (option) => {
                          return createVNode("option", {
                            key: option.value,
                            value: option.value
                          }, toDisplayString(option.label), 9, ["value"]);
                        }), 64))
                      ], 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelSelect, scenario.difficulty]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_Label, null, {
                        default: withCtx(() => [
                          createTextVNode("模式")
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => scenario.mode = $event,
                        class: "w-full rounded-md border border-border bg-background p-2 text-sm",
                        disabled: sessionClosed.value
                      }, [
                        (openBlock(), createBlock(Fragment, null, renderList(modeOptions, (option) => {
                          return createVNode("option", {
                            key: option.value,
                            value: option.value
                          }, toDisplayString(option.label), 9, ["value"]);
                        }), 64))
                      ], 8, ["onUpdate:modelValue", "disabled"]), [
                        [vModelSelect, scenario.mode]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "rounded-2xl border border-border/70 bg-card p-4" }, [
                    createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                      createVNode("p", { class: "font-medium" }, "对话得分进度"),
                      sessionClosed.value && finalResult.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-right"
                      }, [
                        createVNode("p", { class: "text-2xl font-semibold" }, [
                          createTextVNode(toDisplayString(finalResult.value.finalScore), 1),
                          createVNode("span", { class: "text-base font-normal" }, " / 100")
                        ]),
                        createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(finalResult.value.endReasonLabel), 1)
                      ])) : (openBlock(), createBlock("p", {
                        key: 1,
                        class: "text-xs text-muted-foreground"
                      }, "完成演练后将显示本次综合得分"))
                    ]),
                    createVNode("div", { class: "mt-2 h-2 rounded-full bg-muted" }, [
                      createVNode("div", {
                        class: "h-2 rounded-full bg-foreground transition-all",
                        style: { width: sessionClosed.value && finalResult.value ? finalResult.value.finalScore + "%" : "0%" }
                      }, null, 4)
                    ])
                  ]),
                  createVNode("div", {
                    ref_key: "chatBodyRef",
                    ref: chatBodyRef,
                    class: "max-h-[420px] space-y-3 overflow-y-auto rounded-2xl border border-border/70 bg-background/80 p-4 shadow-inner"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(conversation.value, (item, index) => {
                      return openBlock(), createBlock("div", {
                        key: index,
                        class: ["max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed", item.role === "user" ? "ml-auto bg-foreground text-background" : "bg-secondary text-foreground"]
                      }, toDisplayString(item.content), 3);
                    }), 128)),
                    !conversation.value.length ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground"
                    }, " 还没有任何消息，先向 AI 发起第一句对话吧。 ")) : createCommentVNode("", true)
                  ], 512),
                  createVNode("form", {
                    class: "flex flex-col gap-3 md:flex-row",
                    onSubmit: withModifiers(sendMessage, ["prevent"])
                  }, [
                    createVNode(_component_Textarea, {
                      modelValue: message.value,
                      "onUpdate:modelValue": ($event) => message.value = $event,
                      rows: "3",
                      class: "flex-1",
                      disabled: sessionClosed.value,
                      placeholder: "描述你的想法、疑问或进一步追问，以锻炼甄别与拒绝能力。"
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"]),
                    createVNode("div", { class: "flex flex-col gap-2" }, [
                      createVNode(_component_Button, {
                        type: "submit",
                        class: "gap-2",
                        disabled: chatLoading.value || !message.value.trim() || sessionClosed.value
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: "lucide:message-circle",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(chatLoading.value && !endingEarly.value ? "发送中..." : "发送"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(_component_Button, {
                        type: "button",
                        variant: "outline",
                        disabled: chatLoading.value,
                        onClick: resetSession
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" 重置会话 ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(_component_Button, {
                        type: "button",
                        variant: "secondary",
                        disabled: sessionClosed.value || !conversation.value.length || chatLoading.value,
                        onClick: endSessionEarly
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: "lucide:flag",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(endingEarly.value ? "结算中..." : "提前结束"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])
                  ], 32),
                  sessionClosed.value ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-amber-600"
                  }, " 本次演练已结束：" + toDisplayString(finalResult.value?.endReasonLabel ?? "系统终止") + "，可以重置后开启新的对话。 ", 1)) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`对话总结`);
                      } else {
                        return [
                          createTextVNode("对话总结")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`系统自动保存最近一次完整演练，便于复盘与分享。`);
                      } else {
                        return [
                          createTextVNode("系统自动保存最近一次完整演练，便于复盘与分享。")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("对话总结")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("系统自动保存最近一次完整演练，便于复盘与分享。")
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
                  if (displayedResult.value) {
                    _push3(`<div class="rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed"${_scopeId2}><div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(displayedResult.value.scenarioType)} · ${ssrInterpolate(displayedResult.value.difficulty)} · ${ssrInterpolate(displayedResult.value.mode)}</span><span${_scopeId2}>轮次 ${ssrInterpolate(displayedResult.value.conversationRounds)}</span></div><p class="mt-3 text-2xl font-semibold"${_scopeId2}>${ssrInterpolate(displayedResult.value.finalScore)} / 100</p><p class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(displayedResult.value.endReasonLabel)}</p>`);
                    if (radarProfile.value) {
                      _push3(ssrRenderComponent(_sfc_main$a, {
                        class: "mt-4 w-full",
                        profile: radarProfile.value,
                        height: "240px"
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>表现分析</p><p class="mt-2 whitespace-pre-line"${_scopeId2}>${ssrInterpolate(displayedResult.value.performanceAnalysis)}</p><p class="mt-4 text-xs uppercase tracking-widest text-muted-foreground"${_scopeId2}>改进建议</p><p class="mt-2 whitespace-pre-line"${_scopeId2}>${ssrInterpolate(displayedResult.value.suggestions)}</p></div>`);
                  } else {
                    _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>暂无总结，完成一次演练后即可查看详细复盘。</p>`);
                  }
                  _push3(`<div class="flex gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "outline",
                    disabled: latestLoading.value,
                    onClick: fetchLatestResult
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Icon, {
                          name: "lucide:refresh-ccw",
                          class: "h-4 w-4"
                        }, null, _parent4, _scopeId3));
                        _push4(` ${ssrInterpolate(latestLoading.value ? "刷新中..." : "刷新最近记录")}`);
                      } else {
                        return [
                          createVNode(_component_Icon, {
                            name: "lucide:refresh-ccw",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(latestLoading.value ? "刷新中..." : "刷新最近记录"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "secondary",
                    onClick: resetSession
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`重新开始`);
                      } else {
                        return [
                          createTextVNode("重新开始")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    displayedResult.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed"
                    }, [
                      createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest" }, [
                        createVNode("span", null, toDisplayString(displayedResult.value.scenarioType) + " · " + toDisplayString(displayedResult.value.difficulty) + " · " + toDisplayString(displayedResult.value.mode), 1),
                        createVNode("span", null, "轮次 " + toDisplayString(displayedResult.value.conversationRounds), 1)
                      ]),
                      createVNode("p", { class: "mt-3 text-2xl font-semibold" }, toDisplayString(displayedResult.value.finalScore) + " / 100", 1),
                      createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(displayedResult.value.endReasonLabel), 1),
                      radarProfile.value ? (openBlock(), createBlock(_sfc_main$a, {
                        key: 0,
                        class: "mt-4 w-full",
                        profile: radarProfile.value,
                        height: "240px"
                      }, null, 8, ["profile"])) : createCommentVNode("", true),
                      createVNode("p", { class: "mt-4 text-xs uppercase tracking-widest text-muted-foreground" }, "表现分析"),
                      createVNode("p", { class: "mt-2 whitespace-pre-line" }, toDisplayString(displayedResult.value.performanceAnalysis), 1),
                      createVNode("p", { class: "mt-4 text-xs uppercase tracking-widest text-muted-foreground" }, "改进建议"),
                      createVNode("p", { class: "mt-2 whitespace-pre-line" }, toDisplayString(displayedResult.value.suggestions), 1)
                    ])) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-sm text-muted-foreground"
                    }, "暂无总结，完成一次演练后即可查看详细复盘。")),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode(_component_Button, {
                        variant: "outline",
                        disabled: latestLoading.value,
                        onClick: fetchLatestResult
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_Icon, {
                            name: "lucide:refresh-ccw",
                            class: "h-4 w-4"
                          }),
                          createTextVNode(" " + toDisplayString(latestLoading.value ? "刷新中..." : "刷新最近记录"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(_component_Button, {
                        variant: "secondary",
                        onClick: resetSession
                      }, {
                        default: withCtx(() => [
                          createTextVNode("重新开始")
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
                      createTextVNode("对话总结")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("系统自动保存最近一次完整演练，便于复盘与分享。")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, { class: "space-y-4" }, {
                default: withCtx(() => [
                  displayedResult.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "rounded-2xl border border-border/70 bg-card p-4 text-sm leading-relaxed"
                  }, [
                    createVNode("div", { class: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest" }, [
                      createVNode("span", null, toDisplayString(displayedResult.value.scenarioType) + " · " + toDisplayString(displayedResult.value.difficulty) + " · " + toDisplayString(displayedResult.value.mode), 1),
                      createVNode("span", null, "轮次 " + toDisplayString(displayedResult.value.conversationRounds), 1)
                    ]),
                    createVNode("p", { class: "mt-3 text-2xl font-semibold" }, toDisplayString(displayedResult.value.finalScore) + " / 100", 1),
                    createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(displayedResult.value.endReasonLabel), 1),
                    radarProfile.value ? (openBlock(), createBlock(_sfc_main$a, {
                      key: 0,
                      class: "mt-4 w-full",
                      profile: radarProfile.value,
                      height: "240px"
                    }, null, 8, ["profile"])) : createCommentVNode("", true),
                    createVNode("p", { class: "mt-4 text-xs uppercase tracking-widest text-muted-foreground" }, "表现分析"),
                    createVNode("p", { class: "mt-2 whitespace-pre-line" }, toDisplayString(displayedResult.value.performanceAnalysis), 1),
                    createVNode("p", { class: "mt-4 text-xs uppercase tracking-widest text-muted-foreground" }, "改进建议"),
                    createVNode("p", { class: "mt-2 whitespace-pre-line" }, toDisplayString(displayedResult.value.suggestions), 1)
                  ])) : (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-sm text-muted-foreground"
                  }, "暂无总结，完成一次演练后即可查看详细复盘。")),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_Button, {
                      variant: "outline",
                      disabled: latestLoading.value,
                      onClick: fetchLatestResult
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Icon, {
                          name: "lucide:refresh-ccw",
                          class: "h-4 w-4"
                        }),
                        createTextVNode(" " + toDisplayString(latestLoading.value ? "刷新中..." : "刷新最近记录"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"]),
                    createVNode(_component_Button, {
                      variant: "secondary",
                      onClick: resetSession
                    }, {
                      default: withCtx(() => [
                        createTextVNode("重新开始")
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/simulation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=simulation-CyJHHAyo.js.map
