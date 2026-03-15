# About Page – Files Involved

This document lists all files involved in the **About** page (`/about`): the page itself, its components, and related data/API.

---

## Page (entry point)

| File | Role |
|------|------|
| `pages/about.vue` | Route entry for `/about`. Renders the two section components; no local logic. |

---

## Components

| File | Role |
|------|------|
| `components/about/AboutPageIntro.vue` | **Section 1:** About title, paragraphs, and main image with overlay text. Uses `useSiteData()` for `siteData.about`. |
| `components/about/AboutCommunitySays.vue` | **Section 2:** “What our community says” – heading, reviews carousel (prev/next, dots, touch swipe), “Write a review” button, Write Review modal, Publish confirm modal, and Image preview modal. Uses `useSiteData()` for `siteData.communitySays` and submits reviews via API. |

---

## Composables & data

| File | Role |
|------|------|
| `composables/useSiteData.ts` | Provides reactive `siteData` (hero, about, communitySays, etc.) used by both About components. |
| `data/site-data.ts` | Default/static content for `siteData.about` and other sections. |
| `data/community-reviews.json` | Stored community reviews; read by the GET API and written by the submit API. |
| `server/api/community-reviews.get.ts` | Fetches community reviews; used by `useSiteData()` (key `community-reviews`). |
| `server/api/community-reviews/submit.post.ts` | Receives new review submissions from the “Write a review” form in `AboutCommunitySays.vue`. |

---

## Flow

1. **Route:** User visits `/about` → Nuxt renders `pages/about.vue`.
2. **Layout:** The page renders `<AboutPageIntro />` then `<AboutCommunitySays />` (default layout with header/footer if applied).
3. **About section:** `AboutPageIntro` reads `siteData.about` from `useSiteData()` and renders title, paragraphs, image, and overlay.
4. **Community says section:** `AboutCommunitySays` reads `siteData.communitySays` (title, subtitle, reviews), shows the carousel and “Write a review”. Submitting a review calls `POST /api/community-reviews/submit` and then refreshes data (e.g. via `refreshNuxtData('community-reviews')`).

---

## Summary

- **Page:** `pages/about.vue`
- **Components:** `components/about/AboutPageIntro.vue`, `components/about/AboutCommunitySays.vue`
- **Composables:** `composables/useSiteData.ts`
- **Data/API:** `data/site-data.ts`, `data/community-reviews.json`, `server/api/community-reviews.get.ts`, `server/api/community-reviews/submit.post.ts`

All UI/UX and behavior of the about page are implemented in these files.
