<template>
  <section id="about" class="section-block py-20 md:py-24 bg-white scroll-mt-20 font-poppins">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="text-center lg:text-left font-poppins">
          <h2
            class="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
            :style="{ fontFamily: siteData.about.titleFontFamily || 'Poppins', color: siteData.about.titleColor }"
          >{{ siteData.about.title }}</h2>
          <p
            v-for="(paragraph, index) in siteData.about.paragraphs"
            :key="index"
            class="text-base leading-relaxed mb-4 md:mb-6"
            :style="{ fontFamily: siteData.about.textFontFamily || 'Poppins', color: siteData.about.textColor }"
          >
            <span v-html="paragraph.replace(/\n/g, '<br />')"></span>
          </p>
          <div class="mt-8 md:mt-10 flex justify-center lg:justify-start">
            <NuxtLink
              to="/about"
              class="inline-flex items-center justify-center min-w-[160px] font-bold text-sm px-5 py-2.5 rounded-full uppercase tracking-wide transition-opacity hover:opacity-90"
              :style="aboutButtonStyle"
              @mouseover="aboutButtonMouseOver"
              @mouseleave="aboutButtonMouseLeave"
            >
              {{ siteData.about.button.text }}
            </NuxtLink>
          </div>
        </div>
        <div class="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl max-w-sm mx-auto md:max-w-none md:mx-0">
          <img :src="siteData.about.image" :alt="siteData.about.imageAlt" class="w-full h-auto object-cover aspect-[4/3] md:aspect-auto" />
          <div class="absolute bottom-3 left-3 md:bottom-6 md:left-6 bg-white/80 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full font-bold font-poppins text-workflow-green text-sm md:text-lg shadow-md">{{ siteData.about.overlayText }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()

const aboutButtonStyle = computed(() => {
  const a = siteData.about
  const font = a.buttonFontFamily || 'Poppins'
  const color = a.buttonTextColor || '#ffffff'
  if (a.buttonStyle === 'gradient') {
    const dir = a.buttonGradientDirection || 'to right'
    const c1 = a.buttonGradientColor1 || '#7B7557'
    const c2 = a.buttonGradientColor2 || '#605B45'
    return { fontFamily: font, color, background: `linear-gradient(${dir}, ${c1}, ${c2})`, backgroundColor: '' }
  }
  const bg = a.buttonColor || '#7B7557'
  return { fontFamily: font, color, background: '', backgroundColor: bg }
})

function aboutButtonMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.about.buttonHoverColor || '#605B45'
}
function aboutButtonMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = aboutButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}
</script>
