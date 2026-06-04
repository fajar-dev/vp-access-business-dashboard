<template>
  <div class="space-y-6">
    <!-- Top Grid: Left KPI cards stack next to Churn Rate Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Left Column: Primary Churn / MRC Metric Stack -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        
        <!-- Net MRC Growth Card with Detailed Breakdowns -->
        <MetricCard
          title="Net MRC Growth"
          value="Rp 65 Jt"
          trend="18.5%"
          trend-direction="up"
          trend-color="primary"
          icon="i-lucide-sprout"
          icon-color="text-primary"
        >
          <template #details>
            <div class="space-y-2 mt-1">
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span>Net MRC</span>
                </div>
                <div class="flex items-center justify-between md:w-1/3 w-1/2 shrink-0">
                  <span class="text-neutral-900">Rp 190 Jt</span>
                  <UBadge color="primary" variant="soft" size="md" class="rounded-full font-medium">↑ 10%</UBadge>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  <span>Churn MRC</span>
                </div>
                <div class="flex items-center justify-between md:w-1/3 w-1/2 shrink-0">
                  <span class="text-neutral-900">Rp 125 Jt</span>
                  <UBadge color="error" variant="soft" size="md" class="rounded-full font-medium">↑ 8.3%</UBadge>
                </div>
              </div>
            </div>
          </template>
        </MetricCard>

        <!-- Churn Revenue Card -->
        <MetricCard
          title="Churn Revenue"
          :value="churnStats ? formatCurrency(Math.abs(churnStats.revenue)) : '0'"
          :trend="churnStats ? formatPercentage(churnStats.percentage) : '0%'"
          :trend-direction="churnStats?.trend === 'down' ? 'down' : 'up'"
          :trend-color="churnStats?.trend === 'down' ? 'primary' : 'error'"
          :subtext="churnStats?.period || 'Bulan ini'"
          icon="i-lucide-dollar-sign"
          icon-color="text-warning"
          :is-loading="isLoadingChurn"
        />

        <!-- Customer Lose Card with Detailed Breakdowns -->
        <MetricCard
          title="Customer Lose"
          :value="customerLoseStats ? String(customerLoseStats.total.value) : '0'"
          :trend="customerLoseStats ? formatPercentage(customerLoseStats.total.percentage) : '0%'"
          :trend-direction="customerLoseStats?.total.trend === 'down' ? 'down' : 'up'"
          :trend-color="customerLoseStats?.total.trend === 'down' ? 'primary' : 'error'"
          :subtext="customerLoseStats?.total.period || 'Bulan ini'"
          icon="i-lucide-user-round-minus"
          icon-color="text-purple-500"
          :is-loading="isLoadingLose"
        >
          <template #details>
            <div v-if="isLoadingLose" class="space-y-3 mt-1">
              <USkeleton class="h-5 w-full" />
              <USkeleton class="h-5 w-full" />
            </div>
            <div v-else class="space-y-2 mt-1">
              <div v-for="(item, index) in customerLoseStats?.detail || []" :key="index" class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full inline-block" :class="index % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'"></span>
                  <span>{{ item.service_group }}</span>
                </div>
                <div class="flex items-center justify-between md:w-1/3 w-1/2 shrink-0">
                  <span class="text-neutral-900">{{ item.value }}</span>
                  <UBadge :color="item.trend === 'down' ? 'primary' : 'error'" variant="soft" size="md" class="rounded-full font-medium">
                    {{ item.trend === 'up' ? '↑' : '↓' }} {{ formatPercentage(item.percentage) }}
                  </UBadge>
                </div>
              </div>
            </div>
          </template>
        </MetricCard>

        <!-- Total Customer Wireless Card -->
        <MetricCard
          title="Total Customer Wireless"
          :value="wirelessMigrationStats ? String(wirelessMigrationStats.totalCustomer.value) : '0'"
          :trend="wirelessMigrationStats ? formatPercentage(wirelessMigrationStats.totalCustomer.percentage) : '0%'"
          :trend-direction="wirelessMigrationStats?.totalCustomer.trend === 'down' ? 'down' : 'up'"
          :trend-color="wirelessMigrationStats?.totalCustomer.trend === 'down' ? 'error' : 'primary'"
          subtext="Layanan Aktif"
          icon="i-lucide-radio-tower"
          icon-color="text-info"
          :is-loading="isLoadingMigration"
        />
      </div>

      <!-- Right Column: Interactive Line/Area Churn Rate Chart and Grid of Metrics -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- YTD Churn Rate Area Chart Component -->
        <ChurnRateChart :data="churnRateData" :is-loading="isLoadingRate" />

        <!-- 2x2 Grid of Secondary Metrics under the Chart -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Forecast Net MRC -->
          <MetricCard
            title="Forecast Net MRC"
            value="Rp 72M"
            trend="15.2%"
            trend-direction="up"
            trend-color="primary"
            subtext="Proyeksi bulan depan"
            icon="i-lucide-line-chart"
            icon-color="text-primary"
          />

          <!-- Forecast Churn Next Month -->
          <MetricCard
            title="Forecast Churn Next Month"
            :value="forecastChurnStats ? formatCurrency(forecastChurnStats.forecastMrc.value, true) : 'Rp 0'"
            :trend="forecastChurnStats ? formatPercentage(forecastChurnStats.forecastMrc.percentage) : '0%'"
            :trend-direction="forecastChurnStats?.forecastMrc.trend === 'down' ? 'down' : 'up'"
            :trend-color="forecastChurnStats?.forecastMrc.trend === 'up' ? 'error' : 'primary'"
            subtext="Perlu tindakan preventif"
            icon="i-lucide-shield-alert"
            icon-color="text-error"
            :is-loading="isLoadingForecastChurn"
          />

          <!-- Customer Wireless Termigrasi -->
          <MetricCard
            title="Customer Wireless Termigrasi"
            :value="wirelessMigrationStats ? String(wirelessMigrationStats.migrated.value) : '0'"
            :trend="wirelessMigrationStats ? formatPercentage(wirelessMigrationStats.migrated.percentage) : '0%'"
            :trend-direction="wirelessMigrationStats?.migrated.trend === 'down' ? 'down' : 'up'"
            :trend-color="wirelessMigrationStats?.migrated.trend === 'down' ? 'error' : 'primary'"
            :subtext="wirelessMigrationStats?.migrated.period || 'Bulan ini'"
            icon="i-lucide-repeat"
            icon-color="text-purple-500"
            :is-loading="isLoadingMigration"
          />

          <!-- Migrasi -->
          <MetricCard
            title="Migrasi"
            :value="wirelessMigrationStats ? `${Number(wirelessMigrationStats.migrationRate.value.toFixed(1))}%` : '0%'"
            :trend="wirelessMigrationStats ? formatPercentage(wirelessMigrationStats.migrationRate.percentage) : '0%'"
            :trend-direction="wirelessMigrationStats?.migrationRate.trend === 'down' ? 'down' : 'up'"
            :trend-color="wirelessMigrationStats?.migrationRate.trend === 'down' ? 'error' : 'primary'"
            :subtext="wirelessMigrationStats ? `${wirelessMigrationStats.migrationRate.migratedValue} dari ${wirelessMigrationStats.migrationRate.totalValue} customer wireless` : '0 dari 0 customer wireless'"
            icon="i-lucide-percent"
            icon-color="text-primary"
            :is-loading="isLoadingMigration"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { retentionService } from '~/services/retention-service'
