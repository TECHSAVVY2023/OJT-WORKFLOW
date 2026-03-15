<template>
  <div class="min-h-full bg-palette-cream/40">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 class="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-palette-brown">Orders</h1>
        <p class="mt-1 text-sm text-palette-brown/70">
          View all orders. Status updates in real time (read-only). Click a row to see order details.
        </p>
      </div>
    </header>
    <div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Filters (consistent with admin bookings/venue) -->
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <label for="filter-status-orders" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Status</label>
          <div class="relative inline-block min-w-[140px] sm:min-w-[160px]">
            <select
              id="filter-status-orders"
              v-model="filterStatus"
              class="w-full min-w-[140px] sm:min-w-[160px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px] appearance-none"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              v-if="filterStatus"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
              aria-label="Clear status filter"
              @click="filterStatus = ''"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <label for="filter-source-orders" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Source</label>
          <div class="relative inline-block min-w-[120px] sm:min-w-[140px]">
            <select
              id="filter-source-orders"
              v-model="filterSource"
              class="w-full min-w-[120px] sm:min-w-[140px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px] appearance-none"
            >
              <option value="">All sources</option>
              <option value="qr">QR</option>
              <option value="manual">Manual</option>
            </select>
            <button
              v-if="filterSource"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
              aria-label="Clear source filter"
              @click="filterSource = ''"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-[640px] w-full divide-y divide-palette-olive/20">
            <thead class="bg-palette-olive/15">
              <tr>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Order No.</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Items</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Total</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Payment</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Amount paid</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Change</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Date & time</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Source</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-palette-olive/15">
              <tr v-if="paginatedOrders.length === 0">
                <td colspan="9" class="px-4 py-12 sm:py-16 text-center text-palette-brown/80 text-sm font-medium">
                  No orders to show.
                </td>
              </tr>
              <template v-for="row in paginatedOrders" :key="row.key">
                <tr
                  class="hover:bg-palette-cream/50 cursor-pointer transition-colors"
                  @click="toggleExpand(row.key)"
                >
                  <td class="px-4 py-3 text-sm font-medium text-palette-dark text-center">{{ row.orderId }}</td>
                  <td class="px-4 py-3 text-sm text-palette-brown text-center">{{ row.items }}</td>
                  <td class="px-4 py-3 text-sm font-semibold text-palette-dark text-center">₱{{ row.total.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-sm text-palette-brown/80 text-center">{{ row.payment ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-palette-brown/80 text-center">{{ row.amountPaid ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-palette-brown/80 text-center">{{ row.changeDisplay ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-center">
                    <template v-if="row.dateFormatted">
                      <p class="font-medium text-palette-dark">{{ row.dateFormatted.date }}</p>
                      <p v-if="row.dateFormatted.time" class="text-palette-brown/80 text-xs">{{ row.dateFormatted.time }}</p>
                    </template>
                    <span v-else class="text-palette-brown/80">—</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      v-if="row.source"
                      class="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                      :class="row.source === 'qr' ? 'bg-palette-sage/20 text-palette-sage' : 'bg-palette-olive/20 text-palette-brown'"
                    >
                      {{ row.source === 'qr' ? 'QR' : 'Manual' }}
                    </span>
                    <span v-else class="text-palette-brown/80">—</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="row.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-palette-sage/20 text-palette-sage'"
                    >
                      {{ row.status }}
                    </span>
                  </td>
                </tr>
                <!-- Accordion: order details -->
                <tr v-if="expandedRowKey === row.key" class="bg-palette-olive/5">
                  <td colspan="9" class="px-4 py-4">
                    <div class="rounded-lg border border-palette-olive/20 bg-palette-white p-4">
                      <p class="text-xs font-semibold uppercase tracking-wider text-palette-brown/70 mb-3">Order details</p>
                      <ul class="space-y-2">
                        <li
                          v-for="(line, i) in row.lineItems"
                          :key="i"
                          class="flex justify-between gap-4 text-sm text-palette-brown"
                        >
                          <span>{{ line.name }} × {{ line.quantity }}</span>
                          <span class="font-medium text-palette-dark">₱{{ (line.price * line.quantity).toLocaleString() }}</span>
                        </li>
                      </ul>
                      <p class="mt-3 pt-3 border-t border-palette-olive/20 text-sm font-semibold text-palette-dark flex justify-between">
                        <span>Total</span>
                        <span>₱{{ row.total.toLocaleString() }}</span>
                      </p>

                      <div v-if="row.manualTransactionId" class="mt-4 pt-4 border-t border-palette-olive/20">
                        <p class="text-xs font-semibold uppercase tracking-wider text-palette-brown/70 mb-1">Transaction ID</p>
                        <p class="text-sm text-palette-brown">{{ row.manualTransactionId }}</p>
                      </div>
                      <div v-if="row.receiptProof" class="mt-4 pt-4 border-t border-palette-olive/20">
                        <p class="text-xs font-semibold uppercase tracking-wider text-palette-brown/70 mb-2">Proof of payment</p>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center px-3 py-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown text-xs font-medium hover:bg-palette-cream/60"
                          @click.stop="openProof(row)"
                        >
                          View e-receipt photo
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div v-if="!filteredOrders.length" class="px-4 py-8 text-center text-sm text-palette-brown/60">
          {{ allOrders.length ? 'No orders match the filters.' : 'No orders yet.' }}
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredOrders.length > 0"
          class="px-4 py-3 border-t border-palette-olive/15 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p class="text-sm text-palette-brown/70">
            Showing {{ paginationStart }}–{{ paginationEnd }} of {{ sortedFilteredOrders.length }}
          </p>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="px-3 py-1.5 rounded-workflow border border-palette-olive/40 text-sm font-medium text-palette-brown hover:bg-palette-cream/60 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage <= 1"
              aria-label="Previous page"
              @click="currentPage--"
            >
              Previous
            </button>
            <span class="px-2 text-sm text-palette-brown/80">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              type="button"
              class="px-3 py-1.5 rounded-workflow border border-palette-olive/40 text-sm font-medium text-palette-brown hover:bg-palette-cream/60 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage >= totalPages"
              aria-label="Next page"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="proofModalOpen"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      @click.self="closeProof"
    >
      <div class="bg-palette-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-palette-olive/20">
        <div class="px-5 py-4 border-b border-palette-olive/15 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-palette-brown">Proof of payment</p>
            <p class="text-xs text-palette-brown/70 truncate" v-if="proofMeta">
              Order {{ proofMeta.orderId }} • {{ proofMeta.payment ?? '—' }}
              <span v-if="proofMeta.transactionId" class="block mt-0.5">Transaction ID: {{ proofMeta.transactionId }}</span>
            </p>
          </div>
          <button
            type="button"
            class="p-2 rounded-full hover:bg-palette-cream/60 text-palette-brown/80"
            aria-label="Close"
            @click="closeProof"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-5">
          <div v-if="proofDataUrl" class="rounded-xl overflow-hidden border border-palette-olive/20 bg-palette-cream/20">
            <img :src="proofDataUrl" alt="Payment proof" class="w-full h-auto object-contain max-h-[70vh]" />
          </div>
          <p v-else class="text-sm text-palette-brown/70">No proof available.</p>

          <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              class="py-2.5 px-4 rounded-full border border-palette-olive/40 text-palette-brown font-medium text-sm hover:bg-palette-cream/60 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!proofDataUrl || !proofMeta"
              @click="downloadProof"
            >
              Download
            </button>
            <button
              type="button"
              class="py-2.5 px-4 rounded-full bg-palette-sage text-palette-white font-semibold text-sm hover:opacity-90"
              @click="closeProof"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'staff' })

const { pending, refreshFromStorage } = usePendingOrders()
const { records } = useSales()

onMounted(() => { refreshFromStorage() })

const ORDERS_PAGE_SIZE = 10
const expandedRowKey = ref<string | null>(null)
const filterStatus = ref('')
const filterSource = ref('')
const currentPage = ref(1)

function resetFilters() {
  filterStatus.value = ''
  filterSource.value = ''
}

function toggleExpand(key: string) {
  expandedRowKey.value = expandedRowKey.value === key ? null : key
}

/** Same style as venues/bookings: long date + time. */
function formatDateAndTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { date: '—', time: '' }
  const date = d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  const time = d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })
  return { date, time }
}

