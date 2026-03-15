<template>
  <div>
    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins mb-8" style="color: #7B7557;">
      {{ contact.title }}
    </h2>
    <form class="space-y-4" @submit.prevent>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ contact.form.firstName.label }}</label>
          <input type="text" :placeholder="contact.form.firstName.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ contact.form.lastName.label }}</label>
          <input type="text" :placeholder="contact.form.lastName.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ contact.form.email.label }}</label>
        <input type="email" :placeholder="contact.form.email.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ contact.form.phone.label }}</label>
        <input type="tel" :placeholder="contact.form.phone.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ contact.form.subject.label }}</label>
        <input type="text" :placeholder="contact.form.subject.placeholder" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white" style="border-color: #7B7557;" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 font-poppins mb-2">{{ contact.form.message.label }}</label>
        <textarea :placeholder="contact.form.message.placeholder" rows="6" class="w-full px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green resize-none bg-white" style="border-color: #7B7557;" />
      </div>
      <button type="submit" class="w-full bg-workflow-green text-white font-semibold font-poppins py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 uppercase tracking-wide" style="background-color: #7B7557;">
        Send Message
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  contact: {
    title: string
    form: {
      firstName: { label: string; placeholder: string }
      lastName: { label: string; placeholder: string }
      email: { label: string; placeholder: string }
      phone: { label: string; placeholder: string }
      subject: { label: string; placeholder: string }
      message: { label: string; placeholder: string }
    }
  }
}>()
</script>
