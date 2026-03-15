<template>
  <ManagerUsersView :state="state" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })
const state = useManagerUsersPage()
</script>
