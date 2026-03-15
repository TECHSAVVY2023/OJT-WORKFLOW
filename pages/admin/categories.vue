<template>
  <AdminCategoriesView
    v-model:search-query="searchQuery"
    v-model:show-form-modal="showFormModal"
    v-model:form-name="formName"
    :editing-row="editingRow"
    v-model:show-delete-confirm="showDeleteConfirm"
    :filtered-rows="filteredRows"
    @open-add-modal="openAddModal"
    @open-edit-modal="openEditModal"
    @submit-form="submitForm"
    @confirm-delete="confirmDelete"
    @do-delete="doDelete"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const {
  searchQuery,
  showFormModal,
  formName,
  editingRow,
  showDeleteConfirm,
  filteredRows,
  openAddModal,
  openEditModal,
  submitForm,
  confirmDelete,
  doDelete,
} = useAdminCategoriesPage()
</script>
