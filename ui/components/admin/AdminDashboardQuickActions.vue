<template>
  <section>
    <h2 class="text-sm font-semibold uppercase tracking-wider text-palette-brown/70 mb-4">
      Quick actions
    </h2>
    <!-- Mobile: horizontal scroll -->
    <div class="flex sm:hidden gap-2 overflow-x-auto pb-1 -mx-1">
      <NuxtLink
        to="/admin/menu-items"
        class="flex flex-col items-center justify-center gap-1 p-2 min-w-[72px] flex-shrink-0 bg-palette-white rounded-lg border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group"
      >
        <span class="w-8 h-8 rounded-lg bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </span>
        <span class="font-medium text-palette-brown group-hover:text-palette-dark text-[10px] leading-tight text-center line-clamp-2">Menu Items</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/venue"
        class="flex flex-col items-center justify-center gap-1 p-2 min-w-[72px] flex-shrink-0 bg-palette-white rounded-lg border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group"
      >
        <span class="w-8 h-8 rounded-lg bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </span>
        <span class="font-medium text-palette-brown group-hover:text-palette-dark text-[10px] leading-tight text-center line-clamp-2">Venue</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/bookings"
        class="flex flex-col items-center justify-center gap-1 p-2 min-w-[72px] flex-shrink-0 bg-palette-white rounded-lg border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group"
      >
        <span class="w-8 h-8 rounded-lg bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </span>
        <span class="font-medium text-palette-brown group-hover:text-palette-dark text-[10px] leading-tight text-center line-clamp-2">Bookings</span>
      </NuxtLink>
    </div>
    <!-- Desktop: grid -->
    <div class="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        to="/admin/menu-items"
        class="flex flex-row items-center gap-4 p-5 bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group text-left"
      >
        <span class="w-11 h-11 rounded-xl bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </span>
        <div class="min-w-0 flex-1">
          <span class="font-medium text-palette-brown group-hover:text-palette-dark text-base block truncate">Menu Items</span>
          <p class="text-xs text-palette-brown/60 mt-0.5">Manage menu & items</p>
        </div>
        <svg class="w-5 h-5 text-palette-olive/40 group-hover:text-palette-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </NuxtLink>
      <NuxtLink
        to="/admin/venue"
        class="flex flex-row items-center gap-4 p-5 bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group text-left"
      >
        <span class="w-11 h-11 rounded-xl bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </span>
        <div class="min-w-0 flex-1">
          <span class="font-medium text-palette-brown group-hover:text-palette-dark text-base block truncate">Venue</span>
          <p class="text-xs text-palette-brown/60 mt-0.5">Spaces & availability</p>
        </div>
        <svg class="w-5 h-5 text-palette-olive/40 group-hover:text-palette-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </NuxtLink>
      <NuxtLink
        to="/admin/bookings"
        class="flex flex-row items-center gap-4 p-5 bg-palette-white rounded-xl border border-palette-olive/20 shadow-sm hover:shadow-md hover:border-palette-sage/40 hover:bg-palette-sage/5 transition-all duration-200 group text-left"
      >
        <span class="w-11 h-11 rounded-xl bg-palette-sage/15 text-palette-sage flex items-center justify-center flex-shrink-0 group-hover:bg-palette-sage/25 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </span>
        <div class="min-w-0 flex-1">
          <span class="font-medium text-palette-brown group-hover:text-palette-dark text-base block truncate">Bookings</span>
          <p class="text-xs text-palette-brown/60 mt-0.5">View & manage bookings</p>
        </div>
        <svg class="w-5 h-5 text-palette-olive/40 group-hover:text-palette-sage flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
