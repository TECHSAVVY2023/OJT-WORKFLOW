import menuJson from '~/data/menu.json'

export interface MenuItemBase {
  id: number
  name: string
  price: number
  image: string
  available: boolean
  description?: string
  variants?: string[]
}

export interface MenuCategory {
  category: string
  items: MenuItemBase[]
}

export interface AdminMenuItemRow {
  id: string
  productName: string
  category: string
  price: number
  created: string
  createdDate: string
  createdTime: string
  updated: string
  updatedDate: string
  updatedTime: string
  status: 'Available' | 'Unavailable'
  isAdminAdded: boolean
  raw: MenuItemBase & { category: string; created?: string; updated?: string }
}

/** Split "mm/dd/yy h:mm:ss AM" into long date + time (match bookings style). */
function splitCreated(created: string): { date: string; time: string } {
  if (!created || created === '-') return { date: '-', time: '' }
  const parts = created.trim().split(/\s+/)
  if (parts.length < 3) return { date: created, time: '' }
  const [datePart, timePart, ampm] = parts
  const match = datePart?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (!match) return { date: created, time: '' }
  const [, mm, dd, yy] = match
  const year = yy!.length === 2 ? 2000 + parseInt(yy!, 10) : parseInt(yy!, 10)
  const month = parseInt(mm!, 10) - 1
  const day = parseInt(dd!, 10)
  const d = new Date(year, month, day)
  if (Number.isNaN(d.getTime())) return { date: created, time: '' }
  const dateFormatted = d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  const timeMatch = timePart?.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (!timeMatch) return { date: dateFormatted, time: '' }
  const h = parseInt(timeMatch[1], 10)
  const m = timeMatch[2]
  const timeFormatted = `${h}:${m} ${ampm ?? ''}`.trim()
  return { date: dateFormatted, time: timeFormatted }
}

const STORAGE_KEY = 'workflow_admin_menu_extra'
const STORAGE_KEY_BASE = 'workflow_admin_menu_base_changes'

interface StoredExtra {
  nextId: number
  items: Array<{
    id: string
    name: string
    category: string
    price: number
    image: string
    available: boolean
    description?: string
    variants?: string[]
    created: string
    updated?: string
  }>
}

interface BaseChanges {
  overrides: Record<number, Partial<MenuItemBase> & { category?: string; updated?: string }>
  deletedIds: number[]
}

function getStoredExtra(): StoredExtra {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as StoredExtra
        if (data.items && Array.isArray(data.items)) return data
      }
    } catch (_) {}
  }
  return { nextId: 1, items: [] }
}

function setStoredExtra(data: StoredExtra) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

function getStoredBaseChanges(): BaseChanges {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BASE)
      if (raw) {
        const data = JSON.parse(raw) as BaseChanges
        if (data && typeof data.overrides === 'object' && Array.isArray(data.deletedIds)) return data
      }
    } catch (_) {}
  }
  return { overrides: {}, deletedIds: [] }
}

function setStoredBaseChanges(data: BaseChanges) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_BASE, JSON.stringify(data))
  }
}

function formatCreated(date: Date): string {
  const d = date
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  const h = d.getHours()
  const am = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  const min = String(d.getMinutes()).padStart(2, '0')
  const sec = String(d.getSeconds()).padStart(2, '0')
  return `${mm}/${dd}/${yy} ${String(h12).padStart(2, '0')}:${min}:${sec} ${am}`
}

