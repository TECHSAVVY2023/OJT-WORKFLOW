<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader title="Bookings" subtitle="View bookings (read-only). Filter by status." />
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <label for="filter-period-bookings" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Period</label>
          <div class="relative inline-block min-w-[120px]">
            <select
              id="filter-period-bookings"
              :model-value="state.filterPeriod"
              class="w-full min-w-[120px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 min-h-[42px] appearance-none"
              @change="state.setFilterPeriod(($event.target as HTMLSelectElement).value as 'all' | 'daily' | 'weekly' | 'monthly')"
            >
              <option value="all">All</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              v-if="state.filterPeriod !== 'all'"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
              aria-label="Clear period filter"
              @click="state.setFilterPeriod('all')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <label for="filter-status" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Status</label>
          <div class="relative inline-block min-w-[140px]">
            <select
              id="filter-status"
              :model-value="state.filterStatus"
              class="w-full min-w-[140px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 min-h-[42px] appearance-none"
              @change="state.filterStatus = ($event.target as HTMLSelectElement).value"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              v-if="state.filterStatus"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
              aria-label="Clear status filter"
              @click="state.setFilterStatus('')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown text-sm font-medium hover:bg-palette-cream/60 min-h-[42px]"
          @click="state.exportBookingsCsv()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export
        </button>
      </div>

      <div class="mb-6 p-4 rounded-xl bg-palette-sage/10 border border-palette-sage/30">
        <p class="text-sm font-medium text-palette-brown/80">{{ state.filterPeriodLabel }} total booking earning</p>
        <p class="text-2xl font-bold text-palette-dark">₱{{ state.totalBookingEarning.toLocaleString() }}</p>
        <p class="text-xs text-palette-brown/60 mt-1">{{ state.sortedRows.length }} booking(s)</p>
      </div>

      <div class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-[640px] w-full divide-y divide-palette-olive/20">
            <thead class="bg-palette-olive/15">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Booking ID</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Customer</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Venue</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Date & time</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-palette-brown uppercase">Amount</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-palette-olive/15">
              <tr v-if="state.sortedRows.length === 0">
                <td colspan="6" class="px-4 py-12 sm:py-16 text-center text-palette-brown/80 text-sm font-medium">
                  No bookings to show.
                </td>
              </tr>
              <tr v-for="row in state.sortedRows" :key="row.id" class="hover:bg-palette-cream/50">
                <td class="px-4 py-3 text-sm font-medium text-palette-dark">{{ row.bookingRef }}</td>
                <td class="px-4 py-3 text-sm">
                  <p class="font-medium text-palette-dark">{{ row.customerName }}</p>
                  <p class="text-palette-brown/80 text-xs">{{ row.customerEmail }}</p>
                </td>
                <td class="px-4 py-3 text-sm text-palette-brown">{{ row.venueName }}</td>
                <td class="px-4 py-3 text-sm text-center">
                  <p class="font-medium text-palette-dark">{{ row.date }}</p>
                  <p class="text-palette-brown/80 text-xs">{{ row.timeRange }}</p>
                </td>
                <td class="px-4 py-3 text-sm font-semibold text-palette-dark text-right">₱{{ row.total.toLocaleString() }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" :class="state.statusClass(row.status)">{{ row.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 py-3 bg-palette-olive/10 border-t border-palette-olive/20 text-sm text-palette-brown">
          Showing {{ state.sortedRows.length }} of {{ state.flatRows.length }} bookings
        </div>
      </div>

      <p v-if="!state.flatRows.length" class="text-center py-12 text-palette-brown/80">No bookings yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { useManagerBookingsPage } from '~/composables/useManagerBookingsPage'

defineProps<{
  state: ReturnType<typeof useManagerBookingsPage>
}>()
</script>
