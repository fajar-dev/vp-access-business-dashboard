<template>
  <UCard class="border border-neutral-100 h-full flex flex-col justify-between">
    <!-- Header with controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-semibold text-neutral-900">
          Revenue (YTD)
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
    <div class="relative flex-1 min-h-[320px] mt-4 w-full flex flex-col">
      <USkeleton v-if="isLoading" class="flex-1 w-full rounded-xl" />
      <ClientOnly v-else>
        <apexchart
          type="area"
          height="360"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <!-- Chart Legend/Key -->
    <div class="flex items-center justify-center gap-6 text-sm font-medium text-neutral-600 mt-4 select-none">
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
          class="w-5 h-5 text-primary"
        />
        <span>{{ currentYear }} YTD</span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { GrowthRevenueData } from '~/types/growth'

const props = defineProps<{
  data: GrowthRevenueData[] | null
  isLoading?: boolean
}>()

// Define switches
const showNames = ref(false)
const compare = ref(true)

const categories = computed(() => props.data?.map(item => item.period) || [])
const currentMonth = computed(() => {
  if (categories.value.length > 0) {
    const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const idx = categories.value.length - 1
    return fullMonths[idx] || categories.value[idx]
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
  return props.data.map(item => {
    const rev = item.month[currentYear.value]?.revenue || 0
    return Number((rev / 1000000000).toFixed(2))
  })
})

const dataPreviousYear = computed(() => {
  if (!props.data) return []
  return props.data.map(item => {
    const rev = item.month[previousYear.value]?.revenue || 0
    return Number((rev / 1000000000).toFixed(2))
  })
})

const calculateGrowthRate = (current: number, previous: number) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0
  return (((current - previous) / previous) * 100).toFixed(2)
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
    offsetY: -8,
    style: {
      fontSize: '9px',
      fontWeight: 700,
      colors: ['#009838', '#737373']
    },
    background: {
      enabled: true,
      padding: 4,
      borderRadius: 6,
      borderWidth: 1,
      opacity: 0.95
    },
    formatter: (val: number) => `Rp ${val}M`
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
    max: 10,
    tickAmount: 5,
    labels: {
      style: {
        colors: '#a3a3a3',
        fontWeight: 600,
        fontSize: '10px'
      },
      formatter: (val: number) => `${val.toFixed(1)}M`
    }
  },
  tooltip: {
    shared: true,
    intersect: false,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const monthLabel = categories.value[dataPointIndex] || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][dataPointIndex]
      const yCurrent = series[0][dataPointIndex] || 0
      const yPrevious = series[1] ? series[1][dataPointIndex] : null
      const change = calculateGrowthRate(yCurrent, yPrevious)

      let html = `
        <div class="p-3 bg-white border border-neutral-100 rounded-lg shadow-lg text-sm select-none min-w-[200px]">
          <div class="font-semibold text-neutral-900 mb-2 pb-1 border-b border-neutral-100">
            ${monthLabel} ${currentYear.value}
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-4 justify-between">
              <div class="flex items-center gap-1.5 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                <span>${currentYear.value} YTD:</span>
              </div>
              <span class="font-semibold text-neutral-950">Rp ${yCurrent}M</span>
            </div>
      `

      if (yPrevious !== null && compare.value && years.value.length > 1) {
        html += `
            <div class="flex items-center gap-4 justify-between">
              <div class="flex items-center gap-1.5 text-neutral-600">
                <span class="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block"></span>
                <span>${previousYear.value} YTD:</span>
              </div>
              <span class="font-semibold text-neutral-950">Rp ${yPrevious}M</span>
            </div>
            <div class="pt-1.5 flex items-center justify-between border-t border-neutral-100 mt-1">
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
