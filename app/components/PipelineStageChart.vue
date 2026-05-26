<script setup lang="ts">
import { ref } from 'vue'

const activeStage = ref<number | null>(null)

const stages = [
  {
    name: 'Quotation',
    value: 'Rp 920M',
    share: '38.3%',
    color: 'blue'
  },
  {
    name: 'Qualified (BANT)',
    value: 'Rp 850M',
    share: '35.4%',
    color: 'teal'
  },
  {
    name: 'Negotiation',
    value: 'Rp 630M',
    share: '26.3%',
    color: 'green'
  }
]
</script>

<template>
  <UCard class="border border-neutral-100 h-full flex flex-col justify-between overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-neutral-100">
      <div>
        <h3 class="text-base font-semibold text-neutral-900">
          Pipeline by Stage (Rp)
        </h3>
      </div>
      <UBadge
        color="primary"
        variant="subtle"
        size="sm"
        class="rounded-full font-medium"
      >
        <template #leading>
          <UIcon name="i-lucide-minus" class="w-3 h-3 text-primary" />
        </template>
        0%
      </UBadge>
    </div>

    <!-- Main Content Area -->
    <div class="relative flex-1 mt-6">
      <!-- 3-Column Labels & Metrics -->
      <div class="grid grid-cols-3 text-center border-l border-r border-neutral-100 pb-20">
        <div 
          v-for="(stage, idx) in stages" 
          :key="stage.name"
          class="px-4 py-2 flex flex-col justify-between h-28 border-r last:border-r-0 border-neutral-100"
          @mouseenter="activeStage = idx"
          @mouseleave="activeStage = null"
        >
          <span class="text-xs font-medium text-neutral-600 uppercase tracking-wider">
            {{ stage.name }}
          </span>
          <span class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight mt-2">
            {{ stage.value }}
          </span>
        </div>
      </div>

      <!-- Connecting Waves SVG Container -->
      <div class="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none select-none">
        <svg 
          viewBox="0 0 900 130" 
          preserveAspectRatio="none" 
          class="w-full h-full overflow-visible pointer-events-auto"
        >
          <defs>
            <!-- Blue Gradient for Quotation -->
            <linearGradient id="waveBlueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.95" />
            </linearGradient>
            <!-- Teal Gradient for Qualified -->
            <linearGradient id="waveTealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0d9488" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#0f766e" stop-opacity="0.95" />
            </linearGradient>
            <!-- Green Gradient for Negotiation -->
            <linearGradient id="waveGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#009838" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#006625" stop-opacity="0.95" />
            </linearGradient>

            <!-- Shadow filter for waves -->
            <filter id="waveShadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="-4" stdDeviation="4" flood-color="#000000" flood-opacity="0.08" />
            </filter>
          </defs>

          <!-- Stage 1 Wave (Quotation - Blue) -->
          <g 
            class="cursor-pointer transition-transform duration-200" 
            :class="[activeStage === 0 ? 'opacity-100 scale-[1.01]' : 'opacity-90']"
            @mouseenter="activeStage = 0"
            @mouseleave="activeStage = null"
          >
            <!-- Continuous curve from y=10 to y=40, then flat drop -->
            <path 
              d="M 0 130 L 0 10 C 100 10, 200 40, 300 40 L 300 130 Z" 
              fill="url(#waveBlueGrad)"
              filter="url(#waveShadow)"
            />
            <!-- Centered value label -->
            <text 
              x="150" 
              y="90" 
              text-anchor="middle" 
              class="text-xs sm:text-sm font-bold fill-white tracking-wider"
            >
              38.3%
            </text>
          </g>

          <!-- Stage 2 Wave (Qualified - Teal) -->
          <g 
            class="cursor-pointer transition-transform duration-200" 
            :class="[activeStage === 1 ? 'opacity-100 scale-[1.01]' : 'opacity-90']"
            @mouseenter="activeStage = 1"
            @mouseleave="activeStage = null"
          >
            <!-- Continuous curve from y=40 to y=80, then flat drop -->
            <path 
              d="M 300 130 L 300 40 C 400 40, 500 80, 600 80 L 600 130 Z" 
              fill="url(#waveTealGrad)"
              filter="url(#waveShadow)"
            />
            <!-- Centered value label -->
            <text 
              x="450" 
              y="105" 
              text-anchor="middle" 
              class="text-xs sm:text-sm font-bold fill-white tracking-wider"
            >
              35.4%
            </text>
          </g>

          <!-- Stage 3 Wave (Negotiation - Green) -->
          <g 
            class="cursor-pointer transition-transform duration-200" 
            :class="[activeStage === 2 ? 'opacity-100 scale-[1.01]' : 'opacity-90']"
            @mouseenter="activeStage = 2"
            @mouseleave="activeStage = null"
          >
            <!-- Continuous curve from y=80 to y=80 (flat, resting wave) -->
            <path 
              d="M 600 130 L 600 80 C 700 80, 800 80, 900 80 L 900 130 Z" 
              fill="url(#waveGreenGrad)"
              filter="url(#waveShadow)"
            />
            <!-- Centered value label -->
            <text 
              x="750" 
              y="110" 
              text-anchor="middle" 
              class="text-xs sm:text-sm font-bold fill-white tracking-wider"
            >
              26.3%
            </text>
          </g>
        </svg>
      </div>
    </div>
  </UCard>
</template>
