<template>
  <div class="px-4 sm:px-6 py-3 bg-palette-olive/10 border-t border-palette-olive/20 flex flex-wrap items-center justify-between gap-2 text-sm text-palette-brown">
    <span>Showing {{ showingFrom }}-{{ showingTo }} of {{ total }}</span>
    <div class="flex items-center gap-1">
      <button
        type="button"
        class="p-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/80 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Previous page"
        :disabled="currentPage <= 1"
        @click="$emit('prev')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <span class="px-2 text-palette-brown/80 text-sm">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
      <button
        type="button"
        class="p-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/80 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Next page"
        :disabled="currentPage >= totalPages"
        @click="$emit('next')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showingFrom: number
  showingTo: number
  total: number
  currentPage: number
  totalPages: number
}>()
defineEmits<{ prev: []; next: [] }>()
</script>
