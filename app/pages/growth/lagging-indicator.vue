<template>
  <div class="space-y-6">
    
    <!-- Top Grid: KPI Cards Stacked next to YTD Revenue Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Primary Financial KPI Cards -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <MetricCard
          title="Revenue Achievement"
          :value="revenueAchievementStats ? formatPercentage(revenueAchievementStats.percentage) : '0%'"
          :subtext="revenueAchievementStats ? `target: ${formatCurrency(revenueAchievementStats.target, true)}` : 'target: Rp 0'"
          :trend="revenueAchievementStats ? formatPercentage(revenueAchievementStats.trendPercentage) : '0%'"
          :trend-direction="revenueAchievementStats?.trend === 'down' ? 'down' : 'up'"
          icon="i-lucide-activity"
          icon-color="text-primary"
          :is-loading="isLoadingRevenueAchievement"
        />
        
        <MetricCard
          title="New Customer"
          :value="newCustomerStats ? formatCurrency(newCustomerStats.value, true) : 'Rp 0'"
          :subtext="newCustomerStats ? `Deal baru ${newCustomerStats.period}` : 'Deal baru bulan ini'"
          :trend="newCustomerStats ? formatPercentage(newCustomerStats.percentage) : '0%'"
          :trend-direction="newCustomerStats?.trend === 'down' ? 'down' : 'up'"
          icon="i-lucide-dollar-sign"
          icon-color="text-warning"
          :is-loading="isLoadingNewCustomer"
        />
        
        <MetricCard
          title="Forecast Revenue Next Month"
          :value="forecastRevenueStats ? formatCurrency(forecastRevenueStats.value, true) : 'Rp 0'"
          :subtext="forecastRevenueStats ? `Opportunity Stage Negotiation (${forecastRevenueStats.period})` : 'Negotiation stage'"
          :trend="forecastRevenueStats ? formatPercentage(forecastRevenueStats.percentage) : '0%'"
          :trend-direction="forecastRevenueStats?.trend === 'down' ? 'down' : 'up'"
          icon="i-lucide-trending-up"
          icon-color="text-purple-500"
          :is-loading="isLoadingForecastRevenue"
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
            <template v-if="isLoadingNewMrc">
              <div class="space-y-3 mt-1">
                <USkeleton class="h-5 w-full" />
                <USkeleton class="h-5 w-full" />
              </div>
            </template>
            <template v-else>
              <div  class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Paid</span>
                </div>
                <span class="text-neutral-900">
                  {{ newMrcStats ? formatCurrency(newMrcStats.details.mrc_paid) : 'Rp 0' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span>Unpaid</span>
                </div>
                <span class="text-neutral-900">
                  {{ newMrcStats ? formatCurrency(newMrcStats.details.mrc_unpaid) : 'Rp 0' }}
                </span>
              </div>
            </template>
          </div>
        </template>
      </MetricCard>

      <!-- Total MRC (YTD) -->
      <MetricCard
        title="Total MRC (YTD)"
        :value="totalMrcYtdStats ? formatCurrency(totalMrcYtdStats.value, true) : 'Rp 0'"
        :subtext="totalMrcYtdStats ? totalMrcYtdStats.period : 'Year to Date'"
        :trend="totalMrcYtdStats ? formatPercentage(totalMrcYtdStats.percentage) : '0%'"
        :trend-direction="totalMrcYtdStats?.trend === 'down' ? 'down' : 'up'"
        icon="i-lucide-dollar-sign"
        icon-color="text-primary"
        :is-loading="isLoadingTotalMrcYtd"
      />

      <!-- ARPU Card with Breakdown details -->
      <MetricCard
        title="ARPU"
        :value="arpuStats ? formatCurrency(arpuStats.value, true) : 'Rp 0'"
        :subtext="arpuStats ? `per pelanggan / ${arpuStats.period}` : 'per pelanggan / bulan'"
        :trend="arpuStats ? formatPercentage(arpuStats.percentage) : '0%'"
        :trend-direction="arpuStats?.trend === 'down' ? 'down' : 'up'"
        icon="i-lucide-activity"
        icon-color="text-violet-500"
        :is-loading="isLoadingArpu"
      >
        <template #details>
          <div class="space-y-2 mt-1 max-h-[70px] overflow-y-auto pr-1">
            <template v-if="isLoadingArpu">
              <div class="space-y-3 mt-1">
                <USkeleton class="h-5 w-full" />
                <USkeleton class="h-5 w-full" />
              </div>
            </template>
            <template v-else-if="arpuStats">
              <div v-for="(detail, index) in arpuStats.details" :key="detail.serviceGroup" class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span 
                    class="w-2.5 h-2.5 rounded-full inline-block" 
                    :style="{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4', '#d946ef', '#84cc16'][index % 8] }"
                  ></span>
                  <span>{{ detail.serviceGroup || 'Unknown' }}</span>
                </div>
                <span class="text-neutral-900">{{ formatCurrency(detail.avgPerService, true) }}</span>
              </div>
            </template>
          </div>
        </template>
      </MetricCard>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { growthService } from '~/services/growth-service'
import type { GrowthMrcStats, GrowthRevenueData, GrowthRevenueAchievementStats, GrowthNewCustomerStats, GrowthArpuStats, GrowthTotalMrcYtdStats, GrowthForecastRevenueStats } from '~/types/growth'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatCurrency, formatPercentage } from '~/utils/format'

// Page meta to use our executive dashboard layout
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe: globalTimeframe } = useDashboardFilters()

