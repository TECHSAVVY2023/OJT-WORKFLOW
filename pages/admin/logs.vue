<template>
  <AdminLogsView
    :subtitle="subtitle"
    :header-size="headerSize"
    :empty-message="emptyMessage"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { subtitle, headerSize, emptyMessage } = useAdminLogsPage()
</script>
