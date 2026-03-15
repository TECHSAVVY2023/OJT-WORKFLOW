<template>
  <div class="w-full min-h-[60vh] pb-12 bg-white font-poppins">
    <div class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-[55px] pt-6 md:pt-8">
      <h1 class="text-2xl font-bold text-palette-brown mb-6 md:mb-8">Cart</h1>

      <CartEmptyState
        v-if="cart.length === 0 && !showAlmostThere && !showConfirmed"
      />
      <CartOrderSummary
        v-else-if="cart.length > 0"
        :cart="cart"
        :total="total"
        v-model:promo-code="promoCode"
        :cart-entry-key="cartEntryKey"
        :entry-display-name="entryDisplayName"
        :on-decrease="onDecrease"
        :update-quantity="updateQuantity"
        :open-remove-confirm="openRemoveConfirm"
        @place-order="showAlmostThere = true"
      />
    </div>

    <AlmostThereModal v-model="showAlmostThere" @proceed="onProceed" />
    <OrderConfirmedModal
      v-model="showConfirmed"
      :order-number="orderNumber"
      @done="onOrderDone"
    />
    <ConfirmModal
      v-model="showDeleteConfirm"
      :title="deleteConfirmTitle"
      :message="deleteConfirmMessage"
      confirm-label="Yes, remove"
      cancel-label="Cancel"
      danger
      @confirm="onConfirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
const {
  cart,
  total,
  promoCode,
  showAlmostThere,
  showConfirmed,
  orderNumber,
  showDeleteConfirm,
  deleteConfirmTitle,
  deleteConfirmMessage,
  cartEntryKey,
  entryDisplayName,
  updateQuantity,
  openRemoveConfirm,
  onDecrease,
  onConfirmRemove,
  onProceed,
  onOrderDone,
} = useCartPage()
</script>
