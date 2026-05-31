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

const fetchData = () => {
  fetchTicket()
  fetchComplaint()
}

watch([selectedBranch, globalTimeframe], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})

// Scoped state for Radar timeframe selector
const selectedTimeframe = ref('This Month')
const timeframeOptions = ['This Month', 'Last Month', 'This Quarter', 'This Year']

// Radar Chart Options & Series
const radarSeries = [{
  name: 'Performance Score',
  data: [69, 75, 48, 54] // Normalized scores for [Solved Customers, Total Solved, Total Komplain, Total Tiket]
}]

const radarChartOptions = {
  chart: {
    type: 'radar',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Geist, sans-serif'
  },
  colors: ['#009838'], // Brand primary green
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.15,
    colors: ['#009838'] // Elegant light green area
  },
  markers: {
    size: 4,
    colors: ['#009838'],
    strokeColors: '#ffffff',
    strokeWidth: 2
  },
  xaxis: {
    categories: ['', '', '', ''], // Blank out since we overlay premium HTML custom labels!
    labels: {
      show: false
    }
  },
  yaxis: {
    show: false,
    min: 0,
    max: 100,
    tickAmount: 4
  },
  grid: {
    circular: true
  },
  tooltip: {
    enabled: false
  }
}
</script>

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
        value="69%"
        trend="8.4%"
        trend-direction="up"
        trend-color="primary"
        subtext="Bulan ini"
        icon="i-lucide-thumbs-up"
        icon-color="text-info"
      />

      <!-- Total Solved -->
      <MetricCard
        title="Total Solved"
        value="33"
        trend="3.2%"
        trend-direction="up"
        trend-color="primary"
        subtext="Bulan ini"
        icon="i-lucide-square-check-big"
        icon-color="text-info"
      />
    </div>

    <!-- Middle Section: Radar Chart and Insight Panel -->
    <UCard 
      class="border border-neutral-100"
      :ui="{ body: 'p-0 flex flex-col lg:flex-row items-stretch' }"
    >
      
      <!-- Left Area: Interactive Overall Radar Chart (3/4 width) -->
      <div class="lg:w-3/4 md:p-0 md:pr-4 p-4 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-100">
        <!-- Header area of Radar card -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 select-none shrink-0 z-10">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-semibold text-neutral-900">
                Overall Service Quality
              </h3>
              <UIcon name="i-lucide-info" class="w-4 h-4 text-neutral-400 cursor-help" />
            </div>
            <p class="text-sm text-neutral-500 mt-0.5">
              Performa kualitas layanan secara keseluruhan berdasarkan 4 metric utama
            </p>
          </div>
          <USelect
            v-model="selectedTimeframe"
            :items="timeframeOptions"
            class="w-32 shrink-0"
            aria-label="Select Timeframe"
          />
        </div>

        <!-- Radar Render Area with HTML Absolute Overlays -->
        <div class="relative flex-1 min-h-[380px] w-full flex items-center justify-center my-4 select-none">
          
          <!-- Outer Radar Chart wrapper -->
          <div class="w-[300px] h-[300px] flex items-center justify-center">
            <ClientOnly>
              <apexchart
                type="radar"
                width="320"
                height="320"
                :options="radarChartOptions"
                :series="radarSeries"
              />
            </ClientOnly>
          </div>

          <!-- 1. Center circular score badge -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs w-26 h-26 rounded-full border border-neutral-100 shadow-md flex flex-col items-center justify-center text-center  z-20">
            <span class="text-xs text-neutral-500">Overall Score</span>
            <div class="flex flex-col">
              <span class="text-xl font-bold text-primary">72</span>
              <span class="text-xs text-neutral-400">/ 100</span>
            </div>
            <UBadge color="primary" variant="soft" size="xs" class="rounded-full mt-2">Baik</UBadge>
          </div>

          <!-- 2. Top Label (Solved Customers: 69%) -->
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 z-10 max-w-[150px]">
            <span class="text-sm font-medium text-neutral-700">Solved Customers</span>
            <span class="text-base font-bold text-primary">69%</span>
            <div class="flex items-center gap-3 bg-primary/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
              <UIcon name="i-lucide-thumbs-up" class="w-8 h-8 text-primary" />
              <span>Semakin tinggi, semakin baik</span>
            </div>
          </div>

          <!-- 3. Right Label (Total Solved: 33) -->
          <div class="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end gap-1 z-10 max-w-[150px]">
            <span class="text-sm font-medium text-neutral-700">Total Solved</span>
            <span class="text-base font-bold text-neutral-900">33</span>
            <div class="flex items-center gap-3 bg-primary/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
              <UIcon name="i-lucide-circle-check-big" class="w-8 h-8 text-primary" />
              <span>Semakin tinggi, semakin baik</span>
            </div>
          </div>

          <!-- 4. Bottom Label (Total Komplain Customer: 48) -->
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center  text-center gap-1 z-10 max-w-[150px]">
            <div class="flex items-center text-start gap-3 bg-error/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
              <UIcon name="i-lucide-arrow-down" class="w-8 h-8 text-error" />
              <span>Semakin rendah, semakin baik</span>
            </div>
            <span class="text-sm font-medium text-neutral-700 mt-1">Total Komplain Customer</span>
            <span class="text-base font-bold text-red-600">48</span>
          </div>

          <!-- 5. Left Label (Total Tiket: 54) -->
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start gap-1 z-10 max-w-[150px]">
            <span class="text-sm font-medium text-neutral-700">Total Tiket</span>
            <span class="text-base font-bold text-red-600">54</span>
            <div class="flex items-center gap-3 bg-error/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
              <UIcon name="i-lucide-arrow-down" class="w-8 h-8 text-error" />
              <span>Semakin rendah, semakin baik</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Right Area: Insight Panel & Rating System (1/4 width) -->
      <div class="lg:w-1/4 p-4 flex flex-col gap-6 justify-between select-none">
        <!-- Section 1: Cara Membaca -->
        <div class="space-y-3">
          <h4 class="text-sm font-bold text-neutral-900">
            Cara membaca
          </h4>
          <div class="flex gap-4 items-start">
            <!-- Miniature Radar SVG Indicator -->
            <div class="w-16 h-16 rounded-lg border border-neutral-100 bg-white flex items-center justify-center shrink-0 shadow-sm">
              <svg viewBox="0 0 100 100" class="w-12 h-12">
                <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="#e5e7eb" stroke-width="1.5" />
                <polygon points="50,25 75,50 50,75 25,50" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" />
                <circle cx="50" cy="50" r="2" fill="#10b981" />
              </svg>
            </div>
            <p class="text-sm text-neutral-600 leading-relaxed">
              Semakin luas area hijau, semakin baik kualitas layanan secara keseluruhan.
            </p>
          </div>
        </div>

        <!-- Section 2: Skala Penilaian -->
        <div class="space-y-3 pt-5 border-t border-neutral-200/60">
          <h4 class="text-sm font-bold text-neutral-900">
            Skala Penilaian
          </h4>
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
                <span class="text-neutral-700 font-medium">75 - 100</span>
              </div>
              <span class="text-neutral-600">Baik</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm"></span>
                <span class="text-neutral-700 font-medium">50 - 74</span>
              </div>
              <span class="text-neutral-600">Cukup</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm"></span>
                <span class="text-neutral-700 font-medium">0 - 49</span>
              </div>
              <span class="text-neutral-600">Perlu Perbaikan</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Insight -->
        <div class="space-y-2 pt-5 border-t border-neutral-200/60">
          <h4 class="text-sm font-bold text-neutral-900">
            Insight
          </h4>
          <p class="text-sm text-neutral-600 leading-relaxed">
            Performa cukup baik pada solved customers dan total solved. Perlu perhatian pada total komplain customer dan total tiket untuk meningkatkan kualitas layanan.
          </p>
        </div>

      </div>
    </UCard>

    <!-- Bottom Full Width Info Bar -->
    <UAlert
      class="text-neutral-600 border-none"
      icon="i-lucide-info"
      color="info"
      variant="soft"
      title="Nilai pada grafik merupakan skor performa (0-100) yang telah dinormalisasi berdasarkan target dan benchmark."
    />

  </div>
</template>
