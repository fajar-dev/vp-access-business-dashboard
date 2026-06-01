<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { serviceQualityService } from '~/services/service-quality-service'
import type { TicketStats } from '~/types/service-quality'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatPercentage } from '~/utils/format'

// Page meta to use our default layout container
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe: globalTimeframe } = useDashboardFilters()

const issueStats = ref<TicketStats | null>(null)
const isLoadingIssue = ref(true)

const fetchIssue = async () => {
  isLoadingIssue.value = true
  try {
    const response = await serviceQualityService.getIssue(selectedBranch.value, globalTimeframe.value)
    if (response.success && response.data) {
      issueStats.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch issue stats:', error)
  } finally {
    isLoadingIssue.value = false
  }
}

watch([selectedBranch, globalTimeframe], () => {
  fetchIssue()
})

onMounted(() => {
  fetchIssue()
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
        value="54"
        trend="8.3%"
        trend-direction="up"
        trend-color="error"
        subtext="Bulan ini"
        icon="i-lucide-alert-circle"
        icon-color="text-rose-500"
      />
    </div>
  </div>
</template>
