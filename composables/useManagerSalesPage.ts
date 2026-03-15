export function useManagerSalesPage() {
  const { records } = useSales()
  const filterPeriod = ref<'all' | 'daily' | 'weekly' | 'monthly'>('all')
  const filterSource = ref('')

  const proofModalOpen = ref(false)
  const proofDataUrl = ref<string | null>(null)
  const proofMeta = ref<{ saleId: string; orderId: string; payment?: string; transactionId?: string } | null>(null)

  function openProof(r: {
    id: string
    orderId: string
    paymentMethod?: string
    receiptProof?: string
    manualTransactionId?: string
  }) {
    if (!r.receiptProof) return
    proofDataUrl.value = r.receiptProof
    proofMeta.value = { saleId: r.id, orderId: r.orderId, payment: r.paymentMethod, transactionId: r.manualTransactionId }
    proofModalOpen.value = true
  }

  function closeProof() {
    proofModalOpen.value = false
    proofDataUrl.value = null
    proofMeta.value = null
  }

  function downloadProof() {
    if (!proofDataUrl.value || !proofMeta.value) return
    const a = document.createElement('a')
    a.href = proofDataUrl.value
    a.download = `${proofMeta.value.saleId}-proof.jpg`
    a.click()
  }

  function dateTimeFormatted(iso: string): { date: string; time: string } {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return { date: '—', time: '' }
    const date = d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
    const time = d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })
    return { date, time }
  }

  function isInPeriod(iso: string): boolean {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return false
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const recordStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    if (filterPeriod.value === 'all') return true
    if (filterPeriod.value === 'daily') {
      return recordStart.getTime() === todayStart.getTime()
    }
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

  const filteredRecords = computed(() => {
    let list = records.value
    if (filterPeriod.value !== 'all') {
      list = list.filter((r) => isInPeriod(r.createdAt))
    }
    if (filterSource.value) {
      list = list.filter((r) => r.source === filterSource.value)
    }
    return list
  })

  const filteredTotalSales = computed(() => filteredRecords.value.reduce((sum, r) => sum + r.total, 0))

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

  function exportSalesCsv() {
    const headers = ['Sale ID', 'Order ID', 'Staff', 'Source', 'Payment', 'Total', 'Amount paid', 'Change', 'Date', 'Time']
    const rows = filteredRecords.value.map((r) => {
      const dt = dateTimeFormatted(r.createdAt)
      const change = r.amountPaid != null ? r.amountPaid - r.total : ''
      return [r.id, r.orderId, r.staffName, r.source === 'qr' ? 'QR' : 'Manual', r.paymentMethod ?? '', r.total, r.amountPaid ?? '', change, dt.date, dt.time]
    })
    const csv = [headers.join(','), ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function setFilterPeriod(value: 'all' | 'daily' | 'weekly' | 'monthly') {
    filterPeriod.value = value
  }

  function setFilterSource(value: string) {
    filterSource.value = value
  }

  return {
    records,
    filterPeriod,
    filterSource,
    setFilterPeriod,
    setFilterSource,
    proofModalOpen,
    proofDataUrl,
    proofMeta,
    openProof,
    closeProof,
    downloadProof,
    dateTimeFormatted,
    filteredRecords,
    filteredTotalSales,
    filterPeriodLabel,
    exportSalesCsv,
  }
}
