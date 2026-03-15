<template>
  <div class="flex flex-col gap-4 mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="relative flex-1 max-w-md">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          :model-value="searchQuery"
          type="search"
          placeholder="Search announcements..."
          class="w-full pl-11 pr-4 py-3 rounded-xl border-2 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white"
          style="border-color: #e5e7eb;"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-gray-600 text-sm font-poppins whitespace-nowrap">Filter by date:</label>
        <select
          :model-value="dateFilter"
          class="rounded-xl border-2 px-4 py-2.5 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white"
          style="border-color: #e5e7eb;"
          @change="$emit('update:dateFilter', ($event.target as HTMLSelectElement).value)"
        >
          <option value="all">All time</option>
          <option value="this-month">This month</option>
          <option value="last-3">Last 3 months</option>
          <option value="this-year">This year</option>
        </select>
        <p class="text-gray-500 text-sm font-poppins">
          {{ count }} {{ count === 1 ? 'announcement' : 'announcements' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  dateFilter: string
  count: number
}>()
defineEmits<{
  'update:searchQuery': [value: string]
  'update:dateFilter': [value: string]
}>()
</script>
