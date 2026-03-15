<template>
  <div class="min-h-full bg-palette-cream/40 font-poppins">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 class="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-palette-brown">Manual order</h1>
        <p class="mt-1 text-sm text-palette-brown/70">Pick items, choose hot or cold when available, then proceed to checkout.</p>
      </div>
    </header>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Step: Checkout (same process as scan/choose order) -->
      <div v-if="step === 'checkout'" class="max-w-lg mx-auto space-y-6">
        <div class="p-6 rounded-2xl bg-palette-white border-2 border-palette-sage shadow-md">
          <h2 class="text-lg font-semibold text-palette-brown mb-4">Checkout</h2>
          <p class="text-sm font-medium text-palette-brown/80 mb-2">Order No. {{ manualOrderId }}</p>
          <ul class="space-y-2 mb-4 text-sm text-palette-brown">
            <li v-for="(line, i) in orderLines" :key="lineKey(line)">
              {{ lineDisplayName(line) }} × {{ line.quantity }} — ₱{{ (line.price * line.quantity).toLocaleString() }}
            </li>
          </ul>
          <p class="font-semibold text-palette-dark text-lg">Total: ₱{{ orderTotal.toLocaleString() }}</p>
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

          <!-- Cash: amount paid + change -->
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
            <p class="text-xs text-palette-brown/60 mt-1.5">Total due: ₱{{ orderTotal.toLocaleString() }}</p>
            <p v-if="amountPaidValid" class="text-sm font-medium text-palette-sage mt-2">Change: ₱{{ (Number(amountPaidInput) - orderTotal).toLocaleString() }}</p>
          </template>

          <!-- E-wallet: transaction ID + proof of payment -->
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
            @click="closeReceiptCamera(); step = 'cart'"
          >
            Back
          </button>
        </div>
      </div>

      <!-- Step: Cart (pick items + Proceed to checkout) -->
      <div v-else class="flex flex-col lg:flex-row gap-6">
        <!-- Menu: search, categories, then items -->
        <div class="flex-1">
          <div class="mb-6 space-y-4">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search items..."
              class="w-full px-4 py-2.5 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
            />
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="px-3 py-2 rounded-workflow text-sm font-medium transition-colors"
                :class="selectedCategoryForScroll === null ? 'bg-palette-sage text-white' : 'bg-palette-white border border-palette-olive/40 text-palette-brown hover:bg-palette-cream/60'"
                @click="selectCategory(null)"
              >
                All
              </button>
              <button
                v-for="cat in categoryList"
                :key="cat"
                type="button"
                class="px-3 py-2 rounded-workflow text-sm font-medium transition-colors"
                :class="selectedCategoryForScroll === cat ? 'bg-palette-sage text-white' : 'bg-palette-white border border-palette-olive/40 text-palette-brown hover:bg-palette-cream/60'"
                @click="selectCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>
          </div>
          <div v-for="cat in filteredMenuData" :key="cat.category" :id="categoryId(cat.category)" class="mb-6 scroll-mt-4" :data-category="cat.category">
            <h2 class="text-lg font-semibold text-palette-brown mb-3">{{ cat.category }}</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="item in cat.items"
                :key="item.id"
                class="bg-palette-white rounded-xl border border-palette-olive/20 p-3 flex flex-col"
              >
                <p class="font-medium text-palette-brown text-sm truncate">{{ item.name }}</p>
                <p class="text-xs text-palette-brown/80">₱{{ item.price }}</p>
                <!-- With variants: Hot / Cold (Iced) -->
                <template v-if="item.variants && item.variants.length">
                  <div v-for="v in item.variants" :key="v" class="mt-2 flex items-center gap-2">
                    <span class="text-xs font-medium text-palette-brown/80 w-10 capitalize">{{ v === 'iced' ? 'Cold' : v }}</span>
                    <button
                      type="button"
                      class="w-7 h-7 rounded-lg bg-palette-grey/40 text-palette-brown hover:bg-palette-grey/60 font-bold text-sm flex-shrink-0"
                      :disabled="getQty(item.id, v) <= 0"
                      @click="adjustQty(item, -1, v)"
                    >
                      −
                    </button>
                    <span class="min-w-[1.25rem] text-center text-sm font-medium">{{ getQty(item.id, v) }}</span>
                    <button
                      type="button"
                      class="w-7 h-7 rounded-lg bg-palette-sage text-palette-white hover:opacity-90 font-bold text-sm flex-shrink-0"
                      @click="adjustQty(item, 1, v)"
                    >
                      +
                    </button>
                  </div>
                </template>
                <!-- No variants: single quantity -->
                <div v-else class="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    class="w-8 h-8 rounded-lg bg-palette-grey/40 text-palette-brown hover:bg-palette-grey/60 font-bold text-sm"
                    :disabled="getQty(item.id) <= 0"
                    @click="adjustQty(item, -1)"
                  >
                    −
                  </button>
                  <span class="min-w-[1.5rem] text-center text-sm font-medium">{{ getQty(item.id) }}</span>
                  <button
                    type="button"
                    class="w-8 h-8 rounded-lg bg-palette-sage text-palette-white hover:opacity-90 font-bold text-sm"
                    @click="adjustQty(item, 1)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current order + Proceed to checkout -->
        <div class="lg:w-80 shrink-0">
          <div class="bg-palette-white rounded-xl border border-palette-olive/20 shadow-md p-4 sticky top-4">
            <h2 class="font-semibold text-palette-brown mb-3">Current order</h2>
            <ul v-if="orderLines.length" class="space-y-2 mb-4 text-sm">
              <li v-for="line in orderLines" :key="lineKey(line)" class="flex justify-between gap-2">
                <span class="text-palette-brown truncate">{{ lineDisplayName(line) }} × {{ line.quantity }}</span>
                <span class="font-medium text-palette-dark">₱{{ (line.price * line.quantity).toLocaleString() }}</span>
              </li>
            </ul>
            <p v-else class="text-palette-brown/60 text-sm mb-4">No items added.</p>
            <p class="font-semibold text-palette-dark text-lg">Total: ₱{{ orderTotal.toLocaleString() }}</p>
            <button
              type="button"
              class="w-full mt-4 py-3 rounded-full bg-palette-sage text-palette-white font-semibold text-sm uppercase hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="orderLines.length === 0"
              @click="goToCheckout"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>

      <!-- Success: Order completed -->
      <Teleport to="body">
        <div v-if="step === 'done'" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" @click.self="step = 'cart'">
          <div class="bg-palette-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <p class="text-palette-brown font-medium mb-4">Order completed.</p>
            <p class="text-sm text-palette-brown/80 mb-4">Order {{ lastCompletedOrderId }}</p>
            <button type="button" class="py-2 px-4 rounded-full bg-palette-sage text-palette-white font-semibold" @click="step = 'cart'; lastCompletedOrderId = ''">OK</button>
          </div>
        </div>
      </Teleport>

      <!-- Camera modal for E-receipt (opens real webcam) -->
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
definePageMeta({ layout: 'staff' })

