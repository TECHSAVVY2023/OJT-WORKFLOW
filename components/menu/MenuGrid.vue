<template>
  <div class="mt-8 max-w-6xl mx-auto">
    <template v-if="selectedCategory === 'all'">
      <section
        v-for="group in menuData"
        :key="group.category"
        class="mb-8 last:mb-4"
      >
        <h3 class="text-left text-lg font-semibold text-palette-brown mb-4">
          {{ group.category }}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <MenuCard
            v-for="item in group.items"
            :key="item.id"
            :item="item"
          />
        </div>
      </section>
    </template>
    <template v-else>
      <section class="mb-4">
        <h3 class="text-left text-lg font-semibold text-palette-brown mb-4">
          {{ selectedCategoryLabel }}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <MenuCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { MenuCategory } from '~/composables/useAdminMenu'
import type { MenuItemBase } from '~/composables/useAdminMenu'

defineProps<{
  menuData: MenuCategory[]
  selectedCategory: string
  selectedCategoryLabel: string
  filteredItems: MenuItemBase[]
}>()
</script>
