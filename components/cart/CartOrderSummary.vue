<template>
  <template v-if="cart.length > 0">
    <div class="w-full bg-palette-white rounded-2xl border border-palette-grey shadow-sm p-4 sm:p-6 md:p-8">
      <h2 class="text-lg font-bold text-palette-brown mb-4 sm:mb-6">Order Summary</h2>

      <ul class="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
        <li
          v-for="entry in cart"
          :key="cartEntryKey(entry)"
          class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start pb-4 sm:pb-6 border-b border-palette-grey last:border-0 last:pb-0"
        >
          <div class="flex gap-3 sm:gap-4 items-start flex-1 min-w-0">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-palette-grey shrink-0">
              <img :src="entry.image" :alt="entry.name" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-palette-brown truncate">{{ entryDisplayName(entry) }}</p>
              <p class="text-xs sm:text-sm text-palette-olive line-clamp-2">{{ entry.description || 'Add ons: None' }}</p>
              <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <div class="flex items-center gap-1 rounded-lg bg-palette-sage p-1">
                  <button
                    type="button"
                    class="w-7 h-7 rounded flex items-center justify-center text-palette-white hover:bg-white/20 font-bold text-sm"
                    aria-label="Decrease"
                    @click="onDecrease(entry)"
                  >
                    −
                  </button>
                  <span class="min-w-[1.25rem] text-center text-sm font-medium text-palette-white">{{ entry.quantity }}</span>
                  <button
                    type="button"
                    class="w-7 h-7 rounded flex items-center justify-center text-palette-white hover:bg-white/20 font-bold text-sm"
                    aria-label="Increase"
                    @click="updateQuantity(entry.id, 1, entry.variant)"
                  >
                    +
                  </button>
                </div>
                <span class="font-semibold text-palette-brown">₱{{ entry.price * entry.quantity }}</span>
                <button
                  type="button"
                  class="sm:ml-auto p-1.5 rounded text-palette-olive hover:bg-palette-grey/50"
                  aria-label="Remove item"
                  @click="openRemoveConfirm(entry.id, entry.name, entry.variant)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="mb-4 sm:mb-6">
        <label class="block text-sm font-medium text-palette-brown mb-2">Promo Code</label>
        <div class="flex gap-2">
          <input
            v-model="promoCode"
            type="text"
            placeholder="Enter Code"
            class="flex-1 rounded-lg border border-palette-grey px-4 py-2 text-sm text-palette-brown placeholder-palette-olive/60"
          />
          <button
            type="button"
            class="rounded-full bg-palette-sage text-palette-white p-2 hover:opacity-90"
            aria-label="Apply code"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex justify-end items-center gap-2 mb-4 sm:mb-6">
        <span class="font-bold text-palette-brown">TOTAL</span>
        <span class="font-bold text-palette-brown text-lg">₱{{ total }}</span>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          class="py-3 px-8 rounded-full bg-palette-sage text-palette-white font-semibold text-sm uppercase hover:opacity-90 transition-opacity"
          @click="$emit('place-order')"
        >
          Place Order
        </button>
      </div>
    </div>

    <NuxtLink
      to="/menu"
      class="inline-flex items-center gap-1 mt-6 text-sm text-palette-olive hover:underline"
    >
      ← Go back to menu
    </NuxtLink>
  </template>
</template>

<script setup lang="ts">
import type { CartItem } from '~/composables/useCart'

defineProps<{
  cart: CartItem[]
  total: number
  cartEntryKey: (entry: CartItem) => string
  entryDisplayName: (entry: CartItem) => string
  onDecrease: (entry: CartItem) => void
  updateQuantity: (id: number, delta: number, variant?: string) => void
  openRemoveConfirm: (id: number, name: string, variant?: string) => void
}>()

const promoCode = defineModel<string>('promoCode', { default: '' })

defineEmits<{ 'place-order': [] }>()
</script>
