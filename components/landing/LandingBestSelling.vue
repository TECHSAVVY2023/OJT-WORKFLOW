<template>
  <section id="best-selling" class="section-block py-20 md:py-24 bg-white scroll-mt-20">
    <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
      <div class="text-center mb-10 md:mb-12">
        <h2
          class="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
          :style="{ fontFamily: siteData.bestSellingItems.titleFontFamily || 'Poppins', color: siteData.bestSellingItems.titleColor || '#1a1a1a' }"
        >
          {{ siteData.bestSellingItems.title.prefix }}
          <span :style="{ color: siteData.bestSellingItems.titleHighlightColor || '#3AFF86' }">{{ siteData.bestSellingItems.title.highlight }}</span>
          {{ siteData.bestSellingItems.title.suffix }}
        </h2>
      </div>
      <p
        class="text-base leading-relaxed max-w-4xl mx-auto text-justify mb-10 md:mb-12 px-4 md:px-6"
        :style="{ fontFamily: siteData.bestSellingItems.descriptionFontFamily || 'Poppins', color: siteData.bestSellingItems.descriptionColor || '#374151', textIndent: '2em' }"
      >{{ siteData.bestSellingItems.description }}</p>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 md:mb-20 max-w-6xl mx-auto px-4 md:px-6">
        <MenuCard v-for="item in bestSellingMenuItems" :key="item.id" :item="item" @added-to-cart="onAddedToCart" />
      </div>
      <Teleport to="body">
        <div v-if="showAddedToCartModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 font-poppins" @click.self="showAddedToCartModal = false">
          <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center" @click.stop>
            <p class="text-gray-800 font-medium mb-6">
              {{ addedToCartItemName ? `"${addedToCartItemName}" has been added to your cart.` : 'Item has been added to your cart.' }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button type="button" class="inline-flex items-center justify-center min-w-[140px] py-2.5 px-5 rounded-full font-semibold text-sm border-2 transition-colors" style="border-color: #7B7557; color: #7B7557" @click="showAddedToCartModal = false">
                Done
              </button>
              <NuxtLink to="/cart" class="inline-flex items-center justify-center min-w-[140px] py-2.5 px-5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90" style="background-color: #7B7557" @click="showAddedToCartModal = false">
                View Cart
              </NuxtLink>
            </div>
          </div>
        </div>
      </Teleport>
      <div class="text-center mt-8 md:mt-12 flex justify-center">
        <NuxtLink
          to="/menu"
          class="best-selling-view-menu-link inline-flex items-center justify-center min-w-[160px] font-bold text-sm px-5 py-2.5 rounded-full uppercase tracking-wide transition-opacity hover:opacity-90"
          :style="bestSellingButtonStyle"
          @mouseover="bestSellingButtonMouseOver"
          @mouseleave="bestSellingButtonMouseLeave"
        >{{ siteData.bestSellingItems.viewMenuButton.text }}</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import menuJson from '~/data/menu.json'

interface MenuItem {
  id: number
  name: string
  price: number
  image: string
  available: boolean
  description?: string
  variants?: string[]
}

interface MenuCategory {
  category: string
  items: MenuItem[]
}

const { siteData } = useSiteData()
const menuData = menuJson as MenuCategory[]

const bestSellingButtonStyle = computed(() => {
  const b = siteData.bestSellingItems
  const font = b.buttonFontFamily || 'Poppins'
  const color = b.buttonTextColor || '#ffffff'
  if (b.buttonStyle === 'gradient') {
    const dir = b.buttonGradientDirection || 'to right'
    const c1 = b.buttonGradientColor1 || '#7B7557'
    const c2 = b.buttonGradientColor2 || '#605B45'
    return { fontFamily: font, color, background: `linear-gradient(${dir}, ${c1}, ${c2})`, backgroundColor: '' }
  }
  return { fontFamily: font, color, background: '', backgroundColor: b.buttonColor || '#7B7557' }
})

function bestSellingButtonMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.bestSellingItems.buttonHoverColor || '#605B45'
}
function bestSellingButtonMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = bestSellingButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

const bestSellingMenuItems = computed(() => {
  const byName: Record<string, MenuItem> = {}
  for (const cat of menuData) {
    for (const item of cat.items) {
      byName[item.name] = item
    }
  }
  return siteData.bestSellingItems.items
    .map((bs) => byName[bs.name])
    .filter((item): item is MenuItem => item != null)
})

const showAddedToCartModal = ref(false)
const addedToCartItemName = ref('')
function onAddedToCart(itemName: string) {
  addedToCartItemName.value = itemName
  showAddedToCartModal.value = true
}
</script>
