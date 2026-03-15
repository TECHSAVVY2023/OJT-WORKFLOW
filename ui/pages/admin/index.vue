<template>
  <AdminDashboardView
    :admin-data="adminData"
    :summary-cards="summaryCards"
    :menu-items-by-category="menuItemsByCategory"
    :bookings-donut-segments="bookingsDonutSegments"
    :bookings-by-status-total="bookingsByStatusTotal"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const {
  adminData,
  summaryCards,
  menuItemsByCategory,
  bookingsDonutSegments,
  bookingsByStatusTotal,
} = useAdminDashboardPage()
</script>
