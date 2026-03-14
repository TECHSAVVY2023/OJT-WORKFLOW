<template>
  <div class="min-h-full bg-palette-cream/40">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-palette-brown">Menu Items</h1>
        <p class="mt-1 text-sm text-palette-brown/70">Manage menu categories and items, availability, and pricing.</p>
      </div>
    </header>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Search, filter and action bar: one horizontal row on mobile, smaller text -->
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div class="flex flex-nowrap items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="search...."
          class="flex-1 min-w-0 px-2 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[36px] sm:min-h-[42px] max-w-xs sm:max-w-none"
        />
        <div class="relative inline-block w-28 sm:min-w-[140px] flex-shrink-0">
          <select
            v-model="filterCategory"
            class="w-full pl-2 pr-7 sm:pl-4 sm:pr-9 py-2 sm:py-2.5 text-[11px] sm:text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[36px] sm:min-h-[42px] appearance-none"
          >
            <option value="">Category</option>
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <button
            v-if="filterCategory"
            type="button"
            class="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
            aria-label="Clear category filter"
            @click="filterCategory = ''"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="relative inline-block w-24 sm:min-w-[140px] flex-shrink-0">
          <select
            v-model="filterStatus"
            class="w-full pl-2 pr-7 sm:pl-4 sm:pr-9 py-2 sm:py-2.5 text-[11px] sm:text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[36px] sm:min-h-[42px] appearance-none"
          >
            <option value="">Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <button
            v-if="filterStatus"
            type="button"
            class="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
            aria-label="Clear status filter"
            @click="filterStatus = ''"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <button
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[36px] sm:min-h-[42px] transition-all hover:bg-palette-olive"
        @click="showAddModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Add New Item
      </button>
    </div>

    <!-- Table -->
    <div ref="tableContainerRef" class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
      <div class="overflow-x-auto -mx-px">
        <table class="min-w-[640px] w-full divide-y divide-palette-olive/20">
          <thead class="bg-palette-olive/15">
            <tr>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">ID</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Product Name</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Category</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Price</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider hidden md:table-cell">Created</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider hidden md:table-cell">Updated</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Status</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-palette-white divide-y divide-palette-olive/15 admin-table-body">
            <tr v-if="filteredRows.length === 0">
              <td colspan="8" class="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 text-center text-palette-brown/80 text-sm font-medium">
                No products to show.
              </td>
            </tr>
            <tr v-for="row in paginatedRows" :key="row.id" class="hover:bg-palette-cream/50 transition-colors">
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-palette-dark">{{ row.id }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm text-palette-dark">{{ row.productName }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-palette-brown">{{ row.category }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-palette-dark">₱{{ row.price }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm hidden md:table-cell">
                <p class="font-medium text-palette-dark">{{ row.createdDate }}</p>
                <p v-if="row.createdTime" class="text-palette-brown/80 text-xs">{{ row.createdTime }}</p>
              </td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm hidden md:table-cell">
                <p class="font-medium text-palette-dark">{{ row.updatedDate }}</p>
                <p v-if="row.updatedTime" class="text-palette-brown/80 text-xs">{{ row.updatedTime }}</p>
              </td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="row.status === 'Available' ? 'bg-palette-sage/90 text-palette-white' : 'bg-palette-grey text-palette-brown'"
                >
                  {{ row.status }}
                </span>
              </td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                <div class="flex items-center gap-1 sm:gap-2">
                  <button type="button" class="p-2 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="View details" @click="openViewModal(row)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button
                    type="button"
                    class="p-2 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Edit"
                    @click="openEditModal(row)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="p-2 text-palette-olive hover:text-red-600 hover:bg-red-50 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Delete"
                    @click="confirmDelete(row)"
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
      <div class="px-4 sm:px-6 py-3 bg-palette-olive/10 border-t border-palette-olive/20 flex flex-wrap items-center justify-between gap-2 text-sm text-palette-brown">
        <span>Showing {{ showingFrom }}-{{ showingTo }} of {{ filteredRows.length }}</span>
        <div class="flex items-center gap-1">
          <button type="button" class="p-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/80 disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous page" :disabled="currentPage <= 1" @click="currentPage--">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="px-2 text-palette-brown/80 text-sm">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
          <button type="button" class="p-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/80 disabled:opacity-50 disabled:pointer-events-none" aria-label="Next page" :disabled="currentPage >= totalPages" @click="currentPage++">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- View details modal (Close only, no Edit) -->
    <Teleport to="body">
      <div v-if="viewDetailRow" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50" @click.self="viewDetailRow = null">
        <div class="bg-palette-cream border-2 border-palette-olive/40 rounded-workflow-lg shadow-xl w-full max-w-md min-w-[320px] max-h-[90vh] overflow-y-auto p-6 modal-fixed-width">
          <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">Item details</h2>
          <div v-if="viewDetailRow?.raw.image" class="mb-4 rounded-xl overflow-hidden bg-palette-white border border-palette-olive/20 flex items-center justify-center min-h-[200px] max-h-[320px]">
            <img :src="viewDetailRow.raw.image" :alt="viewDetailRow.productName" class="w-full max-h-[320px] object-contain" />
          </div>
          <dl class="grid grid-cols-1 gap-3 text-sm">
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">ID</dt><dd class="text-palette-dark">{{ viewDetailRow?.id }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Product name</dt><dd class="text-palette-dark">{{ viewDetailRow?.productName }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Category</dt><dd class="text-palette-dark">{{ viewDetailRow?.category }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Price</dt><dd class="text-palette-dark">₱{{ viewDetailRow?.price }}</dd></div>
            <div v-if="viewDetailRow?.raw.description" class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Description</dt><dd class="text-palette-dark">{{ viewDetailRow.raw.description }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Hot / Cold</dt><dd class="text-palette-dark">{{ variantLabel(viewDetailRow?.raw.variants) }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Status</dt><dd><span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" :class="viewDetailRow?.status === 'Available' ? 'bg-palette-sage/90 text-palette-white' : 'bg-palette-grey text-palette-brown'">{{ viewDetailRow?.status }}</span></dd></div>
          </dl>
          <div class="mt-6">
            <button type="button" class="w-full px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="viewDetailRow = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add New Item modal -->
    <Teleport to="body">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50"
        @click.self="closeModals"
      >
        <div class="bg-palette-cream border-2 border-palette-olive/40 rounded-workflow-lg shadow-xl w-full max-w-md min-w-[320px] max-h-[90vh] overflow-y-auto flex flex-col p-6 modal-fixed-width">
          <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">{{ showEditModal ? 'Edit Item' : 'Add New Item' }}</h2>
          <form class="space-y-4" @submit.prevent="showEditModal ? confirmSaveEdit() : confirmSubmitAdd()">
              <div>
                <label for="name" class="block text-sm font-medium text-palette-brown mb-1.5">Product Name</label>
                <input id="name" v-model="form.name" type="text" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="e.g. Caramel Macchiato" />
              </div>
              <div>
                <label for="category" class="block text-sm font-medium text-palette-brown mb-1.5">Category</label>
                <select id="category" v-model="form.category" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]">
                  <option value="">Select category</option>
                  <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div>
                <label for="price" class="block text-sm font-medium text-palette-brown mb-1.5">Price (₱)</label>
                <input id="price" v-model.number="form.price" type="number" min="0" step="1" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" />
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-palette-brown mb-1.5">Description (optional)</label>
                <textarea id="description" v-model="form.description" rows="2" class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage resize-none" placeholder="Short description"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1.5">Image</label>
                <AdminImageUpload v-model="form.image" />
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1.5">Hot / Cold</label>
                <div class="flex flex-nowrap items-center gap-2">
                  <label class="inline-flex items-center gap-2 px-3 py-2.5 rounded-workflow border cursor-pointer transition-colors min-h-[42px] shrink-0" :class="form.variantOption === 'hot' ? 'border-palette-sage bg-palette-sage/10 text-palette-brown' : 'border-palette-olive/40 bg-palette-white text-palette-brown hover:border-palette-olive/60'">
                    <input v-model="form.variantOption" type="radio" value="hot" class="w-4 h-4 text-palette-sage focus:ring-palette-sage" />
                    <span class="text-sm font-medium">Hot only</span>
                  </label>
                  <label class="inline-flex items-center gap-2 px-3 py-2.5 rounded-workflow border cursor-pointer transition-colors min-h-[42px] shrink-0" :class="form.variantOption === 'cold' ? 'border-palette-sage bg-palette-sage/10 text-palette-brown' : 'border-palette-olive/40 bg-palette-white text-palette-brown hover:border-palette-olive/60'">
                    <input v-model="form.variantOption" type="radio" value="cold" class="w-4 h-4 text-palette-sage focus:ring-palette-sage" />
                    <span class="text-sm font-medium">Cold only</span>
                  </label>
                  <label class="inline-flex items-center gap-2 px-3 py-2.5 rounded-workflow border cursor-pointer transition-colors min-h-[42px] shrink-0" :class="form.variantOption === 'both' ? 'border-palette-sage bg-palette-sage/10 text-palette-brown' : 'border-palette-olive/40 bg-palette-white text-palette-brown hover:border-palette-olive/60'">
                    <input v-model="form.variantOption" type="radio" value="both" class="w-4 h-4 text-palette-sage focus:ring-palette-sage" />
                    <span class="text-sm font-medium">Both</span>
                  </label>
                </div>
              </div>
              <div class="flex items-center gap-2 min-h-[42px]">
                <input id="available" v-model="form.available" type="checkbox" class="w-4 h-4 rounded border-palette-olive/50 text-palette-sage focus:ring-palette-sage" />
                <label for="available" class="text-sm text-palette-brown">Available</label>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px] transition-colors" @click="showExitConfirm = true">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] transition-all hover:bg-palette-olive">{{ showEditModal ? 'Save' : 'Add Item' }}</button>
              </div>
            </form>
        </div>
      </div>
    </Teleport>

    <!-- Exit without saving confirmation -->
    <Teleport to="body">
      <div v-if="showExitConfirm" class="fixed inset-0 z-[55] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="showExitConfirm = false">
        <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 modal-fixed-width">
          <p class="text-palette-brown font-medium mb-4">Are you sure you want to exit? Changes won't be saved.</p>
          <div class="flex gap-3">
            <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px]" @click="showExitConfirm = false">Cancel</button>
            <button type="button" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] hover:bg-palette-olive" @click="confirmExitWithoutSave">Exit</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add/Edit confirmation modal -->
    <Teleport to="body">
      <div v-if="showAddEditConfirm" class="fixed inset-0 z-[55] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="showAddEditConfirm = false">
        <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 modal-fixed-width">
          <p class="text-palette-brown font-medium mb-4">{{ addEditConfirmMessage }}</p>
          <div class="flex gap-3">
            <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px]" @click="showAddEditConfirm = false">Cancel</button>
            <button type="button" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] hover:bg-palette-olive" @click="doConfirmAddOrSave">Confirm</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success alert modal -->
    <Teleport to="body">
      <div v-if="successAlert.show" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="successAlert.show = false">
        <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-palette-sage/20 text-palette-sage flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p class="font-semibold text-palette-brown">{{ successAlert.title }}</p>
          <p class="text-sm text-palette-brown/80 mt-1">{{ successAlert.message }}</p>
          <button type="button" class="mt-4 px-6 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="successAlert.show = false">OK</button>
        </div>
      </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50"
        @click.self="deleteTarget = null"
      >
        <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6">
          <p class="text-palette-brown font-medium mb-4 text-sm sm:text-base">Delete "{{ deleteTarget?.productName }}"? This cannot be undone.</p>
          <div class="flex gap-3">
            <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px] transition-colors" @click="deleteTarget = null">Cancel</button>
            <button type="button" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-workflow hover:bg-red-700 min-h-[42px] transition-opacity hover:opacity-95" @click="doDelete">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminMenuItemRow } from '~/composables/useAdminMenu'

