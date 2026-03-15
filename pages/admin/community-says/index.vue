<template>
  <AdminCommunitySaysView :state="state" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const state = useAdminCommunitySaysPage()
</script>
