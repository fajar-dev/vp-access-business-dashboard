<script setup lang="ts">
import { ref, computed } from 'vue'

// Define switches
const showNames = ref(false)
const compare = ref(true)

const data2026 = [125, 90, 96, 140] // 2026 YTD Values
const data2025 = [75, 58, 32, 82]  // 2025 YTD Values (Comparison)

// Series configuration
const series = computed(() => {
  const list = [
    {
      name: '2026 YTD',
      data: data2026
    }
  ]
  if (compare.value) {
    list.push({
      name: '2025 YTD',
      data: data2025
    })
  }
  return list
})

// ApexCharts Options configuration
const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Geist, sans-serif'
  },
  colors: ['#009838', '#d4d4d4'],
  stroke: {
    curve: 'straight',
    width: compare.value ? [3, 2] : [3],
    dashArray: compare.value ? [0, 5] : [0]
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: compare.value ? [0.15, 0] : [0.15],
      opacityTo: compare.value ? [0, 0] : [0],
      stops: [0, 100]
    }
  },
  markers: {
    size: compare.value ? [5, 4] : [5],
    colors: ['#009838', '#e5e5e5'],
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: {
      size: 7
    }
  },
  dataLabels: {
    enabled: showNames.value,
    enabledOnSeries: [0], // ONLY show labels on the active 2026 series to avoid cluttered overlapping text
    offsetY: -8, // Offset upward so they sit elegantly above the markers
    style: {
      fontSize: '9px',
      fontWeight: 700,
      colors: ['#009838'] // Beautiful green primary branding color matching the line
    },
    background: {
      enabled: true,
      foreColor: '#D1FAE0', // matching text color
      padding: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#009838', // subtle light green border for premium badge look
      opacity: 0.95,
    },
    formatter: (val: number) => `Rp ${val}M` // Match the Y-axis & tooltip M (Miliar) unit
  },
  grid: {
    borderColor: '#f5f5f5',
    strokeDashArray: 4,
    xaxis: {
      lines: { show: true }
    }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: '#a3a3a3',
        fontWeight: 600,
        fontSize: '10px'
      }
    }
  },
  yaxis: {
    max: 200,
    tickAmount: 5,
    labels: {
      style: {
        colors: '#a3a3a3',
        fontWeight: 600,
        fontSize: '10px'
      },
      formatter: (val: number) => `${val}M`
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const month = ['Januari', 'Februari', 'Maret', 'April'][dataPointIndex]
      const y2026 = series[0][dataPointIndex]
      const y2025 = series[1] ? series[1][dataPointIndex] : null
      const change = calculateGrowthRate(y2026, y2025)

      let html = `
        <div class="p-3 bg-white border border-neutral-100 rounded-lg shadow-lg text-sm select-none min-w-[160px]">
          <div class="font-semibold text-neutral-900 mb-2 pb-1 border-b border-neutral-100">
            ${month} 2026
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-4 justify-between">
              <div class="flex items-center gap-1.5 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                <span>2026 YTD:</span>
              </div>
              <span class="font-semibold text-neutral-950">Rp ${y2026}M</span>
            </div>
      `

      if (y2025 !== null && compare.value) {
        html += `
            <div class="flex items-center gap-4 justify-between">
              <div class="flex items-center gap-1.5 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block"></span>
                <span>2025 YTD:</span>
              </div>
              <span class="font-semibold text-neutral-950">Rp ${y2025}M</span>
            </div>
            <div class="pt-1.5 flex items-center justify-between border-t border-neutral-100">
              <span class="text-neutral-600">Pertumbuhan:</span>
              <span class="font-semibold rounded px-1 ${Number(change) >= 0 ? 'text-primary' : 'text-error'}">
                ${Number(change) >= 0 ? '↑' : '↓'} ${change}%
              </span>
            </div>
        `
      }

      html += `
          </div>
        </div>
      `
      return html
    }
  },
  legend: {
    show: false
  }
}))
</script>

<template>
  <UCard class="border border-neutral-100 h-full flex flex-col justify-between">
    <!-- Header with controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
      <div>
        <h3 class="text-base font-semibold text-neutral-900">
          Revenue (YTD)
        </h3>
        <p class="text-sm text-neutral-500">
          Year to Date sampai 24 April 2026
        </p>
      </div>

      <!-- Controls Switches -->
      <div class="flex items-center gap-6 text-sm font-medium text-neutral-700 select-none shrink-0">
        <div class="flex items-center gap-2">
          <span>Tampilkan Nama</span>
          <USwitch
            v-model="showNames"
            color="primary"
            aria-label="Toggle names display"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>Compare</span>
          <USwitch
            v-model="compare"
            color="primary"
            aria-label="Toggle comparison line"
          />
        </div>
      </div>
    </div>

    <!-- Chart Render Area using ClientOnly to support Nuxt SSR -->
    <div class="relative flex-1 min-h-64 mt-4 w-full">
      <ClientOnly>
        <apexchart
          type="area"
          height="320"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Chart Legend/Key -->
    <div class="flex items-center justify-center gap-6 text-sm font-medium text-neutral-600 pt-4 mt-2 border-t border-neutral-100 select-none">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-line-dot-right-horizontal bg-neutral-300"
          class="w-5 h-5 text-neutral-300"
        />
        <span>2025 YTD</span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-line-dot-right-horizontal"
          class="w-5 h-5 text-primary"
        />
        <span>2026 YTD</span>
      </div>
    </div>
  </UCard>
</template>

