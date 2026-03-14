<template>
  <div class="min-h-screen bg-white font-poppins">
    <!-- 1. About us (same layout as index: title + text left, image right) -->
    <section class="section-block py-20 md:py-24 bg-white font-poppins">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="text-center lg:text-left font-poppins">
            <h1
              class="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
              :style="{ fontFamily: siteData.about.titleFontFamily || 'Poppins', color: siteData.about.titleColor }"
            >
              {{ siteData.about.title }}
            </h1>
            <p
              v-for="(paragraph, index) in siteData.about.paragraphs"
              :key="index"
              class="text-base leading-relaxed mb-4 md:mb-6"
              :style="{ fontFamily: siteData.about.textFontFamily || 'Poppins', color: siteData.about.textColor }"
            >
              <span v-html="paragraph.replace(/\n/g, '<br />')" />
            </p>
          </div>
          <div class="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl max-w-sm mx-auto md:max-w-none md:mx-0">
            <img
              :src="siteData.about.image"
              :alt="siteData.about.imageAlt"
              class="w-full h-auto object-cover aspect-[4/3] md:aspect-auto"
            />
            <div class="absolute bottom-3 left-3 md:bottom-6 md:left-6 bg-white/80 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full font-bold font-poppins text-workflow-green text-sm md:text-lg shadow-md">
              {{ siteData.about.overlayText }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. What our community says about us -->
    <section class="py-20 md:py-24 bg-[#f5f0e8] font-poppins">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-12">
          <h2 class="text-xl sm:text-3xl md:text-4xl font-bold font-poppins text-palette-brown mb-3 md:mb-4">
            {{ siteData.communitySays.title }}
          </h2>
          <p class="text-sm sm:text-base text-palette-olive font-poppins max-w-2xl mx-auto">
            {{ siteData.communitySays.subtitle }}
          </p>
        </div>

        <!-- Reviews carousel -->
        <div
          ref="reviewCarouselRef"
          class="relative max-w-2xl mx-auto mb-12 touch-pan-y"
          @touchstart="onReviewTouchStart"
          @touchend="onReviewTouchEnd"
        >
          <div class="overflow-hidden">
            <p v-if="allReviews.length === 0" class="text-center text-palette-brown/70 py-12 text-sm sm:text-base">No reviews yet. Be the first to write one!</p>
            <Transition v-else-if="currentReview" name="review-slide" mode="out-in">
              <article
                :key="currentReview.id"
                class="bg-white rounded-xl sm:rounded-2xl shadow-md border border-palette-olive/10 p-4 sm:p-6 flex flex-col min-h-[220px] sm:min-h-[280px]"
              >
                <div class="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-palette-olive/20 flex items-center justify-center flex-shrink-0 overflow-hidden text-palette-brown font-semibold text-xs sm:text-sm">
                      <img v-if="currentReview.avatar" :src="currentReview.avatar" :alt="currentReview.name" class="w-full h-full object-cover" />
                      <span v-else>{{ reviewInitials(currentReview.name) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-palette-brown truncate text-sm sm:text-base">{{ currentReview.name }}</p>
                      <div class="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                        <span class="text-xs sm:text-sm font-medium text-palette-brown">{{ formatRating(currentReview.rating) }}</span>
                        <div class="flex gap-0.5" aria-hidden="true">
                          <span v-for="i in 5" :key="i" class="text-xs sm:text-sm">
                            <span v-if="(currentReview.rating ?? 5) >= i" class="text-amber-400">★</span>
                            <span v-else class="text-palette-olive/30">★</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span class="text-[10px] sm:text-xs text-palette-olive/70 flex-shrink-0">{{ formatReviewDate(currentReview.date, currentReview.createdAt) }}</span>
                </div>
                <p class="text-palette-brown/90 text-xs sm:text-sm leading-relaxed flex-1 min-h-0">
                  {{ currentReview.quote }}
                </p>
                <div v-if="currentReview.images && currentReview.images.length" class="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                  <button
                    v-for="(img, i) in currentReview.images"
                    :key="i"
                    type="button"
                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-palette-sage"
                    @click="imageModalSrc = img"
                  >
                    <img
                      :src="img"
                      :alt="`Review photo ${i + 1}`"
                      class="w-full h-full object-cover cursor-pointer"
                    />
                  </button>
                </div>
              </article>
            </Transition>
          </div>
          <template v-if="allReviews.length > 0">
            <button
              type="button"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 md:w-12 md:h-12 hidden md:flex items-center justify-center rounded-full text-white shadow-lg hover:opacity-90 transition-opacity z-10"
              style="background-color: #69AC7C"
              aria-label="Previous review"
              @click="prevReview"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 md:w-12 md:h-12 hidden md:flex items-center justify-center rounded-full text-white shadow-lg hover:opacity-90 transition-opacity z-10"
              style="background-color: #69AC7C"
              aria-label="Next review"
              @click="nextReview"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div class="flex justify-center gap-2 mt-4 sm:mt-6">
              <button
                v-for="(_, index) in allReviews"
                :key="index"
                type="button"
                :aria-label="`Go to review ${index + 1}`"
                class="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all"
                :class="currentReviewIndex === index ? 'scale-125' : 'bg-palette-olive/30 hover:bg-palette-olive/50'"
                :style="currentReviewIndex === index ? { backgroundColor: '#69AC7C' } : {}"
                @click="currentReviewIndex = index"
              />
            </div>
          </template>
        </div>

        <!-- Button to open Write a review modal -->
        <div class="text-center">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm uppercase tracking-wide transition-opacity hover:opacity-90"
            style="background-color: #69AC7C"
            @click="writeReviewModalOpen = true"
          >
            Write a review
          </button>
        </div>
      </div>
    </section>

    <!-- Write a review modal -->
    <Teleport to="body">
      <div
        v-if="writeReviewModalOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 font-poppins"
        @click.self="closeWriteReviewModal"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-palette-olive/10">
          <div class="sticky top-0 bg-white px-5 py-4 border-b border-palette-olive/15 flex items-center justify-between gap-3 rounded-t-2xl z-10">
            <h3 class="text-lg font-bold text-palette-brown">Write a review</h3>
            <button
              type="button"
              class="p-2 rounded-full hover:bg-palette-cream/60 text-palette-brown/80"
              aria-label="Close"
              @click="closeWriteReviewModal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="p-5 sm:p-6">
            <p class="text-sm text-palette-olive/80 mb-4">Share your experience at Workflow. Your feedback helps others discover us.</p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-palette-brown mb-2">Your name</label>
                <input
                  v-model="newReview.name"
                  type="text"
                  placeholder="e.g. Maria S."
                  class="w-full px-4 py-2.5 text-sm border border-palette-olive/30 rounded-xl bg-white text-palette-brown placeholder-palette-olive/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-palette-brown mb-2">Profile picture (optional)</label>
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 rounded-full bg-palette-olive/15 overflow-hidden flex items-center justify-center shrink-0 border-2 border-palette-olive/20">
                    <img v-if="newReview.avatar" :src="newReview.avatar" alt="Preview" class="w-full h-full object-cover" />
                    <span v-else class="text-palette-olive/50 text-xs">None</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-palette-sage/15 text-palette-sage text-sm font-medium cursor-pointer hover:bg-palette-sage/25 w-fit">
                      <input type="file" accept="image/*" class="hidden" @change="onProfileImageSelect" />
                      Upload
                    </label>
                    <button v-if="newReview.avatar" type="button" class="text-xs text-red-600 hover:underline w-fit" @click="newReview.avatar = ''">Clear</button>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-palette-brown mb-2">Rating</label>
                <div class="flex gap-1 items-center">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="p-0.5 focus:outline-none"
                    :aria-label="`${star} star${star > 1 ? 's' : ''}`"
                    @click="newReview.rating = star"
                  >
                    <span class="text-2xl transition-colors" :class="star <= newReview.rating ? 'text-amber-400' : 'text-palette-olive/30'">★</span>
                  </button>
                  <span class="ml-2 text-sm text-palette-brown/80">{{ newReview.rating }}/5</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-palette-brown mb-2">Add photos (optional)</label>
                <div
                  class="w-full min-h-[100px] rounded-xl border-2 border-dashed border-palette-olive/30 flex flex-col items-center justify-center gap-2 bg-palette-cream/30 cursor-pointer hover:border-palette-sage/50 transition-colors"
                  @click="uploadInputRef?.click()"
                >
                  <svg class="w-9 h-9 text-palette-olive/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span class="text-sm text-palette-olive/70">Click to upload (max {{ MAX_REVIEW_IMAGES }} images)</span>
                </div>
                <input
                  ref="uploadInputRef"
                  type="file"
                  accept="image/*"
                  multiple
                  class="hidden"
                  @change="onImageSelect"
                />
                <div v-if="newReview.images.length" class="flex flex-wrap gap-2 mt-2">
                  <div
                    v-for="(img, idx) in newReview.images"
                    :key="idx"
                    class="relative w-20 h-20 rounded-lg overflow-hidden border border-palette-olive/20 flex-shrink-0"
                  >
                    <img :src="img" alt="Upload preview" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      class="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80"
                      aria-label="Remove image"
                      @click="removeReviewImage(idx)"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-palette-brown mb-2">Write your review</label>
                <textarea
                  v-model="newReview.quote"
                  placeholder="Would you like to write anything about your experience?"
                  rows="4"
                  maxlength="400"
                  class="w-full px-4 py-2.5 text-sm border border-palette-olive/30 rounded-xl bg-white text-palette-brown placeholder-palette-olive/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage resize-none"
                />
                <p class="text-xs text-palette-olive/60 mt-1 text-right">{{ 400 - newReview.quote.length }} characters remaining</p>
              </div>
              <button
                type="button"
                class="w-full py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style="background-color: #69AC7C"
                :disabled="!newReview.name.trim() || !newReview.quote.trim()"
                @click="showPublishConfirm = true"
              >
                Submit review
              </button>
            </div>
            <p v-if="submitSuccess" class="mt-4 text-sm font-medium text-palette-sage">Thank you! Your review has been added.</p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Are you sure to publish? (SweetAlert-style confirm) -->
    <Teleport to="body">
      <div
        v-if="showPublishConfirm"
        class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/50 font-poppins"
        @click.self="showPublishConfirm = false"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-palette-olive/10">
          <p class="text-palette-brown font-medium mb-6">Are you sure you want to publish this review?</p>
          <div class="flex gap-3 justify-center">
            <button
              type="button"
              class="px-5 py-2.5 rounded-xl border border-palette-olive/40 text-palette-brown font-semibold text-sm hover:bg-palette-cream/60"
              @click="showPublishConfirm = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90"
              style="background-color: #69AC7C"
              @click="confirmPublishReview"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      <!-- Image preview modal (community says) -->
      <div
        v-if="imageModalSrc"
        class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 font-poppins"
        @click.self="imageModalSrc = null"
      >
        <div class="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
          <button
            type="button"
            class="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Close"
            @click="imageModalSrc = null"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img
            :src="imageModalSrc"
            alt="Review photo"
            class="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            @click.stop
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { siteData } = useSiteData()

const allReviews = computed(() => (siteData.communitySays.reviews ?? []) as Array<{
  id: string
  name: string
  quote: string
  rating?: number
  date?: string
  createdAt?: string
  avatar?: string
  images?: string[]
}>)

const MAX_REVIEW_IMAGES = 5
const writeReviewModalOpen = ref(false)
const showPublishConfirm = ref(false)
const newReview = ref({ name: '', quote: '', avatar: '' as string, images: [] as string[], rating: 5 })
const uploadInputRef = ref<HTMLInputElement | null>(null)
const submitSuccess = ref(false)
const currentReviewIndex = ref(0)
const currentReview = computed(() => allReviews.value[currentReviewIndex.value] ?? allReviews.value[0])
const imageModalSrc = ref<string | null>(null)
const reviewCarouselRef = ref<HTMLElement | null>(null)
const touchStartX = ref(0)
const touchStartY = ref(0)
const SWIPE_THRESHOLD = 50

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
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  if (date) {
    const d = new Date(date)
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const short = date.trim().match(/^(\d{1,2})\s+(\w{3})$/i)
    if (short) {
      const [, day, mon] = short
      const year = new Date().getFullYear()
      const parsed = new Date(`${mon} ${day}, ${year}`)
      if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    return date
  }
  return 'Recently'
}

function prevReview() {
  if (allReviews.value.length === 0) return
  currentReviewIndex.value = (currentReviewIndex.value - 1 + allReviews.value.length) % allReviews.value.length
}

function nextReview() {
  if (allReviews.value.length === 0) return
  currentReviewIndex.value = (currentReviewIndex.value + 1) % allReviews.value.length
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
  if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < SWIPE_THRESHOLD) return
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
  const toAdd = Array.from(files).slice(0, remaining).filter((f) => f.type.startsWith('image/'))
  toAdd.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (newReview.value.images.length < MAX_REVIEW_IMAGES) {
        newReview.value.images = [...newReview.value.images, dataUrl]
      }
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
  reader.onload = () => { newReview.value.avatar = (reader.result as string) ?? '' }
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
        images: newReview.value.images.length ? newReview.value.images.slice(0, MAX_REVIEW_IMAGES) : undefined,
      },
    })
    await refreshNuxtData('community-reviews')
    newReview.value = { name: '', quote: '', avatar: '', images: [], rating: 5 }
    submitSuccess.value = true
    writeReviewModalOpen.value = false
    setTimeout(() => { submitSuccess.value = false }, 3000)
  } catch {
    submitSuccess.value = false
    // Could show error message
  }
}
</script>

<style scoped>
.review-slide-enter-active,
.review-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.review-slide-enter-from {
  opacity: 0;
  transform: translateX(1.5rem);
}
.review-slide-leave-to {
  opacity: 0;
  transform: translateX(-1.5rem);
}
</style>
