<template>
    <div class="space-y-4">
        <!-- 1. Header & Filters Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 sm:px-0">
            <div class="flex items-center">
                <div class="sm:w-11 sm:h-11 w-13 h-13 mr-3 sm:mr-4 shrink-0">
                    <img src="/logo.png" alt="Nusanet Logo" class="w-full h-full object-contain" />
                </div>
                <div>
                    <h1 class="text-lg sm:text-2xl font-bold text-neutral-900">Daily monitoring Performance</h1>
                    <p class="text-xs sm:text-sm text-neutral-500 mt-0 flex flex-wrap items-center gap-1 sm:gap-2">
                        <span>Daily sales performance heatmap 🔥 • {{ todayFormatted }}</span>
                    </p>
                </div>
            </div>

            <!-- Filters -->
            <div class="grid grid-cols-2 gap-3 w-full md:flex md:items-center md:w-auto md:gap-4">
                <div class="flex flex-col gap-1 w-full md:w-auto">
                    <span class="text-sm font-semibold text-neutral-700">Team:</span>
                    <USelect
                        v-model="selectedTeam"
                        :items="teamOptions"
                        class="w-full md:w-52"
                        aria-label="Pilih Tim"
                    />
                </div>
                <div class="flex flex-col gap-1 w-full md:w-auto">
                    <span class="text-sm font-semibold text-neutral-700">Refresh:</span>
                    <USelect
                        v-model="selectedRefresh"
                        :items="refreshOptions"
                        class="w-full md:w-28"
                        aria-label="Interval Refresh"
                    />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1">
            <div class="overflow-x-auto mt-2" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
                <UTable
                sticky
                    :data="tableData"
                    :columns="columns"
                    :meta="{
                        class: {
                            tr: (row: any) => row.index % 2 === 1 ? 'bg-neutral-50/100' : ''
                        }
                    }"
                    class="scrollable-table flex-1 max-h-[calc(100vh-175px)] md:max-h-[calc(100vh-120px)] w-full text-left text-neutral-800 border border-neutral-300 rounded-xl"
                >
                    <!-- Custom Name Cell with UAvatar -->
                    <template #name-cell="{ row }: any">
                        <div class="flex items-center gap-2.5 py-0.5 shrink-0 select-none">
                            <UAvatar 
                                :src="row.original.photoProfile"
                                :alt="row.original.name" 
                                size="sm" 
                                class="font-bold text-neutral-700 bg-neutral-100 border border-neutral-200"
                            />
                            <div class="flex flex-col">
                                <span class="font-bold text-neutral-900 leading-tight whitespace-nowrap">{{ row.original.name }}</span>
                                <span class="text-neutral-500 text-xs leading-tight whitespace-nowrap">{{ row.original.organizationName }}</span>
                            </div>
                        </div>
                    </template>
                </UTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { salesPerformanceService } from '~/services/sales-performance-service'
import type { Manager, SalesPerformanceData } from '~/types/sales-performance'

// Format today's date in Indonesian locale to show only Month and Year (e.g. "Juni 2026")
const todayFormatted = ref(new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }))

definePageMeta({
  layout: 'public'
})

// Filter choices
const selectedTeam = ref('all')
const selectedRefresh = ref('1h')

// Loading & timing states
const isRefreshing = ref(false)
const lastUpdated = ref(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))

const managers = ref<Manager[]>([])
const teamOptions = computed(() => [
  { label: 'Semua Tim', value: 'all' },
  ...managers.value.map(m => ({ label: m.name, value: String(m.id) }))
])

// Fetch managers from API
const fetchManagers = async () => {
    const response = await salesPerformanceService.getManagers()
    if (response.success) {
        managers.value = response.data
    }
}

const refreshOptions = [
  { label: 'Nonaktif', value: '0' },
  { label: '10 Detik', value: '10s' },
  { label: '1 Menit', value: '1m' },
  { label: '1 Jam', value: '1h' },
  { label: '1 Hari', value: '1d' }
]

// Sales data from API
const salesData = ref<SalesPerformanceData[]>([])

// Fetch sales data from API
const fetchSalesData = async () => {
    const managerId = selectedTeam.value !== 'all' ? selectedTeam.value : undefined
    const response = await salesPerformanceService.getSalesData(managerId)
    if (response.success) {
      salesData.value = response.data
    }
}

