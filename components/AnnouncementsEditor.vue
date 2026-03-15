<template>
  <div class="min-h-full bg-palette-cream/40 font-poppins">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-palette-brown">Announcements</h1>
        <p class="mt-1 text-sm text-palette-brown/70 max-w-xl">
          Create and manage announcement posts. They appear on the <NuxtLink to="/announcements" target="_blank" class="text-palette-sage hover:underline">announcements page</NuxtLink> and in the announcements section on the landing page.
        </p>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Create a post – section with clear title -->
      <div class="content-card w-full max-w-5xl mx-auto bg-palette-white rounded-2xl border border-palette-olive/15 shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-palette-olive/15 bg-palette-olive/5">
          <h2 class="font-heading text-xl font-bold text-palette-brown">{{ editingId ? 'Edit post' : 'Create a post' }}</h2>
          <p class="mt-1 text-sm text-palette-brown/70">{{ editingId ? 'Change the content below and click Update.' : 'Add a title, description, images, and links. Click Post to publish.' }}</p>
        </div>
        <div class="compose-box rounded-xl border-2 border-palette-olive/20 bg-palette-cream/20 p-4 m-4 mb-4" :class="{ 'ring-2 ring-palette-sage/50': editingId }">
            <label class="block mb-2">
              <span class="text-sm font-semibold text-palette-brown">Title</span>
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="draft.title"
              type="text"
              class="form-input w-full mb-4"
              placeholder="e.g. New promo, Office hours, Event reminder..."
              required
            />
            <label class="block mb-2">
              <span class="text-sm font-semibold text-palette-brown">Description</span>
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="draft.description"
              rows="4"
              class="form-input w-full resize-y mb-3"
              placeholder="What's new? Share an update, promo, or announcement..."
            ></textarea>
            <div v-if="draft.images.length" class="flex flex-wrap gap-2 mb-3">
              <div v-for="(img, idx) in draft.images" :key="idx" class="relative w-20 h-20 rounded-lg overflow-hidden bg-palette-grey/30">
                <img :src="img" alt="Upload" class="w-full h-full object-cover" />
                <button type="button" class="absolute top-0.5 right-0.5 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600" @click="draft.images.splice(idx, 1)">×</button>
              </div>
            </div>
            <div v-if="draft.links.length" class="space-y-2 mb-3">
              <div v-for="(link, idx) in draft.links" :key="idx" class="flex items-center gap-2 text-sm">
                <a :href="link.url" target="_blank" rel="noopener" class="text-palette-sage hover:underline truncate flex-1 min-w-0">{{ link.text || link.url }}</a>
                <button type="button" class="text-red-600 hover:underline shrink-0" @click="draft.links.splice(idx, 1)">Remove</button>
              </div>
            </div>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-palette-sage/15 text-palette-sage text-sm font-medium cursor-pointer hover:bg-palette-sage/25">
              <input type="file" accept="image/*" class="hidden" @change="onDraftImagePick" />
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Add image
            </label>
            <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-palette-olive/15 text-palette-brown text-sm font-medium hover:bg-palette-olive/25" @click="showAddLink = true">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Add link
            </button>
          </div>
          <div v-if="showAddLink" class="mb-3 p-3 rounded-lg bg-white border border-palette-olive/20 flex flex-wrap gap-2">
            <input v-model="newLinkText" type="text" class="form-input flex-1 min-w-[120px]" placeholder="Link text" />
            <input v-model="newLinkUrl" type="url" class="form-input flex-1 min-w-[160px]" placeholder="https://..." />
            <button type="button" class="btn-secondary py-1.5 inline-flex items-center gap-1.5" @click="addDraftLink">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
            <button type="button" class="btn-secondary py-1.5" @click="showAddLink = false; newLinkText = ''; newLinkUrl = ''">Cancel</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-if="editingId" type="button" class="btn-primary" :disabled="!draft.title?.trim() || !draft.description?.trim()" @click="updatePost">
              Update
            </button>
            <button v-if="editingId" type="button" class="btn-secondary" @click="cancelEdit">Cancel</button>
            <button v-if="!editingId" type="button" class="btn-primary w-full sm:w-auto" :disabled="!draft.title?.trim() || !draft.description?.trim()" @click="publishPost">
              Post
            </button>
          </div>
        </div>
      </div>

      <!-- Your posts -->
      <div class="content-card w-full max-w-5xl mx-auto bg-palette-white rounded-2xl border border-palette-olive/15 shadow-md p-6">
        <h2 class="text-lg font-semibold text-palette-brown mb-4">Your posts</h2>
        <p class="text-sm text-palette-brown/70 mb-4">New posts and edits are saved automatically to the site.</p>

        <div v-if="!form.items.length" class="text-center py-8 text-palette-brown/60 text-sm">No posts yet. Create one above.</div>
        <div v-else class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <article
            v-for="(item, i) in form.items"
            :key="item.id"
            class="post-card rounded-xl border border-palette-olive/15 bg-white shadow-md overflow-hidden"
          >
            <!-- Image area with date badge overlay -->
            <div class="relative w-full aspect-[4/3] bg-palette-olive/10 overflow-hidden">
              <img
                v-if="getPostImages(item).length"
                :src="getPostImages(item)[0]"
                :alt="getPostCardTitle(item)"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-palette-brown/40 text-sm">No image</div>
              <span
                v-if="item.date"
                class="absolute bottom-2 left-2 px-2 py-1 rounded-md text-[10px] font-medium bg-white/95 text-palette-brown shadow-sm"
              >
                {{ formatDate(item.date) }}
              </span>
              <button
                type="button"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 hover:bg-red-500 text-white flex items-center justify-center text-xs transition-colors"
                aria-label="Remove post"
                @click="removePost(i)"
              >
                ×
              </button>
            </div>
            <!-- Text content -->
            <div class="p-3">
              <h3 class="text-sm font-bold text-palette-brown mb-1 line-clamp-1">{{ getPostCardTitle(item) }}</h3>
              <p class="text-palette-brown/80 text-xs leading-relaxed whitespace-pre-line line-clamp-3">{{ item.description || item.title || 'No content' }}</p>
              <div v-if="getPostLinks(item).length" class="mt-2 pt-2 border-t border-palette-olive/10 flex flex-wrap gap-1">
                <a v-for="(link, idx) in getPostLinks(item)" :key="idx" :href="link.url" target="_blank" rel="noopener" class="text-xs text-palette-sage hover:underline truncate max-w-full">{{ link.text || link.url }}</a>
              </div>
              <div class="mt-2 pt-2 border-t border-palette-olive/10 flex items-center gap-2">
                <button type="button" class="text-xs font-medium text-palette-sage hover:underline" @click="startEdit(item)">Edit</button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Transition name="fade">
        <div
          v-if="saveMessage"
          class="mt-6 px-4 py-3 rounded-xl text-sm border max-w-5xl mx-auto flex items-center gap-3"
          :class="saveSuccess ? 'bg-palette-sage/10 border-palette-sage/30 text-palette-sage' : 'bg-red-50/90 border-red-200 text-red-700'"
        >
          <span v-if="saveSuccess">Saved. Changes appear on the announcements page and landing page.</span>
          <span v-else>{{ saveMessage }}</span>
        </div>
      </Transition>
    </div>
  </div>
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
type AnnouncementsData = { title: string; items: AnnouncementItem[] }

