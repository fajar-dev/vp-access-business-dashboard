<script setup lang="ts">
import { ref, computed } from 'vue'

export interface PipelineStage {
  name: string
  value: string
  share: string
  color: string
}

const props = withDefaults(
  defineProps<{
    stages?: PipelineStage[]
  }>(),
  {
    stages: () => [
      {
        name: 'Quotation',
        value: 'Rp 500M',
        share: '90.3%',
        color: 'blue'
      },
      {
        name: 'Qualified (BANT)',
        value: 'Rp 50M',
        share: '1.4%',
        color: 'teal'
      },
      {
        name: 'Negotiation',
        value: 'Rp 300M',
        share: '50.3%',
        color: 'green'
      }
    ]
  }
)

const activeStage = ref<number | null>(null)

// Parse numerical values dynamically and calculate reactive SVG S-curve paths
const wavePaths = computed(() => {
  const parsed = props.stages.map(s => {
    // Extract numbers from strings like "Rp 920M" -> 920
    const num = parseFloat(s.value.replace(/[^0-9.]/g, '')) || 0
    return num
  })
  
  const maxVal = Math.max(...parsed, 1)
  
  // Calculate wave heights scaled to the 300px viewBox (max height = 220px, min = 35px)
  const h1 = Math.max(35, ((parsed[0] || 0) / maxVal) * 200)
  const h2 = Math.max(35, ((parsed[1] || 0) / maxVal) * 200)
  const h3 = Math.max(35, ((parsed[2] || 0) / maxVal) * 200)
  
  // Calculate Y coordinates (bottom is Y = 300)
  const y1 = 300 - h1
  const y2 = 300 - h2
  const y3 = 300 - h3
  
  // Translucent crest border lines sit exactly 10px higher
  const y1Crest = y1 - 10
  const y2Crest = y2 - 10
  const y3Crest = y3 - 10
  
  return {
    stage1: {
      crest: `M 0 300 L 0 ${y1Crest} C 150 ${y1Crest}, 150 ${y2Crest}, 300 ${y2Crest} L 300 300 Z`,
      wave: `M 0 300 L 0 ${y1} C 150 ${y1}, 150 ${y2}, 300 ${y2} L 300 300 Z`
    },
    stage2: {
      crest: `M 300 300 L 300 ${y2Crest} C 450 ${y2Crest}, 450 ${y3Crest}, 600 ${y3Crest} L 600 300 Z`,
      wave: `M 300 300 L 300 ${y2} C 450 ${y2}, 450 ${y3}, 600 ${y3} L 600 300 Z`
    },
    stage3: {
      crest: `M 600 300 L 600 ${y3Crest} L 900 ${y3Crest} L 900 300 Z`,
      wave: `M 600 300 L 600 ${y3} L 900 ${y3} L 900 300 Z`
    }
  }
})
</script>

<template>
  <UCard 
    class="border border-neutral-100 h-full flex flex-col justify-between overflow-hidden relative shadow-xs"
    :ui="{ body: 'p-0 flex-1 flex flex-col justify-between' }"
  >
    <!-- Main Content Area (Header-free, content occupies entire height) -->
    <div class="relative flex-1 min-h-[340px] flex flex-col justify-between">
      
      <!-- Connecting Waves SVG Container (renders at bottom half, fully responsive) -->
      <div class="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none select-none z-0">
        <svg 
          viewBox="0 0 900 300" 
          preserveAspectRatio="none" 
          class="w-full h-full overflow-visible pointer-events-auto"
        >
          <defs>
            <!-- Blue Gradient for Quotation -->
            <linearGradient id="waveBlueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#2563eb" stop-opacity="0.95" />
            </linearGradient>
            <!-- Teal Gradient for Qualified -->
            <linearGradient id="waveTealGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#0891b2" stop-opacity="0.95" />
            </linearGradient>
            <!-- Green Gradient for Negotiation -->
            <linearGradient id="waveGreenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#009838" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#00802f" stop-opacity="0.95" />
            </linearGradient>

            <!-- Shadow filter for waves -->
            <filter id="waveShadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="-4" stdDeviation="4" flood-color="#000000" flood-opacity="0.08" />
            </filter>
          </defs>

          <!-- Stage 1 Wave (Quotation - Blue) -->
          <g 
            class="cursor-pointer transition-all duration-200" 
            :class="[activeStage === 0 ? 'opacity-100' : 'opacity-90']"
            @mouseenter="activeStage = 0"
            @mouseleave="activeStage = null"
          >
            <!-- Translucent crest layer slightly above -->
            <path 
              :d="wavePaths.stage1.crest" 
              fill="#3b82f6"
              fill-opacity="0.25"
            />
            <!-- Solid body wave -->
            <path 
              :d="wavePaths.stage1.wave" 
              fill="url(#waveBlueGrad)"
              filter="url(#waveShadow)"
            />
          </g>

          <!-- Stage 2 Wave (Qualified - Teal) -->
          <g 
            class="cursor-pointer transition-all duration-200" 
            :class="[activeStage === 1 ? 'opacity-100' : 'opacity-90']"
            @mouseenter="activeStage = 1"
            @mouseleave="activeStage = null"
          >
            <!-- Translucent crest layer slightly above -->
            <path 
              :d="wavePaths.stage2.crest" 
              fill="#06b6d4"
              fill-opacity="0.25"
            />
            <!-- Solid body wave -->
            <path 
              :d="wavePaths.stage2.wave" 
              fill="url(#waveTealGrad)"
              filter="url(#waveShadow)"
            />
          </g>

          <!-- Stage 3 Wave (Negotiation - Green) -->
          <g 
            class="cursor-pointer transition-all duration-200" 
            :class="[activeStage === 2 ? 'opacity-100' : 'opacity-90']"
            @mouseenter="activeStage = 2"
            @mouseleave="activeStage = null"
          >
            <!-- Translucent crest layer slightly above -->
            <path 
              :d="wavePaths.stage3.crest" 
              fill="#009838"
              fill-opacity="0.25"
            />
            <!-- Solid body wave -->
            <path 
              :d="wavePaths.stage3.wave" 
              fill="url(#waveGreenGrad)"
              filter="url(#waveShadow)"
            />
          </g>
        </svg>
      </div>

      <!-- 3-Column HTML Grid: Left Aligned and Overlaid on the waves -->
      <div class="relative z-10 grid grid-cols-3 h-full flex-1 min-h-[340px]">
        <div 
          v-for="(stage, idx) in props.stages" 
          :key="stage.name"
          class="pl-2 pr-2 pt-6 pb-2 md:pl-8 md:pr-4 md:pt-8 md:pb-2 flex flex-col justify-between border-r last:border-r-0 border-neutral-100 group transition-all duration-200 cursor-pointer"
          @mouseenter="activeStage = idx"
          @mouseleave="activeStage = null"
        >
          <!-- Text at the top, left-aligned -->
          <div class="flex flex-col select-none">
            <span class="text-xs md:text-sm font-medium text-neutral-500 tracking-wide">
              {{ stage.name }}
            </span>
            <span class="text-lg md:text-4xl font-semibold text-neutral-900 tracking-tight mt-1 md:mt-2.5">
              {{ stage.value }}
            </span>
          </div>
          
          <!-- Percentage label at the bottom, centered relative to column, sitting inside the wave shape -->
          <div class="text-center w-full select-none mt-auto">
            <span class="text-base sm:text-lg font-semibold text-white tracking-wide drop-shadow-xs">
              {{ stage.share }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </UCard>
</template>
