<template>
  <button
    type="button"
    class="group bg-white rounded-xl shadow-md overflow-hidden text-left hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green cursor-pointer border border-gray-100 flex flex-col h-full"
    @click="$emit('click', item)"
  >
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
        No image
      </div>
      <span
        v-if="dateText"
        class="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-xs font-medium font-poppins bg-white/95 text-gray-700 shadow-sm"
      >
        {{ dateText }}
      </span>
    </div>
    <div class="p-3 sm:p-4 flex flex-col flex-1 min-h-[5.5rem]">
      <h2 class="font-bold font-poppins text-palette-brown text-sm sm:text-base md:text-lg leading-snug line-clamp-2">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-2 text-gray-600 text-xs sm:text-sm line-clamp-2 flex-1">
        {{ description }}
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { AnnouncementItem } from '~/composables/useAnnouncementsPage'

defineProps<{
  item: AnnouncementItem
  imageUrl: string
  title: string
  dateText: string
  description?: string
}>()
defineEmits<{
  click: [item: AnnouncementItem]
}>()
</script>
