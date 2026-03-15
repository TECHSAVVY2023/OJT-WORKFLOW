<template>
  <section class="relative h-64 md:h-80 overflow-hidden bg-palette-grey font-poppins">
    <img
      :src="image"
      :alt="title"
      class="absolute inset-0 h-full w-full object-cover"
      @error="($e: Event) => (($e.target as HTMLImageElement).style.display = 'none')"
    />
    <div class="absolute inset-0 bg-palette-dark/60 flex flex-col items-center justify-center text-palette-white px-4">
      <h1 class="text-3xl md:text-4xl font-bold font-poppins tracking-tight text-center">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-2 text-sm md:text-base font-poppins text-palette-white/90 text-center max-w-xl">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  image: string
}>()
</script>
