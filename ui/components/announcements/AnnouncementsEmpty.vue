<template>
  <div class="text-center py-16">
    <p class="text-gray-500 font-poppins">
      No announcements match your search or date filter.
    </p>
    <button
      type="button"
      class="mt-4 text-workflow-green font-semibold text-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green focus-visible:ring-offset-2 rounded"
      @click="$emit('clear')"
    >
      Clear filters
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  clear: []
}>()
</script>
