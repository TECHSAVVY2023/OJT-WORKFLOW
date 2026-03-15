<template>
  <section>
    <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
      Overview
    </h2>
    <div class="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-6">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="group bg-palette-white rounded-lg sm:rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-olive/30 transition-all duration-200 overflow-hidden"
      >
        <div class="p-3 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-1 sm:gap-4 text-center sm:text-left">
          <div class="min-w-0 flex-1 order-2 sm:order-1">
            <p class="text-[10px] sm:text-sm font-medium text-palette-brown/80 truncate">{{ card.title }}</p>
            <p class="mt-0.5 sm:mt-1 font-heading text-base sm:text-3xl font-bold text-palette-dark tabular-nums">
              {{ card.displayValue }}
            </p>
          </div>
          <div
            class="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 order-1 sm:order-2"
            :style="{ backgroundColor: card.iconBgColor }"
          >
            <svg v-if="card.icon === 'items'" class="w-4 h-4 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24" :style="{ color: card.iconColor }" aria-hidden="true">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <svg v-else-if="card.icon === 'venues'" class="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" :style="{ color: card.iconColor }" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <svg v-else-if="card.icon === 'bookings'" class="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" :style="{ color: card.iconColor }" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span v-else class="w-4 h-4 sm:w-6 sm:h-6 rounded" :style="{ backgroundColor: card.iconColor }" />
          </div>
        </div>
        <NuxtLink
          v-if="card.link"
          :to="card.link"
          class="hidden sm:block px-5 sm:px-6 py-3 text-sm font-medium text-palette-sage hover:bg-palette-sage/5 transition-colors border-t border-palette-olive/10"
        >
          View all →
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  cards: Array<{
    title: string
    displayValue: number | string
    link?: string | null
    icon: string
    iconBgColor: string
    iconColor: string
  }>
}>()
</script>
