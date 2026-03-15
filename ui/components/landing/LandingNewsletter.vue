<template>
  <section id="newsletter" class="section-block font-poppins py-20 md:py-24 scroll-mt-20 bg-palette-cream/50">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold font-poppins mb-4" style="color: #7B7557;">{{ siteData.newsletter.title }}</h2>
        <p class="text-gray-700 font-poppins text-base md:text-lg leading-relaxed mb-8">{{ siteData.newsletter.description }}</p>
        <form class="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center" @submit.prevent>
          <input
            type="email"
            :placeholder="siteData.newsletter.emailPlaceholder"
            class="flex-1 min-w-0 px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white"
            style="border-color: #7B7557;"
          />
          <button
            type="submit"
            class="font-bold font-poppins text-sm px-6 py-3 rounded-full uppercase tracking-wide text-white transition-opacity hover:opacity-90 shrink-0"
            style="background-color: #7B7557;"
          >
            {{ siteData.newsletter.buttonText }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
</script>
