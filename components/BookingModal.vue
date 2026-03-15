<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-palette-dark/50 font-poppins"
        @click.self="$emit('update:modelValue', false)"
      >
        <div
          class="relative bg-palette-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 pt-6 pb-2 border-b border-palette-grey">
            <h2 id="booking-modal-title" class="text-xl font-bold text-palette-brown">
              Book {{ venue?.name ?? 'Room' }}
            </h2>
            <button
              type="button"
              class="p-2 rounded-lg text-palette-olive hover:bg-palette-grey/50"
              aria-label="Close"
              @click="$emit('update:modelValue', false)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Progress -->
          <div class="flex gap-1 px-6 pt-3">
            <span
              v-for="s in 3"
              :key="s"
              class="h-1 flex-1 rounded-full transition-colors"
              :class="step >= s ? 'bg-palette-sage' : 'bg-palette-grey'"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <!-- Step 1: Select Date -->
            <div v-show="step === 1" class="space-y-4">
              <p class="text-sm font-semibold text-palette-brown">Select Date</p>
              <!-- Visible native date input — clicking it always opens the calendar -->
              <label class="block text-xs text-palette-olive mb-1">Choose booking date first — tap below to open calendar</label>
              <div class="relative flex items-center rounded-xl border border-palette-grey bg-palette-white">
                <input
                  ref="dateInputRef"
                  v-model="selectedDate"
                  type="date"
                  :min="minDate"
                  class="booking-date-native w-full min-h-[48px] px-4 py-3 pr-10 text-sm text-palette-brown border-0 bg-transparent rounded-xl cursor-pointer focus:ring-2 focus:ring-palette-sage focus:ring-inset outline-none [color-scheme:light]"
                  aria-label="Choose booking date"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-palette-olive" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </span>
              </div>
              <div class="rounded-xl bg-palette-sage/10 border border-palette-sage/30 p-4 flex gap-3">
                <span class="shrink-0 w-8 h-8 rounded-full bg-palette-sage flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-palette-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
                <div class="text-sm text-palette-brown">
                  <p class="font-semibold">Instant Confirmation</p>
                  <p class="text-palette-olive/90">Your booking is secured immediately after completion.</p>
                </div>
              </div>
            </div>

            <!-- Step 2: Time & Duration -->
            <div v-show="step === 2" class="space-y-4">
              <p class="text-sm font-semibold text-palette-brown">Select Time & Duration</p>
              <p class="text-xs text-palette-olive">Choose your start time (30-minute intervals) and booking duration.</p>
              <div>
                <label class="block text-xs font-medium text-palette-brown mb-2">Start Time <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  <button
                    v-for="slot in timeSlots"
                    :key="slot.value"
                    type="button"
                    class="py-2 px-2 rounded-lg text-xs font-medium transition-colors"
                    :class="getTimeSlotClass(slot)"
                    :disabled="slot.disabled"
                    @click="selectTime(slot)"
                  >
                    {{ slot.label }}
                  </button>
                </div>
                <div class="flex flex-wrap gap-4 text-xs text-palette-olive mt-2">
                  <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-palette-white border border-palette-grey" /> Available</span>
                  <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-palette-grey" /> Booked/Unavailable</span>
                  <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-palette-sage" /> Selected</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-palette-brown mb-2">Duration <span class="text-red-500">*</span></label>
                <select
                  v-model="selectedDuration"
                  class="w-full rounded-xl border border-palette-grey px-4 py-3 text-sm text-palette-brown"
                >
                  <option v-for="d in availableDurations" :key="d" :value="d">{{ d === 1 ? '1 hour' : `${d} hours` }}</option>
                </select>
                <p class="text-xs text-palette-olive mt-1">Duration is limited so your booking ends by 10 PM (closing time).</p>
              </div>
              <!-- Step 2 error: no start time or time has passed -->
              <div
                v-if="step2Error"
                class="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                role="alert"
              >
                {{ step2ErrorMessage }}
              </div>
              <!-- Booking summary -->
              <div class="rounded-xl bg-palette-cream border border-palette-grey p-4 space-y-2">
                <p class="text-xs font-semibold text-palette-brown uppercase tracking-wide">Booking Summary</p>
                <div class="flex justify-between text-sm">
                  <span class="text-palette-olive">Start Time</span>
                  <span class="font-medium text-palette-brown">{{ selectedTimeLabel || '—' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-palette-olive">End Time</span>
                  <span class="font-medium text-palette-brown">{{ endTimeLabel || '—' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-palette-olive">Duration</span>
                  <span class="font-medium text-palette-brown">{{ selectedDuration === 1 ? '1 hour' : selectedDuration + ' hours' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-palette-olive">Rate</span>
                  <span class="font-medium text-palette-brown">₱{{ formatRate(venue?.hourlyRate ?? 0) }}/hour</span>
                </div>
                <div class="flex justify-between text-sm pt-2 border-t border-palette-grey">
                  <span class="font-semibold text-palette-brown">Total Amount</span>
                  <span class="font-bold text-palette-sage">₱{{ formatRate(totalAmount) }}</span>
                </div>
              </div>
            </div>

            <!-- Step 3: Contact & T&C -->
            <div v-show="step === 3" class="space-y-4">
              <p class="text-sm font-semibold text-palette-brown uppercase tracking-wide">Contact Information</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-palette-brown mb-1">First name <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="Juan"
                    class="w-full rounded-xl border border-palette-grey px-4 py-3 text-sm text-palette-brown placeholder-palette-olive/60"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-palette-brown mb-1">Last name <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Dela Cruz"
                    class="w-full rounded-xl border border-palette-grey px-4 py-3 text-sm text-palette-brown placeholder-palette-olive/60"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-palette-brown mb-1">Email Address <span class="text-red-500">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="example@gmail.com"
                  class="w-full rounded-xl border border-palette-grey px-4 py-3 text-sm text-palette-brown placeholder-palette-olive/60"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-palette-brown mb-1">Mobile Number <span class="text-red-500">*</span></label>
                <div class="flex items-center rounded-xl border border-palette-grey overflow-hidden bg-palette-white">
                  <span class="pl-4 py-3 text-sm text-palette-olive select-none">+63</span>
                  <input
                    v-model="form.mobile"
                    type="tel"
                    inputmode="numeric"
                    placeholder="912 345 6789"
                    maxlength="10"
                    class="flex-1 min-w-0 py-3 px-2 text-sm text-palette-brown placeholder-palette-olive/60 border-0 focus:ring-0 focus:outline-none"
                    @input="onMobileInput"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-palette-brown mb-1">Purpose of Booking <span class="text-red-500">*</span></label>
                <select
                  v-model="form.purpose"
                  class="w-full rounded-xl border border-palette-grey px-4 py-3 text-sm text-palette-brown"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Interview">Interview</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-palette-brown mb-1">Number of Attendees <span class="text-red-500">*</span></label>
                <input
                  :value="form.attendees"
                  type="number"
                  :min="1"
                  :max="maxAttendees"
                  class="w-full rounded-xl border border-palette-grey px-4 py-3 text-sm text-palette-brown"
                  @input="onAttendeesInput"
                />
                <p class="text-xs text-palette-olive mt-1">Max capacity: {{ maxAttendees }} people</p>
              </div>
              <div class="flex items-start gap-3 pt-2">
                <input
                  id="booking-tnc"
                  v-model="form.agreeTerms"
                  type="checkbox"
                  class="mt-1 w-4 h-4 rounded border-palette-grey text-palette-sage focus:ring-palette-sage"
                />
                <label for="booking-tnc" class="text-xs text-palette-brown">
                  I agree to the
                  <a href="#" class="text-palette-sage font-medium hover:underline">Terms and Conditions</a>
                  and confirm that this booking is final and all details provided are accurate. I understand that cancellations or changes may be subject to the cancellation policy.
                </label>
              </div>
            </div>

            <!-- Step 4: Success -->
            <div v-show="step === 4" class="py-8 text-center">
              <div class="w-20 h-20 rounded-full bg-palette-sage flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-palette-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-palette-brown mb-2">Booking confirmed!</h3>
              <p class="text-sm text-palette-brown/90 mb-2">An email confirmation has been sent to <strong>{{ form.email }}</strong>.</p>
              <p class="text-xs text-palette-olive mb-4">Please check your inbox for booking details. You can close this window.</p>
              <p class="text-xs text-palette-sage font-medium">This window will close automatically in a few seconds.</p>
            </div>
          </div>

          <!-- Footer buttons -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-palette-grey bg-palette-cream/50">
            <button
              v-if="step > 1 && step < 4"
              type="button"
              class="text-sm font-medium text-palette-olive hover:text-palette-brown"
              @click="onBack"
            >
              ← Back
            </button>
            <span v-else />
            <template v-if="step < 4">
              <button
                v-if="step < 3"
                type="button"
                class="py-2.5 px-5 rounded-full bg-palette-sage text-palette-white font-semibold text-sm hover:opacity-90"
                :disabled="step === 1 ? !selectedDate : false"
                @click="goNextStep"
              >
                Next Step →
              </button>
              <button
                v-else
                type="button"
                class="py-2.5 px-5 rounded-full font-semibold text-sm transition-opacity"
                :class="canConfirmStep3 ? 'bg-palette-sage text-palette-white hover:opacity-90' : 'bg-palette-grey text-palette-brown/60 cursor-not-allowed'"
                :disabled="!canConfirmStep3"
                @click="showConfirmBooking = true"
              >
                Confirm Booking
              </button>
            </template>
            <button
              v-else
              type="button"
              class="py-2.5 px-5 rounded-full bg-palette-sage text-palette-white font-semibold text-sm hover:opacity-90"
              @click="closeAfterSuccess"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Are you sure? - teleported on top of everything so it's always visible -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showConfirmBooking"
          class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-palette-dark/60 font-poppins"
          @click.self="showConfirmBooking = false"
        >
          <div
            class="bg-palette-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-booking-title"
          >
            <h3 id="confirm-booking-title" class="text-lg font-bold text-palette-brown mb-2">Are you sure?</h3>
            <p class="text-sm text-palette-brown/90 mb-6">
              Do you want to confirm this booking? You will receive an email confirmation after submitting.
            </p>
            <div class="flex gap-3 justify-center">
              <button
                type="button"
                class="flex-1 py-2.5 rounded-full border-2 border-palette-olive bg-transparent text-palette-brown font-semibold text-sm hover:bg-palette-cream"
                @click="showConfirmBooking = false"
              >
                Cancel
              </button>
              <button
                type="button"
                class="flex-1 py-2.5 rounded-full bg-palette-sage text-palette-white font-semibold text-sm hover:opacity-90"
                @click="confirmBooking"
              >
                Yes, confirm
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  venue: {
    id?: number
    name: string
    hourlyRate?: number
    capacity?: string
    operatingHours?: string
  } | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const step = ref(1)
const showConfirmBooking = ref(false)
const step2Error = ref(false)
const step2ErrorPastTime = ref(false)
const selectedDate = ref('')
const selectedTime = ref('')
const selectedDuration = ref(1)
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  purpose: 'Meeting',
  attendees: 1,
  agreeTerms: false,
})

// Min date = today (past dates unclickable in native date input)
const today = new Date()
const minDate = computed(() => {
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
})

// Parse capacity "Up to 20 people" -> 20, or numeric 20, max 20
const maxAttendees = computed(() => {
  const cap = props.venue?.capacity
  if (cap == null) return 20
  const s = String(cap)
  const match = s.match(/(\d+)/)
  return match ? Math.min(Number(match[1]), 20) : 20
})

// Date in field: Month/Date/Year (MM/DD/YYYY)
const dateFieldDisplay = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-')
  return `${m}/${d}/${y}`
})

// Date display for "Selected:" line (e.g. February 20, 2026)
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})

