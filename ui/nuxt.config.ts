// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // Use root app.vue/pages (Nuxt 4 runtime accepts 3; types only list 4|5)
  future: { compatibilityVersion: 3 as 4 },
  devtools: { enabled: true },
  experimental: {
    appManifest: false,
  },
  vite: {
    resolve: {
      alias: {
        '#unhead/composables': resolve(currentDir, 'node_modules/nuxt/dist/head/runtime/composables.js'),
      },
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  icon: {
    size: '1.25rem',
    class: 'inline-block align-middle',
  },
  app: {
    head: {
      bodyAttrs: { class: 'font-sans bg-palette-cream' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Poppins:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
