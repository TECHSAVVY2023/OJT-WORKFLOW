<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="bg-palette-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-confirmed-title"
        >
          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="w-10 h-10 rounded-lg bg-palette-sage flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-palette-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h2 id="order-confirmed-title" class="text-xl font-bold text-palette-brown">
              Order Confirmed
            </h2>
          </div>
          <div class="bg-palette-grey rounded-xl p-6 flex justify-center items-center my-6">
            <div class="w-40 h-40 bg-white rounded-lg flex items-center justify-center border-2 border-palette-sage overflow-hidden">
              <img
                v-if="qrDataUrl"
                :src="qrDataUrl"
                alt="Order QR code"
                class="w-full h-full object-contain"
              />
              <span v-else class="text-palette-sage font-bold text-2xl">QR</span>
            </div>
          </div>
          <p class="font-semibold text-palette-brown mb-4">
            Order No. {{ orderNumber || '—' }}
          </p>
          <p class="text-sm text-palette-brown/90 mb-6 leading-relaxed">
            Thank you for your order. Please proceed to the counter to complete your payment and present your QR code to the barista.
          </p>
          <button
            type="button"
            class="w-full py-3 rounded-full bg-palette-sage text-palette-white font-semibold text-sm uppercase hover:opacity-90 transition-opacity"
            @click="onDone"
          >
            Done
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  orderNumber?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  done: []
}>()

const qrDataUrl = ref<string>('')

// Generate QR code when modal opens with an order number (client-only; encodes order for staff scan)
watch(
  () => [props.modelValue, props.orderNumber] as const,
  async ([open, orderNo]) => {
    if (!open || !orderNo) {
      qrDataUrl.value = ''
      return
    }
    try {
      const mod = await import('qrcode')
      const QRCode = (mod as { default?: typeof mod }).default ?? mod
      const payload = JSON.stringify({
        orderId: orderNo,
        source: 'workflow',
        ts: Date.now(),
      })
      qrDataUrl.value = await QRCode.toDataURL(payload, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'M',
      })
    } catch (e) {
      console.error('QR generation failed', e)
      qrDataUrl.value = ''
    }
  },
  { immediate: true }
)

function onDone() {
  emit('update:modelValue', false)
  emit('done')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .bg-palette-white,
.modal-leave-active .bg-palette-white {
  transition: transform 0.2s ease;
}
.modal-enter-from .bg-palette-white,
.modal-leave-to .bg-palette-white {
  transform: scale(0.95);
}
</style>
