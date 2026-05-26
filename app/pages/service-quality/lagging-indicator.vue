<script setup lang="ts">
import { ref } from 'vue'

// Page meta to use our default layout container
definePageMeta({
  layout: 'default'
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
        value="54"
        trend="8.3%"
        trend-direction="up"
        trend-color="error"
        subtext="Bulan ini"
        icon="i-lucide-message-circle-more"
        icon-color="text-danger"
      />

      <!-- Total Komplain Customer -->
      <MetricCard
        title="Total Komplain Customer"
        value="48"
        trend="3.2%"
        trend-direction="up"
        trend-color="error"
        subtext="Bulan ini"
        icon="i-lucide-message-square-warning"
        icon-color="text-info"
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

    <!-- Middle Section: Radar Chart and Insight Panel Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
      
      <!-- Left Card: Interactive Overall Radar Chart (Spans 3 columns) -->
      <UCard 
        class="lg:col-span-3 border border-neutral-100 flex flex-col justify-between"
        :ui="{ body: 'p-6 flex-1 flex flex-col justify-between relative overflow-hidden' }"
      >
        <!-- Header area of Radar card -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 select-none shrink-0 z-10">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-semibold text-neutral-900">
                Overall Service Quality
              </h3>
              <UIcon name="i-lucide-info" class="w-4 h-4 text-neutral-400 cursor-help" />
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">
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
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs w-26 h-26 rounded-full border border-neutral-100 shadow-md flex flex-col items-center justify-center text-center p-2 z-20">
            <span class="text-[9px] uppercase font-semibold text-neutral-500 tracking-wider">Overall Score</span>
            <span class="text-xl font-bold text-neutral-900 tracking-tight my-0.5">72 <span class="text-xs text-neutral-400 font-medium">/ 100</span></span>
            <UBadge color="primary" variant="subtle" size="sm" class="rounded-full font-bold px-2 py-0">Baik</UBadge>
          </div>

          <!-- 2. Top Label (Solved Customers: 69%) -->
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-center gap-1 z-10">
            <span class="text-xs font-semibold text-neutral-700">Solved Customers</span>
            <span class="text-base font-bold text-neutral-900 mt-[-2px]">69%</span>
            <div class="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
              <UIcon name="i-lucide-check" class="w-2.5 h-2.5" />
              <span>Semakin tinggi, semakin baik</span>
            </div>
          </div>

          <!-- 3. Right Label (Total Solved: 33) -->
          <div class="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end text-right gap-1 z-10 max-w-[150px]">
            <span class="text-xs font-semibold text-neutral-700">Total Solved</span>
            <span class="text-base font-bold text-neutral-900 mt-[-2px]">33</span>
            <div class="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
              <UIcon name="i-lucide-check" class="w-2.5 h-2.5" />
              <span>Semakin tinggi, semakin baik</span>
            </div>
          </div>

          <!-- 4. Bottom Label (Total Komplain Customer: 48) -->
          <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-center gap-1 z-10">
            <div class="flex items-center gap-1 bg-rose-50 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-100">
              <UIcon name="i-lucide-arrow-down" class="w-2.5 h-2.5" />
              <span>Semakin rendah, semakin baik</span>
            </div>
            <span class="text-xs font-semibold text-neutral-700 mt-1">Total Komplain Customer</span>
            <span class="text-base font-bold text-red-600 mt-[-2px]">48</span>
          </div>

          <!-- 5. Left Label (Total Tiket: 54) -->
          <div class="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start text-left gap-1 z-10 max-w-[150px]">
            <span class="text-xs font-semibold text-neutral-700">Total Tiket</span>
            <span class="text-base font-bold text-red-600 mt-[-2px]">54</span>
            <div class="flex items-center gap-1 bg-rose-50 text-red-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-100">
              <UIcon name="i-lucide-arrow-down" class="w-2.5 h-2.5" />
              <span>Semakin rendah, semakin baik</span>
            </div>
          </div>

        </div>
      </UCard>

      <!-- Right Card: Insight Panel & Rating System (Spans 1 column) -->
      <UCard 
        class="lg:col-span-1 border border-neutral-100 flex flex-col justify-between"
        :ui="{ body: 'p-6 flex-1 flex flex-col gap-6 justify-between select-none' }"
      >
        <!-- Section 1: Cara Membaca -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Cara membaca
          </h4>
          <div class="flex gap-4 items-start">
            <!-- Miniature Radar SVG Indicator -->
            <div class="w-16 h-16 rounded-xl border border-neutral-100 bg-neutral-50/50 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" class="w-12 h-12">
                <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="#e5e7eb" stroke-width="1.5" />
                <polygon points="50,25 75,50 50,75 25,50" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" />
                <circle cx="50" cy="50" r="2" fill="#10b981" />
              </svg>
            </div>
            <p class="text-xs font-medium text-neutral-600 leading-relaxed pt-1">
              Semakin luas area hijau, semakin baik kualitas layanan secara keseluruhan.
            </p>
          </div>
        </div>

        <!-- Section 2: Skala Penilaian -->
        <div class="space-y-3 pt-4 border-t border-neutral-100">
          <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Skala Penilaian
          </h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-semibold">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span class="text-neutral-700">75 - 100</span>
              </div>
              <span class="text-neutral-900 font-bold">Baik</span>
            </div>
            <div class="flex items-center justify-between text-xs font-semibold">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span class="text-neutral-700">50 - 74</span>
              </div>
              <span class="text-neutral-900 font-bold">Cukup</span>
            </div>
            <div class="flex items-center justify-between text-xs font-semibold">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span class="text-neutral-700">0 - 49</span>
              </div>
              <span class="text-neutral-900 font-bold">Perlu Perbaikan</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Insight -->
        <div class="space-y-2 pt-4 border-t border-neutral-100">
          <h4 class="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Insight
          </h4>
          <p class="text-xs text-neutral-600 leading-relaxed font-medium">
            Performa cukup baik pada solved customers dan total solved. Perlu perhatian pada total komplain customer dan total tiket untuk meningkatkan kualitas layanan.
          </p>
        </div>

      </UCard>
    </div>

    <!-- Bottom Full Width Info Bar -->
    <UAlert
      icon="i-lucide-info"
      color="blue"
      variant="subtle"
      title="Nilai pada grafik merupakan skor performa (0-100) yang telah dinormalisasi berdasarkan target dan benchmark."
    />

  </div>
</template>
