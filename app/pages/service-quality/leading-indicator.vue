<script setup lang="ts">
// Page meta to use our default layout container
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="space-y-4">
    <!-- Subtitle Heading -->
    <div class="select-none">
      <h3 class="text-base font-semibold text-neutral-900">
        Leading Indicator
      </h3>
    </div>

    <!-- Grid representing the primary KPI cards in a 4-column format for perfect visual width consistency -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Repeat Issue Rate -->
      <MetricCard
        title="Repeat Issue rate"
        value="63%"
        trend="3.2%"
        trend-direction="down"
        trend-color="error"
        subtext="Bulan ini"
        icon="i-lucide-percent"
        icon-color="text-info"
      />

      <!-- Network Incident -->
      <MetricCard
        title="Network Incident"
        value="54"
        trend="8.3%"
        trend-direction="up"
        trend-color="error"
        subtext="Bulan ini"
        icon="i-lucide-alert-circle"
        icon-color="text-rose-500"
      />
    </div>
  </div>
</template>
