<template>
  <div class="min-h-screen font-poppins">
    <!-- Hero Section (Figma reference: light overlay, dark text, #3AFF86 accent, Poppins) -->
    <section id="hero" class="relative h-[90vh] min-h-[680px] flex flex-col justify-start pt-6 sm:pt-8 md:pt-10 overflow-hidden scroll-mt-0">
      <div class="absolute inset-0">
        <img :src="siteData.hero.backgroundImage" :alt="siteData.hero.backgroundImageAlt" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-white/65" aria-hidden="true" />
      </div>
      <div class="relative z-10 text-center px-6 lg:px-12 max-w-5xl mx-auto mt-2 sm:mt-4 font-poppins">
        <h5 class="text-sm sm:text-base md:text-lg font-bold font-poppins uppercase tracking-widest mb-2 md:mb-3" :style="{ color: siteData.hero.textColor || '#1a1a1a' }">{{ siteData.hero.subtitle }}</h5>
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-poppins leading-tight mb-3 md:mb-4" :style="{ color: siteData.hero.textColor || '#1a1a1a' }">
          {{ siteData.hero.title }} <span :style="{ color: siteData.hero.titleHighlightColor || '#3AFF86' }">{{ siteData.hero.titleHighlight }}</span>.
        </h1>
        <p class="text-base font-medium font-poppins max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed" :style="{ color: siteData.hero.textColor || '#1a1a1a' }">{{ siteData.hero.description }}</p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <NuxtLink
            v-for="(button, index) in siteData.hero.buttons"
            :key="index"
            :to="button.action === 'order' ? '/menu' : '/venues/1'"
            :class="[
              'font-bold font-poppins text-sm px-5 py-2.5 rounded-full uppercase tracking-wide transition-opacity hover:opacity-90 border-2',
              button.type === 'primary' ? 'hover:opacity-90' : 'bg-transparent hover:opacity-90'
            ]"
            :style="button.type === 'primary' ? heroPrimaryButtonStyle : heroSecondaryButtonStyle"
          >
            {{ button.text }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" class="section-block py-20 md:py-24 bg-white scroll-mt-20 font-poppins">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="text-center lg:text-left font-poppins">
            <h2
              class="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
              :style="{ fontFamily: siteData.about.titleFontFamily || 'Poppins', color: siteData.about.titleColor }"
            >{{ siteData.about.title }}</h2>
            <p
              v-for="(paragraph, index) in siteData.about.paragraphs"
              :key="index"
              class="text-base leading-relaxed mb-4 md:mb-6"
              :style="{ fontFamily: siteData.about.textFontFamily || 'Poppins', color: siteData.about.textColor }"
            >
              <span v-html="paragraph.replace(/\n/g, '<br />')"></span>
            </p>
            <div class="mt-8 md:mt-10 flex justify-center lg:justify-start">
              <NuxtLink
                to="/about"
                class="inline-flex items-center justify-center min-w-[160px] font-bold text-sm px-5 py-2.5 rounded-full uppercase tracking-wide transition-opacity hover:opacity-90"
                :style="aboutButtonStyle"
                @mouseover="aboutButtonMouseOver"
                @mouseleave="aboutButtonMouseLeave"
              >
                {{ siteData.about.button.text }}
              </NuxtLink>
            </div>
          </div>
          <div class="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl max-w-sm mx-auto md:max-w-none md:mx-0">
            <img :src="siteData.about.image" :alt="siteData.about.imageAlt" class="w-full h-auto object-cover aspect-[4/3] md:aspect-auto" />
            <div class="absolute bottom-3 left-3 md:bottom-6 md:left-6 bg-white/80 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full font-bold font-poppins text-workflow-green text-sm md:text-lg shadow-md">{{ siteData.about.overlayText }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Marquee Bar (High Speed Internet, etc.) - green -->
    <div class="py-2.5 md:py-5 overflow-hidden font-poppins" style="background-color: #69AC7C;">
      <div class="relative">
        <div class="animate-marquee whitespace-nowrap flex items-center">
          <div v-for="n in 2" :key="n" class="inline-flex items-center gap-2 md:gap-6 lg:gap-8 px-3 md:px-6 text-white text-xs md:text-lg font-semibold font-poppins uppercase tracking-wider">
            <div v-for="(feature, index) in siteData.features" :key="index" class="flex items-center gap-2 md:gap-3 min-w-max">
              <div class="rounded-full bg-white/25 p-1.5 md:p-2.5 flex items-center justify-center">
                <svg class="w-4 h-4 md:w-6 md:h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path v-if="feature.icon === 'wifi'" stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  <g v-else-if="feature.icon === 'outlet'">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1z" />
                    <circle cx="9" cy="12.5" r="1.25" stroke="currentColor" fill="none" stroke-width="2" />
                    <circle cx="15" cy="12.5" r="1.25" stroke="currentColor" fill="none" stroke-width="2" />
                  </g>
                  <path v-else-if="feature.icon === 'ac'" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16v3H4V6zm0 5h16M4 14h16M4 17h16" />
                  <path v-else-if="feature.icon === 'chair'" stroke-linecap="round" stroke-linejoin="round" d="M6 18h12v1.5H6V18zm2.5-1.5V9h7v7.5M12 19.5v1.5m-2.5 0h5" />
                </svg>
              </div>
              <span class="drop-shadow-sm">{{ feature.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Space Section -->
    <section id="our-space" class="section-block py-20 md:py-24 bg-palette-cream/50 font-poppins scroll-mt-20">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div class="w-full max-w-5xl mx-auto">
          <!-- Heading centered -->
          <h2
            class="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center"
            :style="{ fontFamily: siteData.ourSpace.titleFontFamily || 'Poppins', color: siteData.ourSpace.titleColor || '#69AC7C' }"
          >{{ siteData.ourSpace.title }}</h2>
          <div class="mb-8 md:mb-10">
            <p
              class="text-base leading-relaxed mb-6 md:mb-8 text-justify indent-8"
              :style="{ fontFamily: siteData.ourSpace.textFontFamily || 'Poppins', color: siteData.ourSpace.textColor || '#374151' }"
            >{{ siteData.ourSpace.description }}</p>
            <NuxtLink
              to="/venues/1"
              class="inline-flex items-center justify-center min-w-[160px] font-bold text-sm px-5 py-2.5 rounded-full uppercase tracking-wide border-2 transition-opacity hover:opacity-90 shadow-md"
              :style="ourSpaceButtonStyle"
              @mouseover="ourSpaceButtonMouseOver"
              @mouseleave="ourSpaceButtonMouseLeave"
            >
              {{ siteData.ourSpace.button.text }}
            </NuxtLink>
          </div>
          <!-- 4 images in a row, carousel with next button -->
          <div class="relative w-full">
            <div class="overflow-hidden rounded-xl border border-gray-200/80 w-full">
              <div
                class="flex w-full ease-in-out"
                :class="{ 'transition-transform duration-500': !carouselNoTransition }"
                :style="{ transform: `translateX(-${currentGroup * 100}%)` }"
              >
                <div v-for="(group, groupIndex) in groupedSlides" :key="'carousel-' + groupIndex" class="w-full min-w-full flex-shrink-0 grid grid-cols-4 gap-3 md:gap-4 p-0">
                  <div v-for="(slide, index) in group" :key="index" class="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      :src="slide"
                      class="w-full h-full object-cover"
                      style="image-rendering: auto; -webkit-backface-visibility: hidden; backface-visibility: hidden;"
                      decoding="async"
                      :fetchpriority="groupIndex === 0 && index < 4 ? 'high' : undefined"
                      :loading="groupIndex === 0 && index < 4 ? 'eager' : 'lazy'"
                      :alt="`Space image ${(groupIndex % (groupedSlides.length || 1)) * siteData.ourSpace.carousel.itemsPerGroup + index + 1}`"
                      @error="($e: Event) => (($e.target as HTMLImageElement).style.display = 'none')"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button type="button" @click="prevGroup" class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white border border-gray-200 transition-colors z-10" aria-label="Previous">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" @click="nextGroup" class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white border border-gray-200 transition-colors z-10" aria-label="Next">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div class="mt-6 flex justify-center">
            <NuxtLink
              to="/gallery"
              class="our-space-gallery-link inline-flex items-center justify-center gap-2 min-w-[200px] font-bold text-sm px-6 py-3 rounded-full uppercase tracking-wide shadow-md"
              :style="ourSpaceButtonStyle"
              @mouseover="ourSpaceGalleryLinkMouseOver"
              @mouseleave="ourSpaceGalleryLinkMouseLeave"
            >
              {{ siteData.ourSpace.galleryButton?.text || 'View full gallery' }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Features Bar -->
    <div class="max-w-[800px] mx-auto px-2 lg:px-4 py-2 md:py-3 font-poppins">
      <div class="py-3 md:py-4 px-4 lg:px-6 font-poppins overflow-visible" style="background-color: #7B7557; border-radius: 50px;">
        <div class="flex flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
          <button
            v-for="(feature, index) in siteData.serviceFeatures"
            :key="index"
            type="button"
            class="service-feature-btn group relative flex items-center gap-2 outline-none rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#7B7557]"
            :style="{ animationDelay: `${index * 120}ms` }"
          >
            <div class="rounded-full bg-white p-1.5 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95">
              <svg v-if="feature.icon === 'chef'" class="w-5 h-5" fill="none" stroke="#4B5563" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m0-16c-2 0-4 1-4 3v1h8V7c0-2-2-3-4-3zm0 0V2m0 2c2 0 4 1 4 3v1h-8V7c0-2 2-3 4-3z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 8h8M8 12h8M8 16h8" /></svg>
              <svg v-else-if="feature.icon === 'basket'" class="w-5 h-5" fill="none" stroke="#4B5563" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <svg v-else-if="feature.icon === 'lightbulb'" class="w-5 h-5" fill="none" stroke="#4B5563" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            <span
              class="service-feature-label text-white font-poppins font-bold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap overflow-hidden max-w-0 opacity-0 pointer-events-none transition-all duration-300 ease-out group-hover:max-w-[11rem] group-hover:opacity-100 group-focus:max-w-[11rem] group-focus:opacity-100 md:max-w-none md:opacity-100"
            >
              {{ feature.name }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Best-Selling Items Section -->
    <section id="best-selling" class="section-block py-20 md:py-24 bg-white scroll-mt-20">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="text-center mb-10 md:mb-12">
          <h2
            class="text-3xl md:text-4xl font-bold mb-6 md:mb-8"
            :style="{ fontFamily: siteData.bestSellingItems.titleFontFamily || 'Poppins', color: siteData.bestSellingItems.titleColor || '#1a1a1a' }"
          >
            {{ siteData.bestSellingItems.title.prefix }}
            <span :style="{ color: siteData.bestSellingItems.titleHighlightColor || '#3AFF86' }">{{ siteData.bestSellingItems.title.highlight }}</span>
            {{ siteData.bestSellingItems.title.suffix }}
          </h2>
        </div>
        <p
          class="text-base leading-relaxed max-w-4xl mx-auto text-justify mb-10 md:mb-12 px-4 md:px-6"
          :style="{ fontFamily: siteData.bestSellingItems.descriptionFontFamily || 'Poppins', color: siteData.bestSellingItems.descriptionColor || '#374151', textIndent: '2em' }"
        >{{ siteData.bestSellingItems.description }}</p>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 md:mb-20 max-w-6xl mx-auto px-4 md:px-6">
          <MenuCard v-for="item in bestSellingMenuItems" :key="item.id" :item="item" @added-to-cart="onAddedToCart" />
        </div>
        <!-- Added to cart modal (index only) -->
        <Teleport to="body">
          <div v-if="showAddedToCartModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 font-poppins" @click.self="showAddedToCartModal = false">
            <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center" @click.stop>
              <p class="text-gray-800 font-medium mb-6">
                {{ addedToCartItemName ? `"${addedToCartItemName}" has been added to your cart.` : 'Item has been added to your cart.' }}
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button type="button" class="inline-flex items-center justify-center min-w-[140px] py-2.5 px-5 rounded-full font-semibold text-sm border-2 transition-colors" style="border-color: #7B7557; color: #7B7557" @click="showAddedToCartModal = false">
                  Done
                </button>
                <NuxtLink to="/cart" class="inline-flex items-center justify-center min-w-[140px] py-2.5 px-5 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-90" style="background-color: #7B7557" @click="showAddedToCartModal = false">
                  View Cart
                </NuxtLink>
              </div>
            </div>
          </div>
        </Teleport>
        <div class="text-center mt-8 md:mt-12 flex justify-center">
          <NuxtLink
            to="/menu"
            class="best-selling-view-menu-link inline-flex items-center justify-center min-w-[160px] font-bold text-sm px-5 py-2.5 rounded-full uppercase tracking-wide transition-opacity hover:opacity-90"
            :style="bestSellingButtonStyle"
            @mouseover="bestSellingButtonMouseOver"
            @mouseleave="bestSellingButtonMouseLeave"
          >{{ siteData.bestSellingItems.viewMenuButton.text }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Announcements Section -->
    <section id="announcements" class="section-block py-20 md:py-24 bg-palette-cream/50 font-poppins scroll-mt-20">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="text-center mb-10 md:mb-12">
          <h2 class="text-3xl md:text-4xl font-bold font-poppins mb-6 md:mb-8 text-workflow-green">{{ siteData.announcements.title }}</h2>
        </div>
        <div class="flex justify-center items-center overflow-x-hidden overflow-y-visible pb-12 px-2 md:px-4">
          <!-- Mobile: no buttons; tap side cards to navigate, center card to view. Desktop: Prev/Next buttons + tap any card to view. -->
          <div class="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-full">
            <button
              @click="prevAnnouncement"
              type="button"
              class="hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green"
              style="background-color: #7B7557;"
              aria-label="Previous announcement"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="flex items-end justify-center min-w-0 flex-1 overflow-visible">
              <button
                v-for="(announcement, displayIndex) in displayedAnnouncements"
                :key="`${announcement.id}-${currentAnnouncementIndex}`"
                type="button"
                class="relative transition-all duration-500 ease-out hover:scale-105 hover:z-50 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green flex-shrink-0 w-[100px] h-[150px] sm:w-[128px] sm:h-[192px] md:w-[170px] md:h-[255px] lg:w-[200px] lg:h-[300px]"
                :class="[
                  displayIndex === 0 || displayIndex === 3 ? '-mr-[38px] sm:-mr-[42px] md:-mr-[45px]' : displayIndex < displayedAnnouncements.length - 1 ? '-mr-[6px] sm:-mr-[6px] md:-mr-[5px]' : 'mr-0'
                ]"
                :style="{
                  transform: displayIndex === 0 || displayIndex === 4 ? 'scale(0.65)' : displayIndex === 1 || displayIndex === 3 ? 'scale(0.80)' : 'scale(1)',
                  zIndex: displayIndex === 2 ? 30 : displayIndex === 1 || displayIndex === 3 ? 20 : 10,
                  opacity: displayIndex === 2 ? 1 : displayIndex === 1 || displayIndex === 3 ? 0.88 : 0.75
                }"
                @click="onAnnouncementCardClick(announcement, displayIndex)"
              >
                <div class="bg-white rounded-xl shadow-2xl overflow-hidden h-full w-full border-2 border-white/50">
                  <img v-if="getAnnouncementImage(announcement)" :src="getAnnouncementImage(announcement)" :alt="getAnnouncementTitle(announcement)" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                </div>
              </button>
            </div>
            <button
              @click="nextAnnouncement"
              type="button"
              class="hidden sm:flex flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-workflow-green"
              style="background-color: #7B7557;"
              aria-label="Next announcement"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Announcement detail modal -->
    <AnnouncementDetailModal v-model="showAnnouncementModal" :announcement="selectedAnnouncement" />

    <!-- FAQ Section -->
    <section id="faq" class="section-block py-20 md:py-24 bg-white font-poppins scroll-mt-20">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="text-center mb-10 md:mb-12">
          <h2 class="text-3xl md:text-4xl font-bold font-poppins mb-6 md:mb-8" style="color: #7B7557;">{{ siteData.faq.title }}</h2>
        </div>
        <div class="max-w-4xl mx-auto faq-accordion-list">
          <div v-for="(item, index) in siteData.faq.items" :key="item.id" class="faq-item border-t border-gray-200 first:border-t-0" :class="{ 'faq-item-open': openFaqIndex === index }">
            <button
              @click="toggleFaq(index)"
              class="faq-question-btn w-full text-white font-semibold font-poppins text-left px-6 py-4 flex items-center justify-between transition-all duration-300 ease-out"
              :style="{ backgroundColor: openFaqIndex === index ? '#5E5A45' : '#7B7557' }"
              @mouseover="($event as MouseEvent & { currentTarget: HTMLElement }).currentTarget.style.backgroundColor = '#5E5A45'"
              @mouseleave="openFaqIndex !== index && (($event as MouseEvent & { currentTarget: HTMLElement }).currentTarget.style.backgroundColor = '#7B7557')"
            >
              <span class="text-base md:text-lg pr-4">{{ item.question }}</span>
              <svg class="w-5 h-5 flex-shrink-0 ml-4 faq-chevron" :class="{ 'faq-chevron-open': openFaqIndex === index }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div class="faq-answer-wrapper" :class="{ 'faq-answer-wrapper-open': openFaqIndex === index }">
              <div class="faq-answer-inner">
                <div class="bg-amber-50/95 px-6 py-4 text-gray-700 font-poppins text-base leading-relaxed">{{ item.answer }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section id="newsletter" class="section-block font-poppins py-20 md:py-24 scroll-mt-20 bg-palette-cream/50">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold font-poppins mb-4" style="color: #7B7557;">{{ siteData.newsletter.title }}</h2>
          <p class="text-gray-700 font-poppins text-base md:text-lg leading-relaxed mb-8">{{ siteData.newsletter.description }}</p>
          <form class="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center" @submit.prevent>
            <input
              type="email"
              :placeholder="siteData.newsletter.emailPlaceholder"
              class="flex-1 min-w-0 px-4 py-3 border-2 rounded-lg font-poppins focus:outline-none focus:ring-2 focus:ring-workflow-green bg-white"
              style="border-color: #7B7557;"
            />
            <button
              type="submit"
              class="font-bold font-poppins text-sm px-6 py-3 rounded-full uppercase tracking-wide text-white transition-opacity hover:opacity-90 shrink-0"
              style="background-color: #7B7557;"
            >
              {{ siteData.newsletter.buttonText }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import menuJson from '~/data/menu.json'

interface MenuItem {
  id: number
  name: string
  price: number
  image: string
  available: boolean
  description?: string
  variants?: string[]
}

interface MenuCategory {
  category: string
  items: MenuItem[]
}

const { siteData } = useSiteData()
const menuData = menuJson as MenuCategory[]

const heroPrimaryButtonStyle = computed(() => {
  const h = siteData.hero
  const color = h.primaryButtonTextColor || '#ffffff'
  if (h.primaryButtonStyle === 'gradient') {
    const dir = h.primaryGradientDirection || 'to right'
    const c1 = h.primaryGradientColor1 || '#69AC7C'
    const c2 = h.primaryGradientColor2 || '#5a9a6e'
    return { background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color }
  }
  const bg = h.primaryButtonColor || '#69AC7C'
  return { backgroundColor: bg, borderColor: bg, color }
})

const heroSecondaryButtonStyle = computed(() => {
  const h = siteData.hero
  const textColor = h.secondaryButtonTextColor || h.secondaryButtonColor || '#7B7557'
  if (h.secondaryButtonStyle === 'gradient') {
    const dir = h.secondaryGradientDirection || 'to right'
    const c1 = h.secondaryGradientColor1 || '#7B7557'
    const c2 = h.secondaryGradientColor2 || '#605B45'
    return { background: `linear-gradient(${dir}, ${c1}, ${c2})`, borderColor: 'transparent', color: textColor }
  }
  const border = h.secondaryButtonColor || '#7B7557'
  return { borderColor: border, color: textColor }
})

const aboutButtonStyle = computed(() => {
  const a = siteData.about
  const font = a.buttonFontFamily || 'Poppins'
  const color = a.buttonTextColor || '#ffffff'
  if (a.buttonStyle === 'gradient') {
    const dir = a.buttonGradientDirection || 'to right'
    const c1 = a.buttonGradientColor1 || '#7B7557'
    const c2 = a.buttonGradientColor2 || '#605B45'
    return { fontFamily: font, color, background: `linear-gradient(${dir}, ${c1}, ${c2})`, backgroundColor: '' }
  }
  const bg = a.buttonColor || '#7B7557'
  return { fontFamily: font, color, background: '', backgroundColor: bg }
})

function aboutButtonMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.about.buttonHoverColor || '#605B45'
}
function aboutButtonMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = aboutButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

const ourSpaceButtonStyle = computed(() => {
  const o = siteData.ourSpace
  const font = o.buttonFontFamily || 'Poppins'
  const color = o.buttonTextColor || '#ffffff'
  if (o.buttonStyle === 'gradient') {
    const dir = o.buttonGradientDirection || 'to right'
    const c1 = o.buttonGradientColor1 || '#69AC7C'
    const c2 = o.buttonGradientColor2 || '#5a9a6e'
    return { fontFamily: font, color, background: `linear-gradient(${dir}, ${c1}, ${c2})`, backgroundColor: '' }
  }
  const bg = o.buttonColor || '#69AC7C'
  return { fontFamily: font, color, background: '', backgroundColor: bg }
})

function ourSpaceButtonMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.ourSpace.buttonHoverColor || '#5a9a6e'
}
function ourSpaceButtonMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = ourSpaceButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

function ourSpaceGalleryLinkMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.ourSpace.buttonHoverColor || '#5a9a6e'
}
function ourSpaceGalleryLinkMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = ourSpaceButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

const bestSellingButtonStyle = computed(() => {
  const b = siteData.bestSellingItems
  const font = b.buttonFontFamily || 'Poppins'
  const color = b.buttonTextColor || '#ffffff'
  if (b.buttonStyle === 'gradient') {
    const dir = b.buttonGradientDirection || 'to right'
    const c1 = b.buttonGradientColor1 || '#7B7557'
    const c2 = b.buttonGradientColor2 || '#605B45'
    return { fontFamily: font, color, background: `linear-gradient(${dir}, ${c1}, ${c2})`, backgroundColor: '' }
  }
  return { fontFamily: font, color, background: '', backgroundColor: b.buttonColor || '#7B7557' }
})
function bestSellingButtonMouseOver(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  t.style.background = ''
  t.style.backgroundColor = siteData.bestSellingItems.buttonHoverColor || '#605B45'
}
function bestSellingButtonMouseLeave(e: Event) {
  const t = (e as MouseEvent).currentTarget as HTMLElement
  const s = bestSellingButtonStyle.value
  t.style.fontFamily = s.fontFamily || 'Poppins'
  t.style.color = s.color || '#ffffff'
  t.style.background = s.background || ''
  t.style.backgroundColor = s.backgroundColor || ''
}

const bestSellingMenuItems = computed(() => {
  const byName: Record<string, MenuItem> = {}
  for (const cat of menuData) {
    for (const item of cat.items) {
      byName[item.name] = item
    }
  }
  return siteData.bestSellingItems.items
    .map((bs) => byName[bs.name])
    .filter((item): item is MenuItem => item != null)
})

const showAddedToCartModal = ref(false)
const addedToCartItemName = ref('')
function onAddedToCart(itemName: string) {
  addedToCartItemName.value = itemName
  showAddedToCartModal.value = true
}

const slides = computed(() => siteData.ourSpace.images)
const currentGroup = ref(0)
const carouselNoTransition = ref(false)
const itemsPerGroup = computed(() => siteData.ourSpace.carousel.itemsPerGroup)

const groupedSlides = computed(() => {
  const groups: string[][] = []
  for (let i = 0; i < slides.value.length; i += itemsPerGroup.value) {
    groups.push(slides.value.slice(i, i + itemsPerGroup.value))
  }
  return groups
})

const nextGroup = () => {
  const N = groupedSlides.value.length
  if (N === 0) return
  if (currentGroup.value < N - 1) {
    currentGroup.value = currentGroup.value + 1
  }
}

const prevGroup = () => {
  const N = groupedSlides.value.length
  if (N === 0) return
  if (currentGroup.value > 0) {
    currentGroup.value = currentGroup.value - 1
  }
}

function goToGroup(index: number) {
  currentGroup.value = index
}

const currentAnnouncementIndex = ref(0)
const announcements = computed(() => siteData.announcements.items)
const displayedAnnouncements = computed(() => {
  const items = announcements.value
  const current = currentAnnouncementIndex.value
  const result: typeof items = []
  for (let i = -2; i <= 2; i++) {
    const index = (current + i + items.length) % items.length
    result.push(items[index])
  }
  return result
})
const nextAnnouncement = () => {
  currentAnnouncementIndex.value = (currentAnnouncementIndex.value + 1) % announcements.value.length
}
const prevAnnouncement = () => {
  currentAnnouncementIndex.value = (currentAnnouncementIndex.value - 1 + announcements.value.length) % announcements.value.length
}

function getAnnouncementImage(item: { image?: string; images?: string[] }): string {
  if (item.images?.length) return item.images[0]
  return item.image || ''
}
function getAnnouncementTitle(item: { title?: string; description?: string }): string {
  if (item.title) return item.title
  if (item.description) return item.description.split('\n')[0].slice(0, 60) || 'Announcement'
  return 'Announcement'
}

const showAnnouncementModal = ref(false)
const selectedAnnouncement = ref<{ id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string } | null>(null)
function openAnnouncementModal(announcement: { id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string }) {
  selectedAnnouncement.value = announcement
  showAnnouncementModal.value = true
}

/** On mobile: center card (index 2) opens detail; side cards navigate. On desktop: any card opens detail. */
function onAnnouncementCardClick(
  announcement: { id: string; title?: string; description?: string; image?: string; images?: string[]; links?: { text: string; url: string }[]; date?: string },
  displayIndex: number
) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  if (isMobile) {
    if (displayIndex === 2) {
      openAnnouncementModal(announcement)
    } else if (displayIndex < 2) {
      prevAnnouncement()
    } else {
      nextAnnouncement()
    }
  } else {
    openAnnouncementModal(announcement)
  }
}

const openFaqIndex = ref<number | null>(null)
const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  display: flex;
  animation: marquee 10s linear infinite;
  will-change: transform;
}

/* FAQ accordion: premium expand/collapse with height + fade + slide */
.faq-accordion-list {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(123, 117, 87, 0.08);
}
.faq-item {
  overflow: hidden;
  transition: border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-item:first-child .faq-question-btn {
  border-radius: 12px 12px 0 0;
}
.faq-item-open {
  border-radius: 0 0 12px 12px;
}
.faq-item-open:last-child {
  border-radius: 0 0 12px 12px;
}
.faq-question-btn {
  border-radius: 0;
  transition: background-color 0.25s ease, box-shadow 0.3s ease;
}
.faq-item-open .faq-question-btn {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.faq-chevron {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-chevron-open {
  transform: rotate(180deg);
}
.faq-answer-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-answer-wrapper-open {
  max-height: 600px;
}
.faq-answer-inner {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.08s,
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.08s;
}
.faq-answer-wrapper-open .faq-answer-inner {
  opacity: 1;
  transform: translateY(0);
}

/* Service features bar: premium stagger-in */
@keyframes service-feature-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.service-feature-btn {
  animation: service-feature-in 0.5s ease-out forwards;
  opacity: 0;
}
</style>
