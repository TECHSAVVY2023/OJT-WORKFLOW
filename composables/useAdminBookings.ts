import bookingsJson from '~/data/bookings.json'
import venuesJson from '~/data/venues.json'

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'

export interface Booking {
  id: number
  bookingRef: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  venueId: number
  venueName: string
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
  modeOfPayment?: string
  paymentStatus?: string
  /** Number of attendees from frontend */
  attendees?: number
  /** Purpose of booking from frontend */
  purposeOfBooking?: string
}

export interface AdminBookingRow {
  id: number
  bookingRef: string
  customerName: string
  customerEmail: string
  customerPhone: string
  venueName: string
  date: string
  timeRange: string
  total: number
  status: BookingStatus
  modeOfPayment: string
  paymentStatus: string
  attendees: number | null
  purposeOfBooking: string
  raw: Booking
}

const STORAGE_KEY = 'workflow_admin_bookings_status'
const PAYMENT_STORAGE_KEY = 'workflow_admin_bookings_payment'
const MODE_OF_PAYMENT_STORAGE_KEY = 'workflow_admin_bookings_mode_of_payment'
const FRONTEND_BOOKINGS_KEY = 'workflow_frontend_bookings'

export const MODE_OF_PAYMENT_OPTIONS = ['—', 'E-wallet', 'Cash'] as const

function getFrontendBookings(): Booking[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(FRONTEND_BOOKINGS_KEY)
      if (raw) {
        const data = JSON.parse(raw) as unknown[]
        return (Array.isArray(data) ? data : []).filter(
          (b): b is Booking =>
            b != null &&
            typeof b === 'object' &&
            typeof (b as Booking).id === 'number' &&
            typeof (b as Booking).bookingRef === 'string' &&
            typeof (b as Booking).customerName === 'string' &&
            typeof (b as Booking).customerEmail === 'string' &&
            typeof (b as Booking).venueId === 'number' &&
            typeof (b as Booking).venueName === 'string' &&
            typeof (b as Booking).date === 'string' &&
            typeof (b as Booking).startTime === 'string' &&
            typeof (b as Booking).endTime === 'string'
        )
      }
    } catch (_) {}
  }
  return []
}

function setFrontendBookings(list: Booking[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(FRONTEND_BOOKINGS_KEY, JSON.stringify(list))
  }
}

function getStatusOverrides(): Record<number, BookingStatus> {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Record<string, string>
        const out: Record<number, BookingStatus> = {}
        for (const [k, v] of Object.entries(data)) {
          const n = parseInt(k, 10)
          if (!Number.isNaN(n) && ['Pending', 'Confirmed', 'Cancelled', 'Completed'].includes(v)) {
            out[n] = v as BookingStatus
          }
        }
        return out
      }
    } catch (_) {}
  }
  return {}
}

function setStatusOverrides(overrides: Record<number, BookingStatus>) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    const obj: Record<string, string> = {}
    for (const [k, v] of Object.entries(overrides)) {
      obj[String(k)] = v
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  }
}

function getPaymentOverrides(): Record<number, string> {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(PAYMENT_STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Record<string, string>
        const out: Record<number, string> = {}
        for (const [k, v] of Object.entries(data)) {
          const n = parseInt(k, 10)
          if (!Number.isNaN(n) && (v === 'Paid' || v === 'Unpaid')) out[n] = v
        }
        return out
      }
    } catch (_) {}
  }
  return {}
}

function setPaymentOverrides(overrides: Record<number, string>) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    const obj: Record<string, string> = {}
    for (const [k, v] of Object.entries(overrides)) {
      obj[String(k)] = v
    }
    localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(obj))
  }
}

function getModeOfPaymentOverrides(): Record<number, string> {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(MODE_OF_PAYMENT_STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Record<string, string>
        const out: Record<number, string> = {}
        for (const [k, v] of Object.entries(data)) {
          const n = parseInt(k, 10)
          if (!Number.isNaN(n) && typeof v === 'string') out[n] = v
        }
        return out
      }
    } catch (_) {}
  }
  return {}
}

function setModeOfPaymentOverrides(overrides: Record<number, string>) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    const obj: Record<string, string> = {}
    for (const [k, v] of Object.entries(overrides)) {
      obj[String(k)] = v
    }
    localStorage.setItem(MODE_OF_PAYMENT_STORAGE_KEY, JSON.stringify(obj))
  }
}

const venuesData = venuesJson as Array<{ id: number; capacity?: string; hourlyRate?: number }>

