<template>
  <div class="min-h-screen bg-white font-poppins py-16 md:py-20">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-8" style="color: #7B7557;">
            {{ siteData.contact.title }}
          </h2>
          <form class="space-y-4" @submit.prevent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ siteData.contact.form.firstName.label }}</label>
                <input type="text" :placeholder="siteData.contact.form.firstName.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ siteData.contact.form.lastName.label }}</label>
                <input type="text" :placeholder="siteData.contact.form.lastName.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ siteData.contact.form.email.label }}</label>
              <input type="email" :placeholder="siteData.contact.form.email.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ siteData.contact.form.phone.label }}</label>
              <input type="tel" :placeholder="siteData.contact.form.phone.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ siteData.contact.form.subject.label }}</label>
              <input type="text" :placeholder="siteData.contact.form.subject.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ siteData.contact.form.message.label }}</label>
              <textarea :placeholder="siteData.contact.form.message.placeholder" rows="6" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green resize-none bg-white" style="border-color: #7B7557;"></textarea>
            </div>
            <button type="submit" class="w-full bg-workflow-green text-white font-semibold font-poppins py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 uppercase tracking-wide" style="background-color: #7B7557;">
              Send Message
            </button>
          </form>
        </div>
        <div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-8" style="color: #7B7557;">
            {{ siteData.contact.map.title }}
          </h2>
          <div class="w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <iframe :src="siteData.contact.map.embedUrl" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map" />
          </div>
          <div class="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg mt-4">
            <img :src="siteData.contact.buildingImage" alt="Workflow Coworking Space Building" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
</script>
