const CATEGORY_ICONS: Record<string, string> = {
  'Coffee': 'mdi:coffee',
  'Matcha Series': 'mdi:leaf',
  'Tea': 'mdi:tea',
  'Refreshers': 'mdi:glass-mug-variant',
  'Milk Series': 'mdi:cup',
  'Cold Brew Series': 'mdi:snowflake',
  'Rice Meals': 'mdi:rice',
  'Snacks': 'mdi:food',
}

export interface MenuCategoryFilter {
  id: string
  label: string
  icon: string
}

export function useMenuPage() {
  const { menuData } = useAdminMenu()

  const categoryFilters = computed<MenuCategoryFilter[]>(() => {
    const all: MenuCategoryFilter = { id: 'all', label: 'All Items', icon: 'mdi:format-list-bulleted' }
    const rest = menuData.value.map((g) => ({
      id: g.category,
      label: g.category,
      icon: CATEGORY_ICONS[g.category] ?? 'mdi:circle-outline',
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

  return {
    menuData,
    categoryFilters,
    selectedCategory,
    selectedCategoryLabel,
    filteredItems,
  }
}
