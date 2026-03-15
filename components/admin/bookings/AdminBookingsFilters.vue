<template>
  <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
    <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <input
        :model-value="searchQuery"
        type="search"
        placeholder="Search by customer, booking ID, or venue..."
        class="min-w-[200px] flex-1 max-w-xs px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
      <div class="relative inline-block min-w-[140px] sm:min-w-[160px]">
        <select
          id="filter-status"
          :model-value="filterStatus"
          class="w-full min-w-[140px] sm:min-w-[160px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px] appearance-none"
          @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          v-if="filterStatus"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
          aria-label="Clear status filter"
          @click="emit('update:filterStatus', '')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  filterStatus: string
}>()
defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
}>()
</script>