function formatDate(isoOrDate: string): string {
  const d = isoOrDate.includes('T') ? new Date(isoOrDate) : new Date(isoOrDate + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return isoOrDate
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime12h(time24: string): string {
  const [h = 0, m = 0] = time24.split(':').map(Number)
  const h12 = h % 12 || 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function parseHours(startTime: string, endTime: string): number {
  const [sH, sM] = startTime.split(':').map(Number)
  const [eH, eM] = endTime.split(':').map(Number)
  return eH + eM / 60 - (sH + sM / 60)
}

/**
 * Admin bookings composable.
 * Reads base bookings from data/bookings.json and status overrides from localStorage.
 * Use in admin bookings page; for dashboard count only, use bookings.json length to avoid SSR issues.
 */
export type FrontendBookingPayload = {
  venueId: number
  venueName: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  date: string
  startTime: string
  endTime: string
  attendees?: number
  purposeOfBooking?: string
  modeOfPayment?: string
  paymentStatus?: string
}

export function useAdminBookings() {
  const baseBookings = bookingsJson as Booking[]
  const statusOverrides = ref<Record<number, BookingStatus>>({})
  const paymentOverrides = ref<Record<number, string>>({})
  const modeOfPaymentOverrides = ref<Record<number, string>>({})
  const frontendBookings = ref<Booking[]>([])

  if (import.meta.client) {
    onMounted(() => {
      statusOverrides.value = getStatusOverrides()
      paymentOverrides.value = getPaymentOverrides()
      modeOfPaymentOverrides.value = getModeOfPaymentOverrides()
      frontendBookings.value = getFrontendBookings()
    })
  }

  const allBookings = computed<Booking[]>(() => [...baseBookings, ...frontendBookings.value])

  const flatRows = computed<AdminBookingRow[]>(() => {
    return allBookings.value.map((b) => {
      const status = statusOverrides.value[b.id] ?? b.status
      const paymentStatus = paymentOverrides.value[b.id] ?? b.paymentStatus ?? 'Unpaid'
      const rawMode = modeOfPaymentOverrides.value[b.id] ?? b.modeOfPayment ?? '—'
      const modeOfPayment = rawMode === 'GCash' ? 'E-wallet' : rawMode
      const venue = venuesData.find((v) => v.id === b.venueId)
      const hours = parseHours(b.startTime, b.endTime)
      const hourlyRate = venue?.hourlyRate ?? 0
      const total = Math.round(hours * hourlyRate)
      return {
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone ?? '—',
        venueName: b.venueName,
        date: formatDate(b.date),
        timeRange: `${formatTime12h(b.startTime)} – ${formatTime12h(b.endTime)}`,
        total,
        status,
        modeOfPayment,
        paymentStatus,
        attendees: b.attendees ?? null,
        purposeOfBooking: b.purposeOfBooking ?? '—',
        raw: { ...b, status },
      }
    })
  })

  const totalCount = computed(() => flatRows.value.length)

  function updateStatus(bookingId: number, status: BookingStatus) {
    const next = { ...statusOverrides.value, [bookingId]: status }
    statusOverrides.value = next
    setStatusOverrides(next)
  }

  function updatePaymentStatus(bookingId: number, paymentStatus: string) {
    if (paymentStatus !== 'Paid' && paymentStatus !== 'Unpaid') return
    const next = { ...paymentOverrides.value, [bookingId]: paymentStatus }
    paymentOverrides.value = next
    setPaymentOverrides(next)
  }

  function updateModeOfPayment(bookingId: number, mode: string) {
    const next = { ...modeOfPaymentOverrides.value, [bookingId]: mode }
    modeOfPaymentOverrides.value = next
    setModeOfPaymentOverrides(next)
  }

  function addFrontendBooking(payload: FrontendBookingPayload): Booking {
    const list = getFrontendBookings()
    const nextId = list.length ? Math.max(...list.map((b) => b.id)) + 1 : 10000
    const booking: Booking = {
      ...payload,
      id: nextId,
      bookingRef: `WF-BK${nextId}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      modeOfPayment: payload.modeOfPayment ?? '—',
      paymentStatus: payload.paymentStatus ?? 'Unpaid',
      attendees: payload.attendees,
      purposeOfBooking: payload.purposeOfBooking ?? '—',
    }
    list.push(booking)
    setFrontendBookings(list)
    frontendBookings.value = [...list]
    return booking
  }

  return {
    flatRows,
    totalCount,
    updateStatus,
    updatePaymentStatus,
    updateModeOfPayment,
    addFrontendBooking,
  }
}
