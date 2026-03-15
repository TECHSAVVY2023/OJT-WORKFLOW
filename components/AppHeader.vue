<template>
  <header class="sticky top-0 z-50 bg-palette-sage font-poppins border-b border-palette-brown/20 shadow-sm lg:shadow-md">
    <nav class="relative container mx-auto px-3 sm:px-[55px] py-2.5 lg:py-4 flex items-center justify-between font-poppins">
      <NuxtLink to="/" class="flex items-center shrink-0 min-w-[2rem] h-7 lg:h-9" aria-label="Workflow Coworking Space Home">
        <img
          :src="siteData.footer.logo.image"
          alt="Workflow Coworking Space"
          class="h-7 w-auto max-h-7 lg:h-9 lg:max-h-9 object-contain"
        />
      </NuxtLink>

      <!-- Desktop nav (hidden on small screens) -->
      <div class="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8">
        <NuxtLink
          v-for="link in siteData.navigation.links"
          :key="link.to"
          :to="link.to"
          class="uppercase text-sm font-bold text-palette-white hover:opacity-90"
        >
          {{ link.text }}
        </NuxtLink>
      </div>

      <!-- Cart (Menu/Cart pages only) or Contact Us (rest) - desktop -->
      <div class="hidden lg:block">
        <NuxtLink
          v-if="showCartInNav"
          to="/cart"
          class="relative inline-flex items-center gap-2 rounded-full bg-palette-cream px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-palette-brown shadow-sm transition-opacity hover:opacity-90"
          style="background-color: #FFF6EF; color: #59543E;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          Cart
          <span v-if="itemCount > 0" class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-palette-brown text-palette-white text-xs font-bold">
            {{ itemCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          v-else
          :to="siteData.navigation.contactButton.to"
          class="inline-flex items-center gap-2 rounded-full bg-palette-cream px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-palette-brown shadow-sm transition-opacity hover:opacity-90"
          style="background-color: #FFF6EF; color: #59543E;"
        >
          {{ siteData.navigation.contactButton.text }}
        </NuxtLink>
      </div>

      <!-- Hamburger / Close (mobile): clean icon that animates to X -->
      <button
        type="button"
        class="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-palette-white hover:text-palette-white hover:bg-white/10 active:bg-white/15 transition-colors duration-200"
        aria-label="Toggle menu"
        aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="relative w-5 h-5 flex items-center justify-center">
          <!-- Hamburger lines (visible when closed) -->
          <span
            class="absolute flex flex-col justify-between w-5 h-4 transition-opacity duration-200"
            :class="isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'"
          >
            <span class="block h-0.5 w-full bg-current rounded-full" />
            <span class="block h-0.5 w-full bg-current rounded-full" />
            <span class="block h-0.5 w-full bg-current rounded-full" />
          </span>
          <!-- Close X (visible when open): two lines centered and rotated -->
          <span
            class="absolute w-5 h-5 flex items-center justify-center transition-opacity duration-200"
            :class="isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <span class="absolute w-5 h-0.5 bg-current rounded-full rotate-45" />
            <span class="absolute w-5 h-0.5 bg-current rounded-full -rotate-45" />
          </span>
        </span>
      </button>
    </nav>

    <!-- Mobile menu: slide-down with premium animation -->
    <Transition name="mobile-menu">
      <div
        v-show="isMenuOpen"
        class="lg:hidden absolute left-0 right-0 top-full overflow-hidden border-t border-white/15"
        style="background: linear-gradient(180deg, #5a9a6e 0%, #69AC7C 100%); box-shadow: 0 12px 40px -12px rgba(0,0,0,0.25);"
      >
        <div class="container mx-auto px-3 py-3 flex flex-col gap-0.5">
          <NuxtLink
            v-for="(link, i) in siteData.navigation.links"
            :key="link.to"
            :to="link.to"
            class="nav-mobile-link"
            :style="{ animationDelay: `${i * 40}ms` }"
            @click="closeMenu"
          >
            {{ link.text }}
          </NuxtLink>
          <NuxtLink
            v-if="showCartInNav"
            to="/cart"
            class="nav-mobile-link nav-mobile-cta nav-mobile-cart mt-2 pt-3 border-t border-white/15"
            :style="{ animationDelay: `${siteData.navigation.links.length * 40}ms` }"
            @click="closeMenu"
          >
            <span class="inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              Cart
            </span>
            <span v-if="itemCount > 0" class="ml-1 min-w-[1.125rem] h-4.5 px-1 inline-flex items-center justify-center rounded-full bg-palette-brown text-palette-white text-[10px] font-bold">
              {{ itemCount }}
            </span>
          </NuxtLink>
          <NuxtLink
            v-else
            :to="siteData.navigation.contactButton.to"
            class="nav-mobile-link nav-mobile-cta mt-2 pt-3 border-t border-white/15"
            :style="{ animationDelay: `${siteData.navigation.links.length * 40}ms` }"
            @click="closeMenu"
          >
            {{ siteData.navigation.contactButton.text }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { siteData } = useSiteData()
const { itemCount } = useCart()
const isMenuOpen = ref(false)

// Show Cart in nav only on Menu and Cart pages; rest show Contact Us
const showCartInNav = computed(() => {
  const path = route.path
  return path === '/menu' || path === '/cart'
})

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<style scoped>
.nav-mobile-link {
  @apply block py-2.5 px-3 uppercase text-xs font-semibold tracking-wider text-palette-white/95 rounded-lg transition-all duration-200 ease-out;
  letter-spacing: 0.08em;
}
.nav-mobile-link:hover {
  @apply text-palette-white bg-white/10;
}
.nav-mobile-cta {
  @apply font-bold text-palette-white;
}
.nav-mobile-cart {
  @apply flex flex-row items-center gap-2;
}
/* Premium slide-down with ease */
.mobile-menu-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.mobile-menu-enter-active .nav-mobile-link {
  animation: nav-link-fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}
@keyframes nav-link-fade-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
