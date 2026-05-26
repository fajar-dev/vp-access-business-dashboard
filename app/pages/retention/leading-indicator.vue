<script setup lang="ts">
// Page meta to use our default layout container
definePageMeta({
  layout: 'default'
})

// Customer Monthly Payment Donut Chart Options
const paymentSeries = [35, 65] // [Monthly (Orange), Annual (Purple)]
const paymentChartOptions = {
  chart: {
    type: 'donut',
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
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '11px',
            fontWeight: 500,
            color: '#737373',
            offsetY: 20
          },
          value: {
            show: true,
            fontSize: '28px',
            fontWeight: 700,
            color: '#171717',
            offsetY: -15,
            formatter: (val: any) => `${val}%`
          },
          total: {
            show: true,
            label: 'Annual',
            fontSize: '12px',
            fontWeight: 600,
            color: '#737373',
            formatter: () => '65%'
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
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
  <div class="space-y-6">
    <!-- Top Grid: Left Column spans 2 columns, Right Column spans 1 column -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Left Column: Contract Expiring and Tickets/Usage Grid (2/3 width) -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- Contract Expiring Box Container -->
        <UCard 
          class="border border-neutral-100 flex flex-col justify-between"
          :ui="{ body: 'p-6 flex-1 flex flex-col' }"
        >
          <!-- Title Row -->
          <div class="flex items-center gap-2 pb-4 border-b border-neutral-200 select-none">
            <UIcon name="i-lucide-file-pen-line" class="w-5 h-5 text-info" />
            <h3 class="text-sm font-semibold text-neutral-900">
              Contract Expiring
            </h3>
          </div>

          <!-- 3-Column horizontal statistics badges -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            <!-- 30 Hari -->
            <div class="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-neutral-600">30 Hari</span>
                <UBadge color="error" variant="subtle" size="sm" class="rounded-full font-medium">
                  <template #leading>
                    <UIcon name="i-lucide-arrow-up" class="w-3 h-3 text-red-500" />
                  </template>
                  25%
                </UBadge>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">15</span>
                <span class="text-xs text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

            <!-- 60 Hari -->
            <div class="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-neutral-600">60 Hari</span>
                <UBadge color="error" variant="subtle" size="sm" class="rounded-full font-medium">
                  <template #leading>
                    <UIcon name="i-lucide-arrow-up" class="w-3 h-3 text-red-500" />
                  </template>
                  12%
                </UBadge>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">28</span>
                <span class="text-xs text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

            <!-- 90 Hari -->
            <div class="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-neutral-600">90 Hari</span>
                <UBadge color="primary" variant="subtle" size="sm" class="rounded-full font-medium">
                  <template #leading>
                    <UIcon name="i-lucide-arrow-down" class="w-3 h-3 text-primary" />
                  </template>
                  4.5%
                </UBadge>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">42</span>
                <span class="text-xs text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

          </div>
        </UCard>

        <!-- 2-Column KPI grid at bottom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Customer Support Ticket Alert -->
          <MetricCard
            title="Customer ≥2 Ticket dalam 1 Bulan"
            value="156"
            trend="12.5%"
            trend-direction="up"
            trend-color="error"
            subtext="Indikasi ketidakpuasan layanan"
            icon="i-lucide-ticket"
            icon-color="text-indigo-500"
          />

          <!-- Customer Usage Decrease Alert -->
          <MetricCard
            title="Penurunan Usage Customer"
            value="237"
            trend="18.3%"
            trend-direction="up"
            trend-color="error"
            subtext="Usage <500MB per bulan"
            icon="i-lucide-trending-down"
            icon-color="text-rose-500"
          />
        </div>
      </div>

      <!-- Right Column: Customer Monthly Payment Donut Chart (1/3 width) -->
      <div class="lg:col-span-1">
        <UCard 
          class="border border-neutral-100 h-full flex flex-col justify-between"
          :ui="{ body: 'p-6 flex-1 flex flex-col justify-between' }"
        >
          <!-- Header -->
          <div class="flex items-center gap-2 pb-4 border-b border-neutral-100 select-none shrink-0">
            <UIcon name="i-lucide-percent" class="w-5 h-5 text-purple-500" />
            <h3 class="text-sm font-semibold text-neutral-900">
              Customer Monthly Payment
            </h3>
          </div>

          <!-- Chart Area -->
          <div class="relative flex-1 flex items-center justify-center min-h-[220px] my-6">
            <ClientOnly>
              <apexchart
                type="donut"
                width="240"
                height="240"
                :options="paymentChartOptions"
                :series="paymentSeries"
              />
            </ClientOnly>
          </div>

          <!-- Customized Legend -->
          <div class="flex items-center justify-center gap-6 text-xs font-semibold text-neutral-600 pt-4 border-t border-neutral-100 select-none shrink-0">
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
      </div>

    </div>
  </div>
</template>
