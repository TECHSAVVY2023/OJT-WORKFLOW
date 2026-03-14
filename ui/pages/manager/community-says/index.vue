<template>
  <div class="min-h-full bg-palette-cream/40 font-poppins">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-palette-brown">What our community says</h1>
        <p class="mt-1 text-sm text-palette-brown/70">
          Approve reviews to show them on the website. Declined reviews stay hidden. Edit or remove any review below.
        </p>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="bg-palette-white rounded-2xl border border-palette-olive/15 shadow-md overflow-hidden">
        <!-- Filter tabs -->
        <div class="flex flex-wrap gap-1 p-4 border-b border-palette-olive/15 bg-palette-olive/5">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            type="button"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            :class="filterStatus === tab.value
              ? 'bg-palette-sage text-white'
              : 'bg-palette-white/80 text-palette-brown/80 hover:bg-palette-olive/10 border border-palette-olive/20'"
            @click="filterStatus = tab.value"
          >
            {{ tab.label }}
            <span class="ml-1.5 opacity-90">({{ tab.count }})</span>
          </button>
        </div>

        <div class="p-4 sm:p-6">
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
            <svg class="animate-spin w-8 h-8 text-palette-sage" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p class="text-sm text-palette-brown/70">Loading reviews...</p>
          </div>
          <div v-else-if="filteredReviews.length === 0" class="text-center py-12 text-palette-brown/60 text-sm">
            {{ form.reviews.length === 0 ? 'No reviews yet.' : 'No reviews in this filter.' }}
          </div>
          <div v-else class="space-y-6">
            <article
              v-for="(review, i) in filteredReviews"
              :key="review.id"
              class="rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
              :class="reviewStatusClass(review.status)"
            >
              <div class="p-4 sm:p-5">
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-5">
                  <!-- Left: avatar -->
                  <div class="flex sm:flex-col gap-3 sm:gap-2 shrink-0">
                    <button
                      v-if="review.avatar"
                      type="button"
                      class="w-14 h-14 rounded-full bg-palette-olive/15 flex items-center justify-center overflow-hidden border-2 border-palette-olive/10 shrink-0 cursor-pointer hover:ring-2 hover:ring-palette-sage/40 focus:outline-none focus:ring-2 focus:ring-palette-sage/50"
                      title="View profile picture"
                      @click="viewImageSrc = review.avatar"
                    >
                      <img :src="review.avatar" :alt="review.name" class="w-full h-full object-cover" />
                    </button>
                    <div v-else class="w-14 h-14 rounded-full bg-palette-olive/15 flex items-center justify-center border-2 border-palette-olive/10 text-palette-brown font-semibold text-sm shrink-0">
                      {{ reviewInitials(review.name) }}
                    </div>
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize"
                      :class="statusBadgeClass(review.status)"
                    >
                      {{ review.status ?? 'approved' }}
                    </span>
                  </div>
                  <!-- Center: content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                      <span class="font-bold text-palette-brown">{{ review.name }}</span>
                      <span class="text-sm text-amber-600">★ {{ review.rating ?? 5 }}</span>
                      <span v-if="review.date" class="text-xs text-palette-brown/50">{{ review.date }}</span>
                    </div>
                    <p class="text-sm text-palette-brown/80 leading-relaxed">{{ review.quote }}</p>
                    <div v-if="(review.images?.length ?? 0) > 0" class="flex flex-wrap gap-2 mt-3">
                      <button
                        v-for="(img, j) in (review.images ?? [])"
                        :key="j"
                        type="button"
                        class="w-14 h-14 rounded-lg overflow-hidden border border-palette-olive/15 hover:ring-2 hover:ring-palette-sage/40 shrink-0 cursor-pointer"
                        @click="viewImageSrc = img"
                      >
                        <img :src="img" :alt="`Photo ${j + 1}`" class="w-full h-full object-cover" />
                      </button>
                    </div>
                  </div>
                  <!-- Right: actions -->
                  <div class="flex sm:flex-col gap-2 shrink-0 sm:items-end">
                    <!-- Approve / Decline only when pending -->
                    <div v-if="(review.status ?? 'approved') === 'pending'" class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-palette-sage text-white hover:opacity-90"
                        @click="openConfirm('approve', review)"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                        @click="openConfirm('decline', review)"
                      >
                        Decline
                      </button>
                    </div>
                    <div class="flex gap-2">
                      <button type="button" class="btn-secondary py-1.5 text-sm" @click="startEdit(review)">Edit</button>
                      <button type="button" class="text-sm text-red-600 hover:underline py-1.5" @click="openConfirm('remove', review)">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Edit panel -->
              <div v-if="editingId === review.id" class="border-t border-palette-olive/15 p-4 sm:p-5 bg-palette-cream/30 space-y-5">
                <p class="text-sm font-semibold text-palette-brown">Edit review</p>
                <div>
                  <label class="block text-xs font-medium text-palette-brown/80 mb-1">Name <span class="text-red-500">*</span></label>
                  <input
                    v-model="editDraft.name"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-palette-olive/30 rounded-lg bg-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
                    placeholder="Reviewer name"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-palette-brown/80 mb-1">Rating (1–5)</label>
                  <div class="flex gap-1">
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      class="p-1 rounded focus:outline-none focus:ring-2 focus:ring-palette-sage/50"
                      :aria-label="`${star} star${star > 1 ? 's' : ''}`"
                      @click="editDraft.rating = star"
                    >
                      <span class="text-lg" :class="star <= editDraft.rating ? 'text-amber-500' : 'text-palette-olive/30'">★</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-palette-brown/80 mb-1">Description / Quote <span class="text-red-500">*</span></label>
                  <textarea
                    v-model="editDraft.quote"
                    rows="4"
                    class="w-full px-3 py-2 text-sm border border-palette-olive/30 rounded-lg bg-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage resize-y"
                    placeholder="Review text"
                  ></textarea>
                </div>
                <!-- Profile picture & photos -->
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="block text-xs font-medium text-palette-brown/80 mb-1">Profile picture</label>
                    <div class="flex items-center gap-2">
                      <div class="w-14 h-14 rounded-full bg-palette-olive/15 overflow-hidden flex items-center justify-center shrink-0">
                        <img v-if="editDraft.avatar" :src="editDraft.avatar" alt="" class="w-full h-full object-cover" />
                        <span v-else class="text-palette-brown/50 text-xs">None</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-palette-sage/15 text-palette-sage text-xs font-medium cursor-pointer hover:bg-palette-sage/25 w-fit">
                          <input type="file" accept="image/*" class="hidden" @change="e => onEditAvatarPick(e, review)" />
                          Upload
                        </label>
                        <button v-if="editDraft.avatar" type="button" class="text-xs text-red-600 hover:underline w-fit" @click="editDraft.avatar = ''">Clear</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-palette-brown/80 mb-1">Photos (max 5)</label>
                    <div class="flex flex-wrap gap-2">
                      <div v-for="(img, j) in editDraft.images" :key="j" class="relative w-14 h-14 rounded-lg overflow-hidden bg-palette-olive/10">
                        <img :src="img" alt="" class="w-full h-full object-cover" />
                        <button type="button" class="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center" @click="editDraft.images.splice(j, 1)">×</button>
                      </div>
                      <label v-if="editDraft.images.length < 5" class="w-14 h-14 rounded-lg border-2 border-dashed border-palette-olive/30 flex items-center justify-center text-palette-brown/50 text-xs cursor-pointer hover:border-palette-sage/50 hover:text-palette-sage">
                        <input type="file" accept="image/*" class="hidden" @change="e => onEditPhotoPick(e, review)" />
                        + Add
                      </label>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 pt-1">
                  <button type="button" class="btn-primary text-sm" @click="openConfirm('save', review)">Save</button>
                  <button type="button" class="btn-secondary text-sm" @click="cancelEdit">Cancel</button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- Confirm modal for approve, decline, remove, save -->
      <ConfirmModal
        v-model="showConfirm"
        :title="confirmConfig.title"
        :message="confirmConfig.message"
        :confirm-label="confirmConfig.confirmLabel"
        cancel-label="Cancel"
        :danger="confirmConfig.danger"
        @confirm="onConfirmAction"
      />

      <!-- Full-size image viewer modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="viewImageSrc"
            class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 font-poppins"
            @click.self="viewImageSrc = null"
          >
            <div class="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
              <button
                type="button"
                class="absolute -top-10 right-0 sm:top-2 sm:right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-palette-brown hover:bg-white z-10 shadow-lg"
                aria-label="Close"
                @click="viewImageSrc = null"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <img
                :src="viewImageSrc"
                alt="View full size"
                class="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                @click.stop
              />
            </div>
          </div>
        </Transition>
      </Teleport>

      <Transition name="fade">
        <div
          v-if="saveMessage"
          class="mt-6 px-4 py-3 rounded-xl text-sm border max-w-5xl mx-auto flex items-center gap-3"
          :class="saveSuccess ? 'bg-palette-sage/10 border-palette-sage/30 text-palette-sage' : 'bg-red-50/90 border-red-200 text-red-700'"
        >
          <span v-if="saveSuccess">Saved.</span>
          <span v-else>{{ saveMessage }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'manager' })

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

type ConfirmAction = 'approve' | 'decline' | 'remove' | 'save'
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
  reader.onload = () => { editDraft.value.avatar = (reader.result as string) ?? '' }
  reader.readAsDataURL(file)
  input.value = ''
}

const MAX_REVIEW_PHOTOS = 5

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

const { data: reviewsData, pending: isLoading, refresh: refreshReviews } = useFetch<CommunityReviewsData>('/api/community-reviews?scope=all', {
  key: 'manager-community-reviews',
  default: () => ({ title: 'What our community says', subtitle: '', reviews: [] }),
})

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
    setTimeout(() => { saveMessage.value = '' }, 3000)
    await refreshReviews()
  } catch (e) {
    saveSuccess.value = false
    saveMessage.value = e instanceof Error ? e.message : 'Save failed.'
  }
}
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-4 py-2 bg-palette-sage text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50;
}
.btn-secondary {
  @apply inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-palette-sage border border-palette-sage/50 rounded-xl hover:bg-palette-sage/10;
}
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
