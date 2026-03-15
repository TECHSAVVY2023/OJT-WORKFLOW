<template>
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
</template>

<script setup lang="ts">
</script>
