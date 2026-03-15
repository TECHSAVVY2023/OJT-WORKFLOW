export type ReviewStatus = 'pending' | 'approved' | 'declined'

export type CommunityReview = {
  id: string
  name: string
  quote: string
  rating?: number
  date?: string
  avatar?: string
  images?: string[]
  status?: ReviewStatus
}

type CommunityReviewsData = { title: string; subtitle: string; reviews: CommunityReview[] }

type ConfirmAction = 'approve' | 'decline' | 'remove' | 'save'

const MAX_REVIEW_PHOTOS = 5

export function useAdminCommunitySaysPage() {
  const form = ref<CommunityReviewsData>({
    title: 'What our community says',
    subtitle: 'Real experiences from freelancers, students, and visitors',
    reviews: [],
  })
  const saveMessage = ref('')
  const saveSuccess = ref(false)
  const editingId = ref<string | null>(null)
  const viewImageSrc = ref<string | null>(null)
  const editDraft = ref<{
    name: string
    quote: string
    rating: number
    avatar: string
    images: string[]
  }>({
    name: '',
    quote: '',
    rating: 5,
    avatar: '',
    images: [],
  })
  const filterStatus = ref<'all' | 'pending' | 'approved'>('all')

  const showConfirm = ref(false)
  const confirmType = ref<ConfirmAction | null>(null)
  const confirmReview = ref<CommunityReview | null>(null)
  const confirmRemoveIndex = ref(-1)

  const confirmConfig = computed(() => {
    const review = confirmReview.value
    const name = review?.name ? `"${review.name}"` : 'this review'
    switch (confirmType.value) {
      case 'approve':
        return {
          title: 'Approve review?',
          message: `Are you sure you want to approve ${name}? It will be visible on the website.`,
          confirmLabel: 'Yes, approve',
          danger: false,
        }
      case 'decline':
        return {
          title: 'Decline review?',
          message: `Are you sure you want to decline ${name}? It will stay hidden from the website.`,
          confirmLabel: 'Yes, decline',
          danger: false,
        }
      case 'remove':
        return {
          title: 'Remove review?',
          message: `Are you sure you want to remove ${name}? This cannot be undone.`,
          confirmLabel: 'Yes, remove',
          danger: true,
        }
      case 'save':
        return {
          title: 'Save changes?',
          message: `Are you sure you want to save changes to ${name}?`,
          confirmLabel: 'Yes, save',
          danger: false,
        }
      default:
        return { title: '', message: '', confirmLabel: 'Yes', danger: false }
    }
  })

  function openConfirm(action: ConfirmAction, review: CommunityReview) {
    confirmType.value = action
    confirmReview.value = review
    confirmRemoveIndex.value = form.value.reviews.findIndex((r) => r.id === review.id)
    showConfirm.value = true
  }

  function onConfirmAction() {
    const review = confirmReview.value
    const type = confirmType.value
    if (!review) return
    if (type === 'approve') {
      setStatus(review, 'approved')
    } else if (type === 'decline') {
      setStatus(review, 'declined')
    } else if (type === 'remove' && confirmRemoveIndex.value >= 0) {
      removeReview(confirmRemoveIndex.value)
    } else if (type === 'save') {
      saveEdit(review)
    }
    confirmType.value = null
    confirmReview.value = null
    confirmRemoveIndex.value = -1
  }

  const statusTabs = computed(() => {
    const list = form.value.reviews
    return [
      { value: 'all' as const, label: 'All', count: list.length },
      { value: 'pending' as const, label: 'Pending', count: list.filter((r) => (r.status ?? 'approved') === 'pending').length },
      { value: 'approved' as const, label: 'Approved', count: list.filter((r) => (r.status ?? 'approved') === 'approved').length },
    ]
  })

  const filteredReviews = computed(() => {
    const list = form.value.reviews
    if (filterStatus.value === 'all') return list
    return list.filter((r) => (r.status ?? 'approved') === filterStatus.value)
  })

  function reviewStatusClass(status?: ReviewStatus) {
    const s = status ?? 'approved'
    if (s === 'pending') return 'border-amber-200 bg-amber-50/50'
    if (s === 'declined') return 'border-palette-grey/30 bg-palette-grey/10'
    return 'border-palette-olive/15 bg-white'
  }

  function statusBadgeClass(status?: ReviewStatus) {
    const s = status ?? 'approved'
    if (s === 'pending') return 'bg-amber-100 text-amber-800'
    if (s === 'declined') return 'bg-palette-grey text-palette-brown/80'
    return 'bg-palette-sage/20 text-palette-sage'
  }

  async function setStatus(review: CommunityReview, status: ReviewStatus) {
    const r = form.value.reviews.find((x) => x.id === review.id)
    if (!r) return
    r.status = status
    await save()
  }

  function reviewInitials(name: string) {
    return name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  function startEdit(review: CommunityReview) {
    editingId.value = review.id
    editDraft.value = {
      name: review.name ?? '',
      quote: review.quote ?? '',
      rating: review.rating ?? 5,
      avatar: review.avatar ?? '',
      images: [...(review.images ?? [])],
    }
  }

  function cancelEdit() {
    editingId.value = null
    editDraft.value = {
      name: '',
      quote: '',
      rating: 5,
      avatar: '',
      images: [],
    }
  }

  function onEditAvatarPick(e: Event, _review: CommunityReview) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      editDraft.value.avatar = (reader.result as string) ?? ''
    }
    reader.readAsDataURL(file)
    input.value = ''
  }

  function onEditPhotoPick(e: Event, _review: CommunityReview) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || editDraft.value.images.length >= MAX_REVIEW_PHOTOS) return
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result as string
      if (data && editDraft.value.images.length < MAX_REVIEW_PHOTOS) editDraft.value.images.push(data)
    }
    reader.readAsDataURL(file)
    input.value = ''
  }

  async function saveEdit(review: CommunityReview) {
    const r = form.value.reviews.find((x) => x.id === review.id)
    if (!r) return
    r.name = (editDraft.value.name || '').trim() || r.name
    r.quote = (editDraft.value.quote || '').trim() || r.quote
    r.rating = editDraft.value.rating
    r.avatar = editDraft.value.avatar || undefined
    r.images = editDraft.value.images.length ? editDraft.value.images.slice(0, MAX_REVIEW_PHOTOS) : undefined
    cancelEdit()
    await save()
  }

  async function removeReview(index: number) {
    form.value.reviews.splice(index, 1)
    await save()
  }

  const { data: reviewsData, pending: isLoading, refresh: refreshReviews } = useFetch<CommunityReviewsData>(
    '/api/community-reviews?scope=all',
    {
      key: 'admin-community-reviews',
      default: () => ({ title: 'What our community says', subtitle: '', reviews: [] }),
    }
  )

  watch(
    reviewsData,
    (data) => {
      if (!data) return
      const raw = (data.reviews ?? []).filter((r): r is CommunityReview => r != null && typeof r === 'object')
      form.value = {
        title: data.title ?? form.value.title,
        subtitle: data.subtitle ?? form.value.subtitle,
        reviews: raw.map((r: CommunityReview) => ({
          id: r.id ?? `r${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: r.name ?? '',
          quote: r.quote ?? '',
          rating: r.rating ?? 5,
          date: r.date,
          avatar: r.avatar,
          images: r.images ? [...r.images] : undefined,
          status: (r.status === 'pending' || r.status === 'approved' || r.status === 'declined' ? r.status : 'approved') as ReviewStatus,
        })),
      }
    },
    { immediate: true }
  )

  async function save() {
    saveMessage.value = ''
    try {
      await $fetch('/api/community-reviews', { method: 'PUT', body: form.value })
      saveSuccess.value = true
      saveMessage.value = 'Saved.'
      setTimeout(() => {
        saveMessage.value = ''
      }, 3000)
      await refreshReviews()
    } catch (e) {
      saveSuccess.value = false
      saveMessage.value = e instanceof Error ? e.message : 'Save failed.'
    }
  }

  return {
    form,
    saveMessage,
    saveSuccess,
    editingId,
    viewImageSrc,
    editDraft,
    filterStatus,
    showConfirm,
    confirmConfig,
    statusTabs,
    filteredReviews,
    isLoading,
    reviewStatusClass,
    statusBadgeClass,
    reviewInitials,
    openConfirm,
    onConfirmAction,
    startEdit,
    cancelEdit,
    onEditAvatarPick,
    onEditPhotoPick,
    saveEdit,
    removeReview,
    MAX_REVIEW_PHOTOS,
  }
}
