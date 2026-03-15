import managerDashboardData from '~/data/manager-dashboard.json'

const STATUS_CHART_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Completed: '#22c55e',
  Cancelled: '#94a3b8',
}

export function useManagerDashboardPage() {
  const managerData = managerDashboardData as { welcome: { title: string } }
  const { users } = useManagerUsers()
  const { flatRows } = useAdminBookings()
  const { records, totalSales } = useSales()

  const userCount = computed(() => users.value.length)
  const bookingCount = computed(() => flatRows.value.length)

  const salesByDay = computed(() => {
    const days: { date: string; label: string; total: number; heightPercent: number }[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const total = records.value
        .filter((r) => r.createdAt.startsWith(dateStr))
        .reduce((sum, r) => sum + r.total, 0)
      days.push({
        date: dateStr,
        label: d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }),
        total,
        heightPercent: 0,
      })
    }
    const max = Math.max(1, ...days.map((x) => x.total))
    days.forEach((d) => {
      d.heightPercent = max ? Math.round((d.total / max) * 100) : 0
    })
    return days
  })

  const salesBySourceSegments = computed(() => {
    const bySource: Record<string, number> = { QR: 0, Manual: 0 }
    records.value.forEach((r) => {
      const key = r.source === 'qr' ? 'QR' : 'Manual'
      bySource[key] = (bySource[key] || 0) + r.total
    })
    const total = records.value.reduce((s, r) => s + r.total, 0) || 1
    const circumference = 2 * Math.PI * 14
    const colors = { QR: '#22c55e', Manual: '#6366f1' }
    let offset = 0
    return Object.entries(bySource)
      .filter(([, v]) => v > 0)
      .map(([source, totalAmt]) => {
        const ratio = totalAmt / total
        const dash = `${ratio * circumference} ${circumference}`
        const seg = { source, total: totalAmt, color: colors[source as keyof typeof colors] ?? '#94a3b8', dash, offset: -offset }
        offset += ratio * circumference
        return seg
      })
  })

  const bookingsByStatusBars = computed(() => {
    const counts: Record<string, number> = {}
    ;['Pending', 'Confirmed', 'Completed', 'Cancelled'].forEach((s) => {
      counts[s] = 0
    })
    flatRows.value.forEach((r) => {
      counts[r.status] = (counts[r.status] ?? 0) + 1
    })
    const max = Math.max(1, ...Object.values(counts))
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percent: Math.round((count / max) * 100),
      color: STATUS_CHART_COLORS[status] ?? '#94a3b8',
    }))
  })

  return {
    managerData,
    userCount,
    bookingCount,
    totalSales,
    salesByDay,
    salesBySourceSegments,
    bookingsByStatusBars,
  }
}
