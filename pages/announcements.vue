<template>
  <div class="min-h-[60vh] bg-palette-cream/30 font-poppins py-12 md:py-16">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <AnnouncementsHeader />
      <AnnouncementsFilters
        v-model:search-query="searchQuery"
        v-model:date-filter="dateFilter"
        :count="filteredAnnouncements.length"
      />
      <AnnouncementsGrid
        :items="paginatedAnnouncements"
        :get-card-image="getCardImage"
        :get-card-title="getCardTitle"
        :format-date="formatDate"
        @open="openAnnouncementModal"
      />
      <AnnouncementsPagination
        v-if="filteredAnnouncements.length > 0"
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        :page-numbers="pageNumbers"
      />
      <AnnouncementsEmpty v-else-if="!filteredAnnouncements.length" @clear="clearFilters" />
    </div>
    <AnnouncementDetailModal v-model="showAnnouncementModal" :announcement="selectedAnnouncement" />
  </div>
</template>

<script setup lang="ts">
const {
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
} = useAnnouncementsPage()
</script>
