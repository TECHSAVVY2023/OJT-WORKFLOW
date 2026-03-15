export interface SaleItem {
  id: number
  name: string
  price: number
  quantity: number
  variant?: string
}

export interface SaleRecord {
  id: string
  orderId: string
  items: SaleItem[]
  total: number
  staffId: string
  staffName: string
  createdAt: string
  /** 'qr' when completed from scan, 'manual' when from manual entry */
  source: 'qr' | 'manual'
  /** Payment method used (e.g. cash, e-wallet) */
  paymentMethod?: string
  /** Amount paid (for change tracking) */
  amountPaid?: number
  /** Data URL of e-receipt photo when payment is E-wallet */
  receiptProof?: string
  /** Manual transaction ID (e.g. from e-wallet app) for E-wallet payments */
  manualTransactionId?: string
}

const STORAGE_KEY = 'workflow_sales'
let nextId = 1

function getStored(): SaleRecord[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as SaleRecord[]
        if (Array.isArray(data)) return data
      }
    } catch (_) {}
  }
  return []
}

function setStored(records: SaleRecord[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }
}

export function useSales() {
  const records = useState<SaleRecord[]>('workflow_sales', () => [])

  if (import.meta.client) {
    onMounted(() => {
      records.value = getStored()
      const maxId = records.value.reduce((m, r) => {
        const n = parseInt(r.id.replace('SAL-', ''), 10)
        return Number.isNaN(n) ? m : Math.max(m, n)
      }, 0)
      nextId = maxId + 1
    })
  }

  function addSale(sale: Omit<SaleRecord, 'id' | 'createdAt'> & { paymentMethod?: string; amountPaid?: number; receiptProof?: string; manualTransactionId?: string }) {
    const id = `SAL-${String(nextId++).padStart(4, '0')}`
    const record: SaleRecord = {
      ...sale,
      id,
      createdAt: new Date().toISOString(),
    }
    records.value = [record, ...records.value]
    setStored(records.value)
    return id
  }

  const totalSales = computed(() =>
    records.value.reduce((sum, r) => sum + r.total, 0)
  )

  const salesCount = computed(() => records.value.length)

  function clearRecords() {
    records.value = []
    setStored(records.value)
  }

  return {
    records,
    addSale,
    totalSales,
    salesCount,
    clearRecords,
  }
}
