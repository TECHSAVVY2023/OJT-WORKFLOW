import { reactive, watch } from 'vue'
import siteDataStatic from '~/data/site-data'

export function useSiteData() {
  const siteData = reactive({
    ...siteDataStatic,
    announcements: { ...siteDataStatic.announcements },
    communitySays: { ...siteDataStatic.communitySays },
  })
  const { data: announcements } = useFetch<{ title: string; items: unknown[] }>('/api/announcements', {
    key: 'announcements',
  })
  const { data: communityReviews } = useFetch<{ title: string; subtitle: string; reviews: unknown[] }>('/api/community-reviews', {
    key: 'community-reviews',
  })
  const { data: siteContent } = useFetch<Record<string, unknown>>('/api/site-content', {
    key: 'site-content',
  })
  watch(
    announcements,
    (val) => {
      if (val) {
        siteData.announcements = { title: val.title, items: val.items ?? [] }
      }
    },
    { immediate: true }
  )
  watch(
    communityReviews,
    (val) => {
      if (val) {
        siteData.communitySays = { title: val.title, subtitle: val.subtitle, reviews: val.reviews ?? [] }
      }
    },
    { immediate: true }
  )
  watch(
    siteContent,
    (val) => {
      if (!val || typeof val !== 'object') return
      if (val.hero && typeof val.hero === 'object') {
        Object.assign(siteData.hero, val.hero)
      }
      if (val.about && typeof val.about === 'object') {
        Object.assign(siteData.about, val.about)
      }
      if (val.contact && typeof val.contact === 'object') {
        Object.assign(siteData.contact, val.contact)
      }
      if (val.footer && typeof val.footer === 'object') {
        Object.assign(siteData.footer, val.footer)
      }
      if (val.ourSpace && typeof val.ourSpace === 'object') {
        Object.assign(siteData.ourSpace, val.ourSpace)
      }
      if (val.bestSellingItems && typeof val.bestSellingItems === 'object') {
        Object.assign(siteData.bestSellingItems, val.bestSellingItems)
      }
      if (val.faq && typeof val.faq === 'object') {
        Object.assign(siteData.faq, val.faq)
      }
      if (val.newsletter && typeof val.newsletter === 'object') {
        Object.assign(siteData.newsletter, val.newsletter)
      }
    },
    { immediate: true }
  )
  return { siteData, refreshSiteContent: () => refreshNuxtData('site-content') }
}
