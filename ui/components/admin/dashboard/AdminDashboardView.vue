<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader
      :title="adminData.welcome.title"
      subtitle="Manage your menu, venues, and bookings from here."
      size="large"
    />
    <div class="px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      <AdminDashboardSummary :cards="summaryCards" />
      <AdminDashboardCharts
        :menu-items-by-category="menuItemsByCategory"
        :bookings-donut-segments="bookingsDonutSegments"
        :bookings-by-status-total="bookingsByStatusTotal"
      />
      <AdminDashboardQuickActions />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  adminData: { welcome: { title: string } }
  summaryCards: Array<Record<string, unknown>>
  menuItemsByCategory: Array<Record<string, unknown>>
  bookingsDonutSegments: Array<Record<string, unknown>>
  bookingsByStatusTotal: number
}>()
</script>
