<template>
  <div class="flex flex-wrap items-center justify-center gap-2 mt-8">
    <button
      type="button"
      :disabled="currentPage <= 1"
      class="px-4 py-2 rounded-lg font-poppins text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green"
      style="background: #e8e0d5; color: #7B7557;"
      aria-label="Previous page"
      @click="$emit('update:currentPage', Math.max(1, currentPage - 1))"
    >
      ‹
    </button>
    <template v-for="p in pageNumbers" :key="p">
      <button
        v-if="p !== '...'"
        type="button"
        :class="[
          'min-w-[2.5rem] px-3 py-2 rounded-lg font-poppins text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green',
          p === currentPage ? 'text-white' : 'bg-palette-cream/50 text-palette-brown hover:bg-palette-cream'
        ]"
        :style="p === currentPage ? { backgroundColor: '#7B7557' } : {}"
        @click="$emit('update:currentPage', p as number)"
      >
        {{ p }}
      </button>
      <span v-else class="px-1 text-gray-400">…</span>
    </template>
    <button
      type="button"
      :disabled="currentPage >= totalPages"
      class="px-4 py-2 rounded-lg font-poppins text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green"
      style="background: #e8e0d5; color: #7B7557;"
      aria-label="Next page"
      @click="$emit('update:currentPage', Math.min(totalPages, currentPage + 1))"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
  pageNumbers: (number | string)[]
}>()
defineEmits<{
  'update:currentPage': [page: number]
}>()
</script>
