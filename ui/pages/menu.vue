<template>
  <div class="pb-6 bg-white font-poppins">
    <!-- Hero (same size as VenueHero: h-64 md:h-80) -->
    <section class="relative h-64 md:h-80 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1600&q=80"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-palette-dark/60 flex flex-col items-center justify-center text-palette-white">
        <p class="text-sm md:text-base font-medium tracking-wide">Workflow Coworking Space</p>
        <h1 class="text-3xl md:text-4xl font-bold font-poppins mt-1 tracking-tight">Menu</h1>
      </div>
    </section>

    <div class="container mx-auto px-4 md:px-6 lg:px-12 pt-8">
      <!-- Browse by categories: one line on mobile (scroll if needed) -->
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

      <!-- Menu grid (same max width as index best-selling cards) -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
const { menuData } = useAdminMenu()

const categoryFilters = computed(() => {
  const all = { id: 'all', label: 'All Items', icon: 'mdi:format-list-bulleted' }
  const icons: Record<string, string> = {
    'Coffee': 'mdi:coffee',
    'Matcha Series': 'mdi:leaf',
    'Tea': 'mdi:tea',
    'Refreshers': 'mdi:glass-mug-variant',
    'Milk Series': 'mdi:cup',
    'Cold Brew Series': 'mdi:snowflake',
    'Rice Meals': 'mdi:rice',
    'Snacks': 'mdi:food',
  }
  const rest = menuData.value.map((g) => ({
    id: g.category,
    label: g.category,
    icon: icons[g.category] ?? 'mdi:circle-outline',
  }))
  return [all, ...rest]
})

const selectedCategory = ref<string>('all')

const selectedCategoryLabel = computed(() => {
  if (selectedCategory.value === 'all') return ''
  return selectedCategory.value
})

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') return []
  const group = menuData.value.find((g) => g.category === selectedCategory.value)
  return group ? group.items : []
})
</script>
