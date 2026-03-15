<template>
  <div class="min-h-full bg-palette-cream/40 font-poppins">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 class="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-palette-brown">Incoming orders</h1>
        <p class="mt-1 text-sm text-palette-brown/70">
          Scan a customer's order QR or choose a pending order to proceed to checkout. Completed orders no longer appear here.
        </p>
      </div>
    </header>
    <div class="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div v-if="error" class="mb-4 p-4 rounded-xl bg-red-100 text-red-800 text-sm max-w-4xl mx-auto">
        {{ error }}
      </div>

      <!-- Step: Checkout (order overview + payment + Complete sale) -->
      <div v-if="step === 'checkout' && pendingOrder" class="mb-6 space-y-6 max-w-lg mx-auto">
        <div class="p-6 rounded-2xl bg-palette-white border-2 border-palette-sage shadow-md">
          <h2 class="text-lg font-semibold text-palette-brown mb-4">Checkout</h2>
          <p class="text-sm font-medium text-palette-brown/80 mb-2">Order No. {{ scannedOrderId }}</p>
          <ul class="space-y-2 mb-4 text-sm text-palette-brown">
            <li v-for="(line, i) in pendingOrder.items" :key="i">
              {{ line.name }} × {{ line.quantity }} — ₱{{ (line.price * line.quantity).toLocaleString() }}
            </li>
          </ul>
          <p class="font-semibold text-palette-dark text-lg">Total: ₱{{ pendingOrder.total.toLocaleString() }}</p>
        </div>

        <div class="p-6 rounded-2xl bg-palette-white border border-palette-olive/20 shadow-sm">
          <label class="block text-sm font-semibold text-palette-brown mb-3">Payment</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in paymentOptions"
              :key="opt"
              type="button"
              class="px-4 py-2.5 rounded-workflow border text-sm font-medium transition-colors"
              :class="selectedPayment === opt
                ? 'border-palette-sage bg-palette-sage/15 text-palette-sage'
                : 'border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/60'"
              @click="onPaymentOptionClick(opt)"
            >
              {{ opt }}
            </button>
          </div>

          <template v-if="selectedPayment === 'Cash'">
            <label class="block text-sm font-semibold text-palette-brown mt-4 mb-2">Amount paid (₱)</label>
            <input
              v-model.number="amountPaidInput"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              class="w-full px-4 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
            />
            <p v-if="pendingOrder" class="text-xs text-palette-brown/60 mt-1.5">Total due: ₱{{ pendingOrder.total.toLocaleString() }}</p>
            <p v-if="amountPaidValid && pendingOrder" class="text-sm font-medium text-palette-sage mt-2">Change: ₱{{ (Number(amountPaidInput) - pendingOrder.total).toLocaleString() }}</p>
          </template>

          <template v-else-if="selectedPayment === 'E-wallet'">
            <label class="block text-sm font-semibold text-palette-brown mt-4 mb-2">Manual transaction ID</label>
            <input
              v-model="manualTransactionId"
              type="text"
              placeholder="e.g. from e-wallet app"
              class="w-full px-4 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage mb-4"
            />
            <label class="block text-sm font-semibold text-palette-brown mb-2">Proof of payment</label>
            <p class="text-xs text-palette-brown/60 mb-3">Take a photo of the e-receipt using your camera.</p>
            <input
              ref="receiptInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onReceiptFileChange"
            />
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="flex-1 min-w-[140px] py-3 rounded-workflow border-2 border-palette-sage bg-palette-sage/10 text-palette-sage text-sm font-medium hover:bg-palette-sage/20 transition-colors"
                @click="openReceiptCamera"
              >
                {{ receiptImageData ? 'Retake photo' : 'Open camera' }}
              </button>
              <button
                type="button"
                class="py-3 px-4 rounded-workflow border border-palette-olive/40 text-palette-brown/80 text-sm font-medium hover:bg-palette-cream/60"
                @click="receiptInputRef?.click()"
              >
                Choose file instead
              </button>
            </div>
            <p v-if="cameraError" class="mt-2 text-xs text-red-600">{{ cameraError }}</p>
            <div v-if="receiptImageData" class="mt-3 rounded-xl overflow-hidden border border-palette-olive/20 max-h-48">
              <img :src="receiptImageData" alt="E-receipt" class="w-full h-auto object-contain max-h-48" />
            </div>
          </template>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="flex-1 py-3 rounded-full bg-palette-sage text-palette-white font-semibold text-sm uppercase hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedPayment || !checkoutValid"
            @click="completeSale"
          >
            Complete sale
          </button>
          <button
            type="button"
            class="py-3 px-4 rounded-full border border-palette-olive/40 text-palette-brown font-medium text-sm"
            @click="closeReceiptCamera(); step = 'order-found'"
          >
            Back
          </button>
        </div>
      </div>

      <!-- Step: Order found (overview + Proceed to checkout) -->
      <div v-else-if="step === 'order-found' && scannedOrderId && pendingOrder" class="mb-6 p-6 rounded-2xl bg-palette-white border-2 border-palette-sage shadow-md max-w-lg mx-auto">
        <p class="text-sm font-medium text-palette-brown/80 mb-2">Order found</p>
        <p class="text-xl font-bold text-palette-brown mb-4">Order No. {{ scannedOrderId }}</p>
        <ul class="space-y-2 mb-4 text-sm text-palette-brown">
          <li v-for="(line, i) in pendingOrder.items" :key="i">
            {{ line.name }} × {{ line.quantity }} — ₱{{ (line.price * line.quantity).toLocaleString() }}
          </li>
        </ul>
        <p class="font-semibold text-palette-dark">Total: ₱{{ pendingOrder.total.toLocaleString() }}</p>
        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="flex-1 py-3 rounded-full bg-palette-sage text-palette-white font-semibold text-sm uppercase hover:opacity-90"
            @click="goToCheckout"
          >
            Proceed to checkout
          </button>
          <button
            type="button"
            class="py-3 px-4 rounded-full border border-palette-olive/40 text-palette-brown font-medium text-sm"
            @click="resetScan"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Scanned but order not in pending -->
      <div v-else-if="scannedOrderId && !pendingOrder" class="mb-6 p-6 rounded-2xl bg-amber-50 border border-amber-200 max-w-lg mx-auto">
        <p class="text-sm font-medium text-amber-800 mb-2">Order not found</p>
        <p class="text-palette-brown/90 text-sm mb-4">
          This order may already be completed or was placed elsewhere. Use <NuxtLink to="/staff/record-sale" class="font-semibold text-palette-sage underline">Manual sale</NuxtLink> to record a new transaction.
        </p>
        <button type="button" class="py-2 px-4 rounded-full bg-palette-sage text-palette-white font-semibold text-sm" @click="resetScan">
          Scan another
        </button>
      </div>

      <!-- Order completed -->
      <div v-else-if="step === 'done'" class="mb-6 p-6 rounded-2xl bg-green-50 border-2 border-palette-sage text-center max-w-lg mx-auto">
        <p class="text-sm font-medium text-green-800 mb-1">Order completed</p>
        <p class="text-lg font-bold text-palette-brown">Order {{ lastCompletedOrderId }}</p>
        <p class="text-sm text-palette-brown/80 mt-1">Saved to order history.</p>
        <button type="button" class="mt-4 py-2 px-4 rounded-full bg-palette-sage text-palette-white font-semibold text-sm" @click="step = 'scan'; saleCompleted = false; lastCompletedOrderId = ''">
          Incoming orders
        </button>
      </div>

      <!-- Step: Scan — QR left, choose order cards right -->
      <template v-else>
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-5xl mx-auto">
          <!-- Left: QR scanner -->
          <div class="lg:w-[320px] shrink-0">
            <p class="text-sm font-semibold text-palette-brown/80 mb-3">Scan QR</p>
            <ClientOnly>
              <OrderQrScanner
                @scan="onScan"
                @error="onScanError"
              />
              <template #fallback>
                <div class="min-h-[280px] rounded-xl bg-palette-grey flex items-center justify-center text-palette-brown/70">
                  Loading scanner…
                </div>
              </template>
            </ClientOnly>
          </div>
          <!-- Right: Choose an order (same card style as Orders page) -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-palette-brown/80 mb-3">Choose an order</p>
            <div v-if="pendingOrdersList.length > 0" class="grid gap-3 sm:grid-cols-2">
              <button
                v-for="order in pendingOrdersList"
                :key="order.orderId"
                type="button"
                class="text-left p-4 rounded-xl bg-palette-white border border-palette-olive/20 shadow-sm hover:border-palette-sage hover:bg-palette-sage/5 transition-all"
                @click="selectOrder(order.orderId)"
              >
                <div class="flex items-start justify-between gap-2">
                  <p class="font-bold text-palette-brown">Order No. {{ order.orderId }}</p>
                  <span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shrink-0">Pending</span>
                </div>
                <p class="text-sm text-palette-brown/80 mt-2">{{ order.items.length }} item(s)</p>
                <p class="font-semibold text-palette-dark mt-1">₱{{ order.total.toLocaleString() }}</p>
              </button>
            </div>
            <p v-else class="text-sm text-palette-brown/60 py-6">No pending orders. Scan a QR or wait for new orders.</p>
          </div>
        </div>
      </template>

      <!-- Camera modal for E-receipt (outside v-if chain so v-else-if stays adjacent) -->
      <Teleport to="body">
        <div
          v-if="receiptCameraOpen"
          class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60"
          @click.self="closeReceiptCamera"
        >
          <div class="bg-palette-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-palette-olive/20">
            <div class="px-4 py-3 border-b border-palette-olive/15 flex items-center justify-between">
              <p class="text-sm font-semibold text-palette-brown">Camera — position e-receipt in frame</p>
              <button type="button" class="p-2 rounded-full hover:bg-palette-cream/60 text-palette-brown/80" aria-label="Close" @click="closeReceiptCamera">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="p-4 bg-palette-dark/5">
              <video
                ref="receiptVideoRef"
                autoplay
                playsinline
                muted
                class="w-full rounded-xl bg-black aspect-video object-cover"
              />
              <p v-if="cameraError" class="mt-2 text-sm text-red-600">{{ cameraError }}</p>
            </div>
            <div class="px-4 py-3 flex gap-2 justify-end border-t border-palette-olive/15">
              <button type="button" class="py-2.5 px-4 rounded-full border border-palette-olive/40 text-palette-brown font-medium text-sm hover:bg-palette-cream/60" @click="closeReceiptCamera">Cancel</button>
              <button type="button" class="py-2.5 px-4 rounded-full bg-palette-sage text-palette-white font-semibold text-sm hover:opacity-90" @click="captureReceiptPhoto">Capture photo</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
