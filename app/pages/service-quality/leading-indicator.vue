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

const isLoadingIssue = ref(false)
const issueStats = ref<TicketStats | null>(null)

const isLoadingIncident = ref(false)
const incidentStats = ref<TicketStats | null>(null)

const fetchIssue = async () => {
  isLoadingIssue.value = true
  const res = await serviceQualityService.getIssue(selectedBranch.value, globalTimeframe.value)
  if (res?.success) issueStats.value = res.data
  isLoadingIssue.value = false
}

const fetchIncident = async () => {
  isLoadingIncident.value = true
  const res = await serviceQualityService.getIncident(selectedBranch.value, globalTimeframe.value)
  if (res?.success) incidentStats.value = res.data
  isLoadingIncident.value = false
}

const fetchData = () => {
  fetchIssue()
  fetchIncident()
}

watch([selectedBranch, globalTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Subtitle Heading -->
    <div class="select-none">
      <h3 class="text-base font-semibold text-neutral-900">
        Leading Indicator
      </h3>
    </div>

    <!-- Grid representing the primary KPI cards in a 4-column format for perfect visual width consistency -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Repeat Issue Rate -->
      <MetricCard
        title="Repeat Issue rate"
        :value="issueStats ? formatPercentage(issueStats.value) : '0%'"
        :trend="issueStats ? formatPercentage(issueStats.percentage) : '0%'"
        :trend-direction="issueStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="issueStats?.trend === 'down' ? 'primary' : 'error'"
        :subtext="`${issueStats?.period || 'Bulan Ini'}`"
        icon="i-lucide-percent"
        icon-color="text-info"
        :is-loading="isLoadingIssue"
      />

      <!-- Network Incident -->
      <MetricCard
        title="Network Incident"
        :value="incidentStats ? String(incidentStats.value) : '0'"
        :trend="incidentStats ? formatPercentage(incidentStats.percentage) : '0%'"
        :trend-direction="incidentStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="incidentStats?.trend === 'down' ? 'primary' : 'error'"
        :subtext="`${incidentStats?.period || 'Bulan Ini'}`"
        icon="i-lucide-alert-circle"
        icon-color="text-rose-500"
        :is-loading="isLoadingIncident"
      />
    </div>
  </div>
</template>
