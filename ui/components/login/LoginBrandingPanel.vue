<template>
  <div
    class="hidden lg:flex flex-[0.9] min-h-screen flex-col items-center justify-center px-12 text-center"
    :style="{ backgroundColor: branding.panelBackgroundColor }"
  >
    <div class="flex items-center justify-center mb-8">
      <img
        v-if="branding.logo.url"
        :src="branding.logo.url"
        :alt="branding.logo.imageAlt"
        class="w-60 h-60 object-contain"
      />
      <svg v-else class="w-60 h-60 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M8 38V18L16 30L24 18L32 30L40 18V38"
          :stroke="branding.highlightColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>
    </div>
    <h2 class="font-heading text-2xl md:text-3xl font-bold text-palette-brown mb-3">
      {{ branding.welcomeTitle }}
    </h2>
    <p class="text-lg text-palette-brown/90 max-w-xs">
      {{ branding.tagline }}
      <span class="font-semibold" :style="{ color: branding.highlightColor }">{{ branding.taglineHighlight }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { LoginPageData } from '~/composables/useLoginPage'

defineProps<{
  branding: LoginPageData['branding']
}>()
</script>
