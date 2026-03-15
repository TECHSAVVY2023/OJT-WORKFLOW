export type CommunityReview = {
  id: string
  name: string
  quote: string
  rating?: number
  date?: string
  createdAt?: string
  avatar?: string
  images?: string[]
}

const MAX_REVIEW_IMAGES = 5
const SWIPE_THRESHOLD = 50

export function useAboutCommunitySays() {
  const { siteData } = useSiteData()

  const allReviews = computed(
    () => (siteData.communitySays.reviews ?? []) as CommunityReview[]
  )

  const writeReviewModalOpen = ref(false)
  const showPublishConfirm = ref(false)
  const newReview = ref({
    name: '',
    quote: '',
    avatar: '' as string,
    images: [] as string[],
    rating: 5,
  })
  const uploadInputRef = ref<HTMLInputElement | null>(null)
  const submitSuccess = ref(false)
  const currentReviewIndex = ref(0)
  const currentReview = computed(
    () => allReviews.value[currentReviewIndex.value] ?? allReviews.value[0]
  )
  const imageModalSrc = ref<string | null>(null)
  const reviewCarouselRef = ref<HTMLElement | null>(null)
  const touchStartX = ref(0)
  const touchStartY = ref(0)

  function reviewInitials(name: string) {
    return name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  function formatRating(r?: number) {
    if (r == null) return '5'
    return Number.isInteger(r) ? String(r) : r.toFixed(1)
  }

  function formatReviewDate(date?: string, createdAt?: string): string {
    if (createdAt) {
      const d = new Date(createdAt)
      if (!Number.isNaN(d.getTime()))
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
    }
    if (date) {
      const d = new Date(date)
      if (!Number.isNaN(d.getTime()))
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      const short = date.trim().match(/^(\d{1,2})\s+(\w{3})$/i)
      if (short) {
        const [, day, mon] = short
        const parsed = new Date(
          `${mon} ${day}, ${new Date().getFullYear()}`
        )
        if (!Number.isNaN(parsed.getTime()))
          return parsed.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
      }
      return date
    }
    return 'Recently'
  }

  function prevReview() {
    if (allReviews.value.length === 0) return
    currentReviewIndex.value =
      (currentReviewIndex.value - 1 + allReviews.value.length) %
      allReviews.value.length
  }

  function nextReview() {
    if (allReviews.value.length === 0) return
    currentReviewIndex.value =
      (currentReviewIndex.value + 1) % allReviews.value.length
  }

  function onReviewTouchStart(e: TouchEvent) {
    if (!e.touches[0]) return
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
  }

  function onReviewTouchEnd(e: TouchEvent) {
    if (!e.changedTouches[0] || allReviews.value.length === 0) return
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = endX - touchStartX.value
    const deltaY = endY - touchStartY.value
    if (
      Math.abs(deltaX) <= Math.abs(deltaY) ||
      Math.abs(deltaX) < SWIPE_THRESHOLD
    )
      return
    if (deltaX < 0) nextReview()
    else prevReview()
  }

  function onImageSelect(e: Event) {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (!files?.length) return
    const current = newReview.value.images
    const remaining = Math.max(0, MAX_REVIEW_IMAGES - current.length)
    if (remaining === 0) return
    const toAdd = Array.from(files)
      .slice(0, remaining)
      .filter((f) => f.type.startsWith('image/'))
    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (newReview.value.images.length < MAX_REVIEW_IMAGES)
          newReview.value.images = [
            ...newReview.value.images,
            reader.result as string,
          ]
      }
      reader.readAsDataURL(file)
    })
    input.value = ''
  }

  function onProfileImageSelect(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      newReview.value.avatar = (reader.result as string) ?? ''
    }
    reader.readAsDataURL(file)
    input.value = ''
  }

  function removeReviewImage(index: number) {
    newReview.value.images = newReview.value.images.filter((_, i) => i !== index)
  }

  function closeWriteReviewModal() {
    writeReviewModalOpen.value = false
    showPublishConfirm.value = false
    newReview.value = { name: '', quote: '', avatar: '', images: [], rating: 5 }
    submitSuccess.value = false
  }

  async function confirmPublishReview() {
    showPublishConfirm.value = false
    const name = newReview.value.name.trim()
    const quote = newReview.value.quote.trim()
    if (!name || !quote) return
    try {
      await $fetch('/api/community-reviews/submit', {
        method: 'POST',
        body: {
          name,
          quote,
          rating: newReview.value.rating ?? 5,
          avatar: newReview.value.avatar || undefined,
          images:
            newReview.value.images.length
              ? newReview.value.images.slice(0, MAX_REVIEW_IMAGES)
              : undefined,
        },
      })
      await refreshNuxtData('community-reviews')
      newReview.value = { name: '', quote: '', avatar: '', images: [], rating: 5 }
      submitSuccess.value = true
      writeReviewModalOpen.value = false
      setTimeout(() => {
        submitSuccess.value = false
      }, 3000)
    } catch {
      submitSuccess.value = false
    }
  }

  return {
    siteData,
    allReviews,
    MAX_REVIEW_IMAGES,
    writeReviewModalOpen,
    showPublishConfirm,
    newReview,
    uploadInputRef,
    submitSuccess,
    currentReviewIndex,
    currentReview,
    imageModalSrc,
    reviewCarouselRef,
    reviewInitials,
    formatRating,
    formatReviewDate,
    prevReview,
    nextReview,
    onReviewTouchStart,
    onReviewTouchEnd,
    onImageSelect,
    onProfileImageSelect,
    removeReviewImage,
    closeWriteReviewModal,
    confirmPublishReview,
  }
}