interface WorkflowOrderPayload {
  orderId: string
  source: string
  ts?: number
}

definePageMeta({ layout: 'staff' })

const PAYMENT_OPTIONS = ['Cash', 'E-wallet'] as const
const paymentOptions = PAYMENT_OPTIONS as unknown as string[]

const { pending, getByOrderId, removeByOrderId, refreshFromStorage } = usePendingOrders()
const { addSale } = useSales()
const { user } = useAuth()

const scannedOrderId = ref<string | null>(null)
const error = ref('')
const step = ref<'scan' | 'order-found' | 'checkout' | 'done'>('scan')
const saleCompleted = ref(false)
const lastCompletedOrderId = ref('')
const selectedPayment = ref('Cash')
const amountPaidInput = ref<number | ''>('')
const receiptInputRef = ref<HTMLInputElement | null>(null)
const manualTransactionId = ref('')
const receiptImageData = ref<string | null>(null)
const receiptVideoRef = ref<HTMLVideoElement | null>(null)
const receiptCameraOpen = ref(false)
const cameraStreamRef = ref<MediaStream | null>(null)
const cameraError = ref('')

const pendingOrdersList = computed(() => pending.value)
const pendingOrder = computed(() =>
  scannedOrderId.value ? getByOrderId(scannedOrderId.value) : null
)
const amountPaidValid = computed(() => {
  const paid = Number(amountPaidInput.value)
  if (Number.isNaN(paid) || paid < 0) return false
  return pendingOrder.value ? paid >= pendingOrder.value.total : false
})
const checkoutValid = computed(() => {
  if (selectedPayment.value === 'Cash') return amountPaidValid.value
  if (selectedPayment.value === 'E-wallet') return !!receiptImageData.value
  return false
})