const form = ref<AnnouncementsData>({ title: 'Announcements', items: [] })
const saveMessage = ref('')
const saveSuccess = ref(false)

const draft = ref({
  title: '',
  description: '',
  images: [] as string[],
  links: [] as AnnouncementLink[],
})
const editingId = ref<string | null>(null)
const showAddLink = ref(false)
const newLinkText = ref('')
const newLinkUrl = ref('')

const defaultData = (): AnnouncementsData => ({
  title: 'Announcements',
  items: [],
})

function getPostImages(item: AnnouncementItem): string[] {
  if (item.images?.length) return item.images
  if (item.image) return [item.image]
  return []
}

function getPostCardTitle(item: AnnouncementItem): string {
  if (item.title) return item.title
  if (item.description) return item.description.split('\n')[0].slice(0, 80) || 'Announcement'
  return 'Announcement'
}

function getPostLinks(item: AnnouncementItem): AnnouncementLink[] {
  return item.links || []
}

function formatDate(iso: string | undefined): string {
  if (!iso) return ''
  try {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso ?? ''
  }
}

function onDraftImagePick(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    if (dataUrl) draft.value.images.push(dataUrl)
  }
  reader.readAsDataURL(file)
  input.value = ''
}

function addDraftLink() {
  const url = newLinkUrl.value?.trim()
  if (!url) return
  draft.value.links.push({ text: newLinkText.value?.trim() || url, url })
  newLinkText.value = ''
  newLinkUrl.value = ''
  showAddLink.value = false
}

