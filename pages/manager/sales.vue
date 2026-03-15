<template>
  <ManagerSalesView :state="state" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })
const state = useManagerSalesPage()
</script>
