<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader
      title="Activity Logs"
      :subtitle="subtitle"
      :size="headerSize"
    />
    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="relative inline-block min-w-[140px]">
          <select
            v-model="filterRole"
            class="w-full min-w-[140px] pl-3 pr-9 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 min-h-[42px] appearance-none"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
          <button
            v-if="filterRole"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
            aria-label="Clear role filter"
            @click="filterRole = ''"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown text-sm font-medium hover:bg-palette-cream/60 min-h-[42px] transition-colors"
          :disabled="filteredLogs.length === 0"
          @click="exportLogsCsv"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export
        </button>
      </div>
      <div class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-palette-olive/20">
            <thead class="bg-palette-olive/15">
              <tr>
                <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Time</th>
                <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Role</th>
                <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">User</th>
                <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Action</th>
                <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Details</th>
                <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider hidden sm:table-cell">Path</th>
              </tr>
            </thead>
            <tbody class="bg-palette-white divide-y divide-palette-olive/15">
              <tr v-if="filteredLogs.length === 0">
                <td colspan="6" class="px-3 sm:px-4 py-12 sm:py-16 text-center text-palette-brown/80 text-sm font-medium">No logs to show.</td>
              </tr>
              <tr v-for="entry in paginatedLogs" :key="entry.id" class="hover:bg-palette-cream/50 transition-colors">
                <td class="px-3 sm:px-4 py-3 text-sm text-palette-brown whitespace-nowrap">{{ formatTime(entry.createdAt) }}</td>
                <td class="px-3 sm:px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize" :class="roleClass(entry.userRole)">{{ entry.userRole }}</span>
                </td>
                <td class="px-3 sm:px-4 py-3 text-sm">
                  <p class="font-medium text-palette-dark">{{ entry.userName }}</p>
                  <p class="text-palette-brown/80 text-xs truncate max-w-[180px]">{{ entry.userEmail }}</p>
                </td>
                <td class="px-3 sm:px-4 py-3 text-sm font-medium text-palette-dark">{{ entry.action }}</td>
                <td class="px-3 sm:px-4 py-3 text-sm text-palette-brown max-w-[200px] truncate" :title="entry.details">{{ entry.details ?? '—' }}</td>
                <td class="px-3 sm:px-4 py-3 text-xs text-palette-brown/70 hidden sm:table-cell">{{ entry.path ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-4 sm:px-6 py-3 bg-palette-olive/10 border-t border-palette-olive/20 flex flex-wrap items-center justify-between gap-2 text-sm text-palette-brown">
          <span>Showing {{ pageStart }}-{{ pageEnd }} of {{ filteredLogs.length }}</span>
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
      <p v-if="!entries.length" class="text-center py-12 text-palette-brown/80 text-sm">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~/composables/useAuth'

withDefaults(
  defineProps<{ subtitle?: string; headerSize?: 'default' | 'large'; emptyMessage?: string }>(),
  { subtitle: 'Recent actions by admin, staff, and manager.', headerSize: 'default', emptyMessage: 'No activity logged yet.' }
)

const PAGE_SIZE = 10
const { entries, refreshFromStorage } = useActivityLog()
const filterRole = ref('')
const currentPage = ref(1)

onMounted(() => { refreshFromStorage() })

const filteredLogs = computed(() => {
  const list = entries.value
  if (!filterRole.value) return list
  return list.filter((e) => e.userRole === filterRole.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / PAGE_SIZE)))
const paginatedLogs = computed(() => {
  const list = filteredLogs.value
  const start = (currentPage.value - 1) * PAGE_SIZE
  return list.slice(start, start + PAGE_SIZE)
})
const pageStart = computed(() => (filteredLogs.value.length === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1))
const pageEnd = computed(() => Math.min(currentPage.value * PAGE_SIZE, filteredLogs.value.length))

watch(filterRole, () => { currentPage.value = 1 })

function formatTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function roleClass(role: UserRole): string {
  switch (role) {
    case 'admin': return 'bg-palette-sage/90 text-palette-white'
    case 'staff': return 'bg-palette-olive/80 text-palette-cream'
    case 'manager': return 'bg-amber-100 text-amber-800'
    default: return 'bg-palette-grey text-palette-brown'
  }
}

function escapeCsvCell(val: string): string {
  if (val == null || val === '') return '""'
  const s = String(val)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function exportLogsCsv() {
  const list = filteredLogs.value
  if (list.length === 0) return
  const headers = ['Time', 'Role', 'User', 'Email', 'Action', 'Details', 'Path']
  const rows = list.map((e) => [formatTime(e.createdAt), e.userRole ?? '', e.userName ?? '', e.userEmail ?? '', e.action ?? '', e.details ?? '', e.path ?? ''])
  const csv = [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
