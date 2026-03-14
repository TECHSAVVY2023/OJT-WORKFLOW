import type { UserRole } from '~/composables/useAuth'

const AUTH_KEY = 'workflow_auth'

function getStoredUser(): { role: UserRole } | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { role?: string }
    if (data?.role && ['admin', 'staff', 'manager'].includes(data.role)) {
      return { role: data.role as UserRole }
    }
  } catch (_) {}
  return null
}

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const path = to.path
  const stored = getStoredUser()

  if (path === '/login') {
    if (stored) {
      if (stored.role === 'admin') return navigateTo('/admin')
      if (stored.role === 'staff') return navigateTo('/staff')
      if (stored.role === 'manager') return navigateTo('/manager')
    }
    return
  }

  if (!path.startsWith('/admin') && !path.startsWith('/staff') && !path.startsWith('/manager')) {
    return
  }

  if (!stored) {
    return navigateTo('/login')
  }

  const role = stored.role
  if (path.startsWith('/admin') && role !== 'admin') {
    if (role === 'staff') return navigateTo('/staff')
    if (role === 'manager') return navigateTo('/manager')
    return navigateTo('/login')
  }
  if (path.startsWith('/staff') && role !== 'staff') {
    if (role === 'admin') return navigateTo('/admin')
    if (role === 'manager') return navigateTo('/manager')
    return navigateTo('/login')
  }
  if (path.startsWith('/manager') && role !== 'manager') {
    if (role === 'admin') return navigateTo('/admin')
    if (role === 'staff') return navigateTo('/staff')
    return navigateTo('/login')
  }
})
