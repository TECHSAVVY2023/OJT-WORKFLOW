<template>
  <div class="pb-16 bg-palette-cream font-poppins">
    <VenueHero
      :title="pageData.hero.title"
      :subtitle="pageData.hero.subtitle"
      :image="pageData.hero.image"
    />
    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-12">
      <!-- 2 columns (1 on mobile); single venue centered -->
      <div
        class="venue-grid grid gap-5 sm:gap-6 md:gap-8 w-full"
        :class="venues.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'"
      >
        <VenueCard
          v-for="venue in venues"
          :key="venue.id"
          :venue="venue"
        />
      </div>
      <p v-if="!venues.length" class="text-center py-12 text-palette-brown/80 text-sm sm:text-base">
        No spaces available at the moment. Check back soon.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import pageJson from '~/data/venues-page.json'

const { venuesData } = useAdminVenues()
const venues = venuesData

interface VenuesPageData {
  hero: {
    title: string
    subtitle: string
    image: string
  }
}

const pageData = pageJson as VenuesPageData

const amenitiesItems = [
  { icon: 'laptop', text: 'Free use of Premium Laptop Stands and Laptop Mats' },
  { icon: 'coffee', text: 'Unlimited Brewed Coffee' },
  { icon: 'pitcher', text: 'Unlimited Fruit-Infused Water' },
  { icon: 'game', text: 'Free access to Board Games' },
  { icon: 'book', text: 'Free access to Books' },
  { icon: 'wifi', text: 'High-speed Internet' },
  { icon: 'plug', text: 'Power Stations in every Table' },
  { icon: 'workspace', text: 'Unlimited Access to Ergonomic & Comfortable Workspace' },
]
</script>
