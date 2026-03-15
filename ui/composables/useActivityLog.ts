import type { UserRole } from '~/composables/useAuth'

export interface ActivityLogEntry {
  id: string
  createdAt: string
  userRole: UserRole
  userId: string
  userEmail: string
  userName: string
  action: string
  details?: string
  path?: string
}

const STORAGE_KEY = 'workflow_activity_log'
const MAX_ENTRIES = 500

function getStored(): ActivityLogEntry[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as ActivityLogEntry[]
        if (Array.isArray(data)) return data
      }
    } catch (_) {}
  }
  return []
}

function setStored(entries: ActivityLogEntry[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
  }
}

/**
 * Record activity for all user types (admin, staff, manager).
 * Call log(action, details?) from pages/composables after key actions.
 * Persisted to localStorage so logs survive refresh and navigation.
 */
export function useActivityLog() {
  const entries = useState<ActivityLogEntry[]>('workflow_activity_log', () => getStored())

  if (import.meta.client) {
    onMounted(() => {
      entries.value = getStored()
    })
  }

  /** Re-load logs from localStorage (e.g. when opening Logs page so they don’t appear reset). */
  function refreshFromStorage() {
    if (import.meta.client) {
      entries.value = getStored()
    }
  }

  function log(action: string, details?: string) {
    if (import.meta.server) return
    const auth = useAuth()
    const router = useRouter()
    const user = auth.user.value
    const path = router.currentRoute.value?.path
    const entry: ActivityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      userRole: (user?.role ?? 'admin') as UserRole,
      userId: user?.id ?? 'anonymous',
      userEmail: user?.email ?? '',
      userName: user?.name ?? 'Unknown',
      action,
      details: details ?? undefined,
      path: path ?? undefined,
    }
    entries.value = [entry, ...entries.value]
    setStored(entries.value)
  }

  /** Log without requiring auth (e.g. login page). */
  function logAs(role: UserRole, userEmail: string, userName: string, userId: string, action: string, details?: string, path?: string) {
    if (import.meta.server) return
    const router = useRouter()
    const routePath = path ?? router.currentRoute.value?.path
    const entry: ActivityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      userRole: role,
      userId,
      userEmail,
      userName,
      action,
      details: details ?? undefined,
      path: routePath ?? undefined,
    }
    entries.value = [entry, ...entries.value]
    setStored(entries.value)
  }

  function clearLogs() {
    entries.value = []
    setStored([])
  }

  return {
    entries,
    log,
    logAs,
    clearLogs,
    refreshFromStorage,
  }
}
