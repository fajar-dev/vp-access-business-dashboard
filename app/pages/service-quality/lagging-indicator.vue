<template>
  <div class="space-y-6">

    <!-- Top Row: Grid of 4 lagging indicator KPI cards (1 row, 4 columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Total Tiket -->
      <MetricCard
        title="Total Tiket"
        :value="ticketStats ? String(ticketStats.value) : '0'"
        :trend="ticketStats ? formatPercentage(ticketStats.percentage) : '0%'"
        :trend-direction="ticketStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="ticketStats?.trend === 'down' ? 'primary' : 'error'"
        :subtext="`${ticketStats?.period || 'Bulan Ini'}`"
        icon="i-lucide-message-circle-more"
        icon-color="text-error"
        :is-loading="isLoadingTicket"
      />

      <!-- Total Komplain Customer -->
      <MetricCard
        title="Total Komplain Customer"
        :value="complaintStats ? String(complaintStats.value) : '0'"
        :trend="complaintStats ? formatPercentage(complaintStats.percentage) : '0%'"
        :trend-direction="complaintStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="complaintStats?.trend === 'down' ? 'primary' : 'error'"
        :subtext="`${complaintStats?.period || 'Bulan Ini'}`"
        icon="i-lucide-message-square-warning"
        icon-color="text-info"
        :is-loading="isLoadingComplaint"
      />

      <!-- Solved Customers -->
      <MetricCard
        title="Solved Customers"
        :value="solvedPercentageStats ? formatPercentage(solvedPercentageStats.value) : '0%'"
        :trend="solvedPercentageStats ? formatPercentage(solvedPercentageStats.percentage) : '0%'"
        :trend-direction="solvedPercentageStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="solvedPercentageStats?.trend === 'down' ? 'error' : 'primary'"
        :subtext="`${solvedPercentageStats?.period || 'Bulan Ini'}`"
        icon="i-lucide-thumbs-up"
        icon-color="text-info"
        :is-loading="isLoadingSolvedPercentage"
      />

      <!-- Total Solved -->
      <MetricCard
        title="Total Solved"
        :value="solvedStats ? String(solvedStats.value) : '0'"
        :trend="solvedStats ? formatPercentage(solvedStats.percentage) : '0%'"
        :trend-direction="solvedStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="solvedStats?.trend === 'down' ? 'error' : 'primary'"
        :subtext="`${solvedStats?.period || 'Bulan Ini'}`"
        icon="i-lucide-square-check-big"
        icon-color="text-info"
        :is-loading="isLoadingSolved"
      />
    </div>

    <!-- Middle Section: Radar Chart and Insight Panel -->
    <ServiceQualityRadar 
      :ticket-stats="ticketStats"
      :complaint-stats="complaintStats"
      :solved-stats="solvedStats"
      :solved-percentage-stats="solvedPercentageStats"
      :is-loading="isLoadingRadar"
    />

  </div>
</template>

<script setup lang="ts">
import { serviceQualityService } from '~/services/service-quality-service'
import type { TicketStats } from '~/types/service-quality'
import { formatPercentage } from '~/utils/format'
import { useDashboardFilters } from '~/composables/useDashboardFilters'

// Page meta to use our default layout container
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe: globalTimeframe } = useDashboardFilters()

const isLoadingTicket = ref(false)
const ticketStats = ref<TicketStats | null>(null)

const isLoadingComplaint = ref(false)
const complaintStats = ref<TicketStats | null>(null)

const isLoadingSolved = ref(false)
const solvedStats = ref<TicketStats | null>(null)

const isLoadingSolvedPercentage = ref(false)
const solvedPercentageStats = ref<TicketStats | null>(null)

const fetchTicket = async () => {
  isLoadingTicket.value = true
  const res = await serviceQualityService.getTicket(selectedBranch.value, globalTimeframe.value)
  if (res?.success) ticketStats.value = res.data
  isLoadingTicket.value = false
}

const fetchComplaint = async () => {
  isLoadingComplaint.value = true
  const res = await serviceQualityService.getComplaint(selectedBranch.value, globalTimeframe.value)
  if (res?.success) complaintStats.value = res.data
  isLoadingComplaint.value = false
}

const fetchSolved = async () => {
  isLoadingSolved.value = true
  const res = await serviceQualityService.getSolved(selectedBranch.value, globalTimeframe.value)
  if (res?.success) solvedStats.value = res.data
  isLoadingSolved.value = false
}

const fetchSolvedPercentage = async () => {
  isLoadingSolvedPercentage.value = true
  const res = await serviceQualityService.getSolvedPercentage(selectedBranch.value, globalTimeframe.value)
  if (res?.success) solvedPercentageStats.value = res.data
  isLoadingSolvedPercentage.value = false
}

const fetchData = () => {
  fetchTicket()
  fetchComplaint()
  fetchSolved()
  fetchSolvedPercentage()
}

watch([selectedBranch, globalTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})

// Scoped state for Radar timeframe selector is now in the component

// Let's create an aggregated isLoading variable for the component
const isLoadingRadar = computed(() => {
  return isLoadingTicket.value || isLoadingComplaint.value || isLoadingSolved.value || isLoadingSolvedPercentage.value
})

</script>