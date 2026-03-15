<template>
  <section id="announcements" class="section-block py-20 md:py-24 bg-palette-cream/50 font-poppins scroll-mt-20">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="text-center mb-10 md:mb-12">
        <h2 class="text-3xl md:text-4xl font-bold font-poppins mb-6 md:mb-8 text-workflow-green">{{ siteData.announcements.title }}</h2>
      </div>
      <div class="flex justify-center items-center overflow-x-hidden overflow-y-visible pb-12 px-2 md:px-4">
        <div class="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-full">
          <button
            @click="prevAnnouncement"
            type="button"
            class="hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green"
            style="background-color: #7B7557;"
            aria-label="Previous announcement"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div class="flex items-end justify-center min-w-0 flex-1 overflow-visible">
            <button
              v-for="(announcement, displayIndex) in displayedAnnouncements"
              :key="`${announcement.id}-${currentAnnouncementIndex}`"
              type="button"
              class="relative transition-all duration-500 ease-out hover:scale-105 hover:z-50 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green flex-shrink-0 w-[100px] h-[150px] sm:w-[128px] sm:h-[192px] md:w-[170px] md:h-[255px] lg:w-[200px] lg:h-[300px]"
              :class="[
                displayIndex === 0 || displayIndex === 3 ? '-mr-[38px] sm:-mr-[42px] md:-mr-[45px]' : displayIndex < displayedAnnouncements.length - 1 ? '-mr-[6px] sm:-mr-[6px] md:-mr-[5px]' : 'mr-0'
              ]"
              :style="{
                transform: displayIndex === 0 || displayIndex === 4 ? 'scale(0.65)' : displayIndex === 1 || displayIndex === 3 ? 'scale(0.80)' : 'scale(1)',
                zIndex: displayIndex === 2 ? 30 : displayIndex === 1 || displayIndex === 3 ? 20 : 10,
                opacity: displayIndex === 2 ? 1 : displayIndex === 1 || displayIndex === 3 ? 0.88 : 0.75
              }"
              @click="onAnnouncementCardClick(announcement, displayIndex)"
            >
              <div class="bg-white rounded-xl shadow-2xl overflow-hidden h-full w-full border-2 border-white/50">
                <img v-if="getAnnouncementImage(announcement)" :src="getAnnouncementImage(announcement)" :alt="getAnnouncementTitle(announcement)" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
              </div>
            </button>
          </div>
          <button
            @click="nextAnnouncement"
            type="button"
            class="hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green"
            style="background-color: #7B7557;"
            aria-label="Next announcement"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
    <AnnouncementDetailModal v-model="showAnnouncementModal" :announcement="selectedAnnouncement" />
  </section>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()

const currentAnnouncementIndex = ref(0)
const announcements = computed(() => siteData.announcements.items)
const displayedAnnouncements = computed(() => {
  const items = announcements.value
  const current = currentAnnouncementIndex.value
  const result: typeof items = []
  for (let i = -2; i <= 2; i++) {
    const index = (current + i + items.length) % items.length
    result.push(items[index])
  }
  return result
})

const nextAnnouncement = () => {
  currentAnnouncementIndex.value = (currentAnnouncementIndex.value + 1) % announcements.value.length
}
const prevAnnouncement = () => {
  currentAnnouncementIndex.value = (currentAnnouncementIndex.value - 1 + announcements.value.length) % announcements.value.length
}

function getAnnouncementImage(item: { image?: string; images?: string[] }): string {
  if (item.images?.length) return item.images[0]
  return item.image || ''
}
function getAnnouncementTitle(item: { title?: string; description?: string }): string {
  if (item.title) return item.title
  if (item.description) return item.description.split('\n')[0].slice(0, 60) || 'Announcement'
  return 'Announcement'
}

const showAnnouncementModal = ref(false)
const selectedAnnouncement = ref<{ id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string } | null>(null)
function openAnnouncementModal(announcement: { id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string }) {
  selectedAnnouncement.value = announcement
  showAnnouncementModal.value = true
}

function onAnnouncementCardClick(
  announcement: { id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string },
  displayIndex: number
) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  if (isMobile) {
    if (displayIndex === 2) {
      openAnnouncementModal(announcement)
    } else if (displayIndex < 2) {
      prevAnnouncement()
    } else {
      nextAnnouncement()
    }
  } else {
    openAnnouncementModal(announcement)
  }
}
</script>