// Computed: transform API data (number[] → d1..d30) and add total
const tableData = computed(() => {
  return salesData.value.map(row => {
    const dayData: Record<string, number> = {}
    row.data.forEach((val, i) => {
      dayData[`d${i + 1}`] = val
    })
    const total = row.data.reduce((a, b) => a + b, 0)
    return { name: row.name, photoProfile: row.photoProfile, organizationName: row.organizationName, ...dayData, total }
  })
})


// Build columns dynamically — same styling as target-revenue
const thClass = 'py-2.5 px-2 text-sm font-bold'
const tdClass = 'py-2 px-2 font-medium text-neutral-800 align-middle'

const columns: any[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      class: {
        th: `${thClass} w-[200px]`,
        td: `${tdClass}`
      }
    },
    footer: () => 'Total'
  },
  ...Array.from({ length: 30 }, (_, i) => ({
    accessorKey: `d${i + 1}`,
    header: `${i + 1}`,
    meta: {
      class: {
        th: `${thClass} text-center font-bold`,
        td: `${tdClass} text-center`
      }
    },
    footer: ({ column }: any) => {
      const total = column.getFacetedRowModel().rows.reduce(
        (acc: number, row: any) => acc + (Number(row.getValue(`d${i + 1}`)) || 0),
        0
      )
      return total
    }
  })),
  {
    accessorKey: 'total',
    header: 'Total',
    meta: {
      class: {
        th: `${thClass} text-center font-bold`,
        td: `${tdClass} text-center font-bold`
      }
    },
    footer: ({ column }: any) => {
      const total = column.getFacetedRowModel().rows.reduce(
        (acc: number, row: any) => acc + (Number(row.getValue('total')) || 0),
        0
      )
      return total
    }
  }
]

// Refresh: re-fetch data from API
const triggerRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true

  await fetchSalesData()
  lastUpdated.value = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  todayFormatted.value = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  isRefreshing.value = false
}

// Watchers for Team selection
watch(selectedTeam, () => {
  fetchSalesData()
})

// Auto-Refresh Interval Setup
let refreshIntervalId: any = null

const startRefreshTimer = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
  }

  let ms = 0
  switch (selectedRefresh.value) {
    case '10s':
      ms = 10 * 1000
      break
    case '1m':
      ms = 60 * 1000
      break
    case '1h':
      ms = 60 * 60 * 1000
      break
    case '1d':
      ms = 24 * 60 * 60 * 1000
      break
  }

  if (ms > 0) {
    refreshIntervalId = setInterval(() => {
      triggerRefresh()
    }, ms)
  }
}

watch(selectedRefresh, () => {
  startRefreshTimer()
})

// Auto-Scroll Infinity Configuration
let autoScrollIntervalId: any = null
const isScrollPaused = ref(false)

const pauseScroll = () => {
  isScrollPaused.value = true
}

const resumeScroll = () => {
  isScrollPaused.value = false
}

const runAutoScroll = () => {
  if (isScrollPaused.value) return

  const el = document.querySelector('.scrollable-table')
  if (!el) return

  // Scroll down by 1px
  el.scrollTop += 1

  // If reached bottom, pause briefly and loop back to top
  if (Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight) {
    isScrollPaused.value = true
    setTimeout(() => {
      // Loop back to top smoothly
      el.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => {
        isScrollPaused.value = false
      }, 1000) // Pause for 1 second at the top
    }, 1500) // Pause for 1.5 seconds at the bottom
  }
}

const startAutoScroll = () => {
  if (autoScrollIntervalId) {
    clearInterval(autoScrollIntervalId)
  }
  // Run scroll step every 30ms (very smooth scrolling)
  autoScrollIntervalId = setInterval(runAutoScroll, 30)
}

const stopAutoScroll = () => {
  if (autoScrollIntervalId) {
    clearInterval(autoScrollIntervalId)
    autoScrollIntervalId = null
  }
}

onMounted(async () => {
  await fetchManagers()
  await fetchSalesData()
  startRefreshTimer()
  // Give the table a moment to render before starting scroll
  setTimeout(() => {
    startAutoScroll()
  }, 1000)
})

onUnmounted(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
  }
  stopAutoScroll()
})
</script>
