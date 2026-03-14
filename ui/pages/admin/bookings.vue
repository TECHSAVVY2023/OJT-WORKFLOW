<template>
  <div class="min-h-full bg-palette-cream/40">
    <header class="bg-palette-white border-b border-palette-olive/15 shadow-sm">
      <div class="px-6 lg:px-8 py-6 sm:py-8">
        <h1 class="font-heading text-2xl sm:text-3xl font-bold text-palette-brown">Bookings</h1>
        <p class="mt-1 text-sm text-palette-brown/70">View and manage customer bookings. Set <strong>mode of payment</strong> (Cash/E-wallet) first, then mark as <strong>Paid</strong>.</p>
      </div>
    </header>
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Search and filter bar -->
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by customer, booking ID, or venue..."
          class="min-w-[200px] flex-1 max-w-xs px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown placeholder-palette-brown/50 focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px]"
        />
        <div class="relative inline-block min-w-[140px] sm:min-w-[160px]">
          <select
            id="filter-status"
            v-model="filterStatus"
            class="w-full min-w-[140px] sm:min-w-[160px] pl-3 pr-9 py-2.5 sm:pl-4 sm:pr-9 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage min-h-[42px] appearance-none"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            v-if="filterStatus"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-palette-brown/70 hover:text-palette-brown hover:bg-palette-olive/20 focus:outline-none focus:ring-2 focus:ring-palette-sage/40"
            aria-label="Clear status filter"
            @click="filterStatus = ''"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div ref="tableContainerRef" class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
      <!-- Mobile: card list -->
      <div class="md:hidden">
        <div v-if="sortedFilteredRows.length === 0" class="px-4 py-12 text-center text-palette-brown/80 text-sm font-medium">
          No bookings to show.
        </div>
        <div v-else class="divide-y divide-palette-olive/15">
          <article
            v-for="row in paginatedRows"
            :key="row.id"
            class="p-4 bg-palette-white"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold text-palette-brown/80 uppercase tracking-wider">ID</p>
                <p class="font-medium text-palette-dark text-sm truncate">{{ row.bookingRef }}</p>
              </div>
              <button type="button" class="p-2 shrink-0 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow" aria-label="View details" @click="viewDetailRow = row">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </div>
            <div class="space-y-1.5 text-sm">
              <div>
                <p class="text-xs text-palette-brown/70">Customer</p>
                <p class="font-medium text-palette-dark truncate">{{ row.customerName }}</p>
                <p class="text-palette-brown/80 text-xs truncate">{{ row.customerEmail }}</p>
              </div>
              <div>
                <p class="text-xs text-palette-brown/70">Venue</p>
                <p class="text-palette-dark truncate">{{ row.venueName }}</p>
              </div>
              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <div>
                  <p class="text-xs text-palette-brown/70">Date & time</p>
                  <p class="text-palette-dark">{{ row.date }} · {{ row.timeRange }}</p>
                </div>
                <div>
                  <p class="text-xs text-palette-brown/70">Total</p>
                  <p class="font-medium text-palette-dark">₱{{ row.total.toLocaleString() }}</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2 pt-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs text-palette-brown/70">Mode of payment</span>
                  <select
                    v-if="row.status === 'Pending' || row.status === 'Confirmed'"
                    class="min-w-0 max-w-[100px] px-2 py-1 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown"
                    :value="row.modeOfPayment"
                    @change="onModeOfPaymentChange(row.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="opt in MODE_OF_PAYMENT_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <span v-else class="text-palette-dark text-xs">{{ row.modeOfPayment ?? '—' }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-palette-brown/70">Payment</span>
                    <select
                      v-if="row.status === 'Pending' || row.status === 'Confirmed'"
                      class="flex-1 min-w-0 max-w-[90px] px-2 py-1 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown"
                      :value="row.paymentStatus"
                      @change="onPaymentChange(row.id, ($event.target as HTMLSelectElement).value)"
                    >
                      <option value="Paid" :disabled="row.modeOfPayment === '—' || !row.modeOfPayment?.trim()">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                    <span v-else :class="row.paymentStatus === 'Paid' ? 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-palette-sage/90 text-palette-white' : 'inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-palette-grey text-palette-brown'">{{ row.paymentStatus }}</span>
                  </div>
                  <p v-if="(row.status === 'Pending' || row.status === 'Confirmed') && (row.modeOfPayment === '—' || !row.modeOfPayment?.trim())" class="text-[10px] text-amber-700 mt-0.5">Paid disabled: set mode of payment first (e.g. Cash/E-wallet).</p>
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-palette-brown/70">Status</span>
                    <template v-if="row.status === 'Pending'">
                      <button type="button" class="px-2 py-1 rounded-workflow text-xs font-medium bg-palette-sage text-palette-white hover:opacity-90" @click="onStatusChange(row.id, 'Confirmed')">Approve</button>
                      <button type="button" class="px-2 py-1 rounded-workflow text-xs font-medium bg-red-600 text-white hover:opacity-90" @click="onStatusChange(row.id, 'Cancelled')">Decline</button>
                    </template>
                    <select
                      v-else-if="row.status === 'Confirmed'"
                      class="min-w-0 px-2 py-1 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown"
                      :value="row.status"
                      @change="onStatusChange(row.id, ($event.target as HTMLSelectElement).value)"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed" :disabled="row.paymentStatus === 'Unpaid'">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <span v-else class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(row.status)">{{ row.status }}</span>
                  </div>
                  <p v-if="row.status === 'Confirmed' && row.paymentStatus === 'Unpaid'" class="text-[10px] text-amber-700 mt-0.5">Completed disabled: mark as Paid first.</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Desktop: table -->
      <div class="hidden md:block overflow-x-auto -mx-px">
        <table class="w-full divide-y divide-palette-olive/20 table-auto min-w-0">
          <thead class="bg-palette-olive/15">
            <tr>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Booking ID</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Customer</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Venue</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Date & time</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Total</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Mode of payment</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Payment</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider">Status</th>
              <th scope="col" class="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase tracking-wider w-14">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-palette-white divide-y divide-palette-olive/15 admin-table-body">
            <tr v-if="sortedFilteredRows.length === 0">
              <td colspan="9" class="px-3 sm:px-4 py-12 sm:py-16 text-center text-palette-brown/80 text-sm font-medium">
                No bookings to show.
              </td>
            </tr>
            <tr v-for="row in paginatedRows" :key="row.id" class="hover:bg-palette-cream/50 transition-colors">
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium text-palette-dark">{{ row.bookingRef }}</td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm min-w-0">
                <p class="font-medium text-palette-dark truncate">{{ row.customerName }}</p>
                <p class="text-palette-brown/80 text-xs truncate">{{ row.customerEmail }}</p>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm text-palette-brown">{{ row.venueName }}</td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <p class="font-medium text-palette-dark">{{ row.date }}</p>
                <p class="text-palette-brown/80 text-xs">{{ row.timeRange }}</p>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium text-palette-dark">₱{{ row.total.toLocaleString() }}</td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <select
                  v-if="row.status === 'Pending' || row.status === 'Confirmed'"
                  class="min-w-0 w-full max-w-[110px] px-2 py-1.5 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
                  :value="row.modeOfPayment"
                  title="Set how customer paid (required before marking Paid)"
                  @change="onModeOfPaymentChange(row.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="opt in MODE_OF_PAYMENT_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <span v-else class="text-palette-dark">{{ row.modeOfPayment ?? '—' }}</span>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <div class="flex flex-col gap-0.5">
                  <select
                    v-if="row.status === 'Pending' || row.status === 'Confirmed'"
                    class="min-w-0 w-full max-w-[100px] px-2 py-1.5 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
                    :value="row.paymentStatus"
                    @change="onPaymentChange(row.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="Paid" :disabled="row.modeOfPayment === '—' || !row.modeOfPayment?.trim()">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                  <span v-else :class="row.paymentStatus === 'Paid' ? 'inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-palette-sage/90 text-palette-white w-fit' : 'inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-palette-grey text-palette-brown w-fit'">{{ row.paymentStatus }}</span>
                  <p v-if="(row.status === 'Pending' || row.status === 'Confirmed') && (row.modeOfPayment === '—' || !row.modeOfPayment?.trim())" class="text-[10px] text-amber-700">Paid disabled: set mode of payment first.</p>
                </div>
              </td>
              <td class="px-3 sm:px-4 py-3 sm:py-4 text-sm">
                <div class="flex flex-col gap-0.5">
                  <template v-if="row.status === 'Pending'">
                    <div class="flex flex-wrap gap-1">
                      <button type="button" class="px-2.5 py-1.5 rounded-workflow text-xs font-medium bg-palette-sage text-palette-white hover:opacity-90" @click="onStatusChange(row.id, 'Confirmed')">Approve</button>
                      <button type="button" class="px-2.5 py-1.5 rounded-workflow text-xs font-medium bg-red-600 text-white hover:opacity-90" @click="onStatusChange(row.id, 'Cancelled')">Decline</button>
                    </div>
                  </template>
                  <select
                    v-else-if="row.status === 'Confirmed'"
                    class="min-w-0 w-[100px] sm:w-[120px] px-2 py-1.5 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 focus:border-palette-sage"
                    :value="row.status"
                    @change="onStatusChange(row.id, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed" :disabled="row.paymentStatus === 'Unpaid'">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <span
                    v-else
                    class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium w-fit"
                    :class="statusClass(row.status)"
                  >
                    {{ row.status }}
                  </span>
                  <p v-if="row.status === 'Confirmed' && row.paymentStatus === 'Unpaid'" class="text-[10px] text-amber-700">Completed disabled: mark as Paid first.</p>
                </div>
              </td>
              <td class="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                <button type="button" class="p-2 text-palette-olive hover:text-palette-brown hover:bg-palette-cream/80 rounded-workflow transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="View details" @click="viewDetailRow = row">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-4 sm:px-6 py-3 bg-palette-olive/10 border-t border-palette-olive/20 flex flex-wrap items-center justify-between gap-2 text-sm text-palette-brown">
        <span class="text-xs sm:text-sm">Showing {{ showingFrom }}-{{ showingTo }} of {{ sortedFilteredRows.length }}</span>
        <div class="flex items-center gap-1">
          <button type="button" class="p-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/80 disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous page" :disabled="currentPage <= 1" @click="currentPage--">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="px-2 text-palette-brown/80 text-xs sm:text-sm">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
          <button type="button" class="p-2 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown hover:bg-palette-cream/80 disabled:opacity-50 disabled:pointer-events-none" aria-label="Next page" :disabled="currentPage >= totalPages" @click="currentPage++">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- View booking details modal -->
    <Teleport to="body">
      <div v-if="viewDetailRow" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-palette-dark/50" @click.self="viewDetailRow = null">
        <div class="bg-palette-cream border-2 border-palette-olive/40 rounded-workflow-lg shadow-xl w-full max-w-md min-w-[320px] max-h-[90vh] overflow-y-auto p-6">
          <h2 class="font-heading text-lg font-bold text-palette-brown mb-4">Booking details</h2>
          <dl class="grid grid-cols-1 gap-0 text-sm">
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Booking ID</dt><dd class="text-palette-dark">{{ viewDetailRow?.bookingRef }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Status</dt><dd><span class="inline-flex px-2.5 py-1 rounded-full text-xs font-medium" :class="statusClass(viewDetailRow?.status ?? 'Pending')">{{ viewDetailRow?.status }}</span></dd></div>
            <p class="text-xs font-semibold text-palette-brown/70 uppercase tracking-wider mt-4 mb-1">Customer</p>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Name</dt><dd class="text-palette-dark">{{ viewDetailRow?.customerName }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Email</dt><dd class="text-palette-dark">{{ viewDetailRow?.customerEmail }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Phone</dt><dd class="text-palette-dark">{{ viewDetailRow?.customerPhone ?? '—' }}</dd></div>
            <p class="text-xs font-semibold text-palette-brown/70 uppercase tracking-wider mt-4 mb-1">Venue & schedule</p>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Venue</dt><dd class="text-palette-dark">{{ viewDetailRow?.venueName }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Attendees</dt><dd class="text-palette-dark">{{ viewDetailRow?.attendees != null ? viewDetailRow.attendees : '—' }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Purpose of booking</dt><dd class="text-palette-dark">{{ viewDetailRow?.purposeOfBooking ?? '—' }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Date</dt><dd class="text-palette-dark">{{ viewDetailRow?.date }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Time</dt><dd class="text-palette-dark">{{ viewDetailRow?.timeRange }}</dd></div>
            <p class="text-xs font-semibold text-palette-brown/70 uppercase tracking-wider mt-4 mb-1">Payment</p>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Total</dt><dd class="text-palette-dark font-medium">₱{{ viewDetailRow?.total != null ? viewDetailRow.total.toLocaleString() : '—' }}</dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2 border-b border-palette-olive/10"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Mode of payment</dt><dd><select v-if="currentDetailRow && (currentDetailRow.status === 'Pending' || currentDetailRow.status === 'Confirmed')" class="px-2 py-1.5 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown" :value="currentDetailRow.modeOfPayment" @change="onModeOfPaymentChange(currentDetailRow.id, ($event.target as HTMLSelectElement).value)"><option v-for="opt in MODE_OF_PAYMENT_OPTIONS" :key="opt" :value="opt">{{ opt }}</option></select><span v-else class="text-palette-dark">{{ currentDetailRow?.modeOfPayment ?? '—' }}</span></dd></div>
            <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-2"><dt class="font-medium text-palette-brown/80 sm:w-28 shrink-0">Payment status</dt><dd class="flex flex-col gap-0.5"><select v-if="currentDetailRow && (currentDetailRow.status === 'Pending' || currentDetailRow.status === 'Confirmed')" class="w-full max-w-[120px] px-2 py-1.5 text-xs border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown" :value="currentDetailRow.paymentStatus" @change="onPaymentChange(currentDetailRow.id, ($event.target as HTMLSelectElement).value)"><option value="Paid" :disabled="currentDetailRow.modeOfPayment === '—' || !currentDetailRow.modeOfPayment?.trim()">Paid</option><option value="Unpaid">Unpaid</option></select><span v-else :class="currentDetailRow?.paymentStatus === 'Paid' ? 'inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-palette-sage/90 text-palette-white w-fit' : 'inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-palette-grey text-palette-brown w-fit'">{{ currentDetailRow?.paymentStatus ?? '—' }}</span><p v-if="currentDetailRow && (currentDetailRow.status === 'Pending' || currentDetailRow.status === 'Confirmed') && (currentDetailRow.modeOfPayment === '—' || !currentDetailRow.modeOfPayment?.trim())" class="text-xs text-amber-700 mt-1">Paid is disabled: set mode of payment above first (e.g. Cash/E-wallet).</p></dd></div>
          </dl>
          <div class="mt-6">
            <button type="button" class="w-full px-4 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="viewDetailRow = null">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success alert modal -->
    <Teleport to="body">
      <div v-if="successAlert.show" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-palette-dark/50" @click.self="successAlert.show = false">
        <div class="bg-palette-cream border-2 border-palette-olive/30 rounded-workflow-lg shadow-xl w-full max-w-sm p-6 text-center">
          <div class="w-12 h-12 rounded-full bg-palette-sage/20 text-palette-sage flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <p class="font-semibold text-palette-brown">{{ successAlert.title }}</p>
          <p class="text-sm text-palette-brown/80 mt-1">{{ successAlert.message }}</p>
          <button type="button" class="mt-4 px-6 py-2.5 text-sm font-semibold text-palette-cream bg-palette-brown rounded-workflow hover:bg-palette-olive" @click="successAlert.show = false">OK</button>
        </div>
      </div>
    </Teleport>

    <!-- Empty state -->
    <p v-if="!flatRows.length" class="text-center py-12 text-palette-brown/80 text-sm sm:text-base">
      No bookings yet.
    </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminBookingRow, BookingStatus } from '~/composables/useAdminBookings'
import { MODE_OF_PAYMENT_OPTIONS } from '~/composables/useAdminBookings'

definePageMeta({ layout: 'admin' })

const STATUS_ORDER: Record<BookingStatus, number> = { Pending: 0, Confirmed: 1, Completed: 2, Cancelled: 3 }

const { flatRows, updateStatus, updatePaymentStatus, updateModeOfPayment } = useAdminBookings()
const filterStatus = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const successAlert = ref<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' })
const tableContainerRef = ref<HTMLElement | null>(null)
const viewDetailRow = ref<AdminBookingRow | null>(null)
const currentDetailRow = computed(() => (viewDetailRow.value ? flatRows.value.find((r) => r.id === viewDetailRow.value!.id) ?? viewDetailRow.value : null))
const PAGE_SIZE = 10

const filteredRows = computed(() => {
  let list = flatRows.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter((r) => r.customerName.toLowerCase().includes(q) || r.customerEmail.toLowerCase().includes(q) || r.bookingRef.toLowerCase().includes(q) || r.venueName.toLowerCase().includes(q))
  if (filterStatus.value) list = list.filter((r) => r.status === filterStatus.value)
  return list
})

const sortedFilteredRows = computed(() =>
  [...filteredRows.value].sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (byStatus !== 0) return byStatus
    const byDate = (b.raw.date || '').localeCompare(a.raw.date || '')
    if (byDate !== 0) return byDate
    return (b.raw.startTime || '').localeCompare(a.raw.startTime || '')
  })
)

const totalPages = computed(() => Math.max(1, Math.ceil(sortedFilteredRows.value.length / PAGE_SIZE)))
const paginatedRows = computed(() => {
  const list = sortedFilteredRows.value
  const start = (currentPage.value - 1) * PAGE_SIZE
  return list.slice(start, start + PAGE_SIZE)
})
const showingFrom = computed(() => (sortedFilteredRows.value.length === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1))
const showingTo = computed(() => Math.min(currentPage.value * PAGE_SIZE, sortedFilteredRows.value.length))

watch([filterStatus, searchQuery], () => { currentPage.value = 1 })
watch(currentPage, () => {
  nextTick(() => {
    tableContainerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})

function resetFilters() {
  filterStatus.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

function statusClass(status: BookingStatus): string {
  switch (status) {
    case 'Confirmed':
      return 'bg-palette-sage/90 text-palette-white'
    case 'Completed':
      return 'bg-palette-olive/80 text-palette-cream'
    case 'Cancelled':
      return 'bg-palette-grey text-palette-brown'
    default:
      return 'bg-amber-100 text-amber-800'
  }
}

function onStatusChange(bookingId: number, value: string) {
  const status = value as BookingStatus
  if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) return
  const row = flatRows.value.find((r) => r.id === bookingId)
  if (status === 'Completed' && row?.paymentStatus === 'Unpaid') {
    successAlert.value = { show: true, title: 'Cannot complete', message: 'Mark as Paid first before completing the booking.' }
    return
  }
  updateStatus(bookingId, status)
  successAlert.value = { show: true, title: 'Booking updated', message: `Status has been updated to ${status}.` }
  useActivityLog().log('Booking status updated', `Booking ${bookingId} → ${status}`)
}

function onPaymentChange(bookingId: number, value: string) {
  if (value !== 'Paid' && value !== 'Unpaid') return
  const row = flatRows.value.find((r) => r.id === bookingId)
  if (value === 'Paid' && (row?.modeOfPayment === '—' || !row?.modeOfPayment?.trim())) {
    successAlert.value = { show: true, title: 'Set mode of payment first', message: 'Choose how the customer paid (e.g. E-wallet, Cash) before marking as Paid.' }
    return
  }
  updatePaymentStatus(bookingId, value)
  successAlert.value = { show: true, title: 'Payment updated', message: `Payment status set to ${value}.` }
  useActivityLog().log('Booking payment updated', `Booking ${bookingId} → ${value}`)
}

function onModeOfPaymentChange(bookingId: number, value: string) {
  updateModeOfPayment(bookingId, value)
  successAlert.value = { show: true, title: 'Mode of payment updated', message: `Set to ${value === '—' ? 'Not set' : value}.` }
  useActivityLog().log('Booking mode of payment updated', `Booking ${bookingId} → ${value}`)
}
</script>

<style scoped>
.admin-table-body {
  min-height: 520px;
}
</style>
