<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { growthService } from '~/services/growth-service'
import type { GrowthLeadsStats, GrowthOpportunityStats, GrowthWinRateStats, GrowthActivityStats, GrowthPipelineStats, GrowthCycleStats } from '~/types/growth'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatPercentage, formatNumber, formatCurrency } from '~/utils/format'

// Page meta to use our executive dashboard layout
definePageMeta({
  layout: 'dashboard'
})

const { selectedTimeframe: globalTimeframe } = useDashboardFilters()

const isLoadingLeads = ref(true)
const leadsStats = ref<GrowthLeadsStats | null>(null)

const isLoadingOpportunity = ref(true)
const opportunityStats = ref<GrowthOpportunityStats | null>(null)

const isLoadingWinRate = ref(true)
const winRateStats = ref<GrowthWinRateStats | null>(null)

const isLoadingActivity = ref(true)
const activityStats = ref<GrowthActivityStats | null>(null)

const isLoadingPipeline = ref(true)
const pipelineStats = ref<GrowthPipelineStats | null>(null)

const isLoadingCycle = ref(true)
const cycleStats = ref<GrowthCycleStats | null>(null)

const fetchLeads = async () => {
  isLoadingLeads.value = true
  const res = await growthService.getLeads(globalTimeframe.value)
  if (res?.success) leadsStats.value = res.data
  isLoadingLeads.value = false
}

const fetchOpportunity = async () => {
  isLoadingOpportunity.value = true
  const res = await growthService.getOpportunity(globalTimeframe.value)
  if (res?.success) opportunityStats.value = res.data
  isLoadingOpportunity.value = false
}

const fetchWinRate = async () => {
  isLoadingWinRate.value = true
  const res = await growthService.getWinRate(globalTimeframe.value)
  if (res?.success) winRateStats.value = res.data
  isLoadingWinRate.value = false
}

const fetchActivity = async () => {
  isLoadingActivity.value = true
  const res = await growthService.getActivity(globalTimeframe.value)
  if (res?.success) activityStats.value = res.data
  isLoadingActivity.value = false
}

const fetchPipeline = async () => {
  isLoadingPipeline.value = true
  const res = await growthService.getPipeline(globalTimeframe.value)
  if (res?.success) pipelineStats.value = res.data
  isLoadingPipeline.value = false
}

const fetchCycle = async () => {
  isLoadingCycle.value = true
  const res = await growthService.getCycle(globalTimeframe.value)
  if (res?.success) cycleStats.value = res.data
  isLoadingCycle.value = false
}

const fetchData = () => {
  fetchLeads()
  fetchOpportunity()
  fetchWinRate()
  fetchActivity()
  fetchPipeline()
  fetchCycle()
}

