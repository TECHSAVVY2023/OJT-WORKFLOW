<template>
  <span
    class="inline-flex items-center justify-center shrink-0 w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7"
    :class="selected ? 'text-palette-white' : 'text-palette-sage'"
  >
    <!-- list / All Items -->
    <svg v-if="iconKey === 'list'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
    </svg>
    <!-- coffee -->
    <svg v-else-if="iconKey === 'coffee'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M2 21h18v-2H2v2zM20 8h-2V5h2v3zm0 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-9c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2zm-2 2v-4H6v4h12z" />
    </svg>
    <!-- leaf / Matcha -->
    <svg v-else-if="iconKey === 'leaf'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.39-2.8C9.5 17 11 17 13 17c5 0 8-2.9 8-8s-3-8-8-8-8 3-8 8c0 2.5 1 4.5 2.5 6L5 17c1-3 2-6 2-8 0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6h-3z" />
    </svg>
    <!-- tea -->
    <svg v-else-if="iconKey === 'tea'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M12 2c-.9 0-1.6.7-1.6 1.6v.8H4v1.6h6.4v.8c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6v-.8H20V4.4h-6.4v-.8c0-.9-.7-1.6-1.6-1.6zM4 8.8v9.6c0 1.8 1.4 3.2 3.2 3.2h9.6c1.8 0 3.2-1.4 3.2-3.2V8.8H4z" />
    </svg>
    <!-- glass / Refreshers -->
    <svg v-else-if="iconKey === 'glass'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M6 3v2c0 4.4 2.9 8.1 6.9 9.4.5.1.9.2 1.4.2s.9-.1 1.4-.2c4-1.3 6.9-5 6.9-9.4V3H6zm12 5c0 3.5-2.3 6.5-5.5 7.5-.4.1-.8.2-1.2.2s-.8-.1-1.2-.2C8.3 14.5 6 11.5 6 8V5h12v3z" />
    </svg>
    <!-- cup / Milk -->
    <svg v-else-if="iconKey === 'cup'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M18 5H4v12h14v-2h2c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-2V5zM4 19h14v2H4v-2zm16-8h-2v4h2V11z" />
    </svg>
    <!-- snowflake / Cold Brew -->
    <svg v-else-if="iconKey === 'snowflake'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M12 2l-1.5 2.5L8 3l1 3.5L5 6l2 2.5L4 10l3-.5L4 14l2.5-2L5 18l3.5-1L8 21l2.5-1.5L12 22l1.5-2.5L16 21l-1.5-4 3 1.5-1.5-2L19 14l-3 .5 1.5 2.5L20 10l-3 .5 2-2.5-3-1 2-2.5L12 2z" />
    </svg>
    <!-- rice -->
    <svg v-else-if="iconKey === 'rice'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M12 2C8.5 2 6 4.5 6 8c0 2.4 1.2 4.5 3 5.7V21h6v-7.3c1.8-1.2 3-3.3 3-5.7 0-3.5-2.5-6-6-6zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
    <!-- food / Snacks -->
    <svg v-else-if="iconKey === 'food'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M18 3v2h-2v14H8V5H6v14H4V5H2V3h16v2h-2v14h-2V5h-2V3h6zm-6 4l4 8H8l4-8z" />
    </svg>
    <!-- fallback circle -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    </svg>
  </span>
</template>

<script setup lang="ts">
const iconMap: Record<string, string> = {
  'mdi:format-list-bulleted': 'list',
  'mdi:coffee': 'coffee',
  'mdi:leaf': 'leaf',
  'mdi:tea': 'tea',
  'mdi:glass-mug-variant': 'glass',
  'mdi:cup': 'cup',
  'mdi:snowflake': 'snowflake',
  'mdi:rice': 'rice',
  'mdi:food': 'food',
  'mdi:circle-outline': 'circle',
}

const props = defineProps<{
  name: string
  selected?: boolean
}>()

const iconKey = computed(() => iconMap[props.name] ?? 'circle')
</script>
