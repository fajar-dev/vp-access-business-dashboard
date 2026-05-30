<template>
  <UCard class="border border-neutral-100 h-full flex flex-col justify-between">
    <!-- Header with controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
      <div>
        <h3 class="text-base font-semibold text-neutral-900">
          Churn Rate (YTD)
        </h3>
        <p class="text-sm text-neutral-500">
          Year to Date sampai {{ currentMonth }} {{ currentYear }}
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
      <div class="flex items-center gap-2" v-if="compare && years.length > 1">
        <UIcon
          name="i-lucide-line-dot-right-horizontal"
          class="w-5 h-5 text-neutral-300"
        />
        <span>{{ previousYear }} YTD</span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-lucide-line-dot-right-horizontal"
          class="w-5 h-5 text-rose-500"
        />
        <span>{{ currentYear }} YTD</span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ChurnRateData } from '~/types/retention'

const props = defineProps<{
  data: ChurnRateData[] | null
}>()

// Define switches
const showNames = ref(false)
const compare = ref(true)

const categories = computed(() => props.data?.map(item => item.period) || [])
const currentMonth = computed(() => {
  if (categories.value.length > 0) {
    return categories.value[categories.value.length - 1]
  }
  return ''
})

const years = computed(() => {
  const firstItem = props.data?.[0]
  if (!firstItem || !firstItem.month) return []
  return Object.keys(firstItem.month).sort((a, b) => Number(b) - Number(a))
})

const currentYear = computed(() => years.value[0] || new Date().getFullYear().toString())
const previousYear = computed(() => years.value[1] || (new Date().getFullYear() - 1).toString())

const dataCurrentYear = computed(() => {
  if (!props.data) return []
  return props.data.map(item => item.month[currentYear.value]?.ret || 0)
})

const dataPreviousYear = computed(() => {
  if (!props.data) return []
  return props.data.map(item => item.month[previousYear.value]?.ret || 0)
})

const calculateGrowthRate = (current: number, previous: number) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Series configuration
const series = computed(() => {
  const list = [
    {
      name: `${currentYear.value} YTD`,
      data: dataCurrentYear.value
    }
  ]
  if (compare.value && years.value.length > 1) {
    list.push({
      name: `${previousYear.value} YTD`,
      data: dataPreviousYear.value
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
    colors: ['#f43f5e', '#e5e5e5'],
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: {
      size: 7
    }
  },
  dataLabels: {
    enabled: showNames.value,
    offsetY: -8, // Offset upward so they sit elegantly above the markers
    style: {
      fontSize: '9px',
      fontWeight: 700,
      colors: ['#f43f5e', '#737373'] // Rose for current, Gray for previous
    },
    background: {
      enabled: true,
      padding: 4,
      borderRadius: 6,
      borderWidth: 1,
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
    categories: categories.value,
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
    max: (max: number) => max * 1.2, // Tambah 20% ruang di atas agar garis tidak mentok
    tickAmount: 4,
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
      const monthLabel = categories.value[dataPointIndex] || ['Jan', 'Feb', 'Mar', 'Apr'][dataPointIndex]
      const yCurrent = series[0][dataPointIndex] || 0
      const yPrevious = series[1] ? series[1][dataPointIndex] : null

      const dataItem = props.data?.[dataPointIndex]
      const currentStats = dataItem?.month?.[currentYear.value]
      const previousStats = dataItem?.month?.[previousYear.value]

      const diffRet = yPrevious !== null ? (yCurrent - yPrevious) : 0
      const diffChurnCount = (currentStats && previousStats) ? (currentStats.churn - previousStats.churn) : 0

      let html = `
        <div class="p-3 bg-white border border-neutral-100 rounded-lg shadow-lg text-sm select-none min-w-[200px]">
          <div class="font-semibold text-neutral-900 mb-3 pb-2 border-b border-neutral-100">
            Bulan ${monthLabel}
          </div>
          <div class="space-y-3">
            <!-- Current Year -->
            <div>
              <div class="flex items-center gap-4 justify-between mb-1.5">
                <div class="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  <span>Tahun ${currentYear.value}:</span>
                </div>
                <span class="font-bold text-rose-600">${yCurrent.toFixed(2)}%</span>
              </div>
              ${currentStats ? `
              <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-neutral-500 pl-4 border-l-2 border-rose-100 ml-1">
                <div>Churn: <span class="text-neutral-700 font-medium">${currentStats.churn}</span></div>
                <div>Aktif: <span class="text-neutral-700 font-medium">${currentStats.active}</span></div>
              </div>
              ` : ''}
            </div>
      `

      if (yPrevious !== null && compare.value && years.value.length > 1) {
        html += `
            <!-- Previous Year -->
            <div class="pt-3 border-t border-neutral-50">
              <div class="flex items-center gap-4 justify-between mb-1.5">
                <div class="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <span class="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block"></span>
                  <span>Tahun ${previousYear.value}:</span>
                </div>
                <span class="font-bold text-neutral-700">${yPrevious.toFixed(2)}%</span>
              </div>
              ${previousStats ? `
              <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-neutral-500 pl-4 border-l-2 border-neutral-200 ml-1">
                <div>Churn: <span class="text-neutral-700 font-medium">${previousStats.churn}</span></div>
                <div>Aktif: <span class="text-neutral-700 font-medium">${previousStats.active}</span></div>
              </div>
              ` : ''}
            </div>
            
            <div class="pt-2.5 flex flex-col gap-1.5 border-t border-neutral-100 mt-1">
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-xs font-medium">Selisih Churn:</span>
                <span class="font-semibold text-xs ${diffChurnCount > 0 ? 'text-rose-500' : (diffChurnCount < 0 ? 'text-primary' : 'text-neutral-600')}">
                  ${diffChurnCount > 0 ? '+' : ''}${diffChurnCount}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-neutral-600 text-xs font-medium">Selisih Percentage Churn:</span>
                <span class="font-semibold text-xs ${diffRet > 0 ? 'text-rose-500' : (diffRet < 0 ? 'text-primary' : 'text-neutral-600')}">
                  ${diffRet > 0 ? '+' : ''}${diffRet.toFixed(2)}%
                </span>
              </div>
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
