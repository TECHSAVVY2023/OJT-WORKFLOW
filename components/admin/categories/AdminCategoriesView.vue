<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader title="Categories" subtitle="Manage menu categories. Base categories from the menu are read-only; you can add and edit custom categories." size="large" />
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Search and Add -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="relative flex-1 max-w-md">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-palette-brown/50 pointer-events-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            :model-value="searchQuery"
            type="search"
            placeholder="Search by ID or name..."
            class="w-full pl-10 pr-4 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <button
          type="button"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive transition-colors"
          @click="emit('openAddModal')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add category
        </button>
      </div>

      <!-- Table -->
      <div class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-[640px] w-full divide-y divide-palette-olive/20">
            <thead class="bg-palette-olive/15">
              <tr>
                <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Category ID</th>
                <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Name</th>
                <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Created at</th>
                <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Updated at</th>
                <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-palette-white divide-y divide-palette-olive/15 admin-table-body">
              <tr v-if="filteredRows.length === 0">
                <td colspan="5" class="px-3 sm:px-4 lg:px-6 py-12 text-center text-palette-brown/80 text-sm">
                  No categories match your search.
                </td>
              </tr>
              <tr v-for="row in filteredRows" :key="row.isBase ? `base-${row.name}` : row.id" class="hover:bg-palette-cream/50 transition-colors">
                <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-palette-dark">{{ row.id }}</td>
                <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm text-palette-dark">{{ row.name }}</td>
                <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm">
                  <p class="font-medium text-palette-dark">{{ row.createdDate }}</p>
                  <p v-if="row.createdTime" class="text-palette-brown/80 text-xs">{{ row.createdTime }}</p>
                </td>
                <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm">
                  <p class="font-medium text-palette-dark">{{ row.updatedDate }}</p>
                  <p v-if="row.updatedTime" class="text-palette-brown/80 text-xs">{{ row.updatedTime }}</p>
                </td>
                <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      class="p-2 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      aria-label="Edit"
                      @click="emit('openEditModal', row)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="p-2 text-palette-olive hover:text-red-600 hover:bg-red-50 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      aria-label="Delete"
                      @click="emit('confirmDelete', row)"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add / Edit category modal (same style as menu-items) -->
    <Teleport to="body">
      <div
        v-if="showFormModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50"
        @click.self="emit('update:showFormModal', false)"
      >
        <div
          class="bg-palette-cream border-2 border-palette-olive/40 rounded-workflow-lg shadow-xl w-full max-w-md min-w-[320px] p-6 modal-fixed-width"
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-modal-title"
        >
          <h2 id="form-modal-title" class="font-heading text-lg font-bold text-palette-brown mb-4">
            {{ editingRow ? 'Edit category' : 'Add category' }}
          </h2>
          <form class="space-y-4" @submit.prevent="emit('submitForm')">
            <div>
              <label for="category-name" class="block text-sm font-medium text-palette-brown mb-1.5">Name</label>
              <input
                id="category-name"
                :model-value="formName"
                type="text"
                required
                placeholder="e.g. Seasonal Drinks"
                class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]"
                @input="emit('update:formName', ($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="flex gap-3 justify-end pt-2">
              <button
                type="button"
                class="px-4 py-2.5 text-sm font-medium text-palette-brown border border-palette-olive/40 rounded-workflow bg-palette-white hover:bg-palette-cream/60"
                @click="emit('update:showFormModal', false)"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive"
              >
                {{ editingRow ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <ConfirmModal
      :model-value="showDeleteConfirm"
      title="Delete category?"
      message="This category will be removed. Menu items using it will need to be reassigned."
      confirm-label="Delete"
      cancel-label="Cancel"
      @update:model-value="emit('update:showDeleteConfirm', $event)"
      @confirm="emit('doDelete')"
    />
  </div>
</template>

<script setup lang="ts">
import type { AdminCategoryRow } from '~/composables/useAdminCategories'

const props = defineProps<{
  searchQuery: string
  showFormModal: boolean
  formName: string
  editingRow: AdminCategoryRow | null
  showDeleteConfirm: boolean
  filteredRows: AdminCategoryRow[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:showFormModal': [value: boolean]
  'update:formName': [value: string]
  'update:showDeleteConfirm': [value: boolean]
  openAddModal: []
  openEditModal: [row: AdminCategoryRow]
  submitForm: []
  confirmDelete: [row: AdminCategoryRow]
  doDelete: []
}>()
</script>

<style scoped>
.modal-fixed-width {
  width: 100%;
  max-width: 28rem;
  min-width: 20rem;
}
.admin-table-body {
  min-height: 320px;
}
</style>
