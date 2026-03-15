export type AnnouncementItem = {
  id: string
  title?: string
  description?: string
  image?: string
  images?: string[]
  links?: { text: string; url: string }[]
  date?: string
}

const PAGE_SIZE = 8

export function useAnnouncementsPage() {
  const { siteData } = useSiteData()
  const route = useRoute()

  const searchQuery = ref('')
  const dateFilter = ref<'all' | 'this-month' | 'last-3' | 'this-year'>('all')
  const currentPage = ref(1)

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
      return dateB.localeCompare(dateA)
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

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredAnnouncements.value.length / PAGE_SIZE)))

  const paginatedAnnouncements = computed(() => {
    const list = filteredAnnouncements.value
    const start = (currentPage.value - 1) * PAGE_SIZE
    return list.slice(start, start + PAGE_SIZE)
  })

  const pageNumbers = computed(() => {
    const total = totalPages.value
    const page = currentPage.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '...', total]
    if (page >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
    return [1, '...', page - 1, page, page + 1, '...', total]
  })

  watch([searchQuery, dateFilter], () => {
    currentPage.value = 1
  })

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

  function clearFilters() {
    searchQuery.value = ''
    dateFilter.value = 'all'
  }

  watch(
    () => route.query.id,
    (id) => {
      if (!id) return
      const items = siteData.announcements?.items ?? []
      const item = items.find((a: { id: string }) => a.id === id) as AnnouncementItem | undefined
      if (item) {
        selectedAnnouncement.value = item
        showAnnouncementModal.value = true
      }
    },
    { immediate: true }
  )

  return {
    searchQuery,
    dateFilter,
    currentPage,
    filteredAnnouncements,
    paginatedAnnouncements,
    totalPages,
    pageNumbers,
    getCardImage,
    getCardTitle,
    formatDate,
    openAnnouncementModal,
    showAnnouncementModal,
    selectedAnnouncement,
    clearFilters,
  }
}
