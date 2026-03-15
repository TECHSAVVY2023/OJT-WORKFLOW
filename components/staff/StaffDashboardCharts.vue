<template>
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
</template>

<script setup lang="ts">
defineProps<{
  paymentMethodSegments: Array<{ method: string; total: number; color: string; dash: string; offset: number }>
  salesBySourceBars: Array<{ source: string; total: number; percent: number; color: string }>
}>()
</script>
