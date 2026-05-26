<script setup lang="ts">
// Page meta to use our default layout container
definePageMeta({
  layout: 'default'
})
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
          <div class="flex items-center gap-2 select-none">
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
                <span class="text-sm font-medium text-neutral-600">30 Hari</span>
                <UBadge color="error" variant="subtle" size="sm" class="rounded-full font-medium">
                  <template #leading>
                    <UIcon name="i-lucide-arrow-up" class="w-3 h-3 text-red-500" />
                  </template>
                  25%
                </UBadge>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">15</span>
                <span class="text-sm text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

            <!-- 60 Hari -->
            <div class="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-600">60 Hari</span>
                <UBadge color="error" variant="subtle" size="sm" class="rounded-full font-medium">
                  <template #leading>
                    <UIcon name="i-lucide-arrow-up" class="w-3 h-3 text-red-500" />
                  </template>
                  12%
                </UBadge>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">28</span>
                <span class="text-sm text-neutral-500">Kontrak segera berakhir</span>
              </div>
            </div>

            <!-- 90 Hari -->
            <div class="border border-neutral-200 rounded-xl p-4 flex flex-col gap-3 hover:shadow-xs transition-all duration-200">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-600">90 Hari</span>
                <UBadge color="primary" variant="subtle" size="sm" class="rounded-full font-medium">
                  <template #leading>
                    <UIcon name="i-lucide-arrow-down" class="w-3 h-3 text-primary" />
                  </template>
                  4.5%
                </UBadge>
              </div>
              <div class="flex flex-col gap-1 select-none">
                <span class="text-3xl font-semibold text-neutral-900">42</span>
                <span class="text-sm text-neutral-500">Kontrak segera berakhir</span>
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
        <CustomerPaymentChart />
      </div>

    </div>
  </div>
</template>