function onPaymentOptionClick(opt: string) {
  selectedPayment.value = opt
  if (opt === 'Cash') {
    manualTransactionId.value = ''
    receiptImageData.value = null
    closeReceiptCamera()
  } else amountPaidInput.value = ''
}

function onReceiptFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = () => {
    receiptImageData.value = reader.result as string
  }
  reader.readAsDataURL(file)
  input.value = ''
}

async function openReceiptCamera() {
  cameraError.value = ''
  receiptCameraOpen.value = true
  await nextTick()
  const video = receiptVideoRef.value
  if (!video) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .catch(() => navigator.mediaDevices.getUserMedia({ video: true }))
    cameraStreamRef.value = stream
    video.srcObject = stream
  } catch (err) {
    cameraError.value = err instanceof Error ? err.message : 'Could not access camera. Use "Choose file instead" or allow camera permission.'
  }
}

function closeReceiptCamera() {
  const stream = cameraStreamRef.value
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    cameraStreamRef.value = null
  }
  const video = receiptVideoRef.value
  if (video) video.srcObject = null
  receiptCameraOpen.value = false
  cameraError.value = ''
}

function captureReceiptPhoto() {
  const video = receiptVideoRef.value
  if (!video || !video.videoWidth) return
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(video, 0, 0)
  receiptImageData.value = canvas.toDataURL('image/jpeg', 0.9)
  closeReceiptCamera()
}

