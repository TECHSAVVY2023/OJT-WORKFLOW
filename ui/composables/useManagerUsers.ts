import type { UserRole } from '~/composables/useAuth'
import usersSeed from '~/data/users.json'

export interface ManagerUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

const STORAGE_KEY = 'workflow_manager_users'

function getStored(): ManagerUser[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as ManagerUser[]
        if (Array.isArray(data)) return data
      }
      return usersSeed as ManagerUser[]
    } catch (_) {}
  }
  return usersSeed as ManagerUser[]
}

function setStored(users: ManagerUser[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }
}

export function useManagerUsers() {
  const users = useState<ManagerUser[]>('workflow_manager_users', () => getStored())

  if (import.meta.client) {
    onMounted(() => {
      users.value = getStored()
    })
  }

  function addUser(data: { name: string; email: string; role: UserRole }) {
    const id = `user-${data.role}-${Date.now()}`
    const user: ManagerUser = {
      id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      createdAt: new Date().toISOString(),
    }
    users.value = [...users.value, user]
    setStored(users.value)
    return user
  }

  function updateUser(id: string, updates: Partial<{ name: string; email: string; role: UserRole }>) {
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx === -1) return
    users.value = users.value.map((u) =>
      u.id === id ? { ...u, ...updates } : u
    )
    setStored(users.value)
  }

  function deleteUser(id: string) {
    users.value = users.value.filter((u) => u.id !== id)
    setStored(users.value)
  }

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
  }
}