function startEdit(item: AnnouncementItem) {
  editingId.value = item.id
  draft.value = {
    title: item.title ?? '',
    description: item.description ?? '',
    images: [...getPostImages(item)],
    links: [...getPostLinks(item)],
  }
}

function cancelEdit() {
  editingId.value = null
  draft.value = { title: '', description: '', images: [], links: [] }
}

async function updatePost() {
  if (!draft.value.title?.trim() || !draft.value.description?.trim() || !editingId.value) return
  const idx = form.value.items.findIndex((i) => i.id === editingId.value)
  if (idx === -1) return
  const existing = form.value.items[idx]
  form.value.items[idx] = {
    ...existing,
    title: draft.value.title.trim(),
    description: draft.value.description.trim(),
    images: draft.value.images.length ? [...draft.value.images] : undefined,
    links: draft.value.links.length ? [...draft.value.links] : undefined,
  }
  cancelEdit()
  await save()
}

async function publishPost() {
  if (!draft.value.title?.trim() || !draft.value.description?.trim()) return
  const id = `ann-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  form.value.items.unshift({
    id,
    title: draft.value.title.trim(),
    description: draft.value.description.trim(),
    images: draft.value.images.length ? [...draft.value.images] : undefined,
    links: draft.value.links.length ? [...draft.value.links] : undefined,
    date: new Date().toISOString().slice(0, 10),
  })
  draft.value = { title: '', description: '', images: [], links: [] }
  await save()
}

async function removePost(index: number) {
  form.value.items.splice(index, 1)
  await save()
}

async function load() {
  try {
    const data = await $fetch<AnnouncementsData>('/api/announcements')
    if (data?.title != null || (data?.items && data.items.length > 0)) {
      form.value = {
        title: data.title || defaultData().title,
        items: (data.items || []).map((i: AnnouncementItem) => ({
          id: i.id || `ann-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          title: i.title,
          description: i.description,
          image: i.image,
          images: i.images ? [...i.images] : undefined,
          links: i.links ? i.links.map((l) => ({ text: l.text, url: l.url })) : undefined,
          date: i.date ?? new Date().toISOString().slice(0, 10),
        })),
      }
    } else {
      form.value = { title: data?.title ?? defaultData().title, items: data?.items ?? [] }
    }
  } catch {
    form.value = defaultData()
  }
}

async function save() {
  saveMessage.value = ''
  try {
    await $fetch('/api/announcements', {
      method: 'PUT',
      body: form.value,
    })
    saveSuccess.value = true
    saveMessage.value = 'Saved.'
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (e) {
    saveSuccess.value = false
    saveMessage.value = e instanceof Error ? e.message : 'Save failed.'
  }
}

onMounted(load)
</script>

<style scoped>
.form-input {
  @apply w-full px-3 py-2.5 text-sm border border-palette-olive/25 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage transition-colors;
}
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-palette-sage text-white text-sm font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-palette-sage/50 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-palette-sage border border-palette-sage/50 rounded-xl hover:bg-palette-sage/10 focus:outline-none focus:ring-2 focus:ring-palette-sage/30 transition-colors;
}
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
