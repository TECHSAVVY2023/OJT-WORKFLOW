<template>
  <div class="pb-6 bg-white font-poppins">
    <MenuHero
      title="Menu"
      subtitle="Workflow Coworking Space"
      image="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1600&q=80"
    />
    <div class="container mx-auto px-4 md:px-6 lg:px-12 pt-8">
      <MenuCategoryFilters
        :category-filters="categoryFilters"
        v-model:selected-category="selectedCategory"
      />
      <MenuGrid
        :menu-data="menuData"
        :selected-category="selectedCategory"
        :selected-category-label="selectedCategoryLabel"
        :filtered-items="filteredItems"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  menuData,
  categoryFilters,
  selectedCategory,
  selectedCategoryLabel,
  filteredItems,
} = useMenuPage()
</script>
