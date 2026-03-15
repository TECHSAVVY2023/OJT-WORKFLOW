<template>
  <div class="min-h-screen bg-palette-cream/30 font-poppins pb-16">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
      <GalleryHeader :our-space="siteData.ourSpace" />
      <GalleryGrid
        :images="images"
        :gallery-title="siteData.ourSpace?.title"
        @open="openLightbox"
      />
    </div>
    <GalleryLightbox
      :lightbox-index="lightboxIndex"
      :lightbox-src="lightboxSrc"
      :lightbox-ref="lightboxRef"
      :images-count="images.length"
      :gallery-title="siteData.ourSpace?.title"
      @close="closeLightbox"
      @prev="prevImage"
      @next="nextImage"
      @keydown="onLightboxKeydown"
    />
  </div>
</template>

<script setup lang="ts">
const {
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
} = useGalleryPage()
</script>
