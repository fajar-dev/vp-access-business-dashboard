<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  allocationPercentage: number
  totalAllocated: number
  unallocatedAmount: number
}

const props = defineProps<Props>()

// Compute series representation: [Allocated Segment, Unallocated Segment]
const chartSeries = computed(() => {
  const allocated = Math.min(props.allocationPercentage, 100)
  const unallocated = Math.max(100 - props.allocationPercentage, 0)
  return [allocated, unallocated]
})

// Dynamic ApexCharts options
const chartOptions = computed(() => {
  // If overallocated, show warning red, otherwise standard brand green
  const allocatedColor = props.allocationPercentage > 100 ? '#ef4444' : '#009838'
  const unallocatedColor = '#f3f4f6' // neutral-100

  return {
    chart: {
      type: 'donut' as const,
      sparkline: {
        enabled: true
      },
      fontFamily: 'Geist, sans-serif',
      animations: {
        enabled: true,
        animateGradually: { enabled: true, delay: 10 },
        dynamicAnimation: { enabled: true, speed: 200 }
      }
    },
    colors: [allocatedColor, unallocatedColor],
    stroke: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '82%',
          labels: {
            show: false // We use absolute HTML text overlays for perfect rendering and crisp typography!
          }
        },
        startAngle: 0
      }
    }
  }
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-6 pt-2 w-full">
    <!-- Donut Progress Chart Area -->
    <div class="relative w-36 h-36 shrink-0 flex items-center justify-center select-none">
      <ClientOnly>
        <apexchart
          type="donut"
          width="144"
          height="144"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
      <!-- Center Text Badge inside donut (HTML absolute overlay for perfect alignment and rendering) -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span class="text-2xl font-bold text-neutral-800 leading-none">
          {{ allocationPercentage }}%
        </span>
        <span class="text-[9px] text-neutral-400 font-semibold mt-1.5 uppercase tracking-wider">
          Teralokasikan
        </span>
      </div>
    </div>

    <!-- Dynamic Metrics Listing -->
    <div class="space-y-4 w-full select-none text-center sm:text-left">
      <div>
        <span class="text-xs text-neutral-400 font-medium block">Total Teralokasikan</span>
        <span class="text-lg font-bold text-neutral-800">Rp. {{ formatIDR(totalAllocated) }}</span>
      </div>
      <div>
        <span class="text-xs text-neutral-400 font-medium block">Sisa yang belum teralokasi</span>
        <span
          class="text-lg font-bold transition-colors"
          :class="[
            unallocatedAmount > 0 ? 'text-error' :
            unallocatedAmount === 0 ? 'text-neutral-500' : 'text-red-600'
          ]"
        >
          Rp. {{ formatIDR(unallocatedAmount) }}
        </span>
      </div>
    </div>
  </div>
</template>
