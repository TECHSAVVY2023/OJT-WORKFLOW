<template>
  <ManagerBookingsView :state="state" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })
const state = useManagerBookingsPage()
</script>
