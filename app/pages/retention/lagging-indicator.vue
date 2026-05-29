<script setup lang="ts">
// Page meta to use our default layout container
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div class="space-y-6">
    <!-- Top Grid: Left KPI cards stack next to Churn Rate Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- Left Column: Primary Churn / MRC Metric Stack -->
      <div class="lg:col-span-1 flex flex-col gap-6">
        
        <!-- Net MRC Growth Card with Detailed Breakdowns -->
        <MetricCard
          title="Net MRC Growth"
          value="Rp 65 Jt"
          trend="18.5%"
          trend-direction="up"
          trend-color="primary"
          icon="i-lucide-sprout"
          icon-color="text-primary"
        >
          <template #details>
            <div class="space-y-2 mt-1">
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  <span>Net MRC</span>
                </div>
                <div class="flex items-center gap-10 shrink-0">
                  <span class="text-neutral-900">Rp 190 Jt</span>
                  <UBadge color="primary" variant="soft" size="md" class="rounded-full font-medium">↑ 10%</UBadge>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  <span>Churn MRC</span>
                </div>
                <div class="flex items-center gap-10 shrink-0">
                  <span class="text-neutral-900">Rp 125 Jt</span>
                  <UBadge color="error" variant="soft" size="md" class="rounded-full font-medium">↑ 8.3%</UBadge>
                </div>
              </div>
            </div>
          </template>
        </MetricCard>

        <!-- Churn Revenue Card -->
        <MetricCard
          title="Churn Revenue"
          value="Rp 125 Jt"
          trend="8.3%"
          trend-direction="up"
          trend-color="error"
          subtext="Bulan ini"
          icon="i-lucide-dollar-sign"
          icon-color="text-warning"
        />

        <!-- Customer Lose Card with Detailed Breakdowns -->
        <MetricCard
          title="Customer Lose"
          value="20"
          trend="11.1%"
          trend-direction="up"
          trend-color="error"
          icon="i-lucide-user-round-minus"
          icon-color="text-purple-500"
        >
          <template #details>
            <div class="space-y-2 mt-1">
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  <span>Dedicated</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-neutral-900">8</span>
                  <UBadge color="error" variant="subtle" size="sm" class="rounded-full font-medium">↑ 14.3%</UBadge>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm font-medium">
                <div class="flex items-center gap-2 text-neutral-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Broadband</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-neutral-900">12</span>
                  <UBadge color="primary" variant="subtle" size="sm" class="rounded-full font-medium">↓ 7.7%</UBadge>
                </div>
              </div>
            </div>
          </template>
        </MetricCard>

        <!-- Total Customer Wireless Card -->
        <MetricCard
          title="Total Customer Wireless"
          value="245"
          trend="3.2%"
          trend-direction="up"
          trend-color="primary"
          subtext="Layanan Aktif"
          icon="i-lucide-radio-tower"
          icon-color="text-info"
        />
      </div>

      <!-- Right Column: Interactive Line/Area Churn Rate Chart and Grid of Metrics -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        
        <!-- YTD Churn Rate Area Chart Component -->
        <ChurnRateChart />

        <!-- 2x2 Grid of Secondary Metrics under the Chart -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Forecast Net MRC -->
          <MetricCard
            title="Forecast Net MRC"
            value="Rp 72M"
            trend="15.2%"
            trend-direction="up"
            trend-color="primary"
            subtext="Proyeksi bulan depan"
            icon="i-lucide-line-chart"
            icon-color="text-primary"
          />

          <!-- Forecast Churn Next Month -->
          <MetricCard
            title="Forecast Churn Next Month"
            value="Rp 98 Jt"
            trend="12.5%"
            trend-direction="up"
            trend-color="error"
            subtext="Perlu tindakan preventif"
            icon="i-lucide-shield-alert"
            icon-color="text-error"
          />

          <!-- Customer Wireless Termigrasi -->
          <MetricCard
            title="Customer Wireless Termigrasi"
            value="28"
            trend="25.5%"
            trend-direction="up"
            trend-color="primary"
            subtext="Bulan ini"
            icon="i-lucide-repeat"
            icon-color="text-purple-500"
          />

          <!-- Migrasi -->
          <MetricCard
            title="Migrasi"
            value="11.4%"
            trend="5.6%"
            trend-direction="up"
            trend-color="primary"
            subtext="28 dari 245 customer wireless"
            icon="i-lucide-percent"
            icon-color="text-primary"
          />
        </div>
      </div>

    </div>
  </div>
</template>
