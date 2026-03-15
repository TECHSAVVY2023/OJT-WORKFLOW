<template>
  <div class="min-h-full bg-palette-cream/40">
    <AdminBookingsView
      :flat-rows="flatRows"
      v-model:search-query="searchQuery"
      v-model:filter-status="filterStatus"
      :success-alert="successAlert"
      :table-container-ref="tableContainerRef"
      v-model:view-detail-row="viewDetailRow"
      :current-detail-row="currentDetailRow"
      :mode-of-payment-options="MODE_OF_PAYMENT_OPTIONS"
      :sorted-filtered-rows="sortedFilteredRows"
      :paginated-rows="paginatedRows"
      :showing-from="showingFrom"
      :showing-to="showingTo"
      :current-page="currentPage"
      :total-pages="totalPages"
      :status-class="statusClass"
      :on-mode-of-payment-change="onModeOfPaymentChange"
      :on-payment-change="onPaymentChange"
      :on-status-change="onStatusChange"
      @close-success-alert="successAlert.show = false"
      @prev="currentPage--"
      @next="currentPage++"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const {
  flatRows,
  filterStatus,
  searchQuery,
  successAlert,
  tableContainerRef,
  viewDetailRow,
  currentDetailRow,
  MODE_OF_PAYMENT_OPTIONS,
  sortedFilteredRows,
  paginatedRows,
  showingFrom,
  showingTo,
  currentPage,
  totalPages,
  statusClass,
  onStatusChange,
  onPaymentChange,
  onModeOfPaymentChange,
} = useAdminBookingsPage()
</script>
