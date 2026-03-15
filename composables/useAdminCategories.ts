import menuJson from '~/data/menu.json'

export interface AdminCategoryRow {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  createdDate: string
  createdTime: string
  updatedDate: string
  updatedTime: string
  isBase: boolean
}

type MenuCategory = { category: string; items: unknown[] }
const baseCategories = menuJson as MenuCategory[]

const STORAGE_KEY = 'workflow_admin_categories'
const STORAGE_KEY_OVERRIDES = 'workflow_admin_category_overrides'
const STORAGE_KEY_DELETED_BASE = 'workflow_admin_category_deleted_base'

interface StoredCategory {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

function getStored(): StoredCategory[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Array<StoredCategory & { id?: number | string }>
        if (Array.isArray(data)) {
          const baseLen = baseCategories.length
          return data.map((c, i) => ({
            ...c,
            id: typeof c.id === 'number' && c.id > baseLen ? c.id : baseLen + i + 1,
          }))
        }
      }
    } catch (_) {}
  }
  return []
}

function setStored(list: StoredCategory[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }
}

function getOverrides(): Record<number, string> {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_OVERRIDES)
      if (raw) {
        const o = JSON.parse(raw) as Record<string, string>
        const out: Record<number, string> = {}
        Object.keys(o).forEach((k) => { out[Number(k)] = o[k] })
        return out
      }
    } catch (_) {}
  }
  return {}
}

function setOverrides(o: Record<number, string>) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(o))
  }
}

function getDeletedBaseIds(): number[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DELETED_BASE)
      if (raw) {
        const a = JSON.parse(raw) as number[]
        return Array.isArray(a) ? a : []
      }
    } catch (_) {}
  }
  return []
}

function setDeletedBaseIds(ids: number[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_DELETED_BASE, JSON.stringify(ids))
  }
}

function formatDateTime(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}:${s}`
}

/** Parse "yyyy-mm-dd hh:mm:ss" to long date + time (match menu-items/venue style). */
function splitStoredDateTime(value: string): { date: string; time: string } {
  if (!value || value === '—') return { date: '—', time: '' }
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return { date: value, time: '' }
  const [, y, mo, d, h, min] = match
  const date = new Date(parseInt(y!, 10), parseInt(mo!, 10) - 1, parseInt(d!, 10))
  if (Number.isNaN(date.getTime())) return { date: value, time: '' }
  const dateFormatted = date.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  const hour = parseInt(h!, 10)
  const minute = parseInt(min!, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  const timeFormatted = `${h12}:${String(minute).padStart(2, '0')} ${ampm}`
  return { date: dateFormatted, time: timeFormatted }
}

export function useAdminCategories() {
  const customList = useState<StoredCategory[]>('workflow_admin_categories_list', () => [])
  const overrides = useState<Record<number, string>>('workflow_admin_category_overrides_state', () => ({}))
  const deletedBaseIds = useState<number[]>('workflow_admin_category_deleted_base_state', () => [])

  function load() {
    if (import.meta.client) {
      customList.value = getStored()
      overrides.value = getOverrides()
      deletedBaseIds.value = getDeletedBaseIds()
    }
  }

  if (import.meta.client) {
    onMounted(() => load())
  }

  const allCategories = computed<AdminCategoryRow[]>(() => {
    const baseRows: AdminCategoryRow[] = baseCategories
      .map((c, i) => ({ id: i + 1, originalName: c.category }))
      .filter((r) => !deletedBaseIds.value.includes(r.id))
      .map((r) => ({
        id: r.id,
        name: overrides.value[r.id] ?? baseCategories[r.id - 1].category,
        createdAt: '—',
        updatedAt: '—',
        createdDate: '—',
        createdTime: '',
        updatedDate: '—',
        updatedTime: '',
        isBase: true,
      }))
    const customRows: AdminCategoryRow[] = customList.value.map((c) => {
      const created = splitStoredDateTime(c.createdAt)
      const updated = splitStoredDateTime(c.updatedAt)
      return {
        id: c.id,
        name: c.name,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        createdDate: created.date,
        createdTime: created.time,
        updatedDate: updated.date,
        updatedTime: updated.time,
        isBase: false,
      }
    })
    return [...baseRows, ...customRows]
  })

  const categoryNamesForMenu = computed(() => {
    const set = new Set<string>()
    baseCategories.forEach((c, i) => {
      const id = i + 1
      if (!deletedBaseIds.value.includes(id)) set.add(overrides.value[id] ?? c.category)
    })
    customList.value.forEach((c) => set.add(c.name))
    return Array.from(set).sort()
  })

  /** Resolve display name for a base category (for menu display). */
  function getCategoryDisplayName(originalName: string): string {
    const i = baseCategories.findIndex((c) => c.category === originalName)
    if (i === -1) return originalName
    const id = i + 1
    if (deletedBaseIds.value.includes(id)) return originalName
    return overrides.value[id] ?? originalName
  }

  function isBaseCategoryDeleted(originalName: string): boolean {
    const i = baseCategories.findIndex((c) => c.category === originalName)
    if (i === -1) return false
    return deletedBaseIds.value.includes(i + 1)
  }

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    const existing = getStored()
    const maxId = existing.length ? Math.max(...existing.map((c) => c.id), baseCategories.length) : baseCategories.length
    const id = maxId + 1
    const now = formatDateTime(new Date())
    const newCat: StoredCategory = { id, name: trimmed, createdAt: now, updatedAt: now }
    setStored([...existing, newCat])
    load()
  }

  function updateCategory(id: number, name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (id <= baseCategories.length) {
      const o = getOverrides()
      o[id] = trimmed
      setOverrides(o)
      overrides.value = { ...o }
    } else {
      const list = getStored()
      const idx = list.findIndex((c) => c.id === id)
      if (idx === -1) return
      list[idx] = { ...list[idx], name: trimmed, updatedAt: formatDateTime(new Date()) }
      setStored(list)
    }
    load()
  }

  function deleteCategory(id: number) {
    if (id <= baseCategories.length) {
      const ids = getDeletedBaseIds()
      if (!ids.includes(id)) {
        setDeletedBaseIds([...ids, id])
        deletedBaseIds.value = [...ids, id]
      }
    } else {
      const list = getStored().filter((c) => c.id !== id)
      setStored(list)
    }
    load()
  }

  return {
    allCategories,
    categoryNamesForMenu,
    getCategoryDisplayName,
    isBaseCategoryDeleted,
    addCategory,
    updateCategory,
    deleteCategory,
    load,
  }
}