definePageMeta({ layout: 'admin' })

const { flatItems, categoryOptions, addItem, removeAddedItem, updateAddedItem, updateBaseItem, deleteBaseItem } = useAdminMenu()

const PAGE_SIZE = 10
const filterCategory = ref('')
const filterStatus = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editRow = ref<AdminMenuItemRow | null>(null)
const viewDetailRow = ref<AdminMenuItemRow | null>(null)
const deleteTarget = ref<AdminMenuItemRow | null>(null)
const successAlert = ref<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' })

type VariantOption = 'hot' | 'cold' | 'both'

function variantOptionToVariants(opt: VariantOption): string[] {
  if (opt === 'hot') return ['hot']
  if (opt === 'cold') return ['iced']
  return ['hot', 'iced']
}

function variantsToVariantOption(variants: string[] | undefined): VariantOption {
  if (!variants?.length) return 'both'
  const hasHot = variants.includes('hot')
  const hasIced = variants.includes('iced')
  if (hasHot && hasIced) return 'both'
  if (hasHot) return 'hot'
  if (hasIced) return 'cold'
  return 'both'
}

const form = reactive({
  name: '',
  category: '',
  price: 0,
  description: '',
  image: '',
  available: true,
  variantOption: 'both' as VariantOption,
})

const showAddEditConfirm = ref(false)
const addEditConfirmMessage = ref('')
const pendingConfirmAction = ref<'add' | 'edit' | null>(null)
const showExitConfirm = ref(false)

