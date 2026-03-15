import type { CartItem } from '~/composables/useCart'

export function useCartPage() {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const { addOrder } = usePendingOrders()
  const { getNextOrderNumber } = useOrderNumber()

  const promoCode = ref('')
  const showAlmostThere = ref(false)
  const showConfirmed = ref(false)
  const orderNumber = ref('')
  const showDeleteConfirm = ref(false)
  const itemToRemove = ref<{ id: number; name: string; variant?: string } | null>(null)
  const removeReason = ref<'trash' | 'decrease'>('trash')

  function cartEntryKey(entry: CartItem) {
    return `${entry.id}-${entry.variant ?? ''}`
  }

  function entryDisplayName(entry: CartItem) {
    const variantLabel = entry.variant === 'iced' ? 'Iced' : entry.variant === 'hot' ? 'Hot' : ''
    return variantLabel ? `${entry.name} (${variantLabel})` : entry.name
  }

  const deleteConfirmTitle = computed(() =>
    removeReason.value === 'decrease' ? 'Remove from cart?' : 'Remove item?'
  )

  const deleteConfirmMessage = computed(() => {
    if (!itemToRemove.value) return ''
    const name = entryDisplayName({ ...itemToRemove.value, quantity: 1 } as CartItem)
    if (removeReason.value === 'decrease') {
      return `Decreasing the quantity to zero will remove "${name}" from your cart. Are you sure?`
    }
    return `Are you sure you want to remove "${name}" from your cart?`
  })

  function openRemoveConfirm(id: number, name: string, variant?: string) {
    itemToRemove.value = { id, name, variant }
    removeReason.value = 'trash'
    showDeleteConfirm.value = true
  }

  function onDecrease(entry: CartItem) {
    if (entry.quantity === 1) {
      itemToRemove.value = { id: entry.id, name: entry.name, variant: entry.variant }
      removeReason.value = 'decrease'
      showDeleteConfirm.value = true
    } else {
      updateQuantity(entry.id, -1, entry.variant)
    }
  }

  function onConfirmRemove() {
    if (itemToRemove.value) {
      removeFromCart(itemToRemove.value.id, itemToRemove.value.variant)
      itemToRemove.value = null
    }
  }

  function onProceed() {
    showAlmostThere.value = false
    orderNumber.value = getNextOrderNumber()
    addOrder(orderNumber.value, [...cart.value], total.value)
    showConfirmed.value = true
  }

  function onOrderDone() {
    clearCart()
    showConfirmed.value = false
  }

  return {
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
  }
}
