<template>
  <div>
    <!-- Full-page overlay while navigating -->
    <Transition name="loading-fade">
      <div
        v-show="isPageLoading"
        class="global-loading-overlay"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="global-loading-spinner" aria-hidden="true" />
        <span class="sr-only">Loading…</span>
      </div>
    </Transition>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp()
const isPageLoading = ref(false)

nuxtApp.hook('page:start', () => {
  isPageLoading.value = true
})
nuxtApp.hook('page:finish', () => {
  isPageLoading.value = false
})
</script>

<style scoped>
.global-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 246, 239, 0.9);
}
.global-loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e8e0d5;
  border-top-color: #69AC7C;
  border-radius: 50%;
  animation: global-spin 0.8s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .global-loading-spinner {
    animation: none;
    border-top-color: #69AC7C;
    opacity: 0.8;
  }
}
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease;
}
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style>
@keyframes global-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