const PAYMENT_OPTIONS = ['Cash', 'E-wallet'] as const

const { menuData } = useAdminMenu()
const { addSale } = useSales()
const { user } = useAuth()
const { getNextOrderNumber } = useOrderNumber()

const searchQuery = ref('')
const selectedCategoryForScroll = ref<string | null>(null)

const categoryList = computed(() => menuData.value.map((c) => c.category))
const filteredMenuData = computed(() => {
  const q = (searchQuery.value || '').trim().toLowerCase()
  if (!q) return menuData.value
  return menuData.value
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.name.toLowerCase().includes(q)),
    }))
    .filter((cat) => cat.items.length > 0)
})

function categoryId(category: string) {
  return 'category-' + category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function selectCategory(category: string | null) {
  selectedCategoryForScroll.value = category
  if (category === null) return
  nextTick(() => {
    const el = document.getElementById(categoryId(category))
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

interface OrderLine {
  id: number
  name: string
  price: number
  quantity: number
  variant?: string
}

const orderItems = ref<OrderLine[]>([])
const step = ref<'cart' | 'checkout' | 'done'>('cart')
const manualOrderId = ref('')
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

const paymentOptions = PAYMENT_OPTIONS as unknown as string[]

const orderLines = computed(() => orderItems.value.filter((l) => l.quantity > 0))
const orderTotal = computed(() => orderLines.value.reduce((sum, l) => sum + l.price * l.quantity, 0))
const amountPaidValid = computed(() => {
  const paid = Number(amountPaidInput.value)
  if (Number.isNaN(paid) || paid < 0) return false
  return paid >= orderTotal.value
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

onBeforeUnmount(() => closeReceiptCamera())

function lineKey(line: OrderLine) {
  return `${line.id}-${line.variant ?? ''}`
}

function lineDisplayName(line: OrderLine) {
  if (line.variant) {
    const label = line.variant === 'iced' ? 'Cold' : line.variant === 'hot' ? 'Hot' : line.variant
    return `${line.name} (${label})`
  }
  return line.name
}

function getQty(id: number, variant?: string) {
  const line = orderItems.value.find((l) => l.id === id && (l.variant ?? '') === (variant ?? ''))
  return line?.quantity ?? 0
}

function adjustQty(item: { id: number; name: string; price: number }, delta: number, variant?: string) {
  const existing = orderItems.value.find((l) => l.id === item.id && (l.variant ?? '') === (variant ?? ''))
  if (existing) {
    existing.quantity = Math.max(0, existing.quantity + delta)
  } else if (delta > 0) {
    orderItems.value.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      ...(variant && { variant }),
    })
  }
  orderItems.value = orderItems.value.filter((l) => l.quantity > 0)
}

function goToCheckout() {
  if (orderLines.value.length === 0) return
  manualOrderId.value = getNextOrderNumber()
  selectedPayment.value = paymentOptions[0]
  amountPaidInput.value = orderTotal.value
  manualTransactionId.value = ''
  receiptImageData.value = null
  step.value = 'checkout'
}

function completeSale() {
  if (orderLines.value.length === 0 || !user.value) return
  if (!checkoutValid.value) return
  const paid = Number(amountPaidInput.value)
  addSale({
    orderId: manualOrderId.value,
    items: orderLines.value.map((l) => ({
      id: l.id,
      name: l.name,
      price: l.price,
      quantity: l.quantity,
      ...(l.variant && { variant: l.variant }),
    })),
    total: orderTotal.value,
    staffId: user.value.id,
    staffName: user.value.name,
    source: 'manual',
    paymentMethod: selectedPayment.value || undefined,
    amountPaid: selectedPayment.value === 'Cash' && !Number.isNaN(paid) ? paid : (selectedPayment.value === 'E-wallet' ? orderTotal.value : undefined),
    ...(selectedPayment.value === 'E-wallet' && receiptImageData.value && { receiptProof: receiptImageData.value }),
    ...(selectedPayment.value === 'E-wallet' && (manualTransactionId.value?.trim() || '') && { manualTransactionId: manualTransactionId.value.trim() }),
  })
  lastCompletedOrderId.value = manualOrderId.value
  orderItems.value = []
  manualTransactionId.value = ''
  receiptImageData.value = null
  step.value = 'done'
  useActivityLog().log('Sale recorded (manual)', `Order ${manualOrderId.value}, ₱${orderTotal.value.toLocaleString()}, ${selectedPayment.value}`)
}
</script>
