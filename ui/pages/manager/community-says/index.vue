<template>
  <ManagerCommunitySaysView :state="state" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })
const state = useManagerCommunitySaysPage()
</script>
