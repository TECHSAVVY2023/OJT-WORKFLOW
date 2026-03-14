<template>
  <div class="min-h-full bg-palette-cream/40">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-palette-brown">Venue</h1>
        <p class="mt-1 text-sm text-palette-brown/70">Manage spaces, capacity, and availability.</p>
      </div>
    </header>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Search, filter and action bar -->
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by name or ID..."
          class="min-w-[200px] flex-1 max-w-xs px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]"
        />
        <div class="relative inline-block min-w-[120px] sm:min-w-[140px]">
          <select
            v-model="filterStatus"
            class="w-full min-w-[120px] sm:min-w-[140px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px] appearance-none"
          >
            <option value="">Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <button
            v-if="filterStatus"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
            aria-label="Clear status filter"
            @click="filterStatus = ''"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <button
        type="button"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] transition-all hover:bg-palette-olive"
        @click="showAddModal = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Add Venue
      </button>
    </div>

    <div ref="tableContainerRef" class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
      <div class="overflow-x-auto -mx-px">
        <table class="min-w-[640px] w-full divide-y divide-palette-olive/20">
          <thead class="bg-palette-olive/15">
            <tr>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Venue ID</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Venue Name</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Capacity</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Price per Hour</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider hidden md:table-cell">Created</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider hidden md:table-cell">Updated</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Status</th>
              <th scope="col" class="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-palette-white divide-y divide-palette-olive/15 admin-table-body">
            <tr v-if="filteredRows.length === 0">
              <td colspan="8" class="px-3 sm:px-4 lg:px-6 py-12 sm:py-16 text-center text-palette-brown/80 text-sm font-medium">
                No venues to show.
              </td>
            </tr>
            <tr v-for="row in paginatedRows" :key="row.venueId" class="hover:bg-palette-cream/50 transition-colors">
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-palette-dark">{{ row.venueId }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-sm text-palette-dark">{{ row.name }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-palette-brown">{{ row.capacity }}</td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-palette-dark">₱{{ row.pricePerHour }}</td>
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
          <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">Venue details</h2>
          <template v-if="venueDetailImages.length">
            <div class="mb-4 space-y-3">
              <p class="text-sm font-medium text-palette-brown/80">Photos</p>
              <div v-for="(img, idx) in venueDetailImages" :key="idx" class="rounded-xl overflow-hidden bg-palette-white border border-palette-olive/20 flex items-center justify-center min-h-[200px] max-h-[320px]">
                <img :src="img" alt="Venue" class="w-full max-h-[320px] object-contain" />
              </div>
            </div>
          </template>
          <dl class="grid grid-cols-1 gap-0 text-sm">
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Venue ID</dt><dd class="text-palette-dark">{{ viewDetailRow?.venueId }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Name</dt><dd class="text-palette-dark">{{ viewDetailRow?.name }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Capacity</dt><dd class="text-palette-dark">{{ viewDetailRow?.capacity }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Price per hour</dt><dd class="text-palette-dark">₱{{ viewDetailRow?.pricePerHour }}</dd></div>
            <div v-if="(viewDetailRow?.raw as { description?: string })?.description" class="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Description</dt><dd class="text-palette-dark">{{ (viewDetailRow?.raw as { description?: string }).description }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Status</dt><dd><span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" :class="viewDetailRow?.status === 'Available' ? 'bg-palette-sage/90 text-palette-white' : 'bg-palette-grey text-palette-brown'">{{ viewDetailRow?.status }}</span></dd></div>
          </dl>
          <div class="mt-6">
            <button type="button" class="w-full px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="viewDetailRow = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add / Edit Venue modal -->
    <Teleport to="body">
      <div
        v-if="showAddModal || showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50"
        @click.self="closeModals"
      >
        <div class="bg-palette-cream border-2 border-palette-olive/40 rounded-workflow-lg shadow-xl w-full max-w-md min-w-[320px] max-h-[90vh] overflow-y-auto flex flex-col p-6 modal-fixed-width">
          <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">{{ showEditModal ? 'Edit Venue' : 'Add Venue' }}</h2>
          <form class="space-y-4" @submit.prevent="showEditModal ? confirmSaveEdit() : confirmSubmitAdd()">
              <div>
                <label for="venue-name" class="block text-sm font-medium text-palette-brown mb-1.5">Venue Name</label>
                <input id="venue-name" v-model="form.name" type="text" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="e.g. Workflow" />
              </div>
              <div>
                <label for="venue-description" class="block text-sm font-medium text-palette-brown mb-1.5">Description</label>
                <textarea id="venue-description" v-model="form.description" rows="3" class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage resize-none" placeholder="Describe the venue..."></textarea>
              </div>
              <div>
                <label for="venue-capacity" class="block text-sm font-medium text-palette-brown mb-1.5">Capacity (count)</label>
                <input id="venue-capacity" v-model.number="form.capacity" type="number" min="1" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="40" />
              </div>
              <div>
                <label for="venue-price" class="block text-sm font-medium text-palette-brown mb-1.5">Price per Hour (₱)</label>
                <input id="venue-price" v-model.number="form.hourlyRate" type="number" min="0" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="200" />
              </div>
              <div>
                <label for="venue-hours" class="block text-sm font-medium text-palette-brown mb-1.5">Operating Hours</label>
                <input id="venue-hours" v-model="form.operatingHours" type="text" class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="e.g. 8:00 AM - 10:00 PM" />
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1.5">Photos</label>
                <AdminImageUploadList :model-value="venueImagesForList" @update:model-value="(v) => (form.images = v)" />
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1.5">Amenities</label>
                <p class="text-xs text-palette-olive mb-2">Type an amenity and press Enter to add. Click × to remove.</p>
                <div class="flex flex-wrap items-center gap-2 p-2 border border-palette-olive/40 rounded-workflow bg-palette-white min-h-[42px] focus-within:ring-2 focus-within:ring-palette-sage/40 focus-within:border-palette-sage">
                  <span
                    v-for="(amenity, idx) in form.amenities"
                    :key="idx"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-workflow bg-palette-sage/15 text-palette-brown text-sm"
                  >
                    {{ amenity }}
                    <button type="button" class="ml-0.5 text-palette-brown/70 hover:text-red-600 focus:outline-none" aria-label="Remove" @click="removeAmenity(idx)">&times;</button>
                  </span>
                  <input
                    v-model="amenityInput"
                    type="text"
                    class="flex-1 min-w-[120px] py-1 px-0 border-0 bg-transparent text-palette-brown text-sm placeholder-palette-brown/50 focus:ring-0 focus:outline-none"
                    placeholder="Type and press Enter..."
                    :list="venueAmenities.length ? 'venue-amenities-list' : undefined"
                    @keydown.enter.prevent="addAmenityFromInput"
                  />
                </div>
                <datalist v-if="venueAmenities.length" id="venue-amenities-list">
                  <option v-for="opt in venueAmenities" :key="opt" :value="opt" />
                </datalist>
              </div>
              <div class="flex items-center gap-2 min-h-[42px]">
                <input id="venue-available" v-model="form.available" type="checkbox" class="w-4 h-4 rounded border-palette-olive/50 text-palette-sage focus:ring-palette-sage" />
                <label for="venue-available" class="text-sm text-palette-brown">Available</label>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px] transition-colors" @click="showExitConfirm = true">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] transition-all hover:bg-palette-olive">{{ showEditModal ? 'Save' : 'Add Venue' }}</button>
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
          <p class="text-palette-brown font-medium mb-4 text-sm sm:text-base">Delete "{{ deleteTarget?.name }}"? This cannot be undone.</p>
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
import type { AdminVenueRow } from '~/composables/useAdminVenues'
import adminDashboardData from '~/data/admin-dashboard.json'

definePageMeta({ layout: 'admin' })

const adminData = adminDashboardData as { venueAmenities?: string[] }
const venueAmenities = adminData.venueAmenities ?? []

const PAGE_SIZE = 10
const { flatRows, addVenue, removeAddedVenue, updateAddedVenue, updateBaseVenue, deleteBaseVenue } = useAdminVenues()

const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editRow = ref<AdminVenueRow | null>(null)
const viewDetailRow = ref<AdminVenueRow | null>(null)
const deleteTarget = ref<AdminVenueRow | null>(null)
const successAlert = ref<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' })
const tableContainerRef = ref<HTMLElement | null>(null)
const showAddEditConfirm = ref(false)
const addEditConfirmMessage = ref('')
const pendingConfirmAction = ref<'add' | 'edit' | null>(null)
const showExitConfirm = ref(false)
const amenityInput = ref('')

function confirmSubmitAdd() {
  addEditConfirmMessage.value = 'Are you sure you want to add this venue?'
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

const venueDetailImages = computed(() => {
  const raw = viewDetailRow.value?.raw as { images?: string[]; image?: string } | undefined
  if (!raw) return []
  const list = raw.images?.length ? raw.images : (raw.image ? [raw.image] : [])
  return [...new Set(list)]
})

const filteredRows = computed(() => {
  let list = flatRows.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter((r) => r.name.toLowerCase().includes(q) || String(r.venueId).toLowerCase().includes(q))
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

watch([filterStatus, searchQuery], () => { currentPage.value = 1 })
watch(currentPage, () => {
  nextTick(() => {
    tableContainerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

const form = reactive({
  name: '',
  description: '',
  capacity: 0,
  hourlyRate: 0,
  operatingHours: '',
  available: true,
  images: [] as string[],
  amenities: [] as string[],
})

/** Dedupe images by path so we never show two previews for the same image */
function dedupeImagesByPath(list: string[]): string[] {
  const pathKey = (u: string) => {
    const t = (u || '').trim()
    if (!t) return ''
    try {
      return new URL(t, 'http://x').pathname.toLowerCase()
    } catch {
      return t.toLowerCase()
    }
  }
  const seen = new Set<string>()
  return list.filter((u) => {
    const key = pathKey(u)
    if (!key) return false
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const venueImagesForList = computed(() => dedupeImagesByPath(form.images))

function addAmenityFromInput() {
  const val = amenityInput.value.trim()
  if (!val || form.amenities.includes(val)) return
  form.amenities.push(val)
  amenityInput.value = ''
}

function removeAmenity(index: number) {
  form.amenities.splice(index, 1)
}

function resetFilters() {
  searchQuery.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

function openViewModal(row: AdminVenueRow) {
  viewDetailRow.value = row
}

function openEditModal(row: AdminVenueRow) {
  editRow.value = row
  form.name = row.name
  form.description = (row.raw as { description?: string }).description ?? ''
  form.capacity = row.capacity
  form.hourlyRate = row.pricePerHour
  form.operatingHours = (row.raw as { operatingHours?: string }).operatingHours ?? ''
  form.available = row.status === 'Available'
  const raw = row.raw as { images?: string[]; image?: string; amenities?: string[] }
  const imageList = raw.images?.length ? raw.images : (raw.image ? [raw.image] : [])
  form.images = dedupeImagesByPath(imageList)
  form.amenities = (raw.amenities ?? []).length ? [...(raw.amenities ?? [])] : []
  showEditModal.value = true
}

function closeModals() {
  showAddModal.value = false
  showEditModal.value = false
  showExitConfirm.value = false
  editRow.value = null
  amenityInput.value = ''
  form.name = ''
  form.description = ''
  form.capacity = 0
  form.hourlyRate = 0
  form.operatingHours = ''
  form.available = true
  form.images = []
  form.amenities = []
}

function submitAdd() {
  const addedName = form.name
  addVenue({
    name: form.name,
    description: form.description || undefined,
    capacity: form.capacity,
    hourlyRate: form.hourlyRate,
    operatingHours: form.operatingHours || undefined,
    available: form.available,
    images: form.images.length ? form.images : undefined,
    amenities: form.amenities.length ? form.amenities : undefined,
  })
  closeModals()
  successAlert.value = { show: true, title: 'Venue added', message: `"${addedName}" has been added.` }
  useActivityLog().log('Venue added', addedName)
}

function saveEdit() {
  if (!editRow.value) return
  const updatedName = form.name
  const updates = {
    name: form.name,
    description: form.description || undefined,
    capacity: form.capacity,
    hourlyRate: form.hourlyRate,
    operatingHours: form.operatingHours || undefined,
    available: form.available,
    images: form.images.length ? form.images : undefined,
    amenities: form.amenities.length ? form.amenities : undefined,
  }
  if (editRow.value.isAdminAdded) {
    updateAddedVenue(editRow.value.venueId, updates)
  } else {
    updateBaseVenue(editRow.value.raw.id as number, {
      ...updates,
      capacityNum: form.capacity,
    })
  }
  closeModals()
  successAlert.value = { show: true, title: 'Changes saved', message: `"${updatedName}" has been updated.` }
  useActivityLog().log('Venue updated', updatedName)
}

function confirmDelete(row: AdminVenueRow) {
  deleteTarget.value = row
}

function doDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  if (deleteTarget.value.isAdminAdded) {
    removeAddedVenue(deleteTarget.value.venueId)
  } else {
    deleteBaseVenue(deleteTarget.value.raw.id as number)
  }
  deleteTarget.value = null
  useActivityLog().log('Venue deleted', name)
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
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 0.5rem 0.75rem;
}

.amenity-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-family: inherit;
  font-weight: 500;
  text-align: left;
  border: 2px solid rgba(123, 117, 87, 0.4);
  border-radius: 9999px;
  background: rgba(255, 246, 239, 0.6);
  color: #59543e;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.amenity-pill:hover {
  background: rgba(123, 117, 87, 0.12);
  border-color: rgba(123, 117, 87, 0.55);
}

.amenity-pill:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #fff6ef, 0 0 0 4px #69ac7c;
}

.amenity-pill--selected {
  border-color: #69ac7c;
  background: #69ac7c;
  color: #fff6ef;
}

.amenity-pill--selected:hover {
  background: #5a9a6a;
  border-color: #5a9a6a;
}

.amenity-pill__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  min-width: 1.125rem;
  border-radius: 50%;
  transition: background 0.2s ease, border 0.2s ease;
}

.amenity-pill:not(.amenity-pill--selected) .amenity-pill__check {
  border: 2px solid rgba(123, 117, 87, 0.35);
  background: transparent;
}

.amenity-pill:not(.amenity-pill--selected) .amenity-pill__check svg {
  opacity: 0;
}

.amenity-pill--selected .amenity-pill__check {
  border: none;
  background: rgba(255, 246, 239, 0.35);
}

.amenity-pill--selected .amenity-pill__check svg {
  opacity: 1;
}

.amenity-pill__label {
  line-height: 1.2;
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
