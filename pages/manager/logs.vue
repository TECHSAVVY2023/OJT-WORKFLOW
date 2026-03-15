<template>
  <ManagerLogsView
    :subtitle="subtitle"
    :header-size="headerSize"
    :empty-message="emptyMessage"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })
const { subtitle, headerSize, emptyMessage } = useManagerLogsPage()
</script>
