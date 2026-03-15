export type UserRole = 'admin' | 'staff' | 'manager'

export interface WorkflowUser {
  id: string
  email: string
  name: string
  role: UserRole
}

const AUTH_KEY = 'workflow_auth'

function getStored(): WorkflowUser | null {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      if (raw) {
        const data = JSON.parse(raw) as WorkflowUser
        if (data?.email && data?.role && ['admin', 'staff', 'manager'].includes(data.role)) {
          return data
        }
      }
    } catch (_) {}
  }
  return null
}

function setStored(user: WorkflowUser | null) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }
}

/**
 * Demo login: accepts admin@workflow.com, staff@workflow.com, manager@workflow.com with password "password".
 * Replace with real API later.
 */
export function useAuth() {
  const user = useState<WorkflowUser | null>('workflow_user', () => null)

  if (import.meta.client) {
    onMounted(() => {
      user.value = getStored()
    })
  }

  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => user.value?.role ?? null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStaff = computed(() => user.value?.role === 'staff')
  const isManager = computed(() => user.value?.role === 'manager')

  function login(email: string, password: string): { success: boolean; role: UserRole | null } {
    const normalizedEmail = email.trim().toLowerCase()
    const demoUsers: Array<{ email: string; name: string; role: UserRole }> = [
      { email: 'admin@workflow.com', name: 'Admin', role: 'admin' },
      { email: 'staff@workflow.com', name: 'Staff', role: 'staff' },
      { email: 'manager@workflow.com', name: 'Manager', role: 'manager' },
    ]
    const match = demoUsers.find((u) => u.email === normalizedEmail)
    if (match && password === 'password') {
      const u: WorkflowUser = {
        id: `user-${match.role}-1`,
        email: match.email,
        name: match.name,
        role: match.role,
      }
      user.value = u
      setStored(u)
      if (import.meta.client) {
        try {
          const { logAs } = useActivityLog()
          logAs(u.role, u.email, u.name, u.id, 'login')
        } catch (_) {}
      }
      return { success: true, role: match.role }
    }
    return { success: false, role: null }
  }

  function logout() {
    if (import.meta.client && user.value) {
      try {
        const u = user.value
        const { logAs } = useActivityLog()
        logAs(u.role, u.email, u.name, u.id, 'logout')
      } catch (_) {}
    }
    user.value = null
    setStored(null)
  }

  function hasRole(r: UserRole) {
    return user.value?.role === r
  }

  return {
    user,
    isAuthenticated,
    role,
    isAdmin,
    isStaff,
    isManager,
    login,
    logout,
    hasRole,
  }
}