function confirmSubmitAdd() {
  addEditConfirmMessage.value = 'Are you sure you want to add this item?'
  pendingConfirmAction.value = 'add'
  showAddEditConfirm.value = true
}

function confirmSaveEdit() {
  addEditConfirmMessage.value = 'Are you sure you want to save changes?'
  pendingConfirmAction.value = 'edit'
  showAddEditConfirm.value = true
}

function doConfirmAddOrSave() {
  if (pendingConfirmAction.value === 'add') submitAdd()
  else if (pendingConfirmAction.value === 'edit') saveEdit()
  showAddEditConfirm.value = false
  pendingConfirmAction.value = null
}

function confirmExitWithoutSave() {
  showExitConfirm.value = false
  closeModals()
}

const filteredRows = computed(() => {
  let list = flatItems.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter((r) => r.productName.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || String(r.id).toLowerCase().includes(q))
  if (filterCategory.value) list = list.filter((r) => r.category === filterCategory.value)
  if (filterStatus.value) list = list.filter((r) => r.status === filterStatus.value)
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / PAGE_SIZE)))
const paginatedRows = computed(() => {
  const list = filteredRows.value
  const start = (currentPage.value - 1) * PAGE_SIZE
  return list.slice(start, start + PAGE_SIZE)
})
const showingFrom = computed(() => (filteredRows.value.length === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1))
const showingTo = computed(() => Math.min(currentPage.value * PAGE_SIZE, filteredRows.value.length))

