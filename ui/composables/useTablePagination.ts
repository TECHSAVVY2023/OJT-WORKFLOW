export const DEFAULT_PAGE_SIZE = 10

export function useTablePagination<T>(filteredRows: Ref<T[]>, pageSize: number = DEFAULT_PAGE_SIZE) {
  const currentPage = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

  const paginatedRows = computed(() => {
    const list = filteredRows.value
    const start = (currentPage.value - 1) * pageSize
    return list.slice(start, start + pageSize)
  })

  const showingFrom = computed(() => {
    if (filteredRows.value.length === 0) return 0
    return (currentPage.value - 1) * pageSize + 1
  })

  const showingTo = computed(() => Math.min(currentPage.value * pageSize, filteredRows.value.length))

  function resetPage() {
    currentPage.value = 1
  }

  watch(filteredRows, () => { currentPage.value = 1 })

  return { currentPage, totalPages, paginatedRows, showingFrom, showingTo, resetPage }
}
