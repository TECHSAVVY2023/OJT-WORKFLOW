<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader title="Venue" subtitle="Manage spaces, capacity, and availability." size="large" />
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Search, filter and action bar -->
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <input
            :model-value="searchQuery"
            type="search"
            placeholder="Search by name or ID..."
            class="min-w-[200px] flex-1 max-w-xs px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]"
            @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          />
          <div class="relative inline-block min-w-[120px] sm:min-w-[140px]">
            <select
              :model-value="filterStatus"
              class="w-full min-w-[120px] sm:min-w-[140px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px] appearance-none"
              @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
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
              @click="emit('update:filterStatus', '')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <button
          type="button"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] transition-all hover:bg-palette-olive"
          @click="emit('update:showAddModal', true)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Venue
        </button>
      </div>

      <div :ref="tableContainerRef" class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
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
                    <button type="button" class="p-2 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="View details" @click="emit('openViewModal', row)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
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
        <AdminPagination
          :showing-from="showingFrom"
          :showing-to="showingTo"
          :total="filteredRows.length"
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev="emit('prev')"
          @next="emit('next')"
        />
      </div>

      <!-- View details modal (Close only, no Edit) -->
      <Teleport to="body">
        <div v-if="viewDetailRow" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50" @click.self="emit('update:viewDetailRow', null)">
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
              <button type="button" class="w-full px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="emit('update:viewDetailRow', null)">Close</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Add / Edit Venue modal -->
      <Teleport to="body">
        <div
          v-if="showAddModal || showEditModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50"
          @click.self="emit('closeModals')"
        >
          <div class="bg-palette-cream border-2 border-palette-olive/40 rounded-workflow-lg shadow-xl w-full max-w-md min-w-[320px] max-h-[90vh] overflow-y-auto flex flex-col p-6 modal-fixed-width">
            <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">{{ showEditModal ? 'Edit Venue' : 'Add Venue' }}</h2>
            <form class="space-y-4" @submit.prevent="showEditModal ? emit('confirmSaveEdit') : emit('confirmSubmitAdd')">
              <div>
                <label for="venue-name" class="block text-sm font-medium text-palette-brown mb-1.5">Venue Name</label>
                <input id="venue-name" :model-value="form.name" type="text" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="e.g. Workflow" @input="emit('update:form', { key: 'name', value: ($event.target as HTMLInputElement).value })" />
              </div>
              <div>
                <label for="venue-description" class="block text-sm font-medium text-palette-brown mb-1.5">Description</label>
                <textarea id="venue-description" :model-value="form.description" rows="3" class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage resize-none" placeholder="Describe the venue..." @input="emit('update:form', { key: 'description', value: ($event.target as HTMLTextAreaElement).value })" />
              </div>
              <div>
                <label for="venue-capacity" class="block text-sm font-medium text-palette-brown mb-1.5">Capacity (count)</label>
                <input id="venue-capacity" :model-value="form.capacity" type="number" min="1" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="40" @input="emit('update:form', { key: 'capacity', value: Number(($event.target as HTMLInputElement).value) })" />
              </div>
              <div>
                <label for="venue-price" class="block text-sm font-medium text-palette-brown mb-1.5">Price per Hour (₱)</label>
                <input id="venue-price" :model-value="form.hourlyRate" type="number" min="0" required class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="200" @input="emit('update:form', { key: 'hourlyRate', value: Number(($event.target as HTMLInputElement).value) })" />
              </div>
              <div>
                <label for="venue-hours" class="block text-sm font-medium text-palette-brown mb-1.5">Operating Hours</label>
                <input id="venue-hours" :model-value="form.operatingHours" type="text" class="w-full px-3 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]" placeholder="e.g. 8:00 AM - 10:00 PM" @input="emit('update:form', { key: 'operatingHours', value: ($event.target as HTMLInputElement).value })" />
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1.5">Photos</label>
                <AdminImageUploadList :model-value="venueImagesForList" @update:model-value="emit('update:form', { key: 'images', value: $event })" />
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
                    <button type="button" class="ml-0.5 text-palette-brown/70 hover:text-red-600 focus:outline-none" aria-label="Remove" @click="emit('removeAmenity', idx)">&times;</button>
                  </span>
                  <input
                    :model-value="amenityInput"
                    type="text"
                    class="flex-1 min-w-[120px] py-1 px-0 border-0 bg-transparent text-palette-brown text-sm placeholder-palette-brown/50 focus:ring-0 focus:outline-none"
                    placeholder="Type and press Enter..."
                    :list="venueAmenities.length ? 'venue-amenities-list' : undefined"
                    @input="emit('update:amenityInput', ($event.target as HTMLInputElement).value)"
                    @keydown.enter.prevent="emit('addAmenityFromInput')"
                  />
                </div>
                <datalist v-if="venueAmenities.length" id="venue-amenities-list">
                  <option v-for="opt in venueAmenities" :key="opt" :value="opt" />
                </datalist>
              </div>
              <div class="flex items-center gap-2 min-h-[42px]">
                <input id="venue-available" :checked="form.available" type="checkbox" class="w-4 h-4 rounded border-palette-olive/50 text-palette-sage focus:ring-palette-sage" @change="emit('update:form', { key: 'available', value: ($event.target as HTMLInputElement).checked })" />
                <label for="venue-available" class="text-sm text-palette-brown">Available</label>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px] transition-colors" @click="emit('update:showExitConfirm', true)">Cancel</button>
                <button type="submit" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] transition-all hover:bg-palette-olive">{{ showEditModal ? 'Save' : 'Add Venue' }}</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Exit without saving confirmation -->
      <Teleport to="body">
        <div v-if="showExitConfirm" class="fixed inset-0 z-[55] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="emit('update:showExitConfirm', false)">
          <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 modal-fixed-width">
            <p class="text-palette-brown font-medium mb-4">Are you sure you want to exit? Changes won't be saved.</p>
            <div class="flex gap-3">
              <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px]" @click="emit('update:showExitConfirm', false)">Cancel</button>
              <button type="button" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] hover:bg-palette-olive" @click="emit('confirmExitWithoutSave')">Exit</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Add/Edit confirmation modal -->
      <Teleport to="body">
        <div v-if="showAddEditConfirm" class="fixed inset-0 z-[55] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="emit('update:showAddEditConfirm', false)">
          <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 modal-fixed-width">
            <p class="text-palette-brown font-medium mb-4">{{ addEditConfirmMessage }}</p>
            <div class="flex gap-3">
              <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px]" @click="emit('update:showAddEditConfirm', false)">Cancel</button>
              <button type="button" class="flex-1 px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow min-h-[42px] hover:bg-palette-olive" @click="emit('doConfirmAddOrSave')">Confirm</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Success alert modal -->
      <Teleport to="body">
        <div v-if="successAlert.show" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="emit('closeSuccessAlert')">
          <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 text-center">
            <div class="w-12 h-12 rounded-full bg-palette-sage/20 text-palette-sage flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p class="font-semibold text-palette-brown">{{ successAlert.title }}</p>
            <p class="text-sm text-palette-brown/80 mt-1">{{ successAlert.message }}</p>
            <button type="button" class="mt-4 px-6 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="emit('closeSuccessAlert')">OK</button>
          </div>
        </div>
      </Teleport>

      <!-- Delete confirm -->
      <Teleport to="body">
        <div
          v-if="deleteTarget"
          class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50"
          @click.self="emit('update:deleteTarget', null)"
        >
          <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6">
            <p class="text-palette-brown font-medium mb-4 text-sm sm:text-base">Delete "{{ deleteTarget?.name }}"? This cannot be undone.</p>
            <div class="flex gap-3">
              <button type="button" class="flex-1 px-4 py-2.5 text-sm font-medium text-palette-brown bg-palette-olive/20 rounded-workflow hover:bg-palette-olive/30 min-h-[42px] transition-colors" @click="emit('update:deleteTarget', null)">Cancel</button>
              <button type="button" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-workflow hover:bg-red-700 min-h-[42px] transition-opacity hover:opacity-95" @click="emit('doDelete')">Delete</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  venueAmenities: string[]
  searchQuery: string
  filterStatus: string
  showAddModal: boolean
  showEditModal: boolean
  viewDetailRow: unknown
  deleteTarget: unknown
  successAlert: { show: boolean; title: string; message: string }
  tableContainerRef: unknown
  showAddEditConfirm: boolean
  addEditConfirmMessage: string
  showExitConfirm: boolean
  amenityInput: string
  form: Record<string, unknown>
  venueDetailImages: string[]
  venueImagesForList: unknown[]
  filteredRows: unknown[]
  paginatedRows: unknown[]
  showingFrom: number
  showingTo: number
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:showAddModal': [value: boolean]
  'update:showEditModal': [value: boolean]
  'update:viewDetailRow': [value: unknown]
  'update:deleteTarget': [value: unknown]
  'closeSuccessAlert': []
  'update:form': [payload: { key: string; value: unknown }]
  'update:showAddEditConfirm': [value: boolean]
  'update:showExitConfirm': [value: boolean]
  'update:amenityInput': [value: string]
  'addAmenityFromInput': []
  'removeAmenity': [idx: number]
  'confirmSubmitAdd': []
  'confirmSaveEdit': []
  'doConfirmAddOrSave': []
  'confirmExitWithoutSave': []
  'openViewModal': [row: unknown]
  'openEditModal': [row: unknown]
  'closeModals': []
  'confirmDelete': [row: unknown]
  'doDelete': []
  'prev': []
  'next': []
}>()
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
