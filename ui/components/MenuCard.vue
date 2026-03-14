<template>
  <article
    class="relative flex flex-col bg-palette-white rounded-xl shadow-md overflow-hidden p-2 md:p-4 transition-transform duration-200 hover:scale-[1.02] font-poppins"
  >
    <div class="aspect-square w-full overflow-hidden rounded-lg bg-palette-grey flex-shrink-0">
      <img
        :src="item.image"
        :alt="item.name"
        class="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <h3 class="mt-1.5 md:mt-3 font-bold text-palette-brown text-left flex-shrink-0 text-sm md:text-base line-clamp-2">
      {{ item.name }}
    </h3>
    <!-- Hot / Iced variant selector when item has variants -->
    <div v-if="item.variants?.length" class="mt-1 md:mt-2 flex flex-wrap gap-1 md:gap-1.5">
      <button
        v-for="v in item.variants"
        :key="v"
        type="button"
        class="px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-medium transition-colors capitalize"
        :class="selectedVariant === v
          ? 'bg-palette-sage text-palette-white'
          : 'bg-palette-grey/40 text-palette-brown hover:bg-palette-grey/60'"
        @click="selectedVariant = v"
      >
        {{ v === 'iced' ? 'Iced' : 'Hot' }}
      </button>
    </div>
    <div class="flex items-center justify-between gap-1 md:gap-2 mt-1 md:mt-2">
      <span class="font-medium text-palette-brown text-xs md:text-base">₱{{ item.price }}</span>
      <div class="flex items-center gap-0.5 md:gap-1 rounded-md md:rounded-lg bg-palette-sage p-0.5 md:p-1">
        <button
          type="button"
          class="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center text-palette-white hover:bg-white/20 disabled:opacity-50 font-bold text-sm md:text-lg leading-none select-none"
          :disabled="quantity <= 0"
          aria-label="Decrease quantity"
          @click="quantity = Math.max(0, quantity - 1)"
        >
          −
        </button>
        <span class="min-w-[1rem] md:min-w-[1.25rem] text-center text-xs md:text-sm font-medium text-palette-white">{{ quantity }}</span>
        <button
          type="button"
          class="w-6 h-6 md:w-8 md:h-8 rounded flex items-center justify-center text-palette-white hover:bg-white/20 font-bold text-sm md:text-lg leading-none select-none"
          aria-label="Increase quantity"
          @click="quantity += 1"
        >
          +
        </button>
      </div>
    </div>
    <p v-if="item.description" class="mt-1 md:mt-2 text-xs md:text-sm text-palette-olive leading-relaxed line-clamp-2 md:line-clamp-none">
      {{ item.description }}
    </p>
    <div class="mt-auto pt-2 md:pt-3">
      <button
        type="button"
        class="w-full py-1.5 md:py-2.5 rounded-full text-palette-white font-semibold text-xs md:text-sm shadow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style="background-color: #7B7557"
        :disabled="!item.available"
        @click="addToOrder"
      >
        Add to Order
      </button>
    </div>
    <div
      v-if="!item.available"
      class="absolute inset-0 flex items-center justify-center rounded-xl bg-palette-dark/60 backdrop-blur-sm"
      aria-hidden="true"
    >
      <span class="rounded-lg bg-palette-dark px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-palette-white">
        Unavailable
      </span>
    </div>

    <ConfirmModal
      v-model="showInvalidQty"
      title="Invalid quantity"
      message="Please put a valid quantity."
      confirm-label="OK"
      single-button
    />
    <ConfirmModal
      v-model="showAddConfirm"
      title="Add to order?"
      :message="addConfirmMessage"
      confirm-label="Yes, add to order"
      cancel-label="Cancel"
      @confirm="doAddToOrder"
    />
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  item: {
    id: number
    name: string
    price: number
    image: string
    available: boolean
    description?: string
    variants?: string[]
  }
}>()

const emit = defineEmits<{ 'added-to-cart': [itemName: string] }>()

const quantity = ref(0)
const showInvalidQty = ref(false)
const showAddConfirm = ref(false)
const selectedVariant = ref<string | undefined>(
  props.item.variants?.length ? props.item.variants[0] : undefined
)

const { addToCart } = useCart()

const addConfirmMessage = computed(() => {
  const qty = quantity.value
  const name = props.item.name
  const variant = selectedVariant.value ? ` (${selectedVariant.value})` : ''
  return `Are you sure you want to add ${qty} × ${name}${variant} to your order?`
})

watch(() => props.item.variants, (variants) => {
  selectedVariant.value = variants?.length ? variants[0] : undefined
}, { immediate: false })

function addToOrder() {
  if (!props.item.available) return
  if (quantity.value <= 0) {
    showInvalidQty.value = true
    return
  }
  showAddConfirm.value = true
}

function doAddToOrder() {
  addToCart(
    {
      id: props.item.id,
      name: props.item.name,
      price: props.item.price,
      image: props.item.image,
      description: props.item.description,
    },
    quantity.value,
    selectedVariant.value
  )
  quantity.value = 0
  emit('added-to-cart', props.item.name)
}
</script>
