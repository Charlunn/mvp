<template>
  <div class="relative min-h-screen bg-muted/40">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fafafa,_#dcdcdc)] dark:bg-[radial-gradient(circle_at_top,_#0f0f0f,_#050505)]" aria-hidden="true"></div>
    <div class="relative z-10 flex min-h-screen items-center justify-center p-6">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
