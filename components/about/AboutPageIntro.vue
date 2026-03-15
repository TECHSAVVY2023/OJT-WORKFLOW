<template>
  <section class="section-block py-20 md:py-24 bg-white font-poppins">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="text-center lg:text-left font-poppins">
          <h1
            class="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
            :style="{ fontFamily: siteData.about.titleFontFamily || 'Poppins', color: siteData.about.titleColor }"
          >
            {{ siteData.about.title }}
          </h1>
          <p
            v-for="(paragraph, index) in siteData.about.paragraphs"
            :key="index"
            class="text-base leading-relaxed mb-4 md:mb-6"
            :style="{ fontFamily: siteData.about.textFontFamily || 'Poppins', color: siteData.about.textColor }"
          >
            <span v-html="paragraph.replace(/\n/g, '<br />')" />
          </p>
        </div>
        <div class="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl max-w-sm mx-auto md:max-w-none md:mx-0">
          <img
            :src="siteData.about.image"
            :alt="siteData.about.imageAlt"
            class="w-full h-auto object-cover aspect-[4/3] md:aspect-auto"
          />
          <div class="absolute bottom-3 left-3 md:bottom-6 md:left-6 bg-white/80 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full font-bold font-poppins text-workflow-green text-sm md:text-lg shadow-md">
            {{ siteData.about.overlayText }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  siteData: { about: Record<string, unknown> }
}>()
</script>
