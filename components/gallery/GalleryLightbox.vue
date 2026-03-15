<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="lightboxIndex !== null"
        :ref="(el) => { if (lightboxRef && el != null) (lightboxRef as { value: HTMLElement | null }).value = el as HTMLElement }"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="View image"
        tabindex="-1"
        @click.self="$emit('close')"
        @keydown="$emit('keydown', $event)"
      >
        <button
          type="button"
          class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close"
          @click="$emit('close')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div
          class="gallery-lightbox-inner relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
          @click.self="$emit('close')"
        >
          <img
            v-if="lightboxSrc"
            :src="lightboxSrc"
            :alt="`${galleryTitle} photo ${(lightboxIndex ?? 0) + 1}`"
            class="max-h-[90vh] max-w-full w-auto h-auto object-contain rounded-lg shadow-2xl"
            :style="{ aspectRatio: 'auto' }"
            @click.stop
          />
        </div>
        <button
          v-if="imagesCount > 1 && lightboxIndex !== null && lightboxIndex > 0"
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous image"
          @click.stop="$emit('prev')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-if="imagesCount > 1 && lightboxIndex !== null && lightboxIndex < imagesCount - 1"
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next image"
          @click.stop="$emit('next')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  lightboxIndex: number | null
  lightboxSrc: string | null
  lightboxRef: { value: HTMLElement | null } | null
  imagesCount: number
  galleryTitle?: string
}>()

defineEmits<{
  close: []
  prev: []
  next: []
  keydown: [e: KeyboardEvent]
}>()
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
.lightbox-enter-active .gallery-lightbox-inner,
.lightbox-leave-active .gallery-lightbox-inner {
  transition: transform 0.2s ease;
}
.lightbox-enter-from .gallery-lightbox-inner,
.lightbox-leave-to .gallery-lightbox-inner {
  transform: scale(0.95);
}
</style>
