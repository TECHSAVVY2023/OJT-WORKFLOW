import type { AdminMenuItemRow } from '~/composables/useAdminMenu'

type VariantOption = 'hot' | 'cold' | 'both'

function variantOptionToVariants(opt: VariantOption): string[] {
  if (opt === 'hot') return ['hot']
  if (opt === 'cold') return ['iced']
  return ['hot', 'iced']
}

function variantsToVariantOption(variants: string[] | undefined): VariantOption {
  if (!variants?.length) return 'both'
  const hasHot = variants.includes('hot')
  const hasIced = variants.includes('iced')
  if (hasHot && hasIced) return 'both'
  if (hasHot) return 'hot'
  if (hasIced) return 'cold'
  return 'both'
}

export function useAdminMenuItemsPage() {
  const { flatItems, categoryOptions, addItem, removeAddedItem, updateAddedItem, updateBaseItem, deleteBaseItem } =
    useAdminMenu()

  const PAGE_SIZE = 10
  const filterCategory = ref('')
  const filterStatus = ref('')
  const searchQuery = ref('')
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  const editRow = ref<AdminMenuItemRow | null>(null)
  const viewDetailRow = ref<AdminMenuItemRow | null>(null)
  const deleteTarget = ref<AdminMenuItemRow | null>(null)
  const successAlert = ref<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' })

  const form = reactive({
    name: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    available: true,
    variantOption: 'both' as VariantOption,
  })

  const showAddEditConfirm = ref(false)
  const addEditConfirmMessage = ref('')
  const pendingConfirmAction = ref<'add' | 'edit' | null>(null)
  const showExitConfirm = ref(false)

  const filteredRows = computed(() => {
    let list = flatItems.value
    const q = searchQuery.value.trim().toLowerCase()
    if (q)
      list = list.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          String(r.id).toLowerCase().includes(q)
      )
    if (filterCategory.value) list = list.filter((r) => r.category === filterCategory.value)
    if (filterStatus.value) list = list.filter((r) => r.status === filterStatus.value)
    return list
  })

  const { currentPage, totalPages, paginatedRows, showingFrom, showingTo } = useTablePagination(filteredRows, PAGE_SIZE)
  const tableContainerRef = ref<HTMLElement | null>(null)
  watch([filterCategory, filterStatus, searchQuery], () => {
    currentPage.value = 1
  })
  watch(currentPage, () => {
    nextTick(() => {
      tableContainerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  function variantLabel(variants: string[] | undefined): string {
    if (!variants?.length) return 'Both'
    if (variants.includes('hot') && variants.includes('iced')) return 'Both'
    if (variants.includes('hot')) return 'Hot only'
    if (variants.includes('iced')) return 'Cold only'
    return 'Both'
  }

  function openViewModal(row: AdminMenuItemRow) {
    viewDetailRow.value = row
  }

  function openEditModal(row: AdminMenuItemRow) {
    editRow.value = row
    form.name = row.raw.name
    form.category = row.category
    form.price = row.raw.price
    form.description = row.raw.description ?? ''
    form.image = row.raw.image
    form.available = row.raw.available
    form.variantOption = variantsToVariantOption(row.raw.variants)
    showEditModal.value = true
  }

  function closeModals() {
    showAddModal.value = false
    showEditModal.value = false
    editRow.value = null
    form.name = ''
    form.category = ''
    form.price = 0
    form.description = ''
    form.image = ''
    form.available = true
    form.variantOption = 'both'
  }

  function confirmSubmitAdd() {
    addEditConfirmMessage.value = 'Are you sure you want to add this item?'
    pendingConfirmAction.value = 'add'
    showAddEditConfirm.value = true
  }

  function confirmSaveEdit() {
    addEditConfirmMessage.value = 'Are you sure you want to save changes?'
    pendingConfirmAction.value = 'edit'
    showAddEditConfirm.value = true
  }

  function doConfirmAddOrSave() {
    if (pendingConfirmAction.value === 'add') submitAdd()
    else if (pendingConfirmAction.value === 'edit') saveEdit()
    showAddEditConfirm.value = false
    pendingConfirmAction.value = null
  }

  function confirmExitWithoutSave() {
    showExitConfirm.value = false
    closeModals()
  }

  function submitAdd() {
    const addedName = form.name
    addItem({
      name: form.name,
      category: form.category,
      price: form.price,
      description: form.description || undefined,
      image: form.image || undefined,
      available: form.available,
      variants: variantOptionToVariants(form.variantOption),
    })
    closeModals()
    successAlert.value = { show: true, title: 'Item added', message: `"${addedName}" has been added to the menu.` }
    useActivityLog().log('Menu item added', addedName)
  }

  function saveEdit() {
    if (!editRow.value) return
    const updatedName = form.name
    if (editRow.value.isAdminAdded) {
      updateAddedItem(editRow.value.id, {
        name: form.name,
        category: form.category,
        price: form.price,
        description: form.description,
        image: form.image,
        available: form.available,
        variants: variantOptionToVariants(form.variantOption),
      })
    } else {
      updateBaseItem(editRow.value.raw.id as number, {
        name: form.name,
        category: form.category,
        price: form.price,
        description: form.description,
        image: form.image,
        available: form.available,
        variants: variantOptionToVariants(form.variantOption),
      })
    }
    closeModals()
    successAlert.value = { show: true, title: 'Changes saved', message: `"${updatedName}" has been updated.` }
    useActivityLog().log('Menu item updated', updatedName)
  }

  function confirmDelete(row: AdminMenuItemRow) {
    deleteTarget.value = row
  }

  function doDelete() {
    if (!deleteTarget.value) return
    const name = deleteTarget.value.productName
    if (deleteTarget.value.isAdminAdded) {
      removeAddedItem(deleteTarget.value.id)
    } else {
      deleteBaseItem(deleteTarget.value.raw.id as number)
    }
    deleteTarget.value = null
    useActivityLog().log('Menu item deleted', name)
  }

  return {
    flatItems,
    categoryOptions,
    PAGE_SIZE,
    filterCategory,
    filterStatus,
    searchQuery,
    showAddModal,
    showEditModal,
    editRow,
    viewDetailRow,
    deleteTarget,
    successAlert,
    form,
    showAddEditConfirm,
    addEditConfirmMessage,
    pendingConfirmAction,
    showExitConfirm,
    filteredRows,
    currentPage,
    totalPages,
    paginatedRows,
    showingFrom,
    showingTo,
    tableContainerRef,
    variantLabel,
    openViewModal,
    openEditModal,
    closeModals,
    confirmSubmitAdd,
    confirmSaveEdit,
    doConfirmAddOrSave,
    confirmExitWithoutSave,
    submitAdd,
    saveEdit,
    confirmDelete,
    doDelete,
  }
}
