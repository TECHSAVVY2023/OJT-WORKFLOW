<template>
  <div class="min-h-screen bg-white font-poppins py-16 md:py-20">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <ContactForm :contact="siteData.contact" />
        <ContactMapSection :contact="siteData.contact" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { siteData } = useContactPage()
</script>