onMounted(() => { refreshFromStorage() })
onBeforeUnmount(() => closeReceiptCamera())

function goToCheckout() {
  step.value = 'checkout'
  selectedPayment.value = paymentOptions[0]
  amountPaidInput.value = pendingOrder.value ? pendingOrder.value.total : ''
  manualTransactionId.value = ''
  receiptImageData.value = null
}

function selectOrder(orderId: string) {
  error.value = ''
  scannedOrderId.value = orderId
  const found = getByOrderId(orderId)
  if (found) step.value = 'order-found'
}

function onScan(payload: WorkflowOrderPayload) {
  error.value = ''
  scannedOrderId.value = payload.orderId
  step.value = 'order-found'
}

function onScanError(message: string) {
  error.value = message
}

function resetScan() {
  scannedOrderId.value = null
  error.value = ''
  step.value = 'scan'
  amountPaidInput.value = ''
  manualTransactionId.value = ''
  receiptImageData.value = null
  refreshFromStorage()
}

function completeSale() {
  const order = pendingOrder.value
  if (!order || !user.value || !checkoutValid.value) return
  const paid = Number(amountPaidInput.value)
  addSale({
    orderId: order.orderId,
    items: order.items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, ...(i.variant && { variant: i.variant }) })),
    total: order.total,
    staffId: user.value.id,
    staffName: user.value.name,
    source: 'qr',
    paymentMethod: selectedPayment.value || undefined,
    amountPaid: selectedPayment.value === 'Cash' && !Number.isNaN(paid) ? paid : (selectedPayment.value === 'E-wallet' ? order.total : undefined),
    ...(selectedPayment.value === 'E-wallet' && receiptImageData.value && { receiptProof: receiptImageData.value }),
    ...(selectedPayment.value === 'E-wallet' && (manualTransactionId.value?.trim() || '') && { manualTransactionId: manualTransactionId.value.trim() }),
  })
  removeByOrderId(order.orderId)
  lastCompletedOrderId.value = order.orderId
  manualTransactionId.value = ''
  receiptImageData.value = null
  step.value = 'done'
  saleCompleted.value = true
  scannedOrderId.value = null
  useActivityLog().log('Sale recorded (QR scan)', `Order ${order.orderId}, ₱${order.total.toLocaleString()}, ${selectedPayment.value}`)
}
</script>
