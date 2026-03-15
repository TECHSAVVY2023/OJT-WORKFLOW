export function useGalleryPage() {
  const { siteData } = useSiteData()
  const images = computed(() => siteData.ourSpace?.images ?? [])

  const lightboxIndex = ref<number | null>(null)
  const lightboxSrc = computed(() =>
    lightboxIndex.value !== null && images.value[lightboxIndex.value]
      ? images.value[lightboxIndex.value]
      : null
  )

  const lightboxRef = ref<HTMLElement | null>(null)

  function openLightbox(index: number) {
    lightboxIndex.value = index
  }

  function closeLightbox() {
    lightboxIndex.value = null
  }

  function prevImage() {
    if (lightboxIndex.value !== null && lightboxIndex.value > 0) {
      lightboxIndex.value = lightboxIndex.value - 1
    }
  }

  function nextImage() {
    if (lightboxIndex.value !== null && lightboxIndex.value < images.value.length - 1) {
      lightboxIndex.value = lightboxIndex.value + 1
    }
  }

  function onLightboxKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
  }

  watch(lightboxIndex, (val) => {
    if (val !== null) {
      nextTick(() => lightboxRef.value?.focus())
    }
  })

  return {
    siteData,
    images,
    lightboxIndex,
    lightboxSrc,
    lightboxRef,
    openLightbox,
    closeLightbox,
    prevImage,
    nextImage,
    onLightboxKeydown,
  }
}
