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
            v-for="tab in state.statusTabs"
            :key="tab.value"
            type="button"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            :class="state.filterStatus === tab.value
              ? 'bg-palette-sage text-white'
              : 'bg-palette-white/80 text-palette-brown/80 hover:bg-palette-olive/10 border border-palette-olive/20'"
            @click="state.filterStatus = tab.value"
          >
            {{ tab.label }}
            <span class="ml-1.5 opacity-90">({{ tab.count }})</span>
          </button>
        </div>

        <div class="p-4 sm:p-6">
          <div v-if="state.isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
            <svg class="animate-spin w-8 h-8 text-palette-sage" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p class="text-sm text-palette-brown/70">Loading reviews...</p>
          </div>
          <div v-else-if="state.filteredReviews.length === 0" class="text-center py-12 text-palette-brown/60 text-sm">
            {{ state.form.reviews.length === 0 ? 'No reviews yet.' : 'No reviews in this filter.' }}
          </div>
          <div v-else class="space-y-6">
            <article
              v-for="(review, i) in state.filteredReviews"
              :key="review.id"
              class="rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
              :class="state.reviewStatusClass(review.status)"
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
                      @click="state.viewImageSrc = review.avatar"
                    >
                      <img :src="review.avatar" :alt="review.name" class="w-full h-full object-cover" />
                    </button>
                    <div v-else class="w-14 h-14 rounded-full bg-palette-olive/15 flex items-center justify-center border-2 border-palette-olive/10 text-palette-brown font-semibold text-sm shrink-0">
                      {{ state.reviewInitials(review.name) }}
                    </div>
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize"
                      :class="state.statusBadgeClass(review.status)"
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
                        @click="state.viewImageSrc = img"
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
                        @click="state.openConfirm('approve', review)"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                        @click="state.openConfirm('decline', review)"
                      >
                        Decline
                      </button>
                    </div>
                    <div class="flex gap-2">
                      <button type="button" class="btn-secondary py-1.5 text-sm" @click="state.startEdit(review)">Edit</button>
                      <button type="button" class="text-sm text-red-600 hover:underline py-1.5" @click="state.openConfirm('remove', review)">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Edit panel -->
              <div v-if="state.editingId === review.id" class="border-t border-palette-olive/15 p-4 sm:p-5 bg-palette-cream/30 space-y-5">
                <p class="text-sm font-semibold text-palette-brown">Edit review</p>
                <div>
                  <label class="block text-xs font-medium text-palette-brown/80 mb-1">Name <span class="text-red-500">*</span></label>
                  <input
                    v-model="state.editDraft.name"
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
                      @click="state.editDraft.rating = star"
                    >
                      <span class="text-lg" :class="star <= state.editDraft.rating ? 'text-amber-500' : 'text-palette-olive/30'">★</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-palette-brown/80 mb-1">Description / Quote <span class="text-red-500">*</span></label>
                  <textarea
                    v-model="state.editDraft.quote"
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
                        <img v-if="state.editDraft.avatar" :src="state.editDraft.avatar" alt="" class="w-full h-full object-cover" />
                        <span v-else class="text-palette-brown/50 text-xs">None</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <label class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-palette-sage/15 text-palette-sage text-xs font-medium cursor-pointer hover:bg-palette-sage/25 w-fit">
                          <input type="file" accept="image/*" class="hidden" @change="e => state.onEditAvatarPick(e, review)" />
                          Upload
                        </label>
                        <button v-if="state.editDraft.avatar" type="button" class="text-xs text-red-600 hover:underline w-fit" @click="state.editDraft.avatar = ''">Clear</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-palette-brown/80 mb-1">Photos (max 5)</label>
                    <div class="flex flex-wrap gap-2">
                      <div v-for="(img, j) in state.editDraft.images" :key="j" class="relative w-14 h-14 rounded-lg overflow-hidden bg-palette-olive/10">
                        <img :src="img" alt="" class="w-full h-full object-cover" />
                        <button type="button" class="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center" @click="state.editDraft.images.splice(j, 1)">×</button>
                      </div>
                      <label v-if="state.editDraft.images.length < state.MAX_REVIEW_PHOTOS" class="w-14 h-14 rounded-lg border-2 border-dashed border-palette-olive/30 flex items-center justify-center text-palette-brown/50 text-xs cursor-pointer hover:border-palette-sage/50 hover:text-palette-sage">
                        <input type="file" accept="image/*" class="hidden" @change="e => state.onEditPhotoPick(e, review)" />
                        + Add
                      </label>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 pt-1">
                  <button type="button" class="btn-primary text-sm" @click="state.openConfirm('save', review)">Save</button>
                  <button type="button" class="btn-secondary text-sm" @click="state.cancelEdit()">Cancel</button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- Confirm modal for approve, decline, remove, save -->
      <ConfirmModal
        v-model="state.showConfirm"
        :title="state.confirmConfig.title"
        :message="state.confirmConfig.message"
        :confirm-label="state.confirmConfig.confirmLabel"
        cancel-label="Cancel"
        :danger="state.confirmConfig.danger"
        @confirm="state.onConfirmAction"
      />

      <!-- Full-size image viewer modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="state.viewImageSrc"
            class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 font-poppins"
            @click.self="state.viewImageSrc = null"
          >
            <div class="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
              <button
                type="button"
                class="absolute -top-10 right-0 sm:top-2 sm:right-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-palette-brown hover:bg-white z-10 shadow-lg"
                aria-label="Close"
                @click="state.viewImageSrc = null"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <img
                :src="state.viewImageSrc"
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
          v-if="state.saveMessage"
          class="mt-6 px-4 py-3 rounded-xl text-sm border max-w-5xl mx-auto flex items-center gap-3"
          :class="state.saveSuccess ? 'bg-palette-sage/10 border-palette-sage/30 text-palette-sage' : 'bg-red-50/90 border-red-200 text-red-700'"
        >
          <span v-if="state.saveSuccess">Saved.</span>
          <span v-else>{{ state.saveMessage }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { useAdminCommunitySaysPage } from '~/composables/useAdminCommunitySaysPage'

defineProps<{
  state: ReturnType<typeof useAdminCommunitySaysPage>
}>()
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
