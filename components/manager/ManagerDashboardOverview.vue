<template>
  <section>
    <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
      Overview
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <NuxtLink
        to="/manager/users"
        class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
      >
        <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-palette-brown/80">Users</p>
            <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">{{ userCount }}</p>
          </div>
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style="background-color: #e8f5e9;">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#2e7d32" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div class="block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10">
          View all →
        </div>
      </NuxtLink>

      <NuxtLink
        to="/manager/bookings"
        class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
      >
        <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-palette-brown/80">Bookings</p>
            <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">{{ bookingCount }}</p>
          </div>
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style="background-color: #fff3e0;">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#e65100" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10">
          View all →
        </div>
      </NuxtLink>

      <NuxtLink
        to="/manager/sales"
        class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
      >
        <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-palette-brown/80">Total Sales</p>
            <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">₱{{ totalSales.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style="background-color: #e8f5e9;">
            <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#2e7d32" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10">
          View all →
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  userCount: number
  bookingCount: number
  totalSales: number
}>()
</script>
