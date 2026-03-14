<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="bg-palette-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <h2 :id="titleId" class="text-lg font-bold text-palette-brown mb-2">
            {{ title }}
          </h2>
          <p class="text-sm text-palette-brown/90 mb-6">
            {{ message }}
          </p>
          <div class="flex gap-3 justify-center">
            <button
              v-if="!singleButton"
              type="button"
              class="flex-1 py-2.5 rounded-full border-2 border-palette-olive bg-transparent text-palette-brown font-semibold text-sm hover:bg-palette-cream transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="flex-1 py-2.5 rounded-full font-semibold text-sm transition-opacity"
              :class="danger ? 'bg-red-500 text-white hover:opacity-90' : 'bg-palette-sage text-palette-white hover:opacity-90'"
              @click="onConfirm"
            >
              {{ singleButton ? (confirmLabel || 'OK') : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    /** When true, only show one button (OK) that closes the modal */
    singleButton?: boolean
  }>(),
  {
    confirmLabel: 'Yes',
    cancelLabel: 'Cancel',
    danger: false,
    singleButton: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const titleId = 'confirm-modal-title'

function onConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
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
