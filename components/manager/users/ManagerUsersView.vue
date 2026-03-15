<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader title="Users" subtitle="Manage staff and manager accounts, roles, and access." />
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <label for="filter-role-users" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Role</label>
          <select
            id="filter-role-users"
            :model-value="state.filterRole"
            class="min-w-[140px] px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 min-h-[42px]"
            @change="state.setFilterRole(($event.target as HTMLSelectElement).value)"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-workflow bg-palette-sage text-palette-white text-sm font-semibold hover:opacity-90 transition-opacity min-h-[42px]"
          @click="state.openAdd()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add user
        </button>
      </div>

      <div class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
        <table class="min-w-full divide-y divide-palette-olive/20">
          <thead class="bg-palette-olive/15">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Name</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Email</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Role</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-palette-brown uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-palette-olive/15">
            <tr v-for="u in state.filteredUsers" :key="u.id" class="hover:bg-palette-cream/50">
              <td class="px-4 py-3 text-sm font-medium text-palette-dark">{{ u.name }}</td>
              <td class="px-4 py-3 text-sm text-palette-brown">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize" :class="state.roleBadgeClass(u.role)">{{ u.role }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="inline-flex items-center gap-0">
                  <button
                    type="button"
                    class="p-2 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Edit"
                    @click="state.openEdit(u)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="p-2 text-palette-olive hover:text-red-600 hover:bg-red-50 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Delete"
                    @click="state.confirmDelete(u)"
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

      <!-- Add/Edit modal -->
      <Teleport to="body">
        <div v-if="state.showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" @click.self="state.closeModal()">
          <div class="bg-palette-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">{{ state.editingId ? 'Edit user' : 'Add user' }}</h2>
            <form class="space-y-4" @submit.prevent="state.saveUser()">
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1">Name</label>
                <input v-model="state.form.name" type="text" required class="w-full px-4 py-2.5 border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40" placeholder="Full name" />
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1">Email</label>
                <input v-model="state.form.email" type="email" required :readonly="!!state.editingId" class="w-full px-4 py-2.5 border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 disabled:bg-palette-grey/30" placeholder="email@workflow.com" />
              </div>
              <div>
                <label class="block text-sm font-medium text-palette-brown mb-1">Role</label>
                <select v-model="state.form.role" required class="w-full px-4 py-2.5 border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40">
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div class="flex gap-2 pt-2">
                <button type="button" class="flex-1 py-2.5 rounded-workflow border border-palette-olive/40 text-palette-brown font-medium hover:bg-palette-cream/50" @click="state.closeModal()">Cancel</button>
                <button type="submit" class="flex-1 py-2.5 rounded-workflow bg-palette-sage text-palette-white font-semibold hover:opacity-90">Save</button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Delete confirm -->
      <Teleport to="body">
        <div v-if="state.userToDelete" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" @click.self="state.clearUserToDelete()">
          <div class="bg-palette-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <p class="text-palette-brown mb-4">Delete user <strong>{{ state.userToDelete.name }}</strong>? This cannot be undone.</p>
            <div class="flex gap-2">
              <button type="button" class="flex-1 py-2.5 rounded-workflow border border-palette-olive/40 text-palette-brown" @click="state.clearUserToDelete()">Cancel</button>
              <button type="button" class="flex-1 py-2.5 rounded-workflow bg-red-600 text-white font-semibold" @click="state.doDelete()">Delete</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { useManagerUsersPage } from '~/composables/useManagerUsersPage'

defineProps<{
  state: ReturnType<typeof useManagerUsersPage>
}>()
</script>
