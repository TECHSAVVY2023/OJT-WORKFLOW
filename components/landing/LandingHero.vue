<template>
  <section id="hero" class="relative h-[90vh] min-h-[680px] flex flex-col justify-start pt-6 sm:pt-8 md:pt-10 overflow-hidden scroll-mt-0">
    <div class="absolute inset-0">
      <img :src="siteData.hero.backgroundImage" :alt="siteData.hero.backgroundImageAlt" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-white/65" aria-hidden="true" />
    </div>
    <div class="relative z-10 text-center px-6 lg:px-12 max-w-5xl mx-auto mt-2 sm:mt-4 font-poppins">
      <h5 class="text-sm sm:text-base md:text-lg font-bold font-poppins uppercase tracking-widest mb-2 md:mb-3" :style="{ color: siteData.hero.textColor || '#1a1a1a' }">{{ siteData.hero.subtitle }}</h5>
      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-poppins leading-tight mb-3 md:mb-4" :style="{ color: siteData.hero.textColor || '#1a1a1a' }">
        {{ siteData.hero.title }} <span :style="{ color: siteData.hero.titleHighlightColor || '#3AFF86' }">{{ siteData.hero.titleHighlight }}</span>.
      </h1>
      <p class="text-base font-medium font-poppins max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed" :style="{ color: siteData.hero.textColor || '#1a1a1a' }">{{ siteData.hero.description }}</p>
      <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
        <NuxtLink
          v-for="(button, index) in siteData.hero.buttons"
          :key="index"
          :to="button.action === 'order' ? '/menu' : '/venues/1'"
          :class="[
            'font-bold font-poppins text-sm px-5 py-2.5 rounded-full uppercase tracking-wide transition-opacity hover:opacity-90 border-2',
            button.type === 'primary' ? 'hover:opacity-90' : 'bg-transparent hover:opacity-90'
          ]"
          :style="button.type === 'primary' ? heroPrimaryButtonStyle : heroSecondaryButtonStyle"
        >
          {{ button.text }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()

const heroPrimaryButtonStyle = computed(() => {
  const h = siteData.hero
  const color = h.primaryButtonTextColor || '#ffffff'
  if (h.primaryButtonStyle === 'gradient') {
    const dir = h.primaryGradientDirection || 'to right'
    const c1 = h.primaryGradientColor1 || '#69AC7C'
    const c2 = h.primaryGradientColor2 || '#5a9a6e'
    return { background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color }
  }
  const bg = h.primaryButtonColor || '#69AC7C'
  return { backgroundColor: bg, borderColor: bg, color }
})

const heroSecondaryButtonStyle = computed(() => {
  const h = siteData.hero
  const textColor = h.secondaryButtonTextColor || h.secondaryButtonColor || '#7B7557'
  if (h.secondaryButtonStyle === 'gradient') {
    const dir = h.secondaryGradientDirection || 'to right'
    const c1 = h.secondaryGradientColor1 || '#7B7557'
    const c2 = h.secondaryGradientColor2 || '#605B45'
    return { background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color: textColor }
  }
  const border = h.secondaryButtonColor || '#7B7557'
  return { borderColor: border, color: textColor }
})
</script>
