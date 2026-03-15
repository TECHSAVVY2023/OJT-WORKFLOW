<template>
  <section class="relative h-64 md:h-80 overflow-hidden">
    <img
      :src="image"
      :alt="title"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-palette-dark/60 flex flex-col items-center justify-center text-palette-white">
      <p class="text-sm md:text-base font-medium tracking-wide">{{ subtitle }}</p>
      <h1 class="text-3xl md:text-4xl font-bold font-poppins mt-1 tracking-tight">{{ title }}</h1>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  image: string
}>()
</script>
