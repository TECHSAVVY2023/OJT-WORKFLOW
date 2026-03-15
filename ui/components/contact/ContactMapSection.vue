<template>
  <div>
    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-8" style="color: #7B7557;">
      {{ contact.map.title }}
    </h2>
    <div class="w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
      <iframe :src="contact.map.embedUrl" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map" />
    </div>
    <div class="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg mt-4">
      <img :src="contact.buildingImage" alt="Workflow Coworking Space Building" class="w-full h-full object-cover" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contact: {
    map: { title: string; embedUrl: string }
    buildingImage: string
  }
}>()
</script>
