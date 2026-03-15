import type { AdminCategoryRow } from '~/composables/useAdminCategories'

export function useAdminCategoriesPage() {
  const { allCategories, addCategory, updateCategory, deleteCategory } = useAdminCategories()

  const searchQuery = ref('')
  const showFormModal = ref(false)
  const formName = ref('')
  const editingRow = ref<AdminCategoryRow | null>(null)
  const showDeleteConfirm = ref(false)
  const categoryToDelete = ref<AdminCategoryRow | null>(null)

  const filteredRows = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return allCategories.value
    return allCategories.value.filter(
      (r) => String(r.id).toLowerCase().includes(q) || r.name.toLowerCase().includes(q)
    )
  })

  function openAddModal() {
    editingRow.value = null
    formName.value = ''
    showFormModal.value = true
  }

  function openEditModal(row: AdminCategoryRow) {
    editingRow.value = row
    formName.value = row.name
    showFormModal.value = true
  }

  function submitForm() {
    const name = formName.value.trim()
    if (!name) return
    if (editingRow.value) {
      updateCategory(editingRow.value.id, name)
    } else {
      addCategory(name)
    }
    showFormModal.value = false
  }

  function confirmDelete(row: AdminCategoryRow) {
    categoryToDelete.value = row
    showDeleteConfirm.value = true
  }

  function doDelete() {
    if (categoryToDelete.value) {
      deleteCategory(categoryToDelete.value.id)
      categoryToDelete.value = null
    }
    showDeleteConfirm.value = false
  }

  return {
    allCategories,
    searchQuery,
    showFormModal,
    formName,
    editingRow,
    showDeleteConfirm,
    categoryToDelete,
    filteredRows,
    openAddModal,
    openEditModal,
    submitForm,
    confirmDelete,
    doDelete,
  }
}
