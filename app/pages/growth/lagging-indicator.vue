<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { growthService } from '~/services/growth-service'
import type { GrowthMrcStats, GrowthRevenueData } from '~/types/growth'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatCurrency, formatPercentage } from '~/utils/format'

// Page meta to use our executive dashboard layout
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe: globalTimeframe } = useDashboardFilters()

const isLoadingNewMrc = ref(true)
const newMrcStats = ref<GrowthMrcStats | null>(null)

const fetchNewMrc = async () => {
  isLoadingNewMrc.value = true
  const res = await growthService.getNewMrc(selectedBranch.value, globalTimeframe.value)
  if (res?.success) newMrcStats.value = res.data
  isLoadingNewMrc.value = false
}

const isLoadingRevenue = ref(true)
const revenueData = ref<GrowthRevenueData[] | null>(null)

const fetchRevenue = async () => {
  isLoadingRevenue.value = true
  const res = await growthService.getRevenue(selectedBranch.value)
  if (res?.success) revenueData.value = res.data
  isLoadingRevenue.value = false
}

const fetchData = () => {
  fetchNewMrc()
  fetchRevenue()
}

watch([selectedBranch, globalTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    
    <!-- Top Grid: KPI Cards Stacked next to YTD Revenue Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Primary Financial KPI Cards -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <MetricCard
          title="Revenue Achievement"
          value="93.5%"
          subtext="target: Rp 600M"
          trend="2.3%"
          trend-direction="up"
          icon="i-lucide-activity"
          icon-color="text-primary"
        />
        
        <MetricCard
          title="New Customer"
          value="Rp 42 Jt"
          subtext="Deal baru bulan ini"
          trend="12.5%"
          trend-direction="up"
          icon="i-lucide-dollar-sign"
          icon-color="text-warning"
        />
        
        <MetricCard
          title="Forcast Revenue Next Month"
          value="Rp 185 Jt"
          subtext="Mei 2026 (Negotiation 90%)"
          trend="8.2%"
          trend-direction="up"
          icon="i-lucide-trending-up"
          icon-color="text-purple-500"
        />
      </div>

      <!-- Right Column: Interactive Line Chart -->
      <div class="lg:col-span-2">
        <YtdRevenueChart :data="revenueData" :is-loading="isLoadingRevenue" />
      </div>

    </div>

    <!-- Bottom Grid: Secondary Metric Breakdowns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- New MRC Card with Breakdown details -->
      <MetricCard
        title="New MRC"
        :value="newMrcStats ? formatCurrency(newMrcStats.value) : 'Rp 0'"
        :subtext="newMrcStats?.period || 'Bulan ini'"
        :trend="newMrcStats ? formatPercentage(newMrcStats.percentage) : '0%'"
        :trend-direction="newMrcStats?.trend === 'down' ? 'down' : 'up'"
        :trend-color="newMrcStats?.trend === 'down' ? 'error' : 'primary'"
        icon="i-lucide-dollar-sign"
        icon-color="text-primary"
        :is-loading="isLoadingNewMrc"
      >
        <template #details>
          <div class="space-y-2 mt-1">
            <div class="flex items-center justify-between text-sm font-medium">
              <div class="flex items-center gap-2 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Paid</span>
              </div>
              <span class="text-neutral-900">
                <USkeleton v-if="isLoadingNewMrc" class="h-4 w-16" />
                <span v-else>{{ newMrcStats ? formatCurrency(newMrcStats.details.mrc_paid) : 'Rp 0' }}</span>
              </span>
            </div>
            <div class="flex items-center justify-between text-sm font-medium">
              <div class="flex items-center gap-2 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Unpaid</span>
              </div>
              <span class="text-neutral-900">
                <USkeleton v-if="isLoadingNewMrc" class="h-4 w-16" />
                <span v-else>{{ newMrcStats ? formatCurrency(newMrcStats.details.mrc_unpaid) : 'Rp 0' }}</span>
              </span>
            </div>
          </div>
        </template>
      </MetricCard>

      <!-- Total MRC (YTD) -->
      <MetricCard
        title="Total MRC (YTD)"
        value="Rp 99.8 Jt"
        subtext="Year to Date sampai 24 April 2026"
        trend="15.2%"
        trend-direction="up"
        icon="i-lucide-dollar-sign"
        icon-color="text-primary"
      />

      <!-- ARPU Card with Breakdown details -->
      <MetricCard
        title="ARPU"
        value="Rp 3.9 Jt"
        subtext="per pelanggan/ bulan"
        trend="2.8%"
        trend-direction="up"
        icon="i-lucide-activity"
        icon-color="text-violet-500"
      >
        <template #details>
          <div class="space-y-2 mt-1">
            <div class="flex items-center justify-between text-sm font-medium">
              <div class="flex items-center gap-2 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>Dedicated</span>
              </div>
              <span class="text-neutral-900">Rp. 8.4 Jt</span>
            </div>
            <div class="flex items-center justify-between text-sm font-medium">
              <div class="flex items-center gap-2 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Broadband</span>
              </div>
              <span class="text-neutral-900">Rp. 2.7 Jt</span>
            </div>
          </div>
        </template>
      </MetricCard>

    </div>

  </div>
</template>
