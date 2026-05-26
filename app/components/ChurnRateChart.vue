<script setup lang="ts">
import { ref, computed } from 'vue'

// Define switches
const showNames = ref(false)
const compare = ref(true)

const data2026 = [1.5, 1.1, 1.2, 1.8] // 2026 YTD Churn Rate (%)
const data2025 = [0.9, 0.65, 0.45, 1.0] // 2025 YTD Churn Rate (%)

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
  colors: ['#f43f5e', '#d4d4d4'], // Rose for 2026, Light Gray for 2025
  stroke: {
    curve: 'smooth',
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
    colors: ['#f43f5e', '#e5e5e5'],
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
      colors: ['#f43f5e'] // Rose text matching the line
    },
    background: {
      enabled: true,
      foreColor: '#FFE4E6', // Light rose text color
      padding: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#f43f5e', // Rose border for premium badge look
      opacity: 0.95
    },
    formatter: (val: number) => `${val}%` // Show as percentage
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
    min: 0,
    max: 2.5,
    tickAmount: 5,
    labels: {
      style: {
        colors: '#a3a3a3',
        fontWeight: 600,
        fontSize: '10px'
      },
      formatter: (val: number) => `${val.toFixed(1)}%`
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const month = ['Januari', 'Februari', 'Maret', 'April'][dataPointIndex]
      const y2026 = series[0][dataPointIndex]
      const y2025 = series[1] ? series[1][dataPointIndex] : null
      const change = y2025 ? (((y2026 - y2025) / y2025) * 100).toFixed(1) : null

      let html = `
        <div class="p-3 bg-white border border-neutral-100 rounded-xl shadow-lg text-xs select-none min-w-[160px]">
          <div class="font-semibold text-neutral-900 mb-2 pb-1 border-b border-neutral-100">
            ${month} 2026
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-4 justify-between">
              <div class="flex items-center gap-1.5 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                <span>2026 YTD:</span>
              </div>
              <span class="font-semibold text-neutral-950">${y2026.toFixed(2)}%</span>
            </div>
      `

      if (y2025 !== null && compare.value) {
        html += `
            <div class="flex items-center gap-4 justify-between">
              <div class="flex items-center gap-1.5 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block"></span>
                <span>2025 YTD:</span>
              </div>
              <span class="font-semibold text-neutral-950">${y2025.toFixed(2)}%</span>
            </div>
            <div class="pt-1.5 flex items-center justify-between border-t border-neutral-100">
              <span class="text-neutral-600">Pertumbuhan:</span>
              <span class="font-semibold rounded px-1 ${Number(change) >= 0 ? 'text-red-500' : 'text-primary'}">
                ${Number(change) >= 0 ? '↑' : '↓'} ${Math.abs(Number(change)).toFixed(1)}%
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
          Churn Rate (YTD)
        </h3>
        <p class="text-xs text-neutral-500">
          Year to Date sampai 24 April 2026
        </p>
      </div>

      <!-- Controls Switches -->
      <div class="flex items-center gap-6 text-xs font-medium text-neutral-700 select-none shrink-0">
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
    <div class="flex items-center justify-center gap-6 text-xs font-medium text-neutral-600 pt-4 mt-2 border-t border-neutral-100 select-none">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-line-dot-right-horizontal"
          class="w-5 h-5 text-neutral-300"
        />
        <span>2025 YTD</span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-line-dot-right-horizontal"
          class="w-5 h-5 text-rose-500"
        />
        <span>2026 YTD</span>
      </div>
    </div>
  </UCard>
</template>
