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
          aria-labelledby="almost-there-title"
        >
          <div class="w-16 h-16 rounded-full bg-palette-sage flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-palette-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <h2 id="almost-there-title" class="text-xl font-bold text-palette-brown mb-3">
            Almost there!
          </h2>
          <p class="text-sm text-palette-brown/90 mb-6 leading-relaxed">
            Please review your order carefully before proceeding.<br />
            Changes cannot be made once the order is confirmed.
          </p>
          <div class="flex gap-3 justify-center">
            <button
              type="button"
              class="flex-1 py-3 rounded-full bg-palette-olive text-palette-white font-semibold text-sm uppercase hover:opacity-90 transition-opacity"
              @click="$emit('update:modelValue', false)"
            >
              Back
            </button>
            <button
              type="button"
              class="flex-1 py-3 rounded-full bg-palette-sage text-palette-white font-semibold text-sm uppercase hover:opacity-90 transition-opacity"
              @click="$emit('proceed')"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  proceed: []
}>()
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