const isLoadingNewMrc = ref(true)
const newMrcStats = ref<GrowthMrcStats | null>(null)

const isLoadingRevenueAchievement = ref(true)
const revenueAchievementStats = ref<GrowthRevenueAchievementStats | null>(null)

const isLoadingNewCustomer = ref(true)
const newCustomerStats = ref<GrowthNewCustomerStats | null>(null)

const isLoadingArpu = ref(true)
const arpuStats = ref<GrowthArpuStats | null>(null)

const isLoadingTotalMrcYtd = ref(true)
const totalMrcYtdStats = ref<GrowthTotalMrcYtdStats | null>(null)

const isLoadingForecastRevenue = ref(true)
const forecastRevenueStats = ref<GrowthForecastRevenueStats | null>(null)

const fetchNewMrc = async () => {
  isLoadingNewMrc.value = true
  const res = await growthService.getNewMrc(selectedBranch.value, globalTimeframe.value)
  if (res?.success) newMrcStats.value = res.data
  isLoadingNewMrc.value = false
}

const fetchRevenueAchievement = async () => {
  isLoadingRevenueAchievement.value = true
  const res = await growthService.getRevenueAchievement(selectedBranch.value, globalTimeframe.value)
  if (res?.success) revenueAchievementStats.value = res.data
  isLoadingRevenueAchievement.value = false
}

const fetchNewCustomer = async () => {
  isLoadingNewCustomer.value = true
  const res = await growthService.getNewCustomer(selectedBranch.value, globalTimeframe.value)
  if (res?.success) newCustomerStats.value = res.data
  isLoadingNewCustomer.value = false
}

const fetchArpu = async () => {
  isLoadingArpu.value = true
  const res = await growthService.getArpu(selectedBranch.value, globalTimeframe.value)
  if (res?.success) arpuStats.value = res.data
  isLoadingArpu.value = false
}

const fetchTotalMrcYtd = async () => {
  isLoadingTotalMrcYtd.value = true
  const res = await growthService.getTotalMrcYtd(selectedBranch.value)
  if (res?.success) totalMrcYtdStats.value = res.data
  isLoadingTotalMrcYtd.value = false
}

const fetchForecastRevenue = async () => {
  isLoadingForecastRevenue.value = true
  const res = await growthService.getForecastRevenue(globalTimeframe.value)
  if (res?.success) forecastRevenueStats.value = res.data
  isLoadingForecastRevenue.value = false
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
  fetchRevenueAchievement()
  fetchNewCustomer()
  fetchArpu()
  fetchTotalMrcYtd()
  fetchForecastRevenue()
  fetchRevenue()
}

watch([selectedBranch, globalTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>