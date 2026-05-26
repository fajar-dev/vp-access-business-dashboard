<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Scoped to the main default dashboard shell layout
definePageMeta({
  layout: 'default'
})

// Scoped state for Growth selectors
const selectedBranch = ref('All Branch')
const selectedTimeframe = ref('This Month')

const branchOptions = ['All Branch', 'Medan', 'Surabaya', 'Jakarta', 'Bali']
const timeframeOptions = ['This Month', 'Last Month', 'This Quarter', 'This Year']
</script>

<template>
  <div class="space-y-6">
    <!-- Growth Metric Executive Header using reusable custom slots -->
    <Header
      title="Dashboard - Growth Metric"
      description="Rekap dari pertumbuhan penjualan • Senin, 4 Mei 2026"
    >
      <!-- Dropdown selectors injected in the actions slot -->
      <template #actions>
        <USelect
          v-model="selectedBranch"
          :items="branchOptions"
          class="w-32"
          aria-label="Select Branch"
        />
        <USelect
          v-model="selectedTimeframe"
          :items="timeframeOptions"
          class="w-32"
          aria-label="Select Date Range"
        />
      </template>

      <!-- Indicator tabs injected in the tabs slot -->
      <template #tabs>
        <NuxtLink
          to="/growth/lagging-indicator"
          class="pb-3 text-xs md:text-sm font-medium border-b-2 transition-colors relative"
          :class="[
            route.path === '/growth/lagging-indicator'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-600 hover:text-neutral-700'
          ]"
        >
          Lagging Indicator
        </NuxtLink>
        <NuxtLink
          to="/growth/leading-indicator"
          class="pb-3 text-xs md:text-sm font-medium border-b-2 transition-colors relative"
          :class="[
            route.path === '/growth/leading-indicator'
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
