<template>
  <div class="min-h-screen bg-palette-cream/30 font-poppins pb-16">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
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
          :style="{ fontFamily: siteData.ourSpace?.titleFontFamily || 'Poppins', color: siteData.ourSpace?.titleColor || '#69AC7C' }"
        >
          {{ siteData.ourSpace?.title || 'Our Space' }} Gallery
        </h1>
        <p
          class="text-base max-w-2xl mx-auto"
          :style="{ fontFamily: siteData.ourSpace?.textFontFamily || 'Poppins', color: siteData.ourSpace?.textColor || '#374151' }"
        >
          {{ siteData.ourSpace?.galleryPageSubtitle || 'Explore our space with more photos from our coworking and study hub.' }}
        </p>
      </div>

      <div v-if="images.length === 0" class="text-center text-gray-500 py-16">
        No photos in the gallery yet.
      </div>
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        <button
          v-for="(src, index) in images"
          :key="index"
          type="button"
          class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69AC7C] text-left block w-full"
          @click="openLightbox(index)"
        >
          <img
            :src="src"
            :alt="`${siteData.ourSpace.title} photo ${index + 1}`"
            class="w-full h-full object-cover pointer-events-none"
            loading="lazy"
            @error="($e: Event) => (($e.target as HTMLImageElement).style.display = 'none')"
          />
        </button>
      </div>
    </div>

    <!-- Lightbox: full aspect ratio -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxIndex !== null"
          ref="lightboxRef"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="View image"
          tabindex="-1"
          @click.self="closeLightbox"
          @keydown="onLightboxKeydown"
        >
          <button
            type="button"
            class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
            @click="closeLightbox"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            class="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
            @click.self="closeLightbox"
          >
            <img
              v-if="lightboxSrc"
              :src="lightboxSrc"
              :alt="`${siteData.ourSpace.title} photo ${(lightboxIndex ?? 0) + 1}`"
              class="max-h-[90vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              :style="{ aspectRatio: 'auto' }"
              @click.stop
            />
          </div>
          <button
            v-if="images.length > 1 && lightboxIndex !== null && lightboxIndex > 0"
            type="button"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
            @click.stop="prevImage"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-if="images.length > 1 && lightboxIndex !== null && lightboxIndex < images.length - 1"
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
            @click.stop="nextImage"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
const images = computed(() => siteData.ourSpace?.images ?? [])

const lightboxIndex = ref<number | null>(null)
const lightboxSrc = computed(() =>
  lightboxIndex.value !== null && images.value[lightboxIndex.value]
    ? images.value[lightboxIndex.value]
    : null
)

function openLightbox(index: number) {
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}

function prevImage() {
  if (lightboxIndex.value !== null && lightboxIndex.value > 0) {
    lightboxIndex.value = lightboxIndex.value - 1
  }
}

function nextImage() {
  if (lightboxIndex.value !== null && lightboxIndex.value < images.value.length - 1) {
    lightboxIndex.value = lightboxIndex.value + 1
  }
}

const lightboxRef = ref<HTMLElement | null>(null)
function onLightboxKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

watch(lightboxIndex, (val) => {
  if (val !== null) {
    nextTick(() => lightboxRef.value?.focus())
  }
})
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-enter-active .max-h-\[90vh\],
.lightbox-leave-active .max-h-\[90vh\] {
  transition: transform 0.2s ease;
}
.lightbox-enter-from .max-h-\[90vh\],
.lightbox-leave-to .max-h-\[90vh\] {
  transform: scale(0.95);
}
</style>
