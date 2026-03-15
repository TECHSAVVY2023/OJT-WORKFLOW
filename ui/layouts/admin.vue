<template>
  <div class="min-h-screen flex antialiased font-poppins bg-palette-cream">
    <!-- Mobile header: only on small screens -->
    <header class="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-palette-sage text-palette-cream shadow-md">
      <button
        type="button"
        class="p-2 -ml-2 rounded-lg hover:bg-palette-cream/15 transition-colors"
        aria-label="Open menu"
        @click="sidebarOpen = true"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="font-heading font-semibold text-sm uppercase tracking-wide">Admin</span>
    </header>

    <!-- Backdrop: when sidebar open on mobile -->
    <div
      class="fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden"
      :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar: drawer on mobile, fixed on desktop -->
    <aside
      class="fixed inset-y-0 left-0 z-30 w-56 flex flex-col text-palette-cream bg-palette-sage shadow-xl transition-transform duration-300 ease-out md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between gap-2 px-4 py-5 border-b border-palette-cream/20 md:px-6">
        <NuxtLink to="/admin" class="flex items-center gap-2 min-w-0" @click="sidebarOpen = false">
          <img
            v-if="adminData.sidebar.logoImage"
            :src="adminData.sidebar.logoImage"
            :alt="adminData.sidebar.logoAlt"
            class="w-8 h-8 object-contain"
          />
          <span v-else class="w-8 h-8 rounded flex items-center justify-center bg-palette-cream/20" aria-hidden="true">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 18V6l4 6 4-6v12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="font-heading font-semibold text-sm uppercase tracking-wide">WORKFLOW</span>
        </NuxtLink>
        <button
          type="button"
          class="md:hidden p-2 -mr-2 rounded-lg hover:bg-palette-cream/15 transition-colors"
          aria-label="Close menu"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p class="px-6 py-2 text-xs font-medium text-palette-cream/80 uppercase tracking-wider border-b border-palette-cream/20">
        Admin
      </p>
      <nav class="flex-1 py-4 px-3 overflow-y-auto">
        <NuxtLink
          v-for="item in navWithLogs"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-workflow text-sm font-medium transition-colors mb-0.5 border-l-4 border-transparent"
          :class="isActive(item.path) ? 'bg-palette-cream/15 border-palette-cream text-palette-white' : 'hover:bg-palette-cream/10'"
          @click="sidebarOpen = false"
        >
          <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center" aria-hidden="true">
            <!-- Dashboard / Home -->
            <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <!-- Site Content / Document -->
            <svg v-else-if="item.icon === 'content'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <!-- Menu / Grid -->
            <svg v-else-if="item.icon === 'menu'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <!-- Categories / Tag -->
            <svg v-else-if="item.icon === 'categories'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <!-- Venue / Location -->
            <svg v-else-if="item.icon === 'venue'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <!-- Bookings / Calendar -->
            <svg v-else-if="item.icon === 'bookings'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <!-- Announcements / Megaphone -->
            <svg v-else-if="item.icon === 'announcements'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <!-- Community says / Chat quote -->
            <svg v-else-if="item.icon === 'community'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <!-- Logs -->
            <svg v-else-if="item.icon === 'logs'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span v-else class="w-5 h-5 rounded bg-white/30" />
          </span>
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="border-t border-palette-cream/20 p-3">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-workflow text-sm font-medium text-palette-cream/90 hover:bg-palette-cream/10 hover:text-palette-white transition-colors"
          @click="onLogout"
        >
          <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center" aria-hidden="true">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </span>
          Logout
        </button>
      </div>
    </aside>
    <!-- Main content: full width on mobile (below header), offset by sidebar on desktop -->
    <main class="flex-1 min-w-0 pt-14 md:pt-0 md:ml-56 bg-palette-cream admin-main">
      <slot />
    </main>

    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Logout?"
      message="Are you sure you want to logout?"
      confirm-label="Yes, logout"
      cancel-label="Cancel"
      @confirm="doLogout"
    />
  </div>
</template>

<script setup lang="ts">
import adminDashboardData from '~/data/admin-dashboard.json'

const adminData = adminDashboardData as {
  sidebar: { logoImage: string; logoAlt: string; brandText: string }
  nav: Array<{ label: string; path: string; icon: string }>
}

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const sidebarOpen = ref(false)
const showLogoutConfirm = ref(false)

// Prefetch community-reviews (all scopes) so Community says page shows pending/approved etc. immediately
  useFetch('/api/community-reviews?scope=all', { key: 'admin-community-reviews' })

const navWithLogs = computed(() => [...adminData.nav, { label: 'Logs', path: '/admin/logs', icon: 'logs' }])

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

function onLogout() {
  showLogoutConfirm.value = true
}

function doLogout() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-main {
  scrollbar-gutter: stable;
}
</style>
