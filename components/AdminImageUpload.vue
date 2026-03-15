<template>
  <div class="space-y-2">
    <div v-if="modelValue" class="flex items-start gap-3">
      <div class="w-20 h-24 flex items-center justify-center rounded-workflow border border-palette-olive/30 bg-palette-cream/30 overflow-hidden shrink-0">
        <img
          :src="modelValue"
          alt="Preview"
          class="max-w-full max-h-full object-contain"
          @error="($event as Event & { target: HTMLImageElement }).target.style.display = 'none'"
        />
      </div>
      <div v-if="!hideRemoveLink" class="flex-1 min-w-0">
        <p class="text-sm text-palette-brown/80 truncate">{{ modelValue }}</p>
        <button
          type="button"
          class="mt-1 text-sm text-red-600 hover:underline"
          @click="emit('update:modelValue', '')"
        >
          Remove image
        </button>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        class="hidden"
        @change="onFileChange"
      />
      <button
        type="button"
        class="px-4 py-2 bg-palette-sage text-white text-sm font-medium rounded-workflow hover:opacity-90 disabled:opacity-50"
        :disabled="uploading"
        @click="fileInputRef?.click()"
      >
        {{ uploading ? 'Uploading…' : (modelValue ? 'Replace image' : 'Upload image') }}
      </button>
      <span v-if="uploadError" class="text-sm text-red-600">{{ uploadError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; hideRemoveLink?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadError.value = ''
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await $fetch<{ path: string }>('/api/upload-image', {
      method: 'POST',
      body: formData,
    })
    emit('update:modelValue', res.path)
  } catch (err: unknown) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>
