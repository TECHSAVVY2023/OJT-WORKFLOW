import type { AdminVenueRow } from '~/composables/useAdminVenues'
import adminDashboardData from '~/data/admin-dashboard.json'

const adminData = adminDashboardData as { venueAmenities?: string[] }
const venueAmenities = adminData.venueAmenities ?? []

function dedupeImagesByPath(list: string[]): string[] {
  const pathKey = (u: string) => {
    const t = (u || '').trim()
    if (!t) return ''
    try {
      return new URL(t, 'http://x').pathname.toLowerCase()
    } catch {
      return t.toLowerCase()
    }
  }
  const seen = new Set<string>()
  return list.filter((u) => {
    const key = pathKey(u)
    if (!key) return false
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function useAdminVenuePage() {
  const PAGE_SIZE = 10
  const { flatRows, addVenue, removeAddedVenue, updateAddedVenue, updateBaseVenue, deleteBaseVenue } =
    useAdminVenues()

  const searchQuery = ref('')
  const filterStatus = ref('')
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  const editRow = ref<AdminVenueRow | null>(null)
  const viewDetailRow = ref<AdminVenueRow | null>(null)
  const deleteTarget = ref<AdminVenueRow | null>(null)
  const successAlert = ref<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' })
  const tableContainerRef = ref<HTMLElement | null>(null)
  const showAddEditConfirm = ref(false)
  const addEditConfirmMessage = ref('')
  const pendingConfirmAction = ref<'add' | 'edit' | null>(null)
  const showExitConfirm = ref(false)
  const amenityInput = ref('')

  const filteredRows = computed(() => {
    let list = flatRows.value
    const q = searchQuery.value.trim().toLowerCase()
    if (q) list = list.filter((r) => r.name.toLowerCase().includes(q) || String(r.venueId).toLowerCase().includes(q))
    if (filterStatus.value) list = list.filter((r) => r.status === filterStatus.value)
    return list
  })

  const { currentPage, totalPages, paginatedRows, showingFrom, showingTo } = useTablePagination(
    filteredRows,
    PAGE_SIZE
  )
  watch([filterStatus, searchQuery], () => {
    currentPage.value = 1
  })
  watch(currentPage, () => {
    nextTick(() => {
      tableContainerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  const form = reactive({
    name: '',
    description: '',
    capacity: 0,
    hourlyRate: 0,
    operatingHours: '',
    available: true,
    images: [] as string[],
    amenities: [] as string[],
  })

  const venueDetailImages = computed(() => {
    const raw = viewDetailRow.value?.raw as { images?: string[]; image?: string } | undefined
    if (!raw) return []
    const list = raw.images?.length ? raw.images : (raw.image ? [raw.image] : [])
    return [...new Set(list)]
  })

  const venueImagesForList = computed(() => dedupeImagesByPath(form.images))

  function addAmenityFromInput() {
    const val = amenityInput.value.trim()
    if (!val || form.amenities.includes(val)) return
    form.amenities.push(val)
    amenityInput.value = ''
  }

  function removeAmenity(index: number) {
    form.amenities.splice(index, 1)
  }

  function confirmSubmitAdd() {
    addEditConfirmMessage.value = 'Are you sure you want to add this venue?'
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

  function openViewModal(row: AdminVenueRow) {
    viewDetailRow.value = row
  }

  function openEditModal(row: AdminVenueRow) {
    editRow.value = row
    form.name = row.name
    form.description = (row.raw as { description?: string }).description ?? ''
    form.capacity = row.capacity
    form.hourlyRate = row.pricePerHour
    form.operatingHours = (row.raw as { operatingHours?: string }).operatingHours ?? ''
    form.available = row.status === 'Available'
    const raw = row.raw as { images?: string[]; image?: string; amenities?: string[] }
    const imageList = raw.images?.length ? raw.images : (raw.image ? [raw.image] : [])
    form.images = dedupeImagesByPath(imageList)
    form.amenities = (raw.amenities ?? []).length ? [...(raw.amenities ?? [])] : []
    showEditModal.value = true
  }

  function closeModals() {
    showAddModal.value = false
    showEditModal.value = false
    showExitConfirm.value = false
    editRow.value = null
    amenityInput.value = ''
    form.name = ''
    form.description = ''
    form.capacity = 0
    form.hourlyRate = 0
    form.operatingHours = ''
    form.available = true
    form.images = []
    form.amenities = []
  }

  function submitAdd() {
    const addedName = form.name
    addVenue({
      name: form.name,
      description: form.description || undefined,
      capacity: form.capacity,
      hourlyRate: form.hourlyRate,
      operatingHours: form.operatingHours || undefined,
      available: form.available,
      images: form.images.length ? form.images : undefined,
      amenities: form.amenities.length ? form.amenities : undefined,
    })
    closeModals()
    successAlert.value = { show: true, title: 'Venue added', message: `"${addedName}" has been added.` }
    useActivityLog().log('Venue added', addedName)
  }

  function saveEdit() {
    if (!editRow.value) return
    const updatedName = form.name
    const updates = {
      name: form.name,
      description: form.description || undefined,
      capacity: form.capacity,
      hourlyRate: form.hourlyRate,
      operatingHours: form.operatingHours || undefined,
      available: form.available,
      images: form.images.length ? form.images : undefined,
      amenities: form.amenities.length ? form.amenities : undefined,
    }
    if (editRow.value.isAdminAdded) {
      updateAddedVenue(editRow.value.venueId, updates)
    } else {
      updateBaseVenue(editRow.value.raw.id as number, {
        ...updates,
        capacityNum: form.capacity,
      })
    }
    closeModals()
    successAlert.value = { show: true, title: 'Changes saved', message: `"${updatedName}" has been updated.` }
    useActivityLog().log('Venue updated', updatedName)
  }

  function confirmDelete(row: AdminVenueRow) {
    deleteTarget.value = row
  }

  function doDelete() {
    if (!deleteTarget.value) return
    const name = deleteTarget.value.name
    if (deleteTarget.value.isAdminAdded) {
      removeAddedVenue(deleteTarget.value.venueId)
    } else {
      deleteBaseVenue(deleteTarget.value.raw.id as number)
    }
    deleteTarget.value = null
    useActivityLog().log('Venue deleted', name)
  }

  return {
    venueAmenities,
    flatRows,
    searchQuery,
    filterStatus,
    currentPage,
    totalPages,
    paginatedRows,
    showingFrom,
    showingTo,
    showAddModal,
    showEditModal,
    editRow,
    viewDetailRow,
    deleteTarget,
    successAlert,
    tableContainerRef,
    showAddEditConfirm,
    addEditConfirmMessage,
    pendingConfirmAction,
    showExitConfirm,
    amenityInput,
    form,
    venueDetailImages,
    venueImagesForList,
    filteredRows,
    addAmenityFromInput,
    removeAmenity,
    confirmSubmitAdd,
    confirmSaveEdit,
    doConfirmAddOrSave,
    confirmExitWithoutSave,
    openViewModal,
    openEditModal,
    closeModals,
    submitAdd,
    saveEdit,
    confirmDelete,
    doDelete,
  }
}
