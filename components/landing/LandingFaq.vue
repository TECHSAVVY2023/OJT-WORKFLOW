<template>
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
</template>

<script setup lang="ts">
const { siteData } = useSiteData()
const openFaqIndex = ref<number | null>(null)
const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}
</script>

<style scoped>
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
</style>
