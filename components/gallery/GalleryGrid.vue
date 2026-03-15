<template>
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
      @click="$emit('open', index)"
    >
      <img
        :src="src"
        :alt="`${galleryTitle} photo ${index + 1}`"
        class="w-full h-full object-cover pointer-events-none"
        loading="lazy"
        @error="($e: Event) => (($e.target as HTMLImageElement).style.display = 'none')"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  images: string[]
  galleryTitle?: string
}>()

defineEmits<{ open: [index: number] }>()
</script>
