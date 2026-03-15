import adminDashboardData from '~/data/admin-dashboard.json'

const adminData = adminDashboardData as {
  welcome: { title: string }
  summaryCards: Array<{
    title: string
    value: number
    icon: string
    iconBgColor: string
    iconColor: string
  }>
}

export function useAdminDashboardPage() {
  const { flatItems } = useAdminMenu()
  const { flatRows: venueRows } = useAdminVenues()
  const { flatRows: bookingRows, totalCount: totalBookings } = useAdminBookings()

  const totalMenuItems = computed(() => flatItems.value.length)
  const totalVenues = computed(() => venueRows.value.length)

  const summaryCards = computed(() =>
    adminData.summaryCards.map((card) => ({
      ...card,
      displayValue:
        card.icon === 'items'
          ? totalMenuItems.value
          : card.icon === 'venues'
            ? totalVenues.value
            : card.icon === 'bookings'
              ? totalBookings.value
              : card.value,
      link:
        card.icon === 'items'
          ? '/admin/menu-items'
          : card.icon === 'venues'
            ? '/admin/venue'
            : card.icon === 'bookings'
              ? '/admin/bookings'
              : null,
    }))
  )

  const menuItemsByCategory = computed(() => {
    const cats = new Map<string, number>()
    flatItems.value.forEach((item) => {
      const c = item.category || 'Other'
      cats.set(c, (cats.get(c) || 0) + 1)
    })
    const list = Array.from(cats.entries()).map(([category, count]) => ({ category, count }))
    const max = Math.max(1, ...list.map((b) => b.count))
    return list.map((b) => ({ ...b, percent: Math.round((b.count / max) * 100) }))
  })

  const STATUS_COLORS: Record<string, string> = {
    Pending: '#f59e0b',
    Confirmed: '#3b82f6',
    Completed: '#22c55e',
    Cancelled: '#94a3b8',
  }
  const bookingsByStatusTotal = computed(() => bookingRows.value.length)
  const bookingsDonutSegments = computed(() => {
    const counts = new Map<string, number>()
    ;['Pending', 'Confirmed', 'Completed', 'Cancelled'].forEach((s) => counts.set(s, 0))
    bookingRows.value.forEach((r) => counts.set(r.status, (counts.get(r.status) ?? 0) + 1))
    const total = bookingRows.value.length || 1
    let offset = 0
    const circumference = 2 * Math.PI * 14
    return Array.from(counts.entries()).map(([status, count]) => {
      const ratio = count / total
      const dash = `${ratio * circumference} ${circumference}`
      const seg = { status, count, color: STATUS_COLORS[status] ?? '#94a3b8', dash, offset: -offset }
      offset += ratio * circumference
      return seg
    })
  })

  return {
    adminData,
    summaryCards,
    menuItemsByCategory,
    bookingsDonutSegments,
    bookingsByStatusTotal,
  }
}
