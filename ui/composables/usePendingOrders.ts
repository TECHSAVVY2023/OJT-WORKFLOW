import type { CartItem } from '~/composables/useCart'

export interface PendingOrder {
  orderId: string
  items: Array<{ id: number; name: string; price: number; quantity: number; variant?: string }>
  total: number
  createdAt: string
}

const STORAGE_KEY = 'workflow_pending_orders'

function getStored(): PendingOrder[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as PendingOrder[]
        if (Array.isArray(data)) return data
      }
    } catch (_) {}
  }
  return []
}

function setStored(orders: PendingOrder[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }
}

export function usePendingOrders() {
  const pending = useState<PendingOrder[]>('workflow_pending_orders', () => [])

  if (import.meta.client) {
    onMounted(() => {
      pending.value = getStored()
    })
  }

  function addOrder(orderId: string, items: CartItem[], total: number) {
    const order: PendingOrder = {
      orderId,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        ...(i.variant && { variant: i.variant }),
      })),
      total,
      createdAt: new Date().toISOString(),
    }
    pending.value = [...pending.value, order]
    setStored(pending.value)
  }

  function getByOrderId(orderId: string): PendingOrder | null {
    // Re-read from localStorage so we see orders added in another tab (e.g. customer placed order in cart tab)
    if (import.meta.client && typeof localStorage !== 'undefined') {
      pending.value = getStored()
    }
    return pending.value.find((o) => o.orderId === orderId) ?? null
  }

  function removeByOrderId(orderId: string) {
    pending.value = pending.value.filter((o) => o.orderId !== orderId)
    setStored(pending.value)
  }

  function refreshFromStorage() {
    if (import.meta.client) pending.value = getStored()
  }

  function clearAll() {
    pending.value = []
    setStored(pending.value)
  }

  return {
    pending,
    addOrder,
    getByOrderId,
    removeByOrderId,
    refreshFromStorage,
    clearAll,
  }
}

