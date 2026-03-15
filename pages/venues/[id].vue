<template>
  <div class="min-h-screen bg-white font-poppins pb-16">
    <div class="container mx-auto px-4 md:px-[55px] py-6 md:py-8">
      <div v-if="venue" class="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <!-- Left: main content -->
        <div class="flex-1 min-w-0">
          <!-- Image with overlays -->
          <div class="relative rounded-2xl overflow-hidden bg-palette-grey shadow-md">
            <img
              :src="mainImage"
              :alt="venue.name"
              class="w-full aspect-[16/10] object-cover"
            />
            <span
              class="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-palette-sage text-palette-white text-xs font-semibold uppercase"
            >
              Available
            </span>
            <span
              class="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-palette-white text-palette-brown text-sm font-semibold shadow"
            >
              ₱{{ formatRate(venue.hourlyRate ?? 0) }}/hr
            </span>
          </div>
          <!-- Additional photos gallery -->
          <div v-if="venueImages.length > 1" class="mt-3 flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(img, idx) in venueImages"
              :key="idx"
              type="button"
              class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors"
              :class="selectedImageIndex === idx ? 'border-palette-sage' : 'border-transparent hover:border-palette-grey'"
              @click="selectedImageIndex = idx"
            >
              <img :src="img" :alt="`${venue.name} photo ${idx + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>

          <h1 class="mt-6 text-2xl md:text-3xl font-bold text-palette-brown">
            {{ venue.name }}
          </h1>
          <p v-if="venue.locationShort" class="mt-1 text-sm text-palette-olive flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {{ venue.locationShort }}
          </p>
          <p class="mt-4 text-sm text-palette-brown/90 leading-relaxed">
            {{ venue.description }}
          </p>

          <!-- Key info cards: one row on mobile (small), grid on larger -->
          <div class="mt-6 flex flex-nowrap gap-2 sm:grid sm:grid-cols-3 sm:gap-4 overflow-x-auto pb-1">
            <div class="flex-1 min-w-[88px] rounded-lg sm:rounded-xl bg-palette-grey/60 border border-palette-grey p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 sm:min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-palette-sage/20 flex items-center justify-center shrink-0 text-palette-sage">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs font-medium text-palette-olive uppercase truncate">Capacity</p>
                <p class="text-xs sm:text-sm font-semibold text-palette-brown truncate">{{ venue.capacity ?? '—' }}</p>
              </div>
            </div>
            <div class="flex-1 min-w-[88px] rounded-lg sm:rounded-xl bg-palette-grey/60 border border-palette-grey p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 sm:min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-palette-sage/20 flex items-center justify-center shrink-0 text-palette-sage">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs font-medium text-palette-olive uppercase truncate">Hourly Rate</p>
                <p class="text-xs sm:text-sm font-semibold text-palette-brown truncate">₱{{ formatRate(venue.hourlyRate ?? 0) }}</p>
              </div>
            </div>
            <div class="flex-1 min-w-[88px] rounded-lg sm:rounded-xl bg-palette-grey/60 border border-palette-grey p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 sm:min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-palette-sage/20 flex items-center justify-center shrink-0 text-palette-sage">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs font-medium text-palette-olive uppercase truncate">Hours</p>
                <p class="text-xs sm:text-sm font-semibold text-palette-brown truncate">{{ venue.operatingHours ?? '—' }}</p>
              </div>
            </div>
          </div>

          <!-- Amenities & Features -->
          <div class="mt-8">
            <h2 class="text-lg font-bold text-palette-brown mb-4">Amenities & Features</h2>
            <ul class="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <li
                v-for="(amenity, index) in venue.amenities"
                :key="index"
                class="flex items-center gap-3 rounded-xl bg-palette-grey/40 border border-palette-grey px-4 py-3"
              >
                <VenueAmenityIcon :icon="amenityIcon(amenity)" />
                <span class="text-sm font-medium text-palette-brown">{{ amenity }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right: booking card (sticky) -->
        <aside class="lg:w-[340px] shrink-0">
          <div class="lg:sticky lg:top-24 rounded-2xl bg-palette-white border border-palette-grey shadow-lg p-6">
            <p class="text-xs text-palette-olive mb-1">Starting at</p>
            <p class="text-2xl font-bold text-palette-sage">
              ₱{{ formatRate(venue.hourlyRate ?? 0) }}
            </p>
            <p class="text-sm text-palette-brown/80 mb-6">per hour</p>

            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-palette-olive">Capacity</dt>
                <dd class="font-medium text-palette-brown">{{ venue.capacity ?? '—' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-palette-olive">Hours</dt>
                <dd class="font-medium text-palette-brown">{{ venue.operatingHours ?? '—' }}</dd>
              </div>
              <div class="flex justify-between items-center">
                <dt class="text-palette-olive">Status</dt>
                <dd>
                  <span class="inline-block px-3 py-1 rounded-full bg-palette-sage text-palette-white text-xs font-semibold">
                    Available
                  </span>
                </dd>
              </div>
            </dl>

            <button
              type="button"
              class="w-full mt-6 py-3 rounded-full bg-palette-sage text-palette-white font-semibold text-sm shadow hover:opacity-90 transition-opacity"
              @click="showBookingModal = true"
            >
              Book Now
            </button>
            <p class="mt-3 text-xs text-palette-olive/80 text-center">
              You'll be asked to select date, time, and provide your details.
            </p>
          </div>
        </aside>
      </div>

      <!-- Not found -->
      <div v-else class="py-16 text-center">
        <p class="text-palette-brown">Room not found.</p>
        <NuxtLink to="/venues" class="mt-4 inline-block text-palette-sage font-medium hover:underline">
          View all spaces
        </NuxtLink>
      </div>

      <BookingModal v-if="venue" v-model="showBookingModal" :venue="venue" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'VenueDetailPage' })

const route = useRoute()
const { venuesData } = useAdminVenues()
const venue = computed(() => {
  const id = Number(route.params.id)
  return venuesData.value.find((v) => v.id === id) ?? null
})
const showBookingModal = ref(false)
const selectedImageIndex = ref(0)
const venueImages = computed(() => {
  const v = venue.value
  if (!v) return []
  const imgs = (v as { images?: string[] }).images
  if (imgs?.length) return imgs
  return v.image ? [v.image] : []
})
const mainImage = computed(() => {
  const imgs = venueImages.value
  if (imgs.length) return imgs[selectedImageIndex.value] ?? imgs[0]
  return venue.value?.image ?? ''
})
watch(venue, () => { selectedImageIndex.value = 0 }, { immediate: true })

function formatRate(rate: number) {
  return rate.toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

const amenityIcons: Record<string, string> = {
  'High-speed internet': 'wifi',
  'Power outlets': 'plug',
  'Air conditioning': 'ac',
  'Ergonomic chairs': 'chair',
  'Laptop stand': 'laptop',
  'Laptop mat': 'mouse',
  'Board games': 'game',
  'Wifi': 'wifi',
  'Smart TV': 'laptop',
  'Tables and Chairs': 'chair',
  'Aircon': 'ac',
  'Unlimited brewed coffee': 'game',
  'Whiteboard': 'game',
}

function amenityIcon(amenity: string): string {
  return amenityIcons[amenity] ?? 'default'
}
</script>
