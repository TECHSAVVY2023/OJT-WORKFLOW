<template>
  <div class="order-qr-scanner">
    <div id="staff-qr-scanner" class="min-h-[280px]" />
  </div>
</template>

<script setup lang="ts">
/**
 * Client-only QR scanner for staff to scan order QR codes.
 * Renders the html5-qrcode scanner into #staff-qr-scanner.
 */

export interface WorkflowOrderPayload {
  orderId: string
  source: string
  ts?: number
}

const emit = defineEmits<{
  scan: [payload: WorkflowOrderPayload]
  error: [message: string]
}>()

let scannerInstance: import('html5-qrcode').Html5QrcodeScanner | null = null

onMounted(async () => {
  if (import.meta.server) return
  try {
    const { Html5QrcodeScanner } = await import('html5-qrcode')
    scannerInstance = new Html5QrcodeScanner(
      'staff-qr-scanner',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      },
      false
    )
    scannerInstance.render(
      (decodedText: string) => {
        try {
          const data = JSON.parse(decodedText) as WorkflowOrderPayload
          if (data?.orderId && data?.source === 'workflow') {
            emit('scan', data)
            scannerInstance?.clear().catch(() => {})
            scannerInstance = null
          }
        } catch {
          emit('error', 'Invalid order QR code')
        }
      },
      () => {}
    )
  } catch (e) {
    emit('error', e instanceof Error ? e.message : 'Failed to start scanner')
  }
})

onBeforeUnmount(() => {
  if (scannerInstance) {
    scannerInstance.clear().catch(() => {})
    scannerInstance = null
  }
})
</script>
