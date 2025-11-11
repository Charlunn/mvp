
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  'AppShell': typeof import("../../components/layout/AppShell.vue")['default']
  'ThemeToggle': typeof import("../../components/layout/ThemeToggle.vue")['default']
  'Badge': typeof import("../../components/ui/badge.vue")['default']
  'Button': typeof import("../../components/ui/button.vue")['default']
  'CardContent': typeof import("../../components/ui/card-content.vue")['default']
  'CardDescription': typeof import("../../components/ui/card-description.vue")['default']
  'CardFooter': typeof import("../../components/ui/card-footer.vue")['default']
  'CardHeader': typeof import("../../components/ui/card-header.vue")['default']
  'CardTitle': typeof import("../../components/ui/card-title.vue")['default']
  'Card': typeof import("../../components/ui/card.vue")['default']
  'Input': typeof import("../../components/ui/input.vue")['default']
  'Label': typeof import("../../components/ui/label.vue")['default']
  'PageHeader': typeof import("../../components/ui/page-header.vue")['default']
  'Separator': typeof import("../../components/ui/separator.vue")['default']
  'Switch': typeof import("../../components/ui/switch.vue")['default']
  'Textarea': typeof import("../../components/ui/textarea.vue")['default']
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  'Icon': typeof import("../../node_modules/nuxt-icon/dist/runtime/Icon.vue")['default']
  'IconCSS': typeof import("../../node_modules/nuxt-icon/dist/runtime/IconCSS.vue")['default']
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  'LazyAppShell': LazyComponent<typeof import("../../components/layout/AppShell.vue")['default']>
  'LazyThemeToggle': LazyComponent<typeof import("../../components/layout/ThemeToggle.vue")['default']>
  'LazyBadge': LazyComponent<typeof import("../../components/ui/badge.vue")['default']>
  'LazyButton': LazyComponent<typeof import("../../components/ui/button.vue")['default']>
  'LazyCardContent': LazyComponent<typeof import("../../components/ui/card-content.vue")['default']>
  'LazyCardDescription': LazyComponent<typeof import("../../components/ui/card-description.vue")['default']>
  'LazyCardFooter': LazyComponent<typeof import("../../components/ui/card-footer.vue")['default']>
  'LazyCardHeader': LazyComponent<typeof import("../../components/ui/card-header.vue")['default']>
  'LazyCardTitle': LazyComponent<typeof import("../../components/ui/card-title.vue")['default']>
  'LazyCard': LazyComponent<typeof import("../../components/ui/card.vue")['default']>
  'LazyInput': LazyComponent<typeof import("../../components/ui/input.vue")['default']>
  'LazyLabel': LazyComponent<typeof import("../../components/ui/label.vue")['default']>
  'LazyPageHeader': LazyComponent<typeof import("../../components/ui/page-header.vue")['default']>
  'LazySeparator': LazyComponent<typeof import("../../components/ui/separator.vue")['default']>
  'LazySwitch': LazyComponent<typeof import("../../components/ui/switch.vue")['default']>
  'LazyTextarea': LazyComponent<typeof import("../../components/ui/textarea.vue")['default']>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  'LazyIcon': LazyComponent<typeof import("../../node_modules/nuxt-icon/dist/runtime/Icon.vue")['default']>
  'LazyIconCSS': LazyComponent<typeof import("../../node_modules/nuxt-icon/dist/runtime/IconCSS.vue")['default']>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
