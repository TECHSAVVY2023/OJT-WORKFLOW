export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  description?: string
  quantity: number
  /** e.g. 'hot' or 'iced' for drinks */
  variant?: string
}

function sameCartKey(a: CartItem, id: number, variant?: string): boolean {
  return a.id === id && (a.variant ?? '') === (variant ?? '')
}

export function useCart() {
  const cart = useState<CartItem[]>('workflow-cart', () => [])

  function addToCart(item: Omit<CartItem, 'quantity'>, qty: number = 1, variant?: string) {
    const list = [...cart.value]
    const existing = list.find((i) => sameCartKey(i, item.id, variant))
    if (existing) {
      existing.quantity += qty
    } else {
      list.push({ ...item, quantity: qty, ...(variant !== undefined && { variant }) })
    }
    cart.value = list
  }

  function removeFromCart(id: number, variant?: string) {
    cart.value = cart.value.filter((i) => !sameCartKey(i, id, variant))
  }

  function updateQuantity(id: number, delta: number, variant?: string) {
    const list = cart.value.map((i) =>
      sameCartKey(i, id, variant) ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    )
    cart.value = list.filter((i) => i.quantity > 0)
  }

  function setQuantity(id: number, qty: number, variant?: string) {
    if (qty <= 0) {
      removeFromCart(id, variant)
      return
    }
    cart.value = cart.value.map((i) =>
      sameCartKey(i, id, variant) ? { ...i, quantity: qty } : i
    )
  }

  const total = computed(() =>
    cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const itemCount = computed(() =>
    cart.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  function clearCart() {
    cart.value = []
  }

  return {
    cart,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    setQuantity,
    clearCart,
  }
}
