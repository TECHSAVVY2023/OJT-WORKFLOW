<template>
  <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
    <div
      :class="size === 'large' ? 'px-6 lg:px-8 py-6 sm:py-8' : 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'"
    >
      <h1 class="font-heading font-bold text-palette-brown" :class="size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl lg:text-3xl'">
        {{ title }}
      </h1>
      <p class="mt-1 text-sm text-palette-brown/70">
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle: string
    size?: 'default' | 'large'
  }>(),
  { size: 'default' }
)
</script>
