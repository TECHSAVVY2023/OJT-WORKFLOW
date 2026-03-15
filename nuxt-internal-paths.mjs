/**
 * Stub for #internal/nuxt/paths so the built server bundle can resolve
 * when run with Node. Nuxt/Nitro normally injects this at runtime.
 */
export function baseURL() {
  return typeof process !== 'undefined' && process.env.NUXT_APP_BASE_URL || '';
}
