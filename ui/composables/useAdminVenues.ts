import venuesJson from '~/data/venues.json'

export interface VenueBase {
  id: number
  name: string
  description?: string
  image?: string
  images?: string[]
  address?: string
  amenities?: string[]
  capacity?: string
  hourlyRate?: number
  operatingHours?: string
  locationShort?: string
}

export interface AdminVenueRow {
  venueId: string
  name: string
  capacity: number
  pricePerHour: number
  created: string
  createdDate: string
  createdTime: string
  updated: string
  updatedDate: string
  updatedTime: string
  status: 'Available' | 'Unavailable'
  isAdminAdded: boolean
  raw: VenueBase & { capacityNum?: number; created?: string; updated?: string; available?: boolean }
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

const STORAGE_KEY = 'workflow_admin_venues_extra'
const STORAGE_KEY_BASE = 'workflow_admin_venues_base_changes'

interface StoredVenueExtra {
  id: string
  name: string
  capacity: number
  hourlyRate: number
  available: boolean
  created: string
  updated?: string
  description?: string
  image?: string
  images?: string[]
  address?: string
  amenities?: string[]
  operatingHours?: string
  locationShort?: string
}

interface StoredExtra {
  nextId: number
  items: StoredVenueExtra[]
}

interface BaseChanges {
  overrides: Record<number, Partial<VenueBase> & { capacityNum?: number; available?: boolean; images?: string[]; updated?: string }>
  deletedIds: number[]
}

function parseCapacity(cap: string | undefined): number {
  if (cap == null) return 0
  const n = parseInt(cap.replace(/\D/g, ''), 10)
  return Number.isNaN(n) ? 0 : n
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

export function useAdminVenues() {
  const baseVenues = venuesJson as VenueBase[]
  const extraData = ref<StoredExtra>({ nextId: 1, items: [] })
  const baseChanges = ref<BaseChanges>({ overrides: {}, deletedIds: [] })

  function loadExtra() {
    extraData.value = getStoredExtra()
    baseChanges.value = getStoredBaseChanges()
  }

  if (import.meta.client) {
    onMounted(() => loadExtra())
  }

  function resolveBaseVenue(v: VenueBase): (VenueBase & { capacityNum: number; available: boolean; hourlyRate: number; images?: string[] }) | null {
    if (baseChanges.value.deletedIds.includes(v.id)) return null
    const over = baseChanges.value.overrides[v.id]
    const capacityNum = over?.capacityNum ?? parseCapacity(v.capacity)
    const available = over?.available ?? true
    const hourlyRate = over?.hourlyRate ?? v.hourlyRate ?? 0
    const images = over?.images ?? (v.images?.length ? v.images : (v.image ? [v.image] : []))
    const merged = { ...v, ...over, capacityNum, available, hourlyRate, images }
    return merged as VenueBase & { capacityNum: number; available: boolean; hourlyRate: number; images?: string[] }
  }

  /** For public pages: list of venues (base + extra, respecting deletes/overrides) */
  const venuesData = computed<VenueBase[]>(() => {
    const list: VenueBase[] = []
    for (const v of baseVenues) {
      const resolved = resolveBaseVenue(v)
      if (!resolved) continue
      const images = resolved.images ?? (resolved.image ? [resolved.image] : [])
      const capacityStr = resolved.capacity ?? (resolved.capacityNum != null ? `Up to ${resolved.capacityNum} people` : '')
      list.push({ ...resolved, image: images[0], images, capacity: capacityStr })
    }
    let extraId = -1
    for (const item of extraData.value.items) {
      const images = item.images?.length ? item.images : (item.image ? [item.image] : [])
      list.push({
        id: extraId,
        name: item.name,
        description: item.description,
        image: images[0],
        images,
        address: item.address,
        amenities: item.amenities,
        capacity: String(item.capacity),
        hourlyRate: item.hourlyRate,
        operatingHours: item.operatingHours,
        locationShort: item.locationShort,
      })
      extraId -= 1
    }
    return list
  })

  const flatRows = computed<AdminVenueRow[]>(() => {
    const rows: AdminVenueRow[] = []
    for (const v of baseVenues) {
      const resolved = resolveBaseVenue(v)
      if (!resolved) continue
      const created = '-'
      const over = baseChanges.value.overrides[v.id]
      const updated = over?.updated ?? created
      const { date: createdDate, time: createdTime } = splitCreated(created)
      const { date: updatedDate, time: updatedTime } = splitCreated(updated)
      rows.push({
        venueId: `WFV${v.id}`,
        name: resolved.name,
        capacity: resolved.capacityNum,
        pricePerHour: resolved.hourlyRate ?? 0,
        created,
        createdDate,
        createdTime,
        updated,
        updatedDate,
        updatedTime,
        status: resolved.available ? 'Available' : 'Unavailable',
        isAdminAdded: false,
        raw: { ...resolved, capacityNum: resolved.capacityNum, created: undefined, updated: over?.updated, available: resolved.available },
      })
    }
    for (const item of extraData.value.items) {
      const images = item.images?.length ? item.images : (item.image ? [item.image] : [])
      const { date: createdDate, time: createdTime } = splitCreated(item.created)
      const updated = item.updated ?? item.created
      const { date: updatedDate, time: updatedTime } = splitCreated(updated)
      rows.push({
        venueId: item.id,
        name: item.name,
        capacity: item.capacity,
        pricePerHour: item.hourlyRate,
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
          capacity: String(item.capacity),
          hourlyRate: item.hourlyRate,
          capacityNum: item.capacity,
          created: item.created,
          updated: item.updated,
          available: item.available,
          description: item.description,
          operatingHours: item.operatingHours,
          amenities: item.amenities,
          image: images[0],
          images,
        },
      })
    }
    return rows
  })

  function addVenue(item: {
    name: string
    capacity: number
    hourlyRate: number
    available?: boolean
    description?: string
    image?: string
    images?: string[]
    address?: string
    amenities?: string[]
    operatingHours?: string
    locationShort?: string
  }) {
    const stored = getStoredExtra()
    const id = `WFV${stored.nextId}`
    stored.nextId += 1
    const created = formatCreated(new Date())
    const images = item.images?.length ? item.images : (item.image ? [item.image] : [])
    stored.items.push({
      id,
      name: item.name,
      capacity: item.capacity,
      hourlyRate: Number(item.hourlyRate),
      available: item.available ?? true,
      created,
      updated: created,
      description: item.description,
      image: images[0],
      images,
      address: item.address,
      amenities: item.amenities,
      operatingHours: item.operatingHours,
      locationShort: item.locationShort,
    })
    setStoredExtra(stored)
    loadExtra()
  }

  function removeAddedVenue(venueId: string) {
    const stored = getStoredExtra()
    stored.items = stored.items.filter((i) => i.id !== venueId)
    setStoredExtra(stored)
    loadExtra()
  }

  function updateAddedVenue(
    venueId: string,
    updates: Partial<{ name: string; capacity: number; hourlyRate: number; available: boolean; description: string; image: string; images: string[]; address: string; amenities: string[]; operatingHours: string; locationShort: string }>
  ) {
    const stored = getStoredExtra()
    const idx = stored.items.findIndex((i) => i.id === venueId)
    if (idx === -1) return
    const merged = { ...stored.items[idx], ...updates, updated: formatCreated(new Date()) }
    if (updates.images?.length) merged.image = updates.images[0]
    stored.items[idx] = merged
    setStoredExtra(stored)
    loadExtra()
  }

  function updateBaseVenue(
    baseId: number,
    updates: Partial<{ name: string; capacityNum: number; hourlyRate: number; available: boolean; description: string; image: string; images: string[]; address: string; amenities: string[]; operatingHours: string; locationShort: string }>
  ) {
    const stored = getStoredBaseChanges()
    stored.overrides[baseId] = { ...stored.overrides[baseId], ...updates, updated: formatCreated(new Date()) }
    setStoredBaseChanges(stored)
    loadExtra()
  }

  function deleteBaseVenue(baseId: number) {
    const stored = getStoredBaseChanges()
    if (!stored.deletedIds.includes(baseId)) {
      stored.deletedIds.push(baseId)
      setStoredBaseChanges(stored)
      loadExtra()
    }
  }

  return {
    venuesData,
    flatRows,
    loadExtra,
    addVenue,
    removeAddedVenue,
    updateAddedVenue,
    updateBaseVenue,
    deleteBaseVenue,
  }
}
