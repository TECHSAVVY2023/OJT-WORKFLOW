<template>
  <div class="py-2.5 md:py-5 overflow-hidden font-poppins" style="background-color: #69AC7C;">
    <div class="relative">
      <div class="animate-marquee whitespace-nowrap flex items-center">
        <div v-for="n in 2" :key="n" class="inline-flex items-center gap-2 md:gap-6 lg:gap-8 px-3 md:px-6 text-white text-xs md:text-lg font-semibold font-poppins uppercase tracking-wider">
          <div v-for="(feature, index) in siteData.features" :key="index" class="flex items-center gap-2 md:gap-3 min-w-max">
            <div class="rounded-full bg-white/25 p-1.5 md:p-2.5 flex items-center justify-center">
              <svg class="w-4 h-4 md:w-6 md:h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path v-if="feature.icon === 'wifi'" stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                <g v-else-if="feature.icon === 'outlet'">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1z" />
                  <circle cx="9" cy="12.5" r="1.25" stroke="currentColor" fill="none" stroke-width="2" />
                  <circle cx="15" cy="12.5" r="1.25" stroke="currentColor" fill="none" stroke-width="2" />
                </g>
                <path v-else-if="feature.icon === 'ac'" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16v3H4V6zm0 5h16M4 14h16M4 17h16" />
                <path v-else-if="feature.icon === 'chair'" stroke-linecap="round" stroke-linejoin="round" d="M6 18h12v1.5H6V18zm2.5-1.5V9h7v7.5M12 19.5v1.5m-2.5 0h5" />
              </svg>
            </div>
            <span class="drop-shadow-sm">{{ feature.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
</script>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  animation: marquee 10s linear infinite;
  will-change: transform;
}
</style>