const dateInputRef = ref<HTMLInputElement | null>(null)

function onAttendeesInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const num = parseInt(raw, 10)
  if (Number.isNaN(num) || num < 1) {
    form.attendees = 1
    return
  }
  form.attendees = Math.min(num, maxAttendees.value)
}

// Closing time 10 PM (22:00) — no start at 9:30 PM or 10:00 PM; last start is 9:00 PM
const closingHour = 22
const closingMins = 0
const closingMinutes = closingHour * 60 + closingMins // 1320

// Time slots: 8 AM up to 9:00 PM (exclude 9:30 PM and 10:00 PM as start times).
// If selected date is today, disable slots that have already passed.
const timeSlots = computed(() => {
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const isToday = selectedDate.value === todayStr

  const slots: { value: string; label: string; disabled: boolean }[] = []
  for (let h = 8; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) continue // exclude 9:30 PM
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h < 12 ? 'AM' : 'PM'
      const label = `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
      const slotMinutes = h * 60 + m
      const past = isToday && slotMinutes < currentMinutes
      slots.push({ value, label, disabled: past })
    }
  }
  return slots
})

// Duration options: only allow hours that don't go past closing (10 PM)
const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8]
const availableDurations = computed(() => {
  if (!selectedTime.value) return durationOptions
  const [h, m] = selectedTime.value.split(':').map(Number)
  const startMinutes = h * 60 + m
  const maxHours = Math.floor((closingMinutes - startMinutes) / 60)
  if (maxHours < 1) return [1]
  return durationOptions.filter((hours) => hours <= maxHours)
})

const selectedTimeLabel = computed(() => {
  const slot = timeSlots.value.find(s => s.value === selectedTime.value)
  return slot?.label ?? ''
})

// End time = start time + duration (for booking summary display)
const endTimeLabel = computed(() => {
  if (!selectedTime.value || !selectedDuration.value) return ''
  const [hStr, mStr] = selectedTime.value.split(':').map(Number)
  let endMins = hStr * 60 + mStr + selectedDuration.value * 60
  const endH = Math.floor(endMins / 60) % 24
  const endM = endMins % 60
  const hour12 = endH > 12 ? endH - 12 : endH === 0 ? 12 : endH
  const ampm = endH < 12 ? 'AM' : 'PM'
  return `${hour12}:${String(endM).padStart(2, '0')} ${ampm}`
})

// End time in HH:mm for backend payload
const endTimeValue = computed(() => {
  if (!selectedTime.value || !selectedDuration.value) return ''
  const [hStr, mStr] = selectedTime.value.split(':').map(Number)
  const endMins = hStr * 60 + mStr + selectedDuration.value * 60
  const endH = Math.floor(endMins / 60) % 24
  const endM = endMins % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
})

const totalAmount = computed(() => {
  const rate = props.venue?.hourlyRate ?? 0
  return rate * selectedDuration.value
})

const canProceed = computed(() => {
  if (step.value === 1) return !!selectedDate.value
  if (step.value === 2) return !!selectedTime.value
  return true
})

const step2ErrorMessage = computed(() => {
  if (step2ErrorPastTime.value) return 'This time has already passed. Please choose a later time.'
  return 'There is no start time chosen. Please choose in order to proceed to next step.'
})

function goNextStep() {
  if (step.value === 2) {
    if (!selectedTime.value) {
      step2Error.value = true
      step2ErrorPastTime.value = false
      return
    }
    const slot = timeSlots.value.find(s => s.value === selectedTime.value)
    if (slot?.disabled) {
      step2Error.value = true
      step2ErrorPastTime.value = true
      selectedTime.value = ''
      return
    }
    step2Error.value = false
    step2ErrorPastTime.value = false
  }
  step.value++
}

function onBack() {
  step2Error.value = false
  step2ErrorPastTime.value = false
  step.value--
}

function getTimeSlotClass(slot: { value: string; label: string; disabled: boolean }) {
  if (slot.disabled) return 'bg-palette-grey text-palette-olive/60 cursor-not-allowed'
  if (selectedTime.value === slot.value) return 'bg-palette-sage text-palette-white'
  return 'bg-palette-white border border-palette-grey text-palette-brown hover:border-palette-sage'
}

function selectTime(slot: { value: string; label: string; disabled: boolean }) {
  if (!slot.disabled) {
    selectedTime.value = slot.value
    step2Error.value = false
    step2ErrorPastTime.value = false
    // Clamp duration so end time does not go past 10 PM
    const maxHours = availableDurations.value[availableDurations.value.length - 1] ?? 1
    if (selectedDuration.value > maxHours) selectedDuration.value = maxHours
  }
}

function formatRate(rate: number) {
  return rate.toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

const { addFrontendBooking } = useAdminBookings()

function confirmBooking() {
  showConfirmBooking.value = false
  const slot = timeSlots.value.find(s => s.value === selectedTime.value)
  if (slot?.disabled) {
    step2Error.value = true
    step2ErrorPastTime.value = true
    selectedTime.value = ''
    step.value = 2
    return
  }
  const venueId = props.venue?.id
  const venueName = props.venue?.name ?? 'Venue'
  if (typeof venueId === 'number' && selectedDate.value && selectedTime.value && endTimeValue.value) {
    addFrontendBooking({
      venueId,
      venueName,
      customerName: customerName.value || `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      customerEmail: form.email.trim(),
      customerPhone: form.mobile.trim() ? `+63 ${form.mobile.replace(/\D/g, '')}` : undefined,
      date: selectedDate.value,
      startTime: selectedTime.value,
      endTime: endTimeValue.value,
      attendees: form.attendees,
      purposeOfBooking: form.purpose,
      paymentStatus: 'Unpaid',
    })
  }
  step.value = 4
  setTimeout(() => {
    closeAfterSuccess()
  }, 3500)
}