interface LineItem { name: string; quantity: number; price: number }

type OrderRow = {
  key: string
  orderId: string
  items: string
  total: number
  payment?: string
  amountPaid?: string
  changeDisplay?: string
  dateFormatted?: { date: string; time: string }
  /** ISO date string for sorting by date/time */
  sortDateIso: string
  source?: 'qr' | 'manual'
  status: string
  lineItems: LineItem[]
  receiptProof?: string
  manualTransactionId?: string
}

const proofModalOpen = ref(false)
const proofDataUrl = ref<string | null>(null)
const proofMeta = ref<{ orderId: string; payment?: string; transactionId?: string } | null>(null)

function openProof(row: { orderId: string; payment?: string; receiptProof?: string; manualTransactionId?: string }) {
  if (!row.receiptProof) return
  proofDataUrl.value = row.receiptProof
  proofMeta.value = { orderId: row.orderId, payment: row.payment, transactionId: row.manualTransactionId }
  proofModalOpen.value = true
}

function closeProof() {
  proofModalOpen.value = false
  proofDataUrl.value = null
  proofMeta.value = null
}

function downloadProof() {
  if (!proofDataUrl.value || !proofMeta.value) return
  const a = document.createElement('a')
  a.href = proofDataUrl.value
  a.download = `order-${proofMeta.value.orderId}-proof.jpg`
  a.click()
}