export function useAdminMenu() {
  const baseCategories = menuJson as MenuCategory[]
  const { categoryNamesForMenu, getCategoryDisplayName, isBaseCategoryDeleted } = useAdminCategories()

  const extraData = ref<StoredExtra>({ nextId: 1, items: [] })
  const baseChanges = ref<BaseChanges>({ overrides: {}, deletedIds: [] })

  function loadExtra() {
    extraData.value = getStoredExtra()
    baseChanges.value = getStoredBaseChanges()
  }

  if (import.meta.client) {
    onMounted(() => loadExtra())
  }

  /** Resolve a base item with overrides and exclude deleted */
  function resolveBaseItem(item: MenuItemBase, category: string): MenuItemBase | null {
    if (baseChanges.value.deletedIds.includes(item.id)) return null
    const over = baseChanges.value.overrides[item.id]
    if (!over) return { ...item, category } as MenuItemBase & { category: string }
    const merged = { ...item, ...over } as MenuItemBase & { category: string }
    if (over.category) merged.category = over.category
    else merged.category = category
    return merged
  }

  /** Merged menu for public menu page (categories + items including admin-added, respecting base overrides/deletes and category renames/deletes) */
  const menuData = computed<MenuCategory[]>(() => {
    const categories = new Map<string, MenuItemBase[]>()
    for (const cat of baseCategories) {
      if (isBaseCategoryDeleted(cat.category)) continue
      for (const item of cat.items) {
        const resolved = resolveBaseItem(item, cat.category)
        if (resolved) {
          const key = getCategoryDisplayName(resolved.category)
          const list = categories.get(key) ?? []
          list.push({ ...resolved, category: key } as MenuItemBase)
          categories.set(key, list)
        }
      }
    }
    let extraId = -1
    for (const item of extraData.value.items) {
      const list = categories.get(item.category) ?? []
      list.push({
        id: extraId,
        name: item.name,
        price: item.price,
        image: item.image,
        available: item.available,
        description: item.description,
        variants: item.variants,
      })
      categories.set(item.category, list)
      extraId -= 1
    }
    return Array.from(categories.entries()).map(([category, items]) => ({ category, items }))
  })

  /** Flat list for admin table with WFI ids */
  const flatItems = computed<AdminMenuItemRow[]>(() => {
    const rows: AdminMenuItemRow[] = []
    let idx = 0
    for (const cat of baseCategories) {
      if (isBaseCategoryDeleted(cat.category)) continue
      for (const item of cat.items) {
        const resolved = resolveBaseItem(item, cat.category)
        if (!resolved) continue
        idx += 1
        const created = '-'
        const over = baseChanges.value.overrides[item.id]
        const updated = over?.updated ?? created
        const { date: createdDate, time: createdTime } = splitCreated(created)
        const { date: updatedDate, time: updatedTime } = splitCreated(updated)
        const categoryDisplay = getCategoryDisplayName(resolved.category)
        rows.push({
          id: `WFI${String(idx).padStart(3, '0')}`,
          productName: resolved.name,
          category: categoryDisplay,
          price: resolved.price,
          created,
          createdDate,
          createdTime,
          updated,
          updatedDate,
          updatedTime,
          status: resolved.available ? 'Available' : 'Unavailable',
          isAdminAdded: false,
          raw: { ...resolved, category: categoryDisplay, updated },
        })
      }
    }
    for (const item of extraData.value.items) {
      const { date: createdDate, time: createdTime } = splitCreated(item.created)
      const updated = item.updated ?? item.created
      const { date: updatedDate, time: updatedTime } = splitCreated(updated)
      rows.push({
        id: item.id,
        productName: item.name,
        category: item.category,
        price: item.price,
        created: item.created,
        createdDate,
        createdTime,
        updated,
        updatedDate,
        updatedTime,
        status: item.available ? 'Available' : 'Unavailable',
        isAdminAdded: true,
        raw: {
          id: -1,
          name: item.name,
          price: item.price,
          image: item.image,
          available: item.available,
          description: item.description,
          variants: item.variants,
          category: item.category,
          created: item.created,
          updated: item.updated,
        },
      })
    }
    return rows
  })

  const categoryOptions = computed(() => {
    const set = new Set<string>()
    for (const c of baseCategories) set.add(c.category)
    for (const item of extraData.value.items) set.add(item.category)
    for (const over of Object.values(baseChanges.value.overrides)) {
      if (over.category) set.add(over.category)
    }
    for (const name of categoryNamesForMenu.value) set.add(name)
    return Array.from(set).sort()
  })

  function addItem(item: {
    name: string
    category: string
    price: number
    image?: string
    available?: boolean
    description?: string
    variants?: string[]
  }) {
    const stored = getStoredExtra()
    const id = `WFI${String(stored.nextId).padStart(3, '0')}`
    const created = formatCreated(new Date())
    stored.items.push({
      id,
      name: item.name,
      category: item.category,
      price: Number(item.price),
      image: item.image ?? '/images/1.png',
      available: item.available ?? true,
      description: item.description,
      variants: item.variants ?? [],
      created,
      updated: created,
    })
    stored.nextId += 1
    setStoredExtra(stored)
    loadExtra()
  }

  function removeAddedItem(id: string) {
    const stored = getStoredExtra()
    stored.items = stored.items.filter((i) => i.id !== id)
    setStoredExtra(stored)
    loadExtra()
  }

  function updateAddedItem(
    id: string,
    updates: Partial<{ name: string; category: string; price: number; image: string; available: boolean; description: string; variants: string[] }>
  ) {
    const stored = getStoredExtra()
    const idx = stored.items.findIndex((i) => i.id === id)
    if (idx === -1) return
    stored.items[idx] = { ...stored.items[idx], ...updates, updated: formatCreated(new Date()) }
    setStoredExtra(stored)
    loadExtra()
  }

  function updateBaseItem(
    baseId: number,
    updates: Partial<{ name: string; category: string; price: number; image: string; available: boolean; description: string; variants: string[] }>
  ) {
    const stored = getStoredBaseChanges()
    stored.overrides[baseId] = { ...stored.overrides[baseId], ...updates, updated: formatCreated(new Date()) }
    setStoredBaseChanges(stored)
    loadExtra()
  }

  function deleteBaseItem(baseId: number) {
    const stored = getStoredBaseChanges()
    if (!stored.deletedIds.includes(baseId)) {
      stored.deletedIds.push(baseId)
      setStoredBaseChanges(stored)
      loadExtra()
    }
  }

  return {
    menuData,
    flatItems,
    categoryOptions,
    loadExtra,
    addItem,
    removeAddedItem,
    updateAddedItem,
    updateBaseItem,
    deleteBaseItem,
  }
}
