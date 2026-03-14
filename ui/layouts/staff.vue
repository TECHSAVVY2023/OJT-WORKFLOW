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
      <span class="font-heading font-semibold text-sm uppercase tracking-wide">Staff</span>
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
        <NuxtLink to="/staff" class="flex items-center gap-2 min-w-0" @click="sidebarOpen = false">
          <img
            v-if="staffData.sidebar.logoImage"
            :src="staffData.sidebar.logoImage"
            :alt="staffData.sidebar.logoAlt"
            class="w-8 h-8 object-contain"
          />
          <span v-else class="w-8 h-8 rounded flex items-center justify-center bg-palette-cream/20" aria-hidden="true">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
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
        Staff
      </p>
      <nav class="flex-1 py-4 px-3">
        <NuxtLink
          v-for="item in staffNav"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-workflow text-sm font-medium transition-colors mb-0.5 border-l-4 border-transparent"
          :class="isActive(item.path) ? 'bg-palette-cream/15 border-palette-cream text-palette-white' : 'hover:bg-palette-cream/10'"
          @click="sidebarOpen = false"
        >
          <span class="w-5 h-5 flex-shrink-0 flex items-center justify-center" aria-hidden="true">
            <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-else-if="item.icon === 'scan'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <svg v-else-if="item.icon === 'manual'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <svg v-else-if="item.icon === 'history'" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    <main class="flex-1 min-w-0 pt-14 md:pt-0 md:ml-56 bg-palette-cream staff-main">
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
import staffDashboardData from '~/data/staff-dashboard.json'

const staffData = staffDashboardData as {
  sidebar: { logoImage: string; logoAlt: string; brandText: string }
  nav: Array<{ label: string; path: string; icon: string }>
}

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const sidebarOpen = ref(false)
const showLogoutConfirm = ref(false)

const staffNav = computed(() => [
  ...staffData.nav,
  { label: 'Orders', path: '/staff/orders', icon: 'history' },
])

function isActive(path: string) {
  if (path === '/staff') return route.path === '/staff'
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
.staff-main {
  scrollbar-gutter: stable;
}
</style>