const ORDER_STATUS_ORDER: Record<string, number> = { Pending: 0, Completed: 1 }

const allOrders = computed(() => {
  const rows: OrderRow[] = []
  pending.value.forEach((o) => {
    rows.push({
      key: 'p-' + o.orderId,
      orderId: o.orderId,
      items: `${o.items.length} item(s)`,
      total: o.total,
      status: 'Pending',
      sortDateIso: o.createdAt ?? '',
      lineItems: o.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    })
  })
  records.value.forEach((r) => {
    const change = r.amountPaid != null ? r.amountPaid - r.total : null
    rows.push({
      key: 'c-' + r.id,
      orderId: r.orderId,
      items: `${r.items.length} item(s)`,
      total: r.total,
      payment: r.paymentMethod ?? undefined,
      amountPaid: r.amountPaid != null ? '₱' + r.amountPaid.toLocaleString() : undefined,
      changeDisplay: change != null ? '₱' + change.toLocaleString() : undefined,
      dateFormatted: formatDateAndTime(r.createdAt),
      sortDateIso: r.createdAt,
      source: r.source,
      status: 'Completed',
      lineItems: r.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      receiptProof: r.receiptProof,
      manualTransactionId: r.manualTransactionId,
    })
  })
  return rows
})

const filteredOrders = computed(() => {
  let list = allOrders.value
  if (filterStatus.value) {
    list = list.filter((row) => row.status === filterStatus.value)
  }
  if (filterSource.value) {
    list = list.filter((row) => row.source === filterSource.value)
  }
  return list
})

const sortedFilteredOrders = computed(() =>
  [...filteredOrders.value].sort((a, b) => {
    const byStatus = (ORDER_STATUS_ORDER[a.status] ?? 0) - (ORDER_STATUS_ORDER[b.status] ?? 0)
    if (byStatus !== 0) return byStatus
    return (b.sortDateIso || '').localeCompare(a.sortDateIso || '')
  })
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedFilteredOrders.value.length / ORDERS_PAGE_SIZE))
)

const paginatedOrders = computed(() => {
  const list = sortedFilteredOrders.value
  const start = (currentPage.value - 1) * ORDERS_PAGE_SIZE
  return list.slice(start, start + ORDERS_PAGE_SIZE)
})

const paginationStart = computed(() => {
  if (sortedFilteredOrders.value.length === 0) return 0
  return (currentPage.value - 1) * ORDERS_PAGE_SIZE + 1
})

const paginationEnd = computed(() =>
  Math.min(currentPage.value * ORDERS_PAGE_SIZE, sortedFilteredOrders.value.length)
)

watch([filterStatus, filterSource], () => { currentPage.value = 1 })
</script>
