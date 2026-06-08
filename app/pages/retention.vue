<template>
  <div class="space-y-6">
    <!-- Retention Metric Executive Header using reusable custom slots -->
    <Header
      title="Dashboard - Retention Metric"
      :description="route.path === '/retention/leading-indicator' ? `Rekap performa retensi pelanggan • ${todayFormatted}` : `Rekap dari pertumbuhan penjualan • ${todayFormatted}`"
    >
      <!-- Dropdown selectors injected in the actions slot -->
      <template #actions>
        <USelect
          v-model="selectedBranch"
          :items="branchOptions"
          class="md:w-32 w-100"
          aria-label="Select Branch"
        />
        <USelect
          v-model="selectedTimeframe"
          :items="timeframeOptions"
          class="md:w-32 w-100"
          aria-label="Select Date Range"
        />
      </template>

      <!-- Indicator tabs injected in the tabs slot -->
      <template #tabs>
        <NuxtLink
          to="/retention/lagging-indicator"
          class="pb-3 text-sm md:text-sm font-medium border-b-2 transition-colors relative"
          :class="[
            route.path === '/retention/lagging-indicator'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-600 hover:text-neutral-700'
          ]"
        >
          Lagging Indicator
        </NuxtLink>
        <NuxtLink
          to="/retention/leading-indicator"
          class="pb-3 text-sm md:text-sm font-medium border-b-2 transition-colors relative"
          :class="[
            route.path === '/retention/leading-indicator'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-600 hover:text-neutral-700'
          ]"
        >
          Leading Indicator
        </NuxtLink>
      </template>
    </Header>

    <!-- Sub-page dynamic rendering -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDashboardFilters } from '~/composables/useDashboardFilters'

// Format today's date in Indonesian locale (e.g. "Senin, 8 Juni 2026")
const todayFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Retrieve global dashboard filters
const { selectedBranch, selectedTimeframe, branchOptions, timeframeOptions } = useDashboardFilters()
const route = useRoute()

// Scoped to the main default dashboard shell layout
definePageMeta({
  layout: 'dashboard',
  middleware: [
    function (to) {
      if (to.path === '/retention' || to.path === '/retention/') {
        return navigateTo('/retention/lagging-indicator')
      }
    }
  ]
})

</script>