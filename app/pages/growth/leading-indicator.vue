<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { growthService } from '~/services/growth-service'
import type { GrowthLeadsStats, GrowthOpportunityStats } from '~/types/growth'
import { useDashboardFilters } from '~/composables/useDashboardFilters'
import { formatPercentage, formatNumber } from '~/utils/format'

// Page meta to use our executive dashboard layout
definePageMeta({
  layout: 'dashboard'
})

const { selectedTimeframe: globalTimeframe } = useDashboardFilters()

const isLoadingLeads = ref(true)
const leadsStats = ref<GrowthLeadsStats | null>(null)

const isLoadingOpportunity = ref(true)
const opportunityStats = ref<GrowthOpportunityStats | null>(null)

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

const fetchData = () => {
  fetchLeads()
  fetchOpportunity()
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
              value="42 Days"
              subtext="-"
              trend="12.5%"
              trend-direction="up"
              icon="i-lucide-dollar-sign"
              icon-color="text-warning"
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
              value="230"
              subtext="Dari semua sales"
              trend="8.2%"
              trend-direction="up"
              icon="i-lucide-trending-up"
              icon-color="text-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- Right Column Area (Spans 1 Column) - Standardized Vertical Stack of 3 Cards -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        <MetricCard
          title="Pipeline Value"
          value="Rp. 2.4 M"
          subtext="target: Rp 600 Jt"
          trend="2.3%"
          trend-direction="up"
          icon="i-lucide-activity"
          icon-color="text-info"
        />

        <MetricCard
          title="Win Rate"
          value="68.5%"
          trend="12.5%"
          trend-direction="up"
          icon="i-lucide-percent"
          icon-color="text-primary"
        >
          <template #details>
            <div class="space-y-2 mt-1">
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Opportunity Win</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-neutral-900">142</span>
                  <span class="text-primary font-semibold text-[10px]">↑ 9%</span>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  <span>Opportunity Lose</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-neutral-900">292</span>
                  <span class="text-primary font-semibold text-[10px]">↑ 1%</span>
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
