<template>
  <div class="min-h-full bg-palette-cream/40">
    <!-- Welcome header (same as admin / manager) -->
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 class="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-palette-brown">
          {{ staffData.welcome.title }}
        </h1>
        <p class="mt-1 text-sm text-palette-brown/70">
          Record beverage sales by scanning a customer’s QR or entering a manual sale (with hot/cold options).
        </p>
      </div>
    </header>

    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <!-- Overview -->
      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
          Overview
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden">
            <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-palette-brown/80">Total menu items</p>
                <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">
                  {{ totalMenuItems }}
                </p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#fef9e7]">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#e6b800]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>
          <div class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden">
            <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-palette-brown/80">Pending orders</p>
                <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">
                  {{ pendingOrdersCount }}
                </p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#fff3e0]">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#e65100]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden">
            <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-palette-brown/80">Total sales</p>
                <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">
                  ₱{{ totalSalesAmount.toLocaleString() }}
                </p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#e8f5e9]">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-[#2e7d32]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-palette-brown mb-4">Payment methods</h3>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="relative w-36 h-36 flex-shrink-0">
              <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  v-for="seg in paymentMethodSegments"
                  :key="seg.method"
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="6"
                  :stroke-dasharray="seg.dash"
                  :stroke-dashoffset="seg.offset"
                  class="transition-all duration-500"
                />
              </svg>
            </div>
            <ul class="space-y-2 min-w-0">
              <li v-for="seg in paymentMethodSegments" :key="seg.method" class="flex items-center gap-2 text-sm">
                <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: seg.color }" />
                <span class="text-palette-brown/80">{{ seg.method }}</span>
                <span class="font-semibold text-palette-dark tabular-nums">₱{{ seg.total.toLocaleString() }}</span>
              </li>
            </ul>
          </div>
          <p v-if="!paymentMethodSegments.length" class="text-sm text-palette-brown/60 mt-2">No sales yet.</p>
        </div>
        <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-palette-brown mb-4">Sales by source</h3>
          <div class="space-y-3">
            <div
              v-for="bar in salesBySourceBars"
              :key="bar.source"
              class="flex items-center gap-3"
            >
              <span class="w-20 text-xs font-medium text-palette-brown">{{ bar.source }}</span>
              <div class="flex-1 h-6 rounded-full bg-palette-olive/10 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: bar.percent + '%', backgroundColor: bar.color }"
                />
              </div>
              <span class="text-xs font-semibold text-palette-dark tabular-nums">₱{{ bar.total.toLocaleString() }}</span>
            </div>
          </div>
          <p v-if="!salesBySourceBars.length" class="text-sm text-palette-brown/60">No sales yet.</p>
        </div>
      </section>

      <!-- Quick actions (same card style as admin) -->
      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
          Quick actions
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            to="/staff/scan"
            class="flex items-center gap-4 p-4 sm:p-5 bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group"
          >
            <span class="w-11 h-11 rounded-xl bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </span>
            <div class="min-w-0 flex-1">
              <span class="font-medium text-palette-brown group-hover:text-palette-dark">Incoming orders</span>
              <p class="text-xs text-palette-brown/60 mt-0.5">Scan QR or choose a pending order to complete sale</p>
            </div>
            <svg class="w-5 h-5 text-palette-olive/40 group-hover:text-palette-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </NuxtLink>

          <NuxtLink
            to="/staff/record-sale"
            class="flex items-center gap-4 p-4 sm:p-5 bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group"
          >
            <span class="w-11 h-11 rounded-xl bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
            <div class="min-w-0 flex-1">
              <span class="font-medium text-palette-brown group-hover:text-palette-dark">Manual order</span>
              <p class="text-xs text-palette-brown/60 mt-0.5">Pick items, choose hot or cold, then proceed to checkout</p>
            </div>
            <svg class="w-5 h-5 text-palette-olive/40 group-hover:text-palette-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </NuxtLink>
        </div>
      </section>
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
