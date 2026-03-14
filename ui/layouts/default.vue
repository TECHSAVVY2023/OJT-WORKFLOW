<template>
  <div class="min-h-screen flex flex-col bg-palette-cream antialiased font-poppins">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
</script>
