<script setup lang="ts">
import { retentionService } from '~/services/retention-service'
import type { ContractExpiringStats, TicketStats } from '~/types/retention'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatPercentage } from '~/utils/format'

// Page meta to use our default layout container
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe } = useDashboardFilters()
const contractExpiringStats = ref<ContractExpiringStats | null>(null)
const ticketStats = ref<TicketStats | null>(null)
const isLoading = ref(false)

const fetchData = async () => {
  isLoading.value = true
  const [expiringResponse, ticketResponse] = await Promise.all([
    retentionService.getContractExpiring(selectedBranch.value),
    retentionService.getTicket(selectedBranch.value, selectedTimeframe.value)
  ])
  
  if (expiringResponse?.success) {
    contractExpiringStats.value = expiringResponse.data
  }
  if (ticketResponse?.success) {
    ticketStats.value = ticketResponse.data
  }
  
  isLoading.value = false
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
            <div class="border border-neutral-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-600">30 Hari</span>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">
                  <span v-if="isLoading" class="text-neutral-300">...</span>
                  <span v-else>{{ contractExpiringStats?.total_30 || 0 }}</span>
                </span>
                <span class="text-sm text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

            <!-- 60 Hari -->
            <div class="border border-neutral-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-600">60 Hari</span>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">
                  <span v-if="isLoading" class="text-neutral-300">...</span>
                  <span v-else>{{ contractExpiringStats?.total_60 || 0 }}</span>
                </span>
                <span class="text-sm text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

            <!-- 90 Hari -->
            <div class="border border-neutral-200 rounded-lg p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-600">90 Hari</span>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">
                  <span v-if="isLoading" class="text-neutral-300">...</span>
                  <span v-else>{{ contractExpiringStats?.total_90 || 0 }}</span>
                </span>
                <span class="text-sm text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

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
          />

          <!-- Customer Usage Decrease Alert -->
          <MetricCard
            title="Penurunan Usage Customer"
            value="237"
            trend="18.3%"
            trend-direction="up"
            trend-color="error"
            subtext="Usage <500MB per bulan"
            icon="i-lucide-trending-down"
            icon-color="text-rose-500"
          />
        </div>
      </div>

      <!-- Right Column: Customer Monthly Payment Donut Chart (1/3 width) -->
      <div class="lg:col-span-1">
        <CustomerPaymentChart />
      </div>

    </div>
  </div>
</template>
