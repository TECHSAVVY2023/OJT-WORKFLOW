import type { AdminBookingRow, BookingStatus } from '~/composables/useAdminBookings'
import { MODE_OF_PAYMENT_OPTIONS } from '~/composables/useAdminBookings'

export type { AdminBookingRow, BookingStatus }
export { MODE_OF_PAYMENT_OPTIONS }

const STATUS_ORDER: Record<BookingStatus, number> = { Pending: 0, Confirmed: 1, Completed: 2, Cancelled: 3 }

export function useAdminBookingsPage() {
  const { flatRows, updateStatus, updatePaymentStatus, updateModeOfPayment } = useAdminBookings()
  const filterStatus = ref('')
  const searchQuery = ref('')
  const successAlert = ref<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' })
  const tableContainerRef = ref<HTMLElement | null>(null)
  const viewDetailRow = ref<AdminBookingRow | null>(null)
  const currentDetailRow = computed(() =>
    viewDetailRow.value ? flatRows.value.find((r) => r.id === viewDetailRow.value!.id) ?? viewDetailRow.value : null
  )
  const PAGE_SIZE = 10

  const filteredRows = computed(() => {
    let list = flatRows.value
    const q = searchQuery.value.trim().toLowerCase()
    if (q)
      list = list.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.customerEmail.toLowerCase().includes(q) ||
          r.bookingRef.toLowerCase().includes(q) ||
          r.venueName.toLowerCase().includes(q)
      )
    if (filterStatus.value) list = list.filter((r) => r.status === filterStatus.value)
    return list
  })

  const sortedFilteredRows = computed(() =>
    [...filteredRows.value].sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (byStatus !== 0) return byStatus
      const byDate = (b.raw.date || '').localeCompare(a.raw.date || '')
      if (byDate !== 0) return byDate
      return (b.raw.startTime || '').localeCompare(a.raw.startTime || '')
    })
  )

  const { currentPage, totalPages, paginatedRows, showingFrom, showingTo } = useTablePagination(
    sortedFilteredRows,
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

  function resetFilters() {
    filterStatus.value = ''
    searchQuery.value = ''
    currentPage.value = 1
  }

  function statusClass(status: BookingStatus): string {
    switch (status) {
      case 'Confirmed':
        return 'bg-palette-sage/90 text-palette-white'
      case 'Completed':
        return 'bg-palette-olive/80 text-palette-cream'
      case 'Cancelled':
        return 'bg-palette-grey text-palette-brown'
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  function onStatusChange(bookingId: number, value: string) {
    const status = value as BookingStatus
    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) return
    const row = flatRows.value.find((r) => r.id === bookingId)
    if (status === 'Completed' && row?.paymentStatus === 'Unpaid') {
      successAlert.value = {
        show: true,
        title: 'Cannot complete',
        message: 'Mark as Paid first before completing the booking.',
      }
      return
    }
    updateStatus(bookingId, status)
    successAlert.value = { show: true, title: 'Booking updated', message: `Status has been updated to ${status}.` }
    useActivityLog().log('Booking status updated', `Booking ${bookingId} → ${status}`)
  }

  function onPaymentChange(bookingId: number, value: string) {
    if (value !== 'Paid' && value !== 'Unpaid') return
    const row = flatRows.value.find((r) => r.id === bookingId)
    if (value === 'Paid' && (row?.modeOfPayment === '—' || !row?.modeOfPayment?.trim())) {
      successAlert.value = {
        show: true,
        title: 'Set mode of payment first',
        message: 'Choose how the customer paid (e.g. E-wallet, Cash) before marking as Paid.',
      }
      return
    }
    updatePaymentStatus(bookingId, value)
    successAlert.value = { show: true, title: 'Payment updated', message: `Payment status set to ${value}.` }
    useActivityLog().log('Booking payment updated', `Booking ${bookingId} → ${value}`)
  }

  function onModeOfPaymentChange(bookingId: number, value: string) {
    updateModeOfPayment(bookingId, value)
    successAlert.value = {
      show: true,
      title: 'Mode of payment updated',
      message: `Set to ${value === '—' ? 'Not set' : value}.`,
    }
    useActivityLog().log('Booking mode of payment updated', `Booking ${bookingId} → ${value}`)
  }

  return {
    flatRows,
    filterStatus,
    searchQuery,
    successAlert,
    tableContainerRef,
    viewDetailRow,
    currentDetailRow,
    MODE_OF_PAYMENT_OPTIONS,
    sortedFilteredRows,
    paginatedRows,
    showingFrom,
    showingTo,
    currentPage,
    totalPages,
    resetFilters,
    statusClass,
    onStatusChange,
    onPaymentChange,
    onModeOfPaymentChange,
  }
}
