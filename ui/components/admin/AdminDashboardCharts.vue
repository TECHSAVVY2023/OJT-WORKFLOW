<template>
  <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
      <h3 class="text-sm font-semibold text-palette-brown mb-4">Menu items by category</h3>
      <div class="space-y-3">
        <div
          v-for="bar in menuItemsByCategory"
          :key="bar.category"
          class="flex items-center gap-3"
        >
          <span class="w-28 sm:w-32 text-xs font-medium text-palette-brown truncate">{{ bar.category }}</span>
          <div class="flex-1 h-6 rounded-full bg-palette-olive/10 overflow-hidden">
            <div
              class="h-full rounded-full bg-palette-sage transition-all duration-500"
              :style="{ width: bar.percent + '%' }"
            />
          </div>
          <span class="text-xs font-semibold text-palette-dark tabular-nums w-8">{{ bar.count }}</span>
        </div>
        <p v-if="!menuItemsByCategory.length" class="text-sm text-palette-brown/60">No menu items yet.</p>
      </div>
    </div>
    <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm p-5 sm:p-6">
      <h3 class="text-sm font-semibold text-palette-brown mb-4">Bookings by status</h3>
      <div class="flex flex-col sm:flex-row items-center gap-6">
        <div class="relative w-36 h-36 flex-shrink-0">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              v-for="seg in bookingsDonutSegments"
              :key="seg.status"
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
          <li
            v-for="seg in bookingsDonutSegments"
            :key="seg.status"
            class="flex items-center gap-2 text-sm"
          >
            <span class="w-3 h-3 rounded-full flex-shrink-0" :style="{ backgroundColor: seg.color }" />
            <span class="text-palette-brown/80">{{ seg.status }}</span>
            <span class="font-semibold text-palette-dark tabular-nums">{{ seg.count }}</span>
          </li>
        </ul>
      </div>
      <p v-if="!bookingsByStatusTotal" class="text-sm text-palette-brown/60 mt-2">No bookings yet.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  menuItemsByCategory: Array<{ category: string; count: number; percent: number }>
  bookingsDonutSegments: Array<{ status: string; count: number; color: string; dash: string; offset: number }>
  bookingsByStatusTotal: number
}>()
</script>
