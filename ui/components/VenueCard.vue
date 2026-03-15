<template>
  <article
    class="flex flex-col bg-palette-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:scale-[1.02] font-poppins"
  >
    <div class="aspect-[4/3] w-full overflow-hidden bg-palette-grey">
      <img
        :src="venue.image"
        :alt="venue.name"
        class="h-full w-full object-cover"
        loading="lazy"
        @error="($e: Event) => (($e.target as HTMLImageElement).style.display = 'none')"
      />
    </div>
    <div class="p-5 md:p-6 flex flex-col flex-1">
      <h2 class="text-xl font-bold font-poppins text-palette-brown">
        {{ venue.name }}
      </h2>
      <p class="mt-2 text-sm font-poppins text-palette-brown/90 leading-relaxed line-clamp-3">
        {{ venue.description }}
      </p>
      <p v-if="venue.capacity" class="mt-3 text-sm font-medium text-palette-brown flex items-center gap-1.5">
        <Icon name="mdi:account-group" class="w-4 h-4 text-palette-olive shrink-0" />
        {{ venue.capacity }}
      </p>

      <div v-if="venue.amenities?.length" class="mt-4">
        <p class="text-xs font-semibold text-palette-brown uppercase tracking-wide mb-2">Amenities:</p>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="(amenity, index) in displayedAmenities"
            :key="index"
            class="text-xs px-3 py-1.5 rounded-full bg-palette-cream text-palette-brown border border-palette-grey whitespace-nowrap"
          >
            {{ amenity }}
          </li>
          <li
            v-if="remainingAmenityCount > 0"
            class="text-xs px-3 py-1.5 rounded-full bg-palette-cream text-palette-brown border border-palette-grey whitespace-nowrap"
          >
            +{{ remainingAmenityCount }} more
          </li>
        </ul>
      </div>

      <p v-if="venue.hourlyRate != null" class="mt-4 text-sm font-semibold text-palette-brown">
        Hourly Rate: <span class="text-palette-olive">₱{{ formatRate(venue.hourlyRate) }}</span>
      </p>

      <div class="mt-5 pt-4 border-t border-palette-grey">
        <NuxtLink
          :to="`/venues/${venue.id}`"
          class="block w-full py-2.5 rounded-full bg-palette-sage text-palette-white font-semibold font-poppins text-sm shadow hover:opacity-90 transition-opacity text-center"
        >
          Book This Room
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    venue: {
      id: number
      name: string
      description: string
      image?: string
      images?: string[]
      address?: string
      amenities?: string[]
      capacity?: string
      hourlyRate?: number
    }
    featured?: boolean
  }>(),
  { featured: false }
)

const displayImage = computed(() => props.venue.image ?? props.venue.images?.[0] ?? '')

const maxAmenitiesShown = 5
const displayedAmenities = computed(() => {
  const list = props.venue.amenities ?? []
  return list.slice(0, maxAmenitiesShown)
})
const remainingAmenityCount = computed(() => {
  const list = props.venue.amenities ?? []
  const remaining = list.length - maxAmenitiesShown
  return remaining > 0 ? remaining : 0
})

function formatRate(rate: number) {
  return rate.toLocaleString('en-PH', { minimumFractionDigits: 2 })
}
</script>

<style scoped>
.venue-card--featured {
  @apply md:flex-row md:flex;
}
.venue-card--featured .venue-card__media {
  @apply md:rounded-none md:rounded-l-[1rem];
}
.venue-card--featured .venue-card__body {
  @apply md:justify-center;
}
</style>
