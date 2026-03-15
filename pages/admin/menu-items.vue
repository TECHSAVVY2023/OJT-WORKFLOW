<template>
  <AdminMenuItemsView
    v-model:search-query="searchQuery"
    v-model:filter-category="filterCategory"
    v-model:filter-status="filterStatus"
    v-model:show-add-modal="showAddModal"
    v-model:show-edit-modal="showEditModal"
    v-model:view-detail-row="viewDetailRow"
    v-model:delete-target="deleteTarget"
    v-model:show-add-edit-confirm="showAddEditConfirm"
    v-model:show-exit-confirm="showExitConfirm"
    :category-options="categoryOptions"
    :filtered-rows="filteredRows"
    :paginated-rows="paginatedRows"
    :showing-from="showingFrom"
    :showing-to="showingTo"
    :current-page="currentPage"
    :total-pages="totalPages"
    :table-container-ref="tableContainerRef"
    :success-alert="successAlert"
    :form="form"
    :add-edit-confirm-message="addEditConfirmMessage"
    :variant-label="variantLabel"
    @update:form="({ key, value }) => { (form as Record<string, unknown>)[key] = value }"
    @close-success-alert="successAlert.show = false"
    @prev="currentPage--"
    @next="currentPage++"
    @open-view-modal="openViewModal"
    @open-edit-modal="openEditModal"
    @close-modals="closeModals"
    @confirm-submit-add="confirmSubmitAdd"
    @confirm-save-edit="confirmSaveEdit"
    @do-confirm-add-or-save="doConfirmAddOrSave"
    @confirm-exit-without-save="confirmExitWithoutSave"
    @confirm-delete="confirmDelete"
    @do-delete="doDelete"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const {
  categoryOptions,
  filterCategory,
  filterStatus,
  searchQuery,
  showAddModal,
  showEditModal,
  viewDetailRow,
  deleteTarget,
  successAlert,
  form,
  showAddEditConfirm,
  addEditConfirmMessage,
  showExitConfirm,
  filteredRows,
  paginatedRows,
  showingFrom,
  showingTo,
  currentPage,
  totalPages,
  tableContainerRef,
  variantLabel,
  openViewModal,
  openEditModal,
  closeModals,
  confirmSubmitAdd,
  confirmSaveEdit,
  doConfirmAddOrSave,
  confirmExitWithoutSave,
  submitAdd,
  saveEdit,
  confirmDelete,
  doDelete,
} = useAdminMenuItemsPage()
</script>