watch([globalTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    
    <!-- Main 3-Column Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Left Column Area (Spans 2 Columns) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Top: Pipeline by Stage wave chart -->
        <PipelineStageChart />

        <!-- Bottom: 2-Column Grid for Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Metric Stack -->
          <div class="flex flex-col gap-6">
            <MetricCard
              title="Forcast MRC"
              value="Rp 185 Jt"
              subtext="All MRC Pipeline Negotiation"
              trend="8.2%"
              trend-direction="up"
              icon="i-lucide-trending-up"
              icon-color="text-purple-500"
            />

            <MetricCard
              title="Total Opportunity"
              :value="opportunityStats ? formatNumber(opportunityStats.value) : '0'"
              :subtext="opportunityStats ? 'Semua Opportunity ' + opportunityStats.period : 'Semua Opportunity bulan ini'"
              :trend="opportunityStats ? formatPercentage(opportunityStats.percentage) : '0%'"
              :trend-direction="opportunityStats?.trend === 'down' ? 'down' : 'up'"
              :trend-color="opportunityStats?.trend === 'down' ? 'error' : 'primary'"
              icon="i-lucide-users"
              icon-color="text-info"
              :is-loading="isLoadingOpportunity"
            />

            <MetricCard
              title="Avg. Sales Cycle"
              :value="cycleStats ? formatNumber(cycleStats.value) + ' Days' : '0 Days'"
              subtext="-"
              :trend="cycleStats ? formatPercentage(cycleStats.percentage) : '0%'"
              :trend-direction="cycleStats?.trend === 'down' ? 'down' : 'up'"
              :trend-color="cycleStats?.trend === 'down' ? 'error' : 'primary'"
              icon="i-lucide-dollar-sign"
              icon-color="text-warning"
              :is-loading="isLoadingCycle"
            />
          </div>

          <!-- Right/Center Metric Stack -->
          <div class="flex flex-col gap-6">
            <MetricCard
              title="New Opportunity"
              value="42"
              subtext="Mei 2026 (Negotiation 90%)"
              trend="8.2%"
              trend-direction="up"
              icon="i-lucide-trending-up"
              icon-color="text-purple-500"
            />

            <MetricCard
              title="Total Leads"
              :value="leadsStats ? formatNumber(leadsStats.value) : '0'"
              :subtext="leadsStats ? 'Semua prospect ' + leadsStats.period : 'Semua prospect bulan ini'"
              :trend="leadsStats ? formatPercentage(leadsStats.percentage) : '0%'"
              :trend-direction="leadsStats?.trend === 'down' ? 'down' : 'up'"
              :trend-color="leadsStats?.trend === 'down' ? 'error' : 'primary'"
              icon="i-lucide-users"
              icon-color="text-info"
              :is-loading="isLoadingLeads"
            />

            <MetricCard
              title="Avg. Activity per Sales"
              :value="activityStats ? formatNumber(activityStats.value) : '0'"
              subtext="Dari semua sales"
              :trend="activityStats ? formatPercentage(activityStats.percentage) : '0%'"
              :trend-direction="activityStats?.trend === 'down' ? 'down' : 'up'"
              :trend-color="activityStats?.trend === 'down' ? 'error' : 'primary'"
              icon="i-lucide-trending-up"
              icon-color="text-purple-500"
              :is-loading="isLoadingActivity"
            />
          </div>
        </div>
      </div>

      <!-- Right Column Area (Spans 1 Column) - Standardized Vertical Stack of 3 Cards -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <MetricCard
          title="Pipeline Value"
          :value="pipelineStats ? formatCurrency(pipelineStats.value) : '0'"
          :subtext="pipelineStats ? pipelineStats.period : 'target: Rp 600 Jt'"
          :trend="pipelineStats ? formatPercentage(pipelineStats.percentage) : '0%'"
          :trend-direction="pipelineStats?.trend === 'down' ? 'down' : 'up'"
          :trend-color="pipelineStats?.trend === 'down' ? 'error' : 'primary'"
          icon="i-lucide-activity"
          icon-color="text-info"
          :is-loading="isLoadingPipeline"
        />

        <MetricCard
          title="Win Rate"
          :value="winRateStats ? formatPercentage(winRateStats.value) : '0%'"
          :trend="winRateStats ? formatPercentage(winRateStats.percentage) : '0%'"
          :trend-direction="winRateStats?.trend === 'down' ? 'down' : 'up'"
          :trend-color="winRateStats?.trend === 'down' ? 'error' : 'primary'"
          icon="i-lucide-percent"
          icon-color="text-primary"
          :is-loading="isLoadingWinRate"
        >
          <template #details>
            <div class="space-y-2 mt-0">
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span>Opportunity Win</span>
                </div>
                <div class="flex items-center justify-between md:w-1/3 w-1/2 shrink-0">
                  <USkeleton v-if="isLoadingWinRate" class="h-4 w-16" />
                  <template v-else>
                    <span class="text-neutral-900">{{ winRateStats ? formatNumber(winRateStats.details.win.value) : 0 }}</span>
                    <UBadge :color="winRateStats?.details.win.trend === 'down' ? 'error' : 'primary'" variant="soft" size="md" class="rounded-full font-medium">
                      {{ winRateStats?.details.win.trend === 'down' ? '↓' : '↑' }} {{ winRateStats ? formatPercentage(winRateStats.details.win.percentage) : '0%' }}
                    </UBadge>
                  </template>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  <span>Opportunity Lose</span>
                </div>
                <div class="flex items-center justify-between md:w-1/3 w-1/2 shrink-0">
                  <USkeleton v-if="isLoadingWinRate" class="h-4 w-16" />
                  <template v-else>
                    <span class="text-neutral-900">{{ winRateStats ? formatNumber(winRateStats.details.lose.value) : 0 }}</span>
                    <UBadge :color="winRateStats?.details.lose.trend === 'down' ? 'primary' : 'error'" variant="soft" size="md" class="rounded-full font-medium">
                      {{ winRateStats?.details.lose.trend === 'down' ? '↓' : '↑' }} {{ winRateStats ? formatPercentage(winRateStats.details.lose.percentage) : '0%' }}
                    </UBadge>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </MetricCard>

        <MetricCard
          title="Discount Exposure"
          value="Rp 185M"
          trend="8.2%"
          trend-direction="up"
          icon="i-lucide-dollar-sign"
          icon-color="text-rose-500"
        >
          <template #details>
            <div class="space-y-2 mt-1">
              <div class="flex items-center justify-between text-sm font-medium">
                <span class="text-neutral-600">Dedicated</span>
                <span class="text-error font-semibold">Rp. 30 Jt</span>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <span class="text-neutral-600">Broadband</span>
                <span class="text-error font-semibold">Rp. 2 Jt</span>
              </div>
            </div>
          </template>
        </MetricCard>
      </div>

    </div>
  </div>
</template>
