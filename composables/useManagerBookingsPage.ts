import type { BookingStatus } from '~/composables/useAdminBookings'

const STATUS_ORDER: Record<BookingStatus, number> = { Pending: 0, Confirmed: 1, Completed: 2, Cancelled: 3 }

export function useManagerBookingsPage() {
  const { flatRows } = useAdminBookings()
  const filterStatus = ref('')
  const filterPeriod = ref<'all' | 'daily' | 'weekly' | 'monthly'>('all')

  function parseBookingDate(row: { raw: { date: string } }): Date {
    const s = row.raw.date
    const d = s.includes('T') ? new Date(s) : new Date(s + 'T00:00:00')
    return d
  }

  function isInPeriod(row: { raw: { date: string } }): boolean {
    const d = parseBookingDate(row)
    if (Number.isNaN(d.getTime())) return false
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const recordStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    if (filterPeriod.value === 'all') return true
    if (filterPeriod.value === 'daily') return recordStart.getTime() === todayStart.getTime()
    if (filterPeriod.value === 'weekly') {
      const day = now.getDay()
      const weekStart = new Date(todayStart)
      weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return recordStart >= weekStart && recordStart <= weekEnd
    }
    if (filterPeriod.value === 'monthly') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }
    return true
  }

  const filteredRows = computed(() => {
    let list = flatRows.value
    if (filterPeriod.value !== 'all') {
      list = list.filter((r) => isInPeriod(r))
    }
    if (filterStatus.value) {
      list = list.filter((r) => r.status === filterStatus.value)
    }
    return list
  })

  const sortedRows = computed(() =>
    [...filteredRows.value].sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (byStatus !== 0) return byStatus
      const byDate = (b.raw.date || '').localeCompare(a.raw.date || '')
      if (byDate !== 0) return byDate
      return (b.raw.startTime || '').localeCompare(a.raw.startTime || '')
    })
  )

  const totalBookingEarning = computed(() => sortedRows.value.reduce((sum, r) => sum + r.total, 0))

  const filterPeriodLabel = computed(() => {
    switch (filterPeriod.value) {
      case 'daily':
        return 'Today'
      case 'weekly':
        return 'This week'
      case 'monthly':
        return 'This month'
      default:
        return 'All time'
    }
  })

  function exportBookingsCsv() {
    const headers = ['Booking ID', 'Customer', 'Email', 'Venue', 'Date', 'Time', 'Amount', 'Status']
    const rows = sortedRows.value.map((r) => [r.bookingRef, r.customerName, r.customerEmail, r.venueName, r.date, r.timeRange, r.total, r.status])
    const csv = [headers.join(','), ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
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

  function setFilterPeriod(value: 'all' | 'daily' | 'weekly' | 'monthly') {
    filterPeriod.value = value
  }

  function setFilterStatus(value: string) {
    filterStatus.value = value
  }

  return {
    flatRows,
    filterStatus,
    filterPeriod,
    filteredRows,
    sortedRows,
    totalBookingEarning,
    filterPeriodLabel,
    exportBookingsCsv,
    statusClass,
    setFilterPeriod,
    setFilterStatus,
  }
}
