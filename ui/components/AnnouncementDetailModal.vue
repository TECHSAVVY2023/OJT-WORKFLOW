<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue && announcement"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 font-poppins"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up motion-reduce:animate-none"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @click.stop
        >
          <div class="relative flex-1 overflow-y-auto min-h-0 flex flex-col">
            <!-- Images: one main or gallery -->
            <div v-if="displayImage" class="flex items-center justify-center bg-gray-100 flex-shrink-0 min-h-[10rem] max-h-[45vh] overflow-hidden">
              <img
                v-if="displayImages.length === 1"
                :src="displayImages[0]"
                :alt="displayTitle"
                class="max-w-full w-auto max-h-[45vh] h-auto object-contain object-center"
              />
              <div v-else class="grid grid-cols-2 gap-1 p-2 w-full max-h-[45vh] overflow-y-auto">
                <img
                  v-for="(img, idx) in displayImages"
                  :key="idx"
                  :src="img"
                  :alt="`Image ${idx + 1}`"
                  class="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
            <div class="p-4 sm:p-6 flex-1 min-w-0 flex flex-col">
              <p v-if="announcement.date" class="text-gray-500 text-sm font-poppins mb-2">
                {{ formatDate(announcement.date) }}
              </p>
              <h2 :id="titleId" class="text-xl sm:text-2xl font-bold text-palette-brown mb-3">
                {{ displayTitle }}
              </h2>
              <p v-if="displayDescription" class="text-palette-brown/90 text-sm sm:text-base leading-relaxed whitespace-pre-line flex-1">
                {{ displayDescription }}
              </p>
              <div v-if="displayLinks.length" class="mt-4 flex flex-wrap gap-2">
                <a
                  v-for="(link, idx) in displayLinks"
                  :key="idx"
                  :href="link.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-palette-sage hover:underline text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  {{ link.text || link.url }}
                </a>
              </div>
              <div class="mt-5 pt-4 flex justify-end">
                <button
                  type="button"
                  class="px-5 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wide transition-opacity hover:opacity-90"
                  style="background-color: #7B7557; color: white;"
                  @click="$emit('update:modelValue', false)"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
export type AnnouncementLink = { text: string; url: string }
export type AnnouncementItem = {
  id: string
  title?: string
  description?: string
  image?: string
  images?: string[]
  links?: AnnouncementLink[]
  date?: string
}

const props = defineProps<{
  modelValue: boolean
  announcement: AnnouncementItem | null
}>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const titleId = 'announcement-modal-title'

const displayImage = computed(() => {
  if (!props.announcement) return ''
  const a = props.announcement
  if (a.images?.length) return a.images[0]
  return a.image || ''
})

const displayImages = computed(() => {
  if (!props.announcement) return []
  const a = props.announcement
  if (a.images?.length) return a.images
  if (a.image) return [a.image]
  return []
})

const displayTitle = computed(() => {
  if (!props.announcement) return ''
  const a = props.announcement
  if (a.title) return a.title
  if (a.description) return a.description.split('\n')[0].slice(0, 80) || 'Announcement'
  return 'Announcement'
})

const displayDescription = computed(() => props.announcement?.description ?? '')

const displayLinks = computed(() => props.announcement?.links ?? [])

function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}
</script>
