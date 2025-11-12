import { _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3, c as _sfc_main$4, d as _sfc_main$6 } from "./card-content-BbSy3frX.js";
import { _ as _sfc_main$5 } from "./button-BNulVDON.js";
import { _ as _sfc_main$7 } from "./label-s03MuIA6.js";
import { _ as _sfc_main$8 } from "./input-DmJdLXAM.js";
import { _ as _sfc_main$9 } from "./card-footer-BVBzFtgg.js";
import { defineComponent, ref, computed, reactive, watch, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, withModifiers, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { useDebounceFn } from "@vueuse/core";
import { a as useNuxtApp, u as useAuthStore, c as useRouter } from "../server.mjs";
import "clsx";
import "tailwind-merge";
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { $api } = useNuxtApp();
    const auth = useAuthStore();
    const router = useRouter();
    const mode = ref("login");
    const passwordErrors = ref([]);
    const passwordValid = ref(false);
    const passwordChecking = ref(false);
    const isBusy = computed(() => auth.loading || auth.registerLoading || passwordChecking.value);
    const form = reactive({
      username: "",
      password: ""
    });
    const registerForm = reactive({
      username: "",
      nickname: "",
      email: "",
      password: "",
      password2: ""
    });
    const extractErrors = (error) => {
      const axiosError = error;
      const data = axiosError?.response?.data;
      if (!data) {
        return [axiosError?.message || "请求失败"];
      }
      if (typeof data === "string") {
        return [data];
      }
      if (Array.isArray(data)) {
        return data.map(String);
      }
      if (typeof data === "object") {
        if (Array.isArray(data.password)) {
          return data.password.map(String);
        }
        const flattened = Object.values(data).flatMap((value) => {
          if (Array.isArray(value)) return value.map(String);
          if (typeof value === "string") return [value];
          return [];
        });
        if (flattened.length) {
          return flattened;
        }
      }
      return ["请求失败"];
    };
    const extractErrorMessage = (error, fallback) => {
      const list = extractErrors(error);
      return list[0] || fallback;
    };
    const handleLogin = async () => {
      const payload = {
        username: form.username.trim(),
        password: form.password
      };
      if (!payload.username || !payload.password) {
        return;
      }
      try {
        await auth.login(payload);
        await auth.fetchProfile();
        router.push("/");
      } catch (error) {
        console.error(error);
        useToast(extractErrorMessage(error, "登录失败，请检查凭证"));
      }
    };
    const performPasswordValidation = async () => {
      if (mode.value !== "register") return true;
      if (!registerForm.password) {
        passwordErrors.value = [];
        passwordValid.value = false;
        return false;
      }
      passwordChecking.value = true;
      try {
        await $api.post("/users/password/validate/", {
          username: registerForm.username.trim(),
          email: registerForm.email.trim(),
          password: registerForm.password
        });
        passwordErrors.value = [];
        passwordValid.value = true;
        return true;
      } catch (error) {
        passwordErrors.value = extractErrors(error);
        passwordValid.value = false;
        return false;
      } finally {
        passwordChecking.value = false;
      }
    };
    const debouncedPasswordValidation = useDebounceFn(performPasswordValidation, 400);
    watch(
      [() => registerForm.password, () => registerForm.username, () => registerForm.email],
      () => {
        if (mode.value !== "register") return;
        if (!registerForm.password) {
          passwordErrors.value = [];
          passwordValid.value = false;
          return;
        }
        debouncedPasswordValidation();
      }
    );
    watch(
      () => mode.value,
      (current) => {
        if (current === "register" && registerForm.password) {
          performPasswordValidation();
        } else {
          passwordErrors.value = [];
          passwordValid.value = false;
        }
      }
    );
    const handleRegister = async () => {
      const username = registerForm.username.trim();
      const nickname = registerForm.nickname.trim();
      const email = registerForm.email.trim();
      if (!username || !registerForm.password || !registerForm.password2) {
        return;
      }
      if (registerForm.password !== registerForm.password2) {
        return;
      }
      const passwordOk = await performPasswordValidation();
      if (!passwordOk) {
        useToast(passwordErrors.value[0] || "请根据提示调整密码");
        return;
      }
      const payload = {
        username,
        password: registerForm.password,
        password2: registerForm.password2
      };
      if (nickname) payload.nickname = nickname;
      if (email) payload.email = email;
      try {
        await auth.register(payload);
        useToast("注册成功，正在为您登录");
        await auth.login({ username, password: registerForm.password });
        await auth.fetchProfile();
        router.push("/");
      } catch (error) {
        console.error(error);
        useToast(extractErrorMessage(error, "注册失败，请检查信息是否有效或已被占用"));
      }
    };
    const useToast = (message) => {
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$1;
      const _component_CardHeader = _sfc_main$2;
      const _component_CardTitle = _sfc_main$3;
      const _component_CardDescription = _sfc_main$4;
      const _component_Button = _sfc_main$5;
      const _component_CardContent = _sfc_main$6;
      const _component_Label = _sfc_main$7;
      const _component_Input = _sfc_main$8;
      const _component_CardFooter = _sfc_main$9;
      _push(ssrRenderComponent(_component_Card, mergeProps({ class: "w-full max-w-md border border-border/60 bg-card shadow-none" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, { class: "space-y-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(mode) === "login" ? "账号登录" : "快速注册")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(mode) === "login" ? "账号登录" : "快速注册"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(mode) === "login" ? "使用已有账号登录澄源反诈平台" : "创建新的普通用户账号（如需管理员权限请联系平台）")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(mode) === "login" ? "使用已有账号登录澄源反诈平台" : "创建新的普通用户账号（如需管理员权限请联系平台）"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid grid-cols-2 gap-2 pt-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Button, {
                    type: "button",
                    variant: unref(mode) === "login" ? "default" : "outline",
                    class: "w-full",
                    disabled: unref(isBusy),
                    onClick: ($event) => mode.value = "login"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` 登录 `);
                      } else {
                        return [
                          createTextVNode(" 登录 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, {
                    type: "button",
                    variant: unref(mode) === "register" ? "default" : "outline",
                    class: "w-full",
                    disabled: unref(isBusy),
                    onClick: ($event) => mode.value = "register"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` 注册 `);
                      } else {
                        return [
                          createTextVNode(" 注册 ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(mode) === "login" ? "账号登录" : "快速注册"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(mode) === "login" ? "使用已有账号登录澄源反诈平台" : "创建新的普通用户账号（如需管理员权限请联系平台）"), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid grid-cols-2 gap-2 pt-2" }, [
                      createVNode(_component_Button, {
                        type: "button",
                        variant: unref(mode) === "login" ? "default" : "outline",
                        class: "w-full",
                        disabled: unref(isBusy),
                        onClick: ($event) => mode.value = "login"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" 登录 ")
                        ]),
                        _: 1
                      }, 8, ["variant", "disabled", "onClick"]),
                      createVNode(_component_Button, {
                        type: "button",
                        variant: unref(mode) === "register" ? "default" : "outline",
                        class: "w-full",
                        disabled: unref(isBusy),
                        onClick: ($event) => mode.value = "register"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" 注册 ")
                        ]),
                        _: 1
                      }, 8, ["variant", "disabled", "onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(mode) === "login") {
                    _push3(`<form class="space-y-4"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "username" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`账号 / 邮箱 / 手机`);
                        } else {
                          return [
                            createTextVNode("账号 / 邮箱 / 手机")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "username",
                      name: "username",
                      modelValue: unref(form).username,
                      "onUpdate:modelValue": ($event) => unref(form).username = $event,
                      required: "",
                      autocomplete: "username",
                      placeholder: "admin"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "password" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`密码`);
                        } else {
                          return [
                            createTextVNode("密码")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "password",
                      name: "password",
                      modelValue: unref(form).password,
                      "onUpdate:modelValue": ($event) => unref(form).password = $event,
                      type: "password",
                      required: "",
                      autocomplete: "current-password",
                      placeholder: "请输入密码"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      type: "submit",
                      class: "w-full",
                      disabled: unref(auth).loading
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (unref(auth).loading) {
                            _push4(`<span${_scopeId3}>登录中...</span>`);
                          } else {
                            _push4(`<span${_scopeId3}>登录</span>`);
                          }
                        } else {
                          return [
                            unref(auth).loading ? (openBlock(), createBlock("span", { key: 0 }, "登录中...")) : (openBlock(), createBlock("span", { key: 1 }, "登录"))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</form>`);
                  } else {
                    _push3(`<form class="space-y-4"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "register-username" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`用户名*`);
                        } else {
                          return [
                            createTextVNode("用户名*")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "register-username",
                      modelValue: unref(registerForm).username,
                      "onUpdate:modelValue": ($event) => unref(registerForm).username = $event,
                      required: "",
                      autocomplete: "off",
                      placeholder: "new_user"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div class="grid grid-cols-2 gap-4"${_scopeId2}><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "register-nickname" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`昵称`);
                        } else {
                          return [
                            createTextVNode("昵称")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "register-nickname",
                      modelValue: unref(registerForm).nickname,
                      "onUpdate:modelValue": ($event) => unref(registerForm).nickname = $event,
                      autocomplete: "off",
                      placeholder: "可选"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "register-email" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`邮箱`);
                        } else {
                          return [
                            createTextVNode("邮箱")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "register-email",
                      modelValue: unref(registerForm).email,
                      "onUpdate:modelValue": ($event) => unref(registerForm).email = $event,
                      type: "email",
                      autocomplete: "off",
                      placeholder: "可选"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "register-password" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`密码*`);
                        } else {
                          return [
                            createTextVNode("密码*")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "register-password",
                      modelValue: unref(registerForm).password,
                      "onUpdate:modelValue": ($event) => unref(registerForm).password = $event,
                      type: "password",
                      required: "",
                      autocomplete: "new-password",
                      placeholder: "至少 8 位且非常见密码"
                    }, null, _parent3, _scopeId2));
                    _push3(`<p class="${ssrRenderClass([unref(passwordErrors).length ? "text-destructive" : unref(passwordValid) ? "text-emerald-600" : "text-muted-foreground", "text-xs min-h-[1.25rem]"])}"${_scopeId2}>`);
                    if (unref(passwordChecking)) {
                      _push3(`<span${_scopeId2}>正在校验密码强度...</span>`);
                    } else if (unref(passwordErrors).length) {
                      _push3(`<span${_scopeId2}>${ssrInterpolate(unref(passwordErrors)[0])}</span>`);
                    } else if (unref(passwordValid)) {
                      _push3(`<span${_scopeId2}>密码符合当前安全要求</span>`);
                    } else {
                      _push3(`<span${_scopeId2}>密码需满足平台设定的长度与复杂度要求</span>`);
                    }
                    _push3(`</p></div><div${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Label, { for: "register-password2" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`确认密码*`);
                        } else {
                          return [
                            createTextVNode("确认密码*")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "register-password2",
                      modelValue: unref(registerForm).password2,
                      "onUpdate:modelValue": ($event) => unref(registerForm).password2 = $event,
                      type: "password",
                      required: "",
                      autocomplete: "new-password",
                      placeholder: "再次输入密码"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                    _push3(ssrRenderComponent(_component_Button, {
                      type: "submit",
                      class: "w-full",
                      disabled: unref(auth).registerLoading || unref(passwordChecking)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (unref(auth).registerLoading) {
                            _push4(`<span${_scopeId3}>注册中...</span>`);
                          } else {
                            _push4(`<span${_scopeId3}>注册并登录</span>`);
                          }
                        } else {
                          return [
                            unref(auth).registerLoading ? (openBlock(), createBlock("span", { key: 0 }, "注册中...")) : (openBlock(), createBlock("span", { key: 1 }, "注册并登录"))
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</form>`);
                  }
                } else {
                  return [
                    unref(mode) === "login" ? (openBlock(), createBlock("form", {
                      key: 0,
                      class: "space-y-4",
                      onSubmit: withModifiers(handleLogin, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "username" }, {
                          default: withCtx(() => [
                            createTextVNode("账号 / 邮箱 / 手机")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "username",
                          name: "username",
                          modelValue: unref(form).username,
                          "onUpdate:modelValue": ($event) => unref(form).username = $event,
                          required: "",
                          autocomplete: "username",
                          placeholder: "admin"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "password" }, {
                          default: withCtx(() => [
                            createTextVNode("密码")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "password",
                          name: "password",
                          modelValue: unref(form).password,
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          type: "password",
                          required: "",
                          autocomplete: "current-password",
                          placeholder: "请输入密码"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(_component_Button, {
                        type: "submit",
                        class: "w-full",
                        disabled: unref(auth).loading
                      }, {
                        default: withCtx(() => [
                          unref(auth).loading ? (openBlock(), createBlock("span", { key: 0 }, "登录中...")) : (openBlock(), createBlock("span", { key: 1 }, "登录"))
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32)) : (openBlock(), createBlock("form", {
                      key: 1,
                      class: "space-y-4",
                      onSubmit: withModifiers(handleRegister, ["prevent"])
                    }, [
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "register-username" }, {
                          default: withCtx(() => [
                            createTextVNode("用户名*")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "register-username",
                          modelValue: unref(registerForm).username,
                          "onUpdate:modelValue": ($event) => unref(registerForm).username = $event,
                          required: "",
                          autocomplete: "off",
                          placeholder: "new_user"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "register-nickname" }, {
                            default: withCtx(() => [
                              createTextVNode("昵称")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Input, {
                            id: "register-nickname",
                            modelValue: unref(registerForm).nickname,
                            "onUpdate:modelValue": ($event) => unref(registerForm).nickname = $event,
                            autocomplete: "off",
                            placeholder: "可选"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", null, [
                          createVNode(_component_Label, { for: "register-email" }, {
                            default: withCtx(() => [
                              createTextVNode("邮箱")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Input, {
                            id: "register-email",
                            modelValue: unref(registerForm).email,
                            "onUpdate:modelValue": ($event) => unref(registerForm).email = $event,
                            type: "email",
                            autocomplete: "off",
                            placeholder: "可选"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "register-password" }, {
                          default: withCtx(() => [
                            createTextVNode("密码*")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "register-password",
                          modelValue: unref(registerForm).password,
                          "onUpdate:modelValue": ($event) => unref(registerForm).password = $event,
                          type: "password",
                          required: "",
                          autocomplete: "new-password",
                          placeholder: "至少 8 位且非常见密码"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("p", {
                          class: ["text-xs min-h-[1.25rem]", unref(passwordErrors).length ? "text-destructive" : unref(passwordValid) ? "text-emerald-600" : "text-muted-foreground"]
                        }, [
                          unref(passwordChecking) ? (openBlock(), createBlock("span", { key: 0 }, "正在校验密码强度...")) : unref(passwordErrors).length ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(passwordErrors)[0]), 1)) : unref(passwordValid) ? (openBlock(), createBlock("span", { key: 2 }, "密码符合当前安全要求")) : (openBlock(), createBlock("span", { key: 3 }, "密码需满足平台设定的长度与复杂度要求"))
                        ], 2)
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "register-password2" }, {
                          default: withCtx(() => [
                            createTextVNode("确认密码*")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "register-password2",
                          modelValue: unref(registerForm).password2,
                          "onUpdate:modelValue": ($event) => unref(registerForm).password2 = $event,
                          type: "password",
                          required: "",
                          autocomplete: "new-password",
                          placeholder: "再次输入密码"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode(_component_Button, {
                        type: "submit",
                        class: "w-full",
                        disabled: unref(auth).registerLoading || unref(passwordChecking)
                      }, {
                        default: withCtx(() => [
                          unref(auth).registerLoading ? (openBlock(), createBlock("span", { key: 0 }, "注册中...")) : (openBlock(), createBlock("span", { key: 1 }, "注册并登录"))
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ], 32))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(mode) === "register") {
              _push2(ssrRenderComponent(_component_CardFooter, { class: "text-xs text-muted-foreground leading-relaxed" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p${_scopeId2}>注册创建的账户默认为普通用户，如需管理员权限请联系平台维护人员。</p>`);
                  } else {
                    return [
                      createVNode("p", null, "注册创建的账户默认为普通用户，如需管理员权限请联系平台维护人员。")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_CardHeader, { class: "space-y-3" }, {
                default: withCtx(() => [
                  createVNode(_component_CardTitle, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(mode) === "login" ? "账号登录" : "快速注册"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(mode) === "login" ? "使用已有账号登录澄源反诈平台" : "创建新的普通用户账号（如需管理员权限请联系平台）"), 1)
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "grid grid-cols-2 gap-2 pt-2" }, [
                    createVNode(_component_Button, {
                      type: "button",
                      variant: unref(mode) === "login" ? "default" : "outline",
                      class: "w-full",
                      disabled: unref(isBusy),
                      onClick: ($event) => mode.value = "login"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 登录 ")
                      ]),
                      _: 1
                    }, 8, ["variant", "disabled", "onClick"]),
                    createVNode(_component_Button, {
                      type: "button",
                      variant: unref(mode) === "register" ? "default" : "outline",
                      class: "w-full",
                      disabled: unref(isBusy),
                      onClick: ($event) => mode.value = "register"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" 注册 ")
                      ]),
                      _: 1
                    }, 8, ["variant", "disabled", "onClick"])
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  unref(mode) === "login" ? (openBlock(), createBlock("form", {
                    key: 0,
                    class: "space-y-4",
                    onSubmit: withModifiers(handleLogin, ["prevent"])
                  }, [
                    createVNode("div", null, [
                      createVNode(_component_Label, { for: "username" }, {
                        default: withCtx(() => [
                          createTextVNode("账号 / 邮箱 / 手机")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "username",
                        name: "username",
                        modelValue: unref(form).username,
                        "onUpdate:modelValue": ($event) => unref(form).username = $event,
                        required: "",
                        autocomplete: "username",
                        placeholder: "admin"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_Label, { for: "password" }, {
                        default: withCtx(() => [
                          createTextVNode("密码")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "password",
                        name: "password",
                        modelValue: unref(form).password,
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        type: "password",
                        required: "",
                        autocomplete: "current-password",
                        placeholder: "请输入密码"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(_component_Button, {
                      type: "submit",
                      class: "w-full",
                      disabled: unref(auth).loading
                    }, {
                      default: withCtx(() => [
                        unref(auth).loading ? (openBlock(), createBlock("span", { key: 0 }, "登录中...")) : (openBlock(), createBlock("span", { key: 1 }, "登录"))
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 32)) : (openBlock(), createBlock("form", {
                    key: 1,
                    class: "space-y-4",
                    onSubmit: withModifiers(handleRegister, ["prevent"])
                  }, [
                    createVNode("div", null, [
                      createVNode(_component_Label, { for: "register-username" }, {
                        default: withCtx(() => [
                          createTextVNode("用户名*")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "register-username",
                        modelValue: unref(registerForm).username,
                        "onUpdate:modelValue": ($event) => unref(registerForm).username = $event,
                        required: "",
                        autocomplete: "off",
                        placeholder: "new_user"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "register-nickname" }, {
                          default: withCtx(() => [
                            createTextVNode("昵称")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "register-nickname",
                          modelValue: unref(registerForm).nickname,
                          "onUpdate:modelValue": ($event) => unref(registerForm).nickname = $event,
                          autocomplete: "off",
                          placeholder: "可选"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_Label, { for: "register-email" }, {
                          default: withCtx(() => [
                            createTextVNode("邮箱")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Input, {
                          id: "register-email",
                          modelValue: unref(registerForm).email,
                          "onUpdate:modelValue": ($event) => unref(registerForm).email = $event,
                          type: "email",
                          autocomplete: "off",
                          placeholder: "可选"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_Label, { for: "register-password" }, {
                        default: withCtx(() => [
                          createTextVNode("密码*")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "register-password",
                        modelValue: unref(registerForm).password,
                        "onUpdate:modelValue": ($event) => unref(registerForm).password = $event,
                        type: "password",
                        required: "",
                        autocomplete: "new-password",
                        placeholder: "至少 8 位且非常见密码"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("p", {
                        class: ["text-xs min-h-[1.25rem]", unref(passwordErrors).length ? "text-destructive" : unref(passwordValid) ? "text-emerald-600" : "text-muted-foreground"]
                      }, [
                        unref(passwordChecking) ? (openBlock(), createBlock("span", { key: 0 }, "正在校验密码强度...")) : unref(passwordErrors).length ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(passwordErrors)[0]), 1)) : unref(passwordValid) ? (openBlock(), createBlock("span", { key: 2 }, "密码符合当前安全要求")) : (openBlock(), createBlock("span", { key: 3 }, "密码需满足平台设定的长度与复杂度要求"))
                      ], 2)
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_Label, { for: "register-password2" }, {
                        default: withCtx(() => [
                          createTextVNode("确认密码*")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_Input, {
                        id: "register-password2",
                        modelValue: unref(registerForm).password2,
                        "onUpdate:modelValue": ($event) => unref(registerForm).password2 = $event,
                        type: "password",
                        required: "",
                        autocomplete: "new-password",
                        placeholder: "再次输入密码"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode(_component_Button, {
                      type: "submit",
                      class: "w-full",
                      disabled: unref(auth).registerLoading || unref(passwordChecking)
                    }, {
                      default: withCtx(() => [
                        unref(auth).registerLoading ? (openBlock(), createBlock("span", { key: 0 }, "注册中...")) : (openBlock(), createBlock("span", { key: 1 }, "注册并登录"))
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ], 32))
                ]),
                _: 1
              }),
              unref(mode) === "register" ? (openBlock(), createBlock(_component_CardFooter, {
                key: 0,
                class: "text-xs text-muted-foreground leading-relaxed"
              }, {
                default: withCtx(() => [
                  createVNode("p", null, "注册创建的账户默认为普通用户，如需管理员权限请联系平台维护人员。")
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-DBAOibow.js.map
