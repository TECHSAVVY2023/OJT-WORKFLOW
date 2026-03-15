<template>
  <div class="min-h-full bg-palette-cream/40">
    <DashboardPageHeader title="Sales Reports" subtitle="View all recorded beverage sales." />
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <label for="filter-period-sales" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Period</label>
          <select
            id="filter-period-sales"
            :model-value="state.filterPeriod"
            class="min-w-[120px] px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 min-h-[42px]"
            @change="state.setFilterPeriod(($event.target as HTMLSelectElement).value as 'all' | 'daily' | 'weekly' | 'monthly')"
          >
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <label for="filter-source-sales" class="text-sm font-medium text-palette-brown sr-only sm:not-sr-only">Source</label>
          <select
            id="filter-source-sales"
            :model-value="state.filterSource"
            class="min-w-[120px] px-3 py-2.5 sm:px-4 text-sm border border-palette-olive/40 rounded-workflow bg-palette-white text-palette-brown focus:ring-2 focus:ring-palette-sage/40 min-h-[42px]"
            @change="state.setFilterSource(($event.target as HTMLSelectElement).value)"
          >
            <option value="">All sources</option>
            <option value="qr">QR</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown text-sm font-medium hover:bg-palette-cream/60 min-h-[42px]"
          @click="state.exportSalesCsv()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export
        </button>
      </div>

      <div class="mb-6 p-4 rounded-xl bg-palette-sage/10 border border-palette-sage/30">
        <p class="text-sm font-medium text-palette-brown/80">{{ state.filterPeriodLabel }} total</p>
        <p class="text-2xl font-bold text-palette-dark">₱{{ state.filteredTotalSales.toLocaleString() }}</p>
        <p class="text-xs text-palette-brown/60 mt-1">{{ state.filteredRecords.length }} transaction(s)</p>
      </div>

      <div class="border border-palette-olive/30 rounded-workflow-lg overflow-hidden bg-palette-white shadow-md">
        <div class="overflow-x-auto">
          <table class="min-w-[640px] w-full divide-y divide-palette-olive/20">
            <thead class="bg-palette-olive/15">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Sale ID</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Order ID</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Staff</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Source</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Payment</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-semibold text-palette-brown uppercase">Transaction ID</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Proof</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-palette-brown uppercase">Total</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-palette-brown uppercase">Amount paid</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-semibold text-palette-brown uppercase">Change</th>
                <th scope="col" class="px-4 py-3 text-center text-xs font-semibold text-palette-brown uppercase">Date & time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-palette-olive/15">
              <tr v-for="r in state.filteredRecords" :key="r.id" class="hover:bg-palette-cream/50">
                <td class="px-4 py-3 text-sm font-medium text-palette-dark">{{ r.id }}</td>
                <td class="px-4 py-3 text-sm text-palette-brown">{{ r.orderId }}</td>
                <td class="px-4 py-3 text-sm text-palette-brown">{{ r.staffName }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium" :class="r.source === 'qr' ? 'bg-palette-sage/20 text-palette-sage' : 'bg-palette-olive/20 text-palette-brown'">{{ r.source === 'qr' ? 'QR' : 'Manual' }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-palette-brown/80">{{ r.paymentMethod ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-palette-brown/80 max-w-[140px] truncate" :title="r.manualTransactionId ?? ''">{{ r.manualTransactionId ?? '—' }}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    v-if="r.receiptProof"
                    type="button"
                    class="inline-flex items-center justify-center px-3 py-1.5 rounded-workflow border border-palette-olive/40 bg-palette-white text-palette-brown text-xs font-medium hover:bg-palette-cream/60"
                    @click="state.openProof(r)"
                  >
                    View
                  </button>
                  <span v-else class="text-palette-brown/60 text-sm">—</span>
                </td>
                <td class="px-4 py-3 text-sm font-semibold text-palette-dark text-right">₱{{ r.total.toLocaleString() }}</td>
                <td class="px-4 py-3 text-sm text-palette-brown/80 text-right">{{ r.amountPaid != null ? '₱' + r.amountPaid.toLocaleString() : '—' }}</td>
                <td class="px-4 py-3 text-sm text-palette-brown/80 text-right">{{ r.amountPaid != null ? '₱' + (r.amountPaid - r.total).toLocaleString() : '—' }}</td>
                <td class="px-4 py-3 text-sm text-center">
                  <template v-if="state.dateTimeFormatted(r.createdAt).date">
                    <p class="font-medium text-palette-dark">{{ state.dateTimeFormatted(r.createdAt).date }}</p>
                    <p class="text-palette-brown/80 text-xs">{{ state.dateTimeFormatted(r.createdAt).time }}</p>
                  </template>
                  <span v-else class="text-palette-brown/80">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="!state.filteredRecords.length" class="text-center py-12 text-palette-brown/80">{{ state.records.length ? 'No sales match the filters.' : 'No sales recorded yet.' }}</p>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="state.proofModalOpen"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      @click.self="state.closeProof()"
    >
      <div class="bg-palette-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-palette-olive/20">
        <div class="px-5 py-4 border-b border-palette-olive/15 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-palette-brown">Proof of payment</p>
            <p v-if="state.proofMeta" class="text-xs text-palette-brown/70 truncate">
              {{ state.proofMeta.saleId }} • Order {{ state.proofMeta.orderId }} • {{ state.proofMeta.payment ?? '—' }}
              <span v-if="state.proofMeta.transactionId" class="block mt-0.5">Transaction ID: {{ state.proofMeta.transactionId }}</span>
            </p>
          </div>
          <button
            type="button"
            class="p-2 rounded-full hover:bg-palette-cream/60 text-palette-brown/80"
            aria-label="Close"
            @click="state.closeProof()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="p-5">
          <div v-if="state.proofDataUrl" class="rounded-xl overflow-hidden border border-palette-olive/20 bg-palette-cream/20">
            <img :src="state.proofDataUrl" alt="Payment proof" class="w-full h-auto object-contain max-h-[70vh]" />
          </div>
          <p v-else class="text-sm text-palette-brown/70">No proof available.</p>

          <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              class="py-2.5 px-4 rounded-full border border-palette-olive/40 text-palette-brown font-medium text-sm hover:bg-palette-cream/60 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!state.proofDataUrl || !state.proofMeta"
              @click="state.downloadProof()"
            >
              Download
            </button>
            <button
              type="button"
              class="py-2.5 px-4 rounded-full bg-palette-sage text-palette-white font-semibold text-sm hover:opacity-90"
              @click="state.closeProof()"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { useManagerSalesPage } from '~/composables/useManagerSalesPage'

defineProps<{
  state: ReturnType<typeof useManagerSalesPage>
}>()
</script>
