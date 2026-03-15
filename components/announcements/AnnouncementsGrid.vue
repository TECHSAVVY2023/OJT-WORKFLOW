<template>
  <section class="announcements-posts" aria-label="Announcements list">
    <div v-if="items.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
      <AnnouncementCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :image-url="getCardImage(item)"
        :title="getCardTitle(item)"
        :date-text="item.date ? formatDate(item.date) : ''"
        :description="item.description"
        @click="$emit('open', item)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AnnouncementItem } from '~/composables/useAnnouncementsPage'

defineProps<{
  items: AnnouncementItem[]
  getCardImage: (item: AnnouncementItem) => string
  getCardTitle: (item: AnnouncementItem) => string
  formatDate: (iso: string) => string
}>()
defineEmits<{
  open: [item: AnnouncementItem]
}>()
</script>
