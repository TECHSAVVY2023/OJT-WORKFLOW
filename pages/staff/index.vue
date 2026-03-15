<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader
      :title="staffData.welcome.title"
      subtitle="Record beverage sales by scanning a customer's QR or entering a manual sale (with hot/cold options)."
    />
    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <StaffDashboardOverview
        :total-menu-items="totalMenuItems"
        :pending-orders-count="pendingOrdersCount"
        :total-sales-amount="totalSalesAmount"
      />
      <StaffDashboardCharts
        :payment-method-segments="paymentMethodSegments"
        :sales-by-source-bars="salesBySourceBars"
      />
      <StaffDashboardQuickActions />
    </div>
  </div>
</template>

<script setup lang="ts">
import staffDashboardData from '~/data/staff-dashboard.json'
definePageMeta({ layout: 'staff' })

const staffData = staffDashboardData as { welcome: { title: string } }
const { menuData } = useAdminMenu()
const { pending } = usePendingOrders()
const { records, totalSales } = useSales()

const totalMenuItems = computed(() =>
  menuData.value.reduce((sum, cat) => sum + cat.items.length, 0)
)
const pendingOrdersCount = computed(() => pending.value.length)
const totalSalesAmount = computed(() => totalSales.value)

const paymentMethodSegments = computed(() => {
  const byMethod: Record<string, number> = {}
  records.value.forEach((r) => {
    const method = r.paymentMethod && r.paymentMethod.trim() ? r.paymentMethod : 'Other'
    byMethod[method] = (byMethod[method] || 0) + r.total
  })
  const total = records.value.reduce((s, r) => s + r.total, 0) || 1
  const circumference = 2 * Math.PI * 14
  const colors: Record<string, string> = { Cash: '#22c55e', 'E-wallet': '#6366f1', Other: '#94a3b8' }
  let offset = 0
  return Object.entries(byMethod)
    .filter(([, v]) => v > 0)
    .map(([method, totalAmt]) => {
      const ratio = totalAmt / total
      const dash = `${ratio * circumference} ${circumference}`
      const seg = { method, total: totalAmt, color: colors[method] ?? '#94a3b8', dash, offset: -offset }
      offset += ratio * circumference
      return seg
    })
})

const salesBySourceBars = computed(() => {
  const bySource: Record<string, number> = { QR: 0, Manual: 0 }
  records.value.forEach((r) => {
    const key = r.source === 'qr' ? 'QR' : 'Manual'
    bySource[key] += r.total
  })
  const list = Object.entries(bySource).filter(([, v]) => v > 0).map(([source, total]) => ({ source, total }))
  const max = Math.max(1, ...list.map((b) => b.total))
  return list.map((b) => ({
    ...b,
    percent: Math.round((b.total / max) * 100),
    color: b.source === 'QR' ? '#22c55e' : '#6366f1',
  }))
})
</script>
