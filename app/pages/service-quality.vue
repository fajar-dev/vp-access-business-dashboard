<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Scoped to the main default dashboard shell layout
definePageMeta({
  layout: 'dashboard',
  middleware: [
    function (to) {
      if (to.path === '/service-quality' || to.path === '/service-quality/') {
        return navigateTo('/service-quality/lagging-indicator')
      }
    }
  ]
})

// Scoped state for Service Quality selectors
const selectedBranch = ref('All Branch')
const selectedTimeframe = ref('This Month')

const branchOptions = ['All Branch', 'Medan', 'Surabaya', 'Jakarta', 'Bali']
const timeframeOptions = ['This Month', 'Last Month', 'This Quarter', 'This Year']
</script>

<template>
  <div class="space-y-6">
    <!-- Service Quality Metric Header using reusable custom slots -->
    <Header
      title="Dashboard - Service Quality Metric"
      description="Rekap dari pertumbuhan penjualan • Senin, 4 Mei 2026"
    >
      <!-- Dropdown selectors injected in the actions slot placed BELOW the tabs -->
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
          to="/service-quality/lagging-indicator"
          class="pb-3 text-sm md:text-sm font-medium border-b-2 transition-colors relative"
          :class="[
            route.path === '/service-quality/lagging-indicator'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-600 hover:text-neutral-700'
          ]"
        >
          Lagging Indicator
        </NuxtLink>
        <NuxtLink
          to="/service-quality/leading-indicator"
          class="pb-3 text-sm md:text-sm font-medium border-b-2 transition-colors relative"
          :class="[
            route.path === '/service-quality/leading-indicator'
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
