<template>
  <span class="shrink-0 w-5 h-5 text-palette-sage" aria-hidden="true">
    <!-- wifi -->
    <svg v-if="icon === 'wifi'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
    </svg>
    <!-- power / plug -->
    <svg v-else-if="icon === 'plug'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 7V3h-2v4h-4V3H8v4H6c-1.1 0-2 .9-2 2v4h4v6h4v-6h4V9c0-1.1-.9-2-2-2h-2zM4 19v-2h2v2H4zm12 0v-2h2v2h-2z"/>
    </svg>
    <!-- air conditioning (snowflake) -->
    <svg v-else-if="icon === 'ac'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 11h-4.17l3.24-3.24-1.41-1.41L16 8.34V4h-2v4.34l-3.24-3.24-1.41 1.41L12.17 11H8v2h4.17l-3.24 3.24 1.41 1.41L10 15.66V20h2v-4.34l3.24 3.24 1.41-1.41L15.83 13H20v-2z"/>
    </svg>
    <!-- chair / seat -->
    <svg v-else-if="icon === 'chair'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 13v2h10v-2c0-1.1.9-2 2-2h2V9c0-1.1-.9-2-2-2h-2V5c0-1.1-.9-2-2-2H9C7.9 3 7 3.9 7 5v2H5c-1.1 0-2 .9-2 2v2h2c1.1 0 2 .9 2 2zM5 9h2V5h10v4h2v2h-2v6H5v-6H3V9h2z"/>
    </svg>
    <!-- laptop -->
    <svg v-else-if="icon === 'laptop'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
    </svg>
    <!-- mouse -->
    <svg v-else-if="icon === 'mouse'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/>
    </svg>
    <!-- gamepad / board games -->
    <svg v-else-if="icon === 'game'" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.55 0 2.74-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm2 3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
    </svg>
    <!-- default / check -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
}>()
</script>
