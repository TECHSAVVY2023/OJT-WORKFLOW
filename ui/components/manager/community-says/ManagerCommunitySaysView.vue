<template>
  <CommunitySaysEditor :state="state" />
</template>

<script setup lang="ts">
import type { useManagerCommunitySaysPage } from '~/composables/useManagerCommunitySaysPage'

defineProps<{
  state: ReturnType<typeof useManagerCommunitySaysPage>
}>()
</script>
