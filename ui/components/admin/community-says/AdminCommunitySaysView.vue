<template>
  <CommunitySaysEditor :state="state" />
</template>

<script setup lang="ts">
import type { useAdminCommunitySaysPage } from '~/composables/useAdminCommunitySaysPage'

defineProps<{
  state: ReturnType<typeof useAdminCommunitySaysPage>
}>()
</script>
