<template>
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
                v-for="seg in salesBySourceSegments"
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
</template>

<script setup lang="ts">
defineProps<{
  salesByDay: Array<{ date: string; label: string; total: number; heightPercent: number }>
  salesBySourceSegments: Array<{ source: string; total: number; color: string; dash: string; offset: number }>
  bookingsByStatusBars: Array<{ status: string; count: number; percent: number; color: string }>
  bookingCount: number
}>()
</script>