// Mobile: only digits, max 10 (Philippines without +63)
function onMobileInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  const digits = raw.replace(/\D/g, '').slice(0, 10)
  form.mobile = digits
}

function closeAfterSuccess() {
  emit('update:modelValue', false)
  // Reset for next open
  step.value = 1
  selectedDate.value = ''
  selectedTime.value = ''
  selectedDuration.value = 1
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.mobile = ''
  form.purpose = 'Meeting'
  form.attendees = 1
  form.agreeTerms = false
}

// Customer full name for submission (e.g. to backend)
const customerName = computed(() => [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' '))

const canConfirmStep3 = computed(() => {
  return form.agreeTerms && form.firstName.trim() && form.lastName.trim() && form.email.trim() && form.mobile.replace(/\D/g, '').length >= 10
})

// Init when modal opens
watch(() => props.modelValue, (open) => {
  if (open) {
    step.value = 1
    step2Error.value = false
    selectedDate.value = ''
    form.attendees = Math.min(form.attendees, maxAttendees.value) || 1
  }
})
</script>

<style scoped>
/* Native date input: hide browser calendar icon so our icon shows; input stays fully clickable */
.booking-date-native::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .rounded-2xl,
.modal-leave-active .rounded-2xl {
  transition: transform 0.2s ease;
}
.modal-enter-from .rounded-2xl,
.modal-leave-to .rounded-2xl {
  transform: scale(0.95);
}
</style>
