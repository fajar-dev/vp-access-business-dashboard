<script setup lang="ts">
import { retentionService } from '~/services/retention-service'
import type { ContractExpiringStats, TicketStats, UsageStats, PaymentStats } from '~/types/retention'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatPercentage } from '~/utils/format'

// Page meta to use our default layout container
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe } = useDashboardFilters()
const contractExpiringStats = ref<ContractExpiringStats | null>(null)
const ticketStats = ref<TicketStats | null>(null)
const usageStats = ref<UsageStats | null>(null)
const paymentStats = ref<PaymentStats | null>(null)
const isLoadingExpiring = ref(false)
const isLoadingTicket = ref(false)
const isLoadingUsage = ref(false)
const isLoadingPayment = ref(false)

const fetchContractExpiring = async () => {
  isLoadingExpiring.value = true
  const res = await retentionService.getContractExpiring(selectedBranch.value)
  if (res?.success) contractExpiringStats.value = res.data
  isLoadingExpiring.value = false
}

const fetchTicket = async () => {
  isLoadingTicket.value = true
  const res = await retentionService.getTicket(selectedBranch.value, selectedTimeframe.value)
  if (res?.success) ticketStats.value = res.data
  isLoadingTicket.value = false
}

const fetchUsage = async () => {
  isLoadingUsage.value = true
  const res = await retentionService.getUsage(selectedBranch.value, selectedTimeframe.value)
  if (res?.success) usageStats.value = res.data
  isLoadingUsage.value = false
}

const fetchPayment = async () => {
  isLoadingPayment.value = true
  const res = await retentionService.getPayment(selectedBranch.value)
  if (res?.success) paymentStats.value = res.data
  isLoadingPayment.value = false
}

const fetchData = () => {
  fetchContractExpiring()
  fetchTicket()
  fetchUsage()
  fetchPayment()
}

// Watchers to trigger re-fetch when branch changes
watch([selectedBranch, selectedTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Top Grid: Left Column spans 2 columns, Right Column spans 1 column -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Left Column: Contract Expiring and Tickets/Usage Grid (2/3 width) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- Contract Expiring Box Container -->
        <UCard 
          class="border border-neutral-100 flex flex-col justify-between"
          :ui="{ body: 'p-6 flex-1 flex flex-col' }"
        >
          <!-- Title Row -->
          <div class="flex items-center gap-2 select-none">
            <UIcon name="i-lucide-file-pen-line" class="w-5 h-5 text-info" />
            <h3 class="text-sm font-semibold text-neutral-900">
              Contract Expiring
            </h3>
          </div>

          <!-- 3-Column horizontal statistics badges -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            <!-- 30 Hari -->
            <MetricCard
              title="30 Hari"
              :value="contractExpiringStats ? String(contractExpiringStats.total_30) : '0'"
              subtext="Kontrak segera berakhir"
              :is-loading="isLoadingExpiring"
            />

            <!-- 60 Hari -->
            <MetricCard
              title="60 Hari"
              :value="contractExpiringStats ? String(contractExpiringStats.total_60) : '0'"
              subtext="Kontrak segera berakhir"
              :is-loading="isLoadingExpiring"
            />

            <!-- 90 Hari -->
            <MetricCard
              title="90 Hari"
              :value="contractExpiringStats ? String(contractExpiringStats.total_90) : '0'"
              subtext="Kontrak segera berakhir"
              :is-loading="isLoadingExpiring"
            />

          </div>
        </UCard>

        <!-- 2-Column KPI grid at bottom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Customer Support Ticket Alert -->
          <MetricCard
            title="Customer ≥2 Ticket dalam 1 Bulan"
            :value="ticketStats ? String(ticketStats.value) : '0'"
            :trend="ticketStats ? formatPercentage(ticketStats.percentage) : '0%'"
            :trend-direction="ticketStats?.trend === 'down' ? 'down' : 'up'"
            :trend-color="ticketStats?.trend === 'down' ? 'primary' : 'error'"
            subtext="Indikasi ketidakpuasan layanan"
            icon="i-lucide-ticket"
            icon-color="text-indigo-500"
            :is-loading="isLoadingTicket"
          />

          <MetricCard
            title="Penurunan Usage Customer"
            :value="usageStats ? String(usageStats.value) : '0'"
            :trend="usageStats ? formatPercentage(usageStats.percentage) : '0%'"
            :trend-direction="usageStats?.trend === 'down' ? 'down' : 'up'"
            :trend-color="usageStats?.trend === 'down' ? 'primary' : 'error'"
            subtext="Usage <500MB per bulan"
            icon="i-lucide-trending-down"
            icon-color="text-rose-500"
            :is-loading="isLoadingUsage"
          />
        </div>
      </div>

      <!-- Right Column: Customer Monthly Payment Donut Chart (1/3 width) -->
      <div class="lg:col-span-1">
        <CustomerPaymentChart :data="paymentStats" :is-loading="isLoadingPayment" />
      </div>

    </div>
  </div>
</template>
