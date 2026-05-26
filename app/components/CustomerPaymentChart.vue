<script setup lang="ts">
const paymentSeries = [35, 65] // [Monthly (Orange), Annual (Purple)]

const paymentChartOptions = {
  chart: {
    type: 'pie',
    fontFamily: 'Geist, sans-serif'
  },
  colors: ['#f97316', '#6b21a8'], // Orange (Monthly), Purple (Annual)
  labels: ['Monthly', 'Annual'],
  stroke: {
    width: 2,
    colors: ['#ffffff']
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: -20 // Adjusts the text position perfectly toward the center of the slices
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '14px',
      fontFamily: 'Geist, sans-serif',
      fontWeight: '700',
      colors: ['#ffffff']
    },
    dropShadow: {
      enabled: false
    },
    // Return array of strings to render text in beautiful separate lines in ApexCharts!
    formatter: (val: any, opts: any) => {
      const name = opts.w.globals.labels[opts.seriesIndex]
      return [name, `${val}%`]
    }
  },
  legend: {
    show: false
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val}%`
    }
  }
}
</script>

<template>
  <UCard 
    class="border border-neutral-100 h-full flex flex-col justify-between"
    :ui="{ body: 'p-6 flex-1 flex flex-col justify-between' }"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 pb-4 border-b border-neutral-100 select-none shrink-0">
      <UIcon name="i-lucide-percent" class="w-5 h-5 text-smurple-500" />
      <h3 class="text-sm font-semibold text-neutral-900">
        Customer Monthly Payment
      </h3>
    </div>

    <!-- Chart Area -->
    <div class="relative flex-1 flex items-center justify-center min-h-[220px] my-6">
      <ClientOnly>
        <apexchart
          type="pie"
          width="240"
          height="240"
          :options="paymentChartOptions"
          :series="paymentSeries"
        />
      </ClientOnly>
    </div>

    <!-- Customized Legend -->
    <div class="flex items-center justify-center gap-6 text-sm font-semibold text-neutral-600 pt-4 select-none shrink-0">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
        <span>Monthly</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-purple-800 inline-block"></span>
        <span>Annual</span>
      </div>
    </div>
  </UCard>
</template>
