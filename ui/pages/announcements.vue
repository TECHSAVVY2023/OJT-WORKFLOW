<template>
  <div class="min-h-[60vh] bg-palette-cream/30 font-poppins py-12 md:py-16">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <h1 class="text-3xl md:text-4xl font-bold font-poppins mb-2 text-center" style="color: #7B7557;">Announcements</h1>
      <p class="text-gray-600 text-center text-sm md:text-base mb-8 max-w-xl mx-auto">Promos, news, and updates from Workflow.</p>

      <!-- Search, date filter, and count -->
      <div class="flex flex-col gap-4 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="relative flex-1 max-w-md">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search announcements..."
              class="w-full pl-11 pr-4 py-3 rounded-xl border-2 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white"
              style="border-color: #e5e7eb;"
            />
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <label class="text-gray-600 text-sm font-poppins whitespace-nowrap">Filter by date:</label>
            <select
              v-model="dateFilter"
              class="rounded-xl border-2 px-4 py-2.5 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white"
              style="border-color: #e5e7eb;"
            >
              <option value="all">All time</option>
              <option value="this-month">This month</option>
              <option value="last-3">Last 3 months</option>
              <option value="this-year">This year</option>
            </select>
            <p class="text-gray-500 text-sm font-poppins">
              {{ filteredAnnouncements.length }} {{ filteredAnnouncements.length === 1 ? 'announcement' : 'announcements' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cards grid: 4 per row on large screens -->
      <div v-if="paginatedAnnouncements.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
        <button
          v-for="item in paginatedAnnouncements"
          :key="item.id"
          type="button"
          class="group bg-white rounded-xl shadow-md overflow-hidden text-left hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green cursor-pointer border border-gray-100 flex flex-col h-full"
          @click="openAnnouncementModal(item)"
        >
          <div class="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img v-if="getCardImage(item)" :src="getCardImage(item)" :alt="getCardTitle(item)" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            <span
              v-if="item.date"
              class="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-xs font-medium font-poppins bg-white/95 text-gray-700 shadow-sm"
            >
              {{ formatDate(item.date) }}
            </span>
          </div>
          <div class="p-3 sm:p-4 flex flex-col flex-1 min-h-[5.5rem]">
            <h2 class="font-bold font-poppins text-palette-brown text-sm sm:text-base md:text-lg leading-snug line-clamp-2">{{ getCardTitle(item) }}</h2>
            <p v-if="item.description" class="mt-2 text-gray-600 text-xs sm:text-sm line-clamp-2 flex-1">{{ item.description }}</p>
          </div>
        </button>
      </div>

      <!-- Pagination (always show when there are results) -->
      <div v-if="filteredAnnouncements.length > 0" class="flex flex-wrap items-center justify-center gap-2 mt-8">
        <button
          type="button"
          :disabled="currentPage <= 1"
          class="px-4 py-2 rounded-lg font-poppins text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green"
          style="background: #e8e0d5; color: #7B7557;"
          aria-label="Previous page"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          ‹
        </button>
        <template v-for="p in pageNumbers" :key="p">
          <button
            v-if="p !== '...'"
            type="button"
            :class="[
              'min-w-[2.5rem] px-3 py-2 rounded-lg font-poppins text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green',
              p === currentPage ? 'text-white' : 'bg-palette-cream/50 text-palette-brown hover:bg-palette-cream'
            ]"
            :style="p === currentPage ? { backgroundColor: '#7B7557' } : {}"
            @click="currentPage = p as number"
          >
            {{ p }}
          </button>
          <span v-else class="px-1 text-gray-400">…</span>
        </template>
        <button
          type="button"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 rounded-lg font-poppins text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green"
          style="background: #e8e0d5; color: #7B7557;"
          aria-label="Next page"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          ›
        </button>
      </div>

      <!-- No results -->
      <div v-else-if="!filteredAnnouncements.length" class="text-center py-16">
        <p class="text-gray-500 font-poppins">No announcements match your search or date filter.</p>
        <button
          type="button"
          class="mt-4 text-workflow-green font-semibold text-sm hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-workflow-green focus-visible:ring-offset-2 rounded"
          @click="searchQuery = ''; dateFilter = 'all'"
        >
          Clear filters
        </button>
      </div>
    </div>
    <AnnouncementDetailModal v-model="showAnnouncementModal" :announcement="selectedAnnouncement" />
  </div>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
const route = useRoute()

const searchQuery = ref('')
const dateFilter = ref<'all' | 'this-month' | 'last-3' | 'this-year'>('all')
const currentPage = ref(1)
const pageSize = 8

type AnnouncementItem = { id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string }

function getCardImage(item: AnnouncementItem): string {
  if (item.images?.length) return item.images[0]
  return item.image || ''
}

function getCardTitle(item: AnnouncementItem): string {
  if (item.title) return item.title
  if (item.description) return item.description.split('\n')[0].slice(0, 60) || 'Announcement'
  return 'Announcement'
}

function parseDate(iso: string): Date {
  try {
    return new Date(iso + 'T00:00:00')
  } catch {
    return new Date(0)
  }
}

const sortedAnnouncements = computed(() => {
  const items = [...(siteData.announcements?.items ?? [])]
  return items.sort((a, b) => {
    const dateA = (a as AnnouncementItem).date || ''
    const dateB = (b as AnnouncementItem).date || ''
    return dateB.localeCompare(dateA) // newest first
  })
})

const filteredAnnouncements = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = sortedAnnouncements.value
  if (q) {
    list = list.filter((item: AnnouncementItem) => {
      const title = (item.title || '').toLowerCase()
      const desc = (item.description || '').toLowerCase()
      return title.includes(q) || desc.includes(q)
    })
  }
  // Filter by date
  const now = new Date()
  if (dateFilter.value === 'this-month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    list = list.filter((item: AnnouncementItem) => {
      const d = parseDate((item.date || '') || '1970-01-01')
      return d >= start && d <= now
    })
  } else if (dateFilter.value === 'last-3') {
    const start = new Date(now)
    start.setMonth(start.getMonth() - 3)
    list = list.filter((item: AnnouncementItem) => {
      const d = parseDate((item.date || '') || '1970-01-01')
      return d >= start && d <= now
    })
  } else if (dateFilter.value === 'this-year') {
    const start = new Date(now.getFullYear(), 0, 1)
    list = list.filter((item: AnnouncementItem) => {
      const d = parseDate((item.date || '') || '1970-01-01')
      return d >= start && d <= now
    })
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredAnnouncements.value.length / pageSize)))

const paginatedAnnouncements = computed(() => {
  const list = filteredAnnouncements.value
  const start = (currentPage.value - 1) * pageSize
  return list.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const page = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (page >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', page - 1, page, page + 1, '...', total]
})

watch([searchQuery, dateFilter], () => { currentPage.value = 1 })

function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

const showAnnouncementModal = ref(false)
const selectedAnnouncement = ref<AnnouncementItem | null>(null)

function openAnnouncementModal(item: AnnouncementItem) {
  selectedAnnouncement.value = item
  showAnnouncementModal.value = true
}

watch(() => route.query.id, (id) => {
  if (!id) return
  const item = siteData.announcements.items.find((a: { id: string }) => a.id === id) as AnnouncementItem | undefined
  if (item) {
    selectedAnnouncement.value = item
    showAnnouncementModal.value = true
  }
}, { immediate: true })
</script>
