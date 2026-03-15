<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader
      :title="managerData.welcome.title"
      subtitle="View users, bookings, and sales reports."
    />
    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <ManagerDashboardOverview
        :user-count="userCount"
        :booking-count="bookingCount"
        :total-sales="totalSales"
      />
      <ManagerDashboardCharts
        :sales-by-day="salesByDay"
        :sales-by-source-segments="salesBySourceSegments"
        :bookings-by-status-bars="bookingsByStatusBars"
        :booking-count="bookingCount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  managerData: { welcome: { title: string } }
  userCount: number
  bookingCount: number
  totalSales: number
  salesByDay: Array<{ date: string; label: string; total: number; heightPercent: number }>
  salesBySourceSegments: Array<{ source: string; total: number; color: string; dash: string; offset: number }>
  bookingsByStatusBars: Array<{ status: string; count: number; percent: number; color: string }>
}>()
</script>
