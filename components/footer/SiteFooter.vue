<template>
  <footer class="mt-auto font-poppins text-palette-white bg-[#7B7557] text-sm">
    <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-14">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        <!-- Brand + logo -->
        <div class="flex flex-col gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
          <NuxtLink to="/" class="inline-flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
            <img
              :src="siteData.footer.logo.image"
              alt="Workflow Coworking Space"
              class="h-7 sm:h-8 w-auto object-contain shrink-0"
            />
            <span class="font-semibold uppercase tracking-wide text-palette-white leading-tight max-w-[200px] sm:max-w-[140px]">
              {{ siteData.footer.logo.text }}
            </span>
          </NuxtLink>
          <p class="text-palette-white/85 leading-relaxed max-w-sm">
            {{ siteData.footer.logo.tagline }}
          </p>
        </div>

        <!-- Sitemap -->
        <div class="flex flex-col">
          <h3 class="footer-heading">
            {{ siteData.footer.sitemap.title }}
          </h3>
          <ul class="space-y-1.5 sm:space-y-2 text-palette-white/85">
            <li v-for="link in siteData.footer.sitemap.links" :key="link.text">
              <NuxtLink
                :to="link.to"
                class="hover:text-palette-white hover:underline transition-colors inline-block"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Location -->
        <div class="flex flex-col min-w-0">
          <h3 class="footer-heading">
            {{ siteData.footer.location.title }}
          </h3>
          <div class="text-palette-white/85 leading-relaxed space-y-0.5 overflow-x-auto">
            <span v-for="(line, i) in addressLines" :key="i" class="block whitespace-nowrap">{{ line }}</span>
          </div>
        </div>

        <!-- Business hours -->
        <div class="flex flex-col min-w-0">
          <h3 class="footer-heading">
            {{ siteData.footer.businessHours.title }}
          </h3>
          <ul class="space-y-1.5 sm:space-y-2 text-palette-white/85">
            <li v-for="(line, i) in siteData.footer.businessHours.hours" :key="i">
              {{ line }}
            </li>
          </ul>
          <div v-if="socialLinks" class="flex items-center gap-3 mt-4">
            <a
              v-if="socialLinks.facebook"
              :href="socialLinks.facebook"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1.5 text-palette-white/85 hover:text-palette-white transition-colors rounded"
              aria-label="Facebook"
            >
              <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a
              v-if="socialLinks.instagram"
              :href="socialLinks.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1.5 text-palette-white/85 hover:text-palette-white transition-colors rounded"
              aria-label="Instagram"
            >
              <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-3.205a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" clip-rule="evenodd" />
              </svg>
            </a>
            <a
              v-if="socialLinks.email"
              :href="emailHref"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1.5 text-palette-white/85 hover:text-palette-white transition-colors rounded"
              aria-label="Email"
              @click.prevent="openEmail"
            >
              <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.36 5.76a1.5 1.5 0 001.68 0l9.36-5.76z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-palette-white/15 py-3 sm:py-4 bg-[#59543E]">
      <div class="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <p class="text-palette-white/80">
          {{ siteData.footer.poweredBy }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-heading {
  @apply font-semibold text-palette-white uppercase tracking-wide mb-2 sm:mb-3;
}
</style>

<script setup lang="ts">
const { siteData } = useSiteData()
const socialLinks = computed(() => siteData.footer?.socialLinks ?? null)
const addressLines = computed(() => {
  const addr = siteData.footer?.location?.address
  return (typeof addr === 'string' ? addr.split(/\r?\n/) : []).filter(Boolean)
})
const emailHref = computed(() => {
  const email = socialLinks.value?.email?.trim()
  if (!email) return '#'
  const to = encodeURIComponent(email)
  return `https://mail.google.com/mail/?view=cm&to=${to}`
})
function openEmail() {
  const email = socialLinks.value?.email?.trim()
  if (email) {
    const to = encodeURIComponent(email)
    window.open(`https://mail.google.com/mail/?view=cm&to=${to}`, '_blank', 'noopener,noreferrer')
  }
}
</script>
