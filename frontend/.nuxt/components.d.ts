
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


export const CommentThread: typeof import("../components/community/CommentThread.vue")['default']
export const AppShell: typeof import("../components/layout/AppShell.vue")['default']
export const ThemeToggle: typeof import("../components/layout/ThemeToggle.vue")['default']
export const CapabilityRadar: typeof import("../components/simulation/CapabilityRadar.client.vue")['default']
export const Badge: typeof import("../components/ui/badge.vue")['default']
export const Button: typeof import("../components/ui/button.vue")['default']
export const CardContent: typeof import("../components/ui/card-content.vue")['default']
export const CardDescription: typeof import("../components/ui/card-description.vue")['default']
export const CardFooter: typeof import("../components/ui/card-footer.vue")['default']
export const CardHeader: typeof import("../components/ui/card-header.vue")['default']
export const CardTitle: typeof import("../components/ui/card-title.vue")['default']
export const Card: typeof import("../components/ui/card.vue")['default']
export const Input: typeof import("../components/ui/input.vue")['default']
export const Label: typeof import("../components/ui/label.vue")['default']
export const PageHeader: typeof import("../components/ui/page-header.vue")['default']
export const Separator: typeof import("../components/ui/separator.vue")['default']
export const Switch: typeof import("../components/ui/switch.vue")['default']
export const Tabs: typeof import("../components/ui/tabs/Tabs.vue")['default']
export const TabsContent: typeof import("../components/ui/tabs/TabsContent.vue")['default']
export const TabsList: typeof import("../components/ui/tabs/TabsList.vue")['default']
export const TabsRoot: typeof import("../components/ui/tabs/TabsRoot.vue")['default']
export const TabsTrigger: typeof import("../components/ui/tabs/TabsTrigger.vue")['default']
export const Textarea: typeof import("../components/ui/textarea.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const Icon: typeof import("../node_modules/nuxt-icon/dist/runtime/Icon.vue")['default']
export const IconCSS: typeof import("../node_modules/nuxt-icon/dist/runtime/IconCSS.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyCommentThread: LazyComponent<typeof import("../components/community/CommentThread.vue")['default']>
export const LazyAppShell: LazyComponent<typeof import("../components/layout/AppShell.vue")['default']>
export const LazyThemeToggle: LazyComponent<typeof import("../components/layout/ThemeToggle.vue")['default']>
export const LazyCapabilityRadar: LazyComponent<typeof import("../components/simulation/CapabilityRadar.client.vue")['default']>
export const LazyBadge: LazyComponent<typeof import("../components/ui/badge.vue")['default']>
export const LazyButton: LazyComponent<typeof import("../components/ui/button.vue")['default']>
export const LazyCardContent: LazyComponent<typeof import("../components/ui/card-content.vue")['default']>
export const LazyCardDescription: LazyComponent<typeof import("../components/ui/card-description.vue")['default']>
export const LazyCardFooter: LazyComponent<typeof import("../components/ui/card-footer.vue")['default']>
export const LazyCardHeader: LazyComponent<typeof import("../components/ui/card-header.vue")['default']>
export const LazyCardTitle: LazyComponent<typeof import("../components/ui/card-title.vue")['default']>
export const LazyCard: LazyComponent<typeof import("../components/ui/card.vue")['default']>
export const LazyInput: LazyComponent<typeof import("../components/ui/input.vue")['default']>
export const LazyLabel: LazyComponent<typeof import("../components/ui/label.vue")['default']>
export const LazyPageHeader: LazyComponent<typeof import("../components/ui/page-header.vue")['default']>
export const LazySeparator: LazyComponent<typeof import("../components/ui/separator.vue")['default']>
export const LazySwitch: LazyComponent<typeof import("../components/ui/switch.vue")['default']>
export const LazyTabs: LazyComponent<typeof import("../components/ui/tabs/Tabs.vue")['default']>
export const LazyTabsContent: LazyComponent<typeof import("../components/ui/tabs/TabsContent.vue")['default']>
export const LazyTabsList: LazyComponent<typeof import("../components/ui/tabs/TabsList.vue")['default']>
export const LazyTabsRoot: LazyComponent<typeof import("../components/ui/tabs/TabsRoot.vue")['default']>
export const LazyTabsTrigger: LazyComponent<typeof import("../components/ui/tabs/TabsTrigger.vue")['default']>
export const LazyTextarea: LazyComponent<typeof import("../components/ui/textarea.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyIcon: LazyComponent<typeof import("../node_modules/nuxt-icon/dist/runtime/Icon.vue")['default']>
export const LazyIconCSS: LazyComponent<typeof import("../node_modules/nuxt-icon/dist/runtime/IconCSS.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
