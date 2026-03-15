<template>
  <div>
    <NuxtLink
      to="/#our-space"
      class="inline-flex items-center gap-2 text-sm font-semibold text-palette-brown hover:text-[#69AC7C] transition-colors mb-6"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Our Space
    </NuxtLink>
    <div class="text-center mb-8 md:mb-12">
      <h1
        class="text-3xl md:text-4xl font-bold mb-2 max-w-2xl mx-auto"
        :style="{ fontFamily: ourSpace?.titleFontFamily || 'Poppins', color: ourSpace?.titleColor || '#69AC7C' }"
      >
        {{ ourSpace?.title || 'Our Space' }} Gallery
      </h1>
      <p
        class="text-base max-w-2xl mx-auto"
        :style="{ fontFamily: ourSpace?.textFontFamily || 'Poppins', color: ourSpace?.textColor || '#374151' }"
      >
        {{ ourSpace?.galleryPageSubtitle || 'Explore our space with more photos from our coworking and study hub.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  ourSpace?: {
    title?: string
    titleFontFamily?: string
    titleColor?: string
    textFontFamily?: string
    textColor?: string
    galleryPageSubtitle?: string
  }
}>()
</script>
