<template>
  <ManagerDashboardView
    :manager-data="managerData"
    :user-count="userCount"
    :booking-count="bookingCount"
    :total-sales="totalSales"
    :sales-by-day="salesByDay"
    :sales-by-source-segments="salesBySourceSegments"
    :bookings-by-status-bars="bookingsByStatusBars"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })
const {
  managerData,
  userCount,
  bookingCount,
  totalSales,
  salesByDay,
  salesBySourceSegments,
  bookingsByStatusBars,
} = useManagerDashboardPage()
</script>
