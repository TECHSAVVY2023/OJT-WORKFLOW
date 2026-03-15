<template>
  <section id="our-space" class="section-block py-20 md:py-24 bg-palette-cream/50 font-poppins scroll-mt-20">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
      <div class="w-full max-w-5xl mx-auto">
        <h2
          class="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center"
          :style="{ fontFamily: siteData.ourSpace.titleFontFamily || 'Poppins', color: siteData.ourSpace.titleColor || '#69AC7C' }"
        >{{ siteData.ourSpace.title }}</h2>
        <div class="mb-8 md:mb-10">
          <p
            class="text-base leading-relaxed mb-6 md:mb-8 text-justify indent-8"
            :style="{ fontFamily: siteData.ourSpace.textFontFamily || 'Poppins', color: siteData.ourSpace.textColor || '#374151' }"
          >{{ siteData.ourSpace.description }}</p>
          <NuxtLink
            to="/venues/1"
            class="inline-flex items-center justify-center min-w-[160px] font-bold text-sm px-5 py-2.5 rounded-full uppercase tracking-wide border-2 transition-opacity hover:opacity-90 shadow-md"
            :style="ourSpaceButtonStyle"
            @mouseover="ourSpaceButtonMouseOver"
            @mouseleave="ourSpaceButtonMouseLeave"
          >
            {{ siteData.ourSpace.button.text }}
          </NuxtLink>
        </div>
        <div class="relative w-full">
          <div class="overflow-hidden rounded-xl border border-gray-200/80 w-full">
            <div
              class="flex w-full ease-in-out"
              :class="{ 'transition-transform duration-500': !carouselNoTransition }"
              :style="{ transform: `translateX(-${currentGroup * 100}%)` }"
            >
              <div v-for="(group, groupIndex) in groupedSlides" :key="'carousel-' + groupIndex" class="w-full min-w-full flex-shrink-0 grid grid-cols-4 gap-3 md:gap-4 p-0">
                <div v-for="(slide, index) in group" :key="index" class="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    :src="slide"
                    class="w-full h-full object-cover"
                    style="image-rendering: auto; -webkit-backface-visibility: hidden; backface-visibility: hidden;"
                    decoding="async"
                    :fetchpriority="groupIndex === 0 && index < 4 ? 'high' : undefined"
                    :loading="groupIndex === 0 && index < 4 ? 'eager' : 'lazy'"
                    :alt="`Space image ${(groupIndex % (groupedSlides.length || 1)) * siteData.ourSpace.carousel.itemsPerGroup + index + 1}`"
                    @error="($e: Event) => (($e.target as HTMLImageElement).style.display = 'none')"
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="button" @click="prevGroup" class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white border border-gray-200 transition-colors z-10" aria-label="Previous">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" @click="nextGroup" class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white border border-gray-200 transition-colors z-10" aria-label="Next">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div class="mt-6 flex justify-center">
          <NuxtLink
            to="/gallery"
            class="our-space-gallery-link inline-flex items-center justify-center gap-2 min-w-[200px] font-bold text-sm px-6 py-3 rounded-full uppercase tracking-wide shadow-md"
            :style="ourSpaceButtonStyle"
            @mouseover="ourSpaceGalleryLinkMouseOver"
            @mouseleave="ourSpaceGalleryLinkMouseLeave"
          >
            {{ siteData.ourSpace.galleryButton?.text || 'View full gallery' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()

const ourSpaceButtonStyle = computed(() => {
  const o = siteData.ourSpace
  const font = o.buttonFontFamily || 'Poppins'
  const color = o.buttonTextColor || '#ffffff'
  if (o.buttonStyle === 'gradient') {
    const dir = o.buttonGradientDirection || 'to right'
    const c1 = o.buttonGradientColor1 || '#69AC7C'
    const c2 = o.buttonGradientColor2 || '#5a9a6e'
    return { fontFamily: font, color, background: `linear-gradient(${dir}, ${c1}, ${c2})`, backgroundColor: '' }
  }
  const bg = o.buttonColor || '#69AC7C'
  return { fontFamily: font, color, background: '', backgroundColor: bg }
})

function ourSpaceButtonMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.ourSpace.buttonHoverColor || '#5a9a6e'
}
function ourSpaceButtonMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = ourSpaceButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

function ourSpaceGalleryLinkMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.ourSpace.buttonHoverColor || '#5a9a6e'
}
function ourSpaceGalleryLinkMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = ourSpaceButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

const slides = computed(() => siteData.ourSpace.images)
const currentGroup = ref(0)
const carouselNoTransition = ref(false)
const itemsPerGroup = computed(() => siteData.ourSpace.carousel.itemsPerGroup)

const groupedSlides = computed(() => {
  const groups: string[][] = []
  for (let i = 0; i < slides.value.length; i += itemsPerGroup.value) {
    groups.push(slides.value.slice(i, i + itemsPerGroup.value))
  }
  return groups
})

const nextGroup = () => {
  const N = groupedSlides.value.length
  if (N === 0) return
  if (currentGroup.value < N - 1) currentGroup.value = currentGroup.value + 1
}

const prevGroup = () => {
  const N = groupedSlides.value.length
  if (N === 0) return
  if (currentGroup.value > 0) currentGroup.value = currentGroup.value - 1
}
</script>