import { growthService } from '~/services/growth-service'
import type { ChurnStats, CustomerLoseStats, WirelessMigrationStats, ChurnRateData } from '~/types/retention'
import type { GrowthForecastChurnStats } from '~/types/growth'
import { formatCurrency, formatPercentage } from '~/utils/format'

// Page meta to use our default layout container
definePageMeta({
  layout: 'dashboard'
})

const { selectedBranch, selectedTimeframe } = useDashboardFilters()

const churnStats = ref<ChurnStats | null>(null)
const customerLoseStats = ref<CustomerLoseStats | null>(null)
const wirelessMigrationStats = ref<WirelessMigrationStats | null>(null)
const churnRateData = ref<ChurnRateData[] | null>(null)
const isLoadingChurn = ref(false)
const isLoadingLose = ref(false)
const isLoadingMigration = ref(false)
const isLoadingRate = ref(false)

const isLoadingForecastChurn = ref(true)
const forecastChurnStats = ref<GrowthForecastChurnStats | null>(null)

const fetchChurnStats = async () => {
  isLoadingChurn.value = true
  const res = await retentionService.getChurnStats(selectedBranch.value, selectedTimeframe.value)
  if (res?.success) churnStats.value = res.data
  isLoadingChurn.value = false
}

const fetchCustomerLose = async () => {
  isLoadingLose.value = true
  const res = await retentionService.getCustomerLose(selectedBranch.value, selectedTimeframe.value)
  if (res?.success) customerLoseStats.value = res.data
  isLoadingLose.value = false
}

const fetchWirelessMigration = async () => {
  isLoadingMigration.value = true
  const res = await retentionService.getWirelessMigration(selectedBranch.value, selectedTimeframe.value)
  if (res?.success) wirelessMigrationStats.value = res.data
  isLoadingMigration.value = false
}

const fetchChurnRate = async () => {
  isLoadingRate.value = true
  const res = await retentionService.getChurnRate(selectedBranch.value)
  if (res?.success) churnRateData.value = res.data
  isLoadingRate.value = false
}

const fetchForecastChurn = async () => {
  isLoadingForecastChurn.value = true
  const res = await growthService.getForecastChurn(selectedTimeframe.value)
  if (res?.success) forecastChurnStats.value = res.data
  isLoadingForecastChurn.value = false
}

const fetchData = () => {
  fetchChurnStats()
  fetchCustomerLose()
  fetchWirelessMigration()
  fetchChurnRate()
  fetchForecastChurn()
}

watch([selectedBranch, selectedTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>