const tableContainerRef = ref<HTMLElement | null>(null)
watch([filterCategory, filterStatus, searchQuery], () => { currentPage.value = 1 })
watch(currentPage, () => {
  nextTick(() => {
    tableContainerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

function resetFilters() {
  filterCategory.value = ''
  filterStatus.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

function variantLabel(variants: string[] | undefined): string {
  if (!variants?.length) return 'Both'
  if (variants.includes('hot') && variants.includes('iced')) return 'Both'
  if (variants.includes('hot')) return 'Hot only'
  if (variants.includes('iced')) return 'Cold only'
  return 'Both'
}

function openViewModal(row: AdminMenuItemRow) {
  viewDetailRow.value = row
}

function openEditModal(row: AdminMenuItemRow) {
  editRow.value = row
  form.name = row.raw.name
  form.category = row.category
  form.price = row.raw.price
  form.description = row.raw.description ?? ''
  form.image = row.raw.image
  form.available = row.raw.available
  form.variantOption = variantsToVariantOption(row.raw.variants)
  showEditModal.value = true
}

function closeModals() {
  showAddModal.value = false
  showEditModal.value = false
  editRow.value = null
  form.name = ''
  form.category = ''
  form.price = 0
  form.description = ''
  form.image = ''
  form.available = true
  form.variantOption = 'both'
}

function submitAdd() {
  const addedName = form.name
  addItem({
    name: form.name,
    category: form.category,
    price: form.price,
    description: form.description || undefined,
    image: form.image || undefined,
    available: form.available,
    variants: variantOptionToVariants(form.variantOption),
  })
  closeModals()
  successAlert.value = { show: true, title: 'Item added', message: `"${addedName}" has been added to the menu.` }
  useActivityLog().log('Menu item added', addedName)
}

function saveEdit() {
  if (!editRow.value) return
  const updatedName = form.name
  if (editRow.value.isAdminAdded) {
    updateAddedItem(editRow.value.id, {
      name: form.name,
      category: form.category,
      price: form.price,
      description: form.description,
      image: form.image,
      available: form.available,
      variants: variantOptionToVariants(form.variantOption),
    })
  } else {
    updateBaseItem(editRow.value.raw.id as number, {
      name: form.name,
      category: form.category,
      price: form.price,
      description: form.description,
      image: form.image,
      available: form.available,
      variants: variantOptionToVariants(form.variantOption),
    })
  }
  closeModals()
  successAlert.value = { show: true, title: 'Changes saved', message: `"${updatedName}" has been updated.` }
  useActivityLog().log('Menu item updated', updatedName)
}

function confirmDelete(row: AdminMenuItemRow) {
  deleteTarget.value = row
}

function doDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.productName
  if (deleteTarget.value.isAdminAdded) {
    removeAddedItem(deleteTarget.value.id)
  } else {
    deleteBaseItem(deleteTarget.value.raw.id as number)
  }
  deleteTarget.value = null
  useActivityLog().log('Menu item deleted', name)
}
</script>

<style scoped>
.modal-fixed-width {
  width: 100%;
  max-width: 28rem;
  min-width: 20rem;
}
.admin-table-body {
  min-height: 520px;
}
.toast-enter-active,
.toast-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
.animate-shrink {
  animation: shrink linear forwards;
  transform-origin: left;
}
</style>
