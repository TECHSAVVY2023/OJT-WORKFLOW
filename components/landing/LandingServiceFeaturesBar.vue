<template>
  <div class="max-w-[800px] mx-auto px-2 lg:px-4 py-2 md:py-3 font-poppins">
    <div class="py-3 md:py-4 px-4 lg:px-6 font-poppins overflow-visible" style="background-color: #7B7557; border-radius: 50px;">
      <div class="flex flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        <button
          v-for="(feature, index) in siteData.serviceFeatures"
          :key="index"
          type="button"
          class="service-feature-btn group relative flex items-center gap-2 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7B7557]"
          :style="{ animationDelay: `${index * 120}ms` }"
        >
          <div class="rounded-full bg-white p-1.5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95">
            <svg v-if="feature.icon === 'chef'" class="w-5 h-5" fill="none" stroke="#4B5563" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m0-16c-2 0-4 1-4 3v1h8V7c0-2-2-3-4-3zm0 0V2m0 2c2 0 4 1 4 3v1h-8V7c0-2 2-3 4-3z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8h8M8 12h8M8 16h8" /></svg>
            <svg v-else-if="feature.icon === 'basket'" class="w-5 h-5" fill="none" stroke="#4B5563" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <svg v-else-if="feature.icon === 'lightbulb'" class="w-5 h-5" fill="none" stroke="#4B5563" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <span
            class="service-feature-label text-white font-poppins font-bold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap overflow-hidden max-w-0 opacity-0 pointer-events-none transition-all duration-300 ease-out group-hover:max-w-[11rem] group-hover:opacity-100 group-focus:max-w-[11rem] group-focus:opacity-100 md:max-w-none md:opacity-100"
          >
            {{ feature.name }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
</script>

<style scoped>
@keyframes service-feature-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.service-feature-btn {
  animation: service-feature-in 0.5s ease-out forwards;
  opacity: 0;
}
</style>
