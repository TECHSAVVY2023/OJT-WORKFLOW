<template>
  <section>
    <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
      Overview
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden">
        <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-palette-brown/80">Total menu items</p>
            <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">
              {{ totalMenuItems }}
            </p>
          </div>
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#fef9e7]">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#e6b800]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
      <div class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden">
        <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-palette-brown/80">Pending orders</p>
            <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">
              {{ pendingOrdersCount }}
            </p>
          </div>
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#fff3e0]">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#e65100]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden">
        <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-palette-brown/80">Total sales</p>
            <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">
              ₱{{ totalSalesAmount.toLocaleString() }}
            </p>
          </div>
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#e8f5e9]">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#2e7d32]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  totalMenuItems: number
  pendingOrdersCount: number
  totalSalesAmount: number
}>()
</script>
