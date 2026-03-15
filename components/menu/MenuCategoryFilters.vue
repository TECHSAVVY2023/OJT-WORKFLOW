<template>
  <div class="flex flex-col items-center">
    <h2 class="text-lg sm:text-xl font-bold text-palette-brown mb-3 sm:mb-4">
      Browse by categories
    </h2>
    <div class="flex flex-nowrap sm:flex-wrap justify-center gap-1.5 sm:gap-5 pb-2 overflow-x-auto w-full sm:w-auto max-w-full">
      <button
        v-for="cat in categoryFilters"
        :key="cat.id"
        type="button"
        class="flex-shrink-0 flex flex-col items-center gap-1 sm:gap-2 p-0 transition-colors bg-transparent border-0 cursor-pointer w-[2.25rem] min-w-[2.25rem] sm:w-auto sm:min-w-0"
        @click="selectedCategory = cat.id"
      >
        <span
          class="w-7 h-7 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors"
          :class="selectedCategory === cat.id
            ? 'bg-palette-sage border-palette-sage text-palette-white'
            : 'bg-palette-white border-palette-sage text-palette-brown hover:border-palette-olive'"
        >
          <MenuCategoryIcon :name="cat.icon" :selected="selectedCategory === cat.id" />
        </span>
        <span class="text-[7px] sm:text-xs font-medium text-center w-full sm:max-w-[4rem] text-palette-brown leading-tight line-clamp-1 sm:line-clamp-none">{{ cat.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuCategoryFilter } from '~/composables/useMenuPage'

defineProps<{
  categoryFilters: MenuCategoryFilter[]
}>()

const selectedCategory = defineModel<string>('selectedCategory', { default: 'all' })
</script>
