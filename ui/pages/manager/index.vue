<template>
  <div class="min-h-full bg-palette-cream/40">
    <!-- Welcome header (same as admin) -->
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 class="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-palette-brown">
          {{ managerData.welcome.title }}
        </h1>
        <p class="mt-1 text-sm text-palette-brown/70">
          View users, bookings, and sales reports.
        </p>
      </div>
    </header>

    <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
      <!-- Overview (same card style as admin) -->
      <section>
        <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
          Overview
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <NuxtLink
            to="/manager/users"
            class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
          >
            <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-palette-brown/80">Users</p>
                <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">{{ userCount }}</p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style="background-color: #e8f5e9;">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#2e7d32" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div class="block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10">
              View all →
            </div>
          </NuxtLink>

          <NuxtLink
            to="/manager/bookings"
            class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
          >
            <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-palette-brown/80">Bookings</p>
                <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">{{ bookingCount }}</p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style="background-color: #fff3e0;">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#e65100" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10">
              View all →
            </div>
          </NuxtLink>

          <NuxtLink
            to="/manager/sales"
            class="group bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
          >
            <div class="p-5 sm:p-6 flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-palette-brown/80">Total Sales</p>
                <p class="mt-1 font-heading text-2xl sm:text-3xl font-bold text-palette-dark tabular-nums">₱{{ totalSales.toLocaleString() }}</p>
              </div>
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style="background-color: #e8f5e9;">
                <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="#2e7d32" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10">
              View all →
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Charts -->
      <section class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
            <h3 class="text-sm font-semibold text-palette-brown mb-4">Sales (last 7 days)</h3>
            <div class="flex items-end gap-1 sm:gap-2 h-40">
              <div
                v-for="day in salesByDay"
                :key="day.date"
                class="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  class="w-full rounded-t bg-palette-sage min-h-[4px] transition-all duration-500"
                  :style="{ height: day.heightPercent + '%' }"
                />
                <span class="text-[10px] sm:text-xs text-palette-brown/70 truncate max-w-full">{{ day.label }}</span>
              </div>
            </div>
            <p v-if="!salesByDay.length" class="text-sm text-palette-brown/60">No sales in the last 7 days.</p>
          </div>
          <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
            <h3 class="text-sm font-semibold text-palette-brown mb-4">Sales by source</h3>
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div class="relative w-36 h-36 flex-shrink-0">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    v-for="(seg, i) in salesBySourceSegments"
                    :key="seg.source"
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
                <li v-for="seg in salesBySourceSegments" :key="seg.source" class="flex items-center gap-2 text-sm">
                  <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: seg.color }" />
                  <span class="text-palette-brown/80">{{ seg.source }}</span>
                  <span class="font-semibold text-palette-dark tabular-nums">₱{{ seg.total.toLocaleString() }}</span>
                </li>
              </ul>
            </div>
            <p v-if="!salesBySourceSegments.length" class="text-sm text-palette-brown/60 mt-2">No sales yet.</p>
          </div>
        </div>
        <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
          <h3 class="text-sm font-semibold text-palette-brown mb-4">Bookings by status</h3>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="bar in bookingsByStatusBars"
              :key="bar.status"
              class="flex items-center gap-3 min-w-[140px]"
            >
              <span class="w-20 text-xs font-medium text-palette-brown">{{ bar.status }}</span>
              <div class="flex-1 h-6 rounded-full bg-palette-olive/10 overflow-hidden max-w-24">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: bar.percent + '%', backgroundColor: bar.color }"
                />
              </div>
              <span class="text-xs font-semibold text-palette-dark tabular-nums">{{ bar.count }}</span>
            </div>
          </div>
          <p v-if="!bookingCount" class="text-sm text-palette-brown/60 mt-2">No bookings yet.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import managerDashboardData from '~/data/manager-dashboard.json'
definePageMeta({ layout: 'manager' })

const managerData = managerDashboardData as { welcome: { title: string } }
const { users } = useManagerUsers()
const { flatRows } = useAdminBookings()
const { records, totalSales } = useSales()

const userCount = computed(() => users.value.length)
const bookingCount = computed(() => flatRows.value.length)

const STATUS_CHART_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Completed: '#22c55e',
  Cancelled: '#94a3b8',
}

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
  days.forEach((d) => { d.heightPercent = max ? Math.round((d.total / max) * 100) : 0 })
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
  ;['Pending', 'Confirmed', 'Completed', 'Cancelled'].forEach((s) => { counts[s] = 0 })
  flatRows.value.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1 })
  const max = Math.max(1, ...Object.values(counts))
  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    percent: Math.round((count / max) * 100),
    color: STATUS_CHART_COLORS[status] ?? '#94a3b8',
  }))
})
</script>
