<template>
  <div class="space-y-4">
    <div v-for="(path, i) in normalizedList" :key="`${i}-${path || 'empty'}`" class="p-3 border border-palette-olive/20 rounded-workflow">
      <AdminImageUpload
        :model-value="path"
        @update:model-value="(v) => updateItem(i, v)"
      />
    </div>
    <button
      type="button"
      class="text-palette-sage font-medium text-sm hover:underline"
      @click="add"
    >
      + Add image
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

/** Canonical key for dedupe: same path = same image (handles relative vs absolute URLs) */
function urlKey(url: string): string {
  const t = (url || '').trim()
  if (!t) return ''
  try {
    return new URL(t, 'http://x').pathname.toLowerCase()
  } catch {
    return t.toLowerCase()
  }
}

/** Dedupe by canonical path (keep first occurrence), at most one empty slot at the end */
function normalize(list: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  let hasEmpty = false
  for (const url of list) {
    const key = urlKey(url)
    if (!key) {
      if (!hasEmpty) {
        result.push('')
        hasEmpty = true
      }
    } else {
      if (!seen.has(key)) {
        seen.add(key)
        result.push(url)
      }
    }
  }
  return result
}

const normalizedList = computed(() => normalize(props.modelValue))

// Sync parent with deduped list when opening Edit so only one image shows (no double pic)
watch(
  () => props.modelValue,
  (val) => {
    const list = val ?? []
    const norm = normalize(list)
    const same = norm.length === list.length && norm.every((n, i) => (list[i] ?? '') === n)
    if (!same) {
      nextTick(() => emit('update:modelValue', norm))
    }
  },
  { immediate: true, flush: 'post' }
)

function updateItem(index: number, path: string) {
  const list = normalizedList.value
  const next = [...list]
  if (index >= 0 && index < next.length) next[index] = path
  emit('update:modelValue', normalize(next))
}
function remove(index: number) {
  const list = normalizedList.value
  const next = list.filter((_, j) => j !== index)
  emit('update:modelValue', normalize(next))
}
function add() {
  const list = normalizedList.value
  if (list.length && list[list.length - 1] === '') return
  emit('update:modelValue', normalize([...list, '']))
}
</script>
