<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// Define switches
const showNames = ref(false)
const compare = ref(true)

// Chart container ref for responsive sizing
const containerRef = ref<HTMLDivElement | null>(null)
const size = reactive({
  width: 600,
  height: 320
})

// Data sets representing YTD Revenue in Millions (Rp)
const months = ['Jan', 'Feb', 'Mar', 'Apr']

const data2026 = [125, 90, 96, 140] // 2026 YTD Values
const data2025 = [75, 58, 32, 82]  // 2025 YTD Values (Comparison)

// Y-Axis limits
const maxValue = 200
const yTicks = [200, 160, 120, 80, 40, 0]

// Chart Layout Parameters (Margins/Paddings)
const padding = {
  top: 30,
  right: 20,
  bottom: 40,
  left: 50
}

// Compute drawable dimensions
const chartWidth = computed(() => Math.max(100, size.width - padding.left - padding.right))
const chartHeight = computed(() => Math.max(100, size.height - padding.top - padding.bottom))

// Map data values to coordinates
const getCoords = (data: number[]) => {
  return data.map((val, index) => {
    const x = padding.left + (index / (months.length - 1)) * chartWidth.value
    // Invert Y axis: higher values have smaller SVG Y coordinates
    const y = padding.top + chartHeight.value - (val / maxValue) * chartHeight.value
    return { x, y, val }
  })
}

const points2026 = computed(() => getCoords(data2026))
const points2025 = computed(() => getCoords(data2025))

// Build path strings for lines
const linePath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return ''
  return points.reduce((path, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`
  }, '')
}

// Build closed path for 2026 gradient area fill
const areaPath2026 = computed(() => {
  const pts = points2026.value
  if (pts.length === 0) return ''
  const startX = pts[0].x
  const endX = pts[pts.length - 1].x
  const bottomY = padding.top + chartHeight.value
  return `${linePath(pts)} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`
})

// Responsive observer to adjust SVG size
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    size.width = containerRef.value.clientWidth
    size.height = containerRef.value.clientHeight || 320

    resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return
      const entry = entries[0]
      size.width = entry.contentRect.width
      // Maintain minimum aspect height
      size.height = Math.max(300, entry.contentRect.height || 320)
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value)
  }
})

// Hover state for interactive tooltip
const hoveredIndex = ref<number | null>(null)
const mousePos = reactive({ x: 0, y: 0 })

const handleMouseMove = (event: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  mousePos.x = mouseX
  mousePos.y = mouseY

  // Find nearest index along X axis
  const xCoords = points2026.value.map(p => p.x)
  let nearestIdx = 0
  let minDist = Infinity

  xCoords.forEach((x, idx) => {
    const dist = Math.abs(x - mouseX)
    if (dist < minDist) {
      minDist = dist
      nearestIdx = idx
    }
  })

  // Only hover if mouse is relatively close to the point horizontally
  if (minDist < chartWidth.value / (months.length * 1.5)) {
    hoveredIndex.value = nearestIdx
  } else {
    hoveredIndex.value = null
  }
}

const handleMouseLeave = () => {
  hoveredIndex.value = null
}

// Compute tooltip content & positions
const tooltipData = computed(() => {
  if (hoveredIndex.value === null) return null
  const idx = hoveredIndex.value
  const val2026 = data2026[idx]
  const val2025 = data2025[idx]
  const pctChange = val2025 > 0 ? ((val2026 - val2025) / val2025) * 100 : 0
  
  // Align tooltip above or to the side of the 2026 active point
  const pt = points2026.value[idx]
  
  return {
    month: months[idx],
    y2026: val2026,
    y2025: val2025,
    change: pctChange.toFixed(1),
    x: pt.x,
    y: pt.y - 10
  }
})
</script>

<template>
  <UCard class="border border-neutral-100 h-full flex flex-col justify-between">
    <!-- Header with controls -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
      <div>
        <h3 class="text-base font-semibold text-neutral-900">
          Revenue (YTD)
        </h3>
        <p class="text-xs text-neutral-500">
          Year to Date sampai 24 April 2026
        </p>
      </div>

      <!-- Controls Switches -->
      <div class="flex items-center gap-6 text-xs font-medium text-neutral-700 select-none shrink-0">
        <div class="flex items-center gap-2">
          <span>Tampilkan Nama</span>
          <USwitch
            v-model="showNames"
            color="primary"
            aria-label="Toggle names display"
          />
        </div>
        <div class="flex items-center gap-2">
          <span>Compare</span>
          <USwitch
            v-model="compare"
            color="primary"
            aria-label="Toggle comparison line"
          />
        </div>
      </div>
    </div>

    <!-- Chart Render Area -->
    <div 
      ref="containerRef" 
      class="relative flex-1 min-h-64 mt-4 w-full cursor-crosshair"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <svg :width="size.width" :height="size.height" class="overflow-visible select-none">
        <defs>
          <!-- Beautiful Green Fill Gradient -->
          <linearGradient id="greenAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#009838" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#009838" stop-opacity="0.00" />
          </linearGradient>

          <!-- Shadow Filter for Primary Dots & Lines -->
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#009838" flood-opacity="0.25" />
          </filter>
        </defs>

        <!-- Horizontal grid lines and Y axis ticks -->
        <g class="grid-lines">
          <g v-for="(tick, idx) in yTicks" :key="idx">
            <!-- Label -->
            <text
              :x="padding.left - 12"
              :y="padding.top + (idx / (yTicks.length - 1)) * chartHeight"
              text-anchor="end"
              alignment-baseline="middle"
              class="text-[10px] font-semibold fill-neutral-400"
            >
              {{ tick }}M
            </text>
            <!-- Grid Line -->
            <line
              :x1="padding.left"
              :y1="padding.top + (idx / (yTicks.length - 1)) * chartHeight"
              :x2="padding.left + chartWidth"
              :y2="padding.top + (idx / (yTicks.length - 1)) * chartHeight"
              class="stroke-neutral-100"
              stroke-dasharray="4 4"
            />
          </g>
        </g>

        <!-- Vertical grid lines and X axis labels -->
        <g class="x-axis">
          <g v-for="(month, idx) in months" :key="idx">
            <!-- Grid line -->
            <line
              :x1="padding.left + (idx / (months.length - 1)) * chartWidth"
              :y1="padding.top"
              :x2="padding.left + (idx / (months.length - 1)) * chartWidth"
              :y2="padding.top + chartHeight"
              class="stroke-neutral-100"
              stroke-dasharray="2 4"
            />
            <!-- Text label -->
            <text
              :x="padding.left + (idx / (months.length - 1)) * chartWidth"
              :y="padding.top + chartHeight + 20"
              text-anchor="middle"
              class="text-[10px] font-semibold fill-neutral-400"
            >
              {{ month }}
            </text>
          </g>
        </g>

        <!-- Vertical Highlight Line on Hover -->
        <line
          v-if="hoveredIndex !== null"
          :x1="points2026[hoveredIndex].x"
          :y1="padding.top"
          :x2="points2026[hoveredIndex].x"
          :y2="padding.top + chartHeight"
          class="stroke-primary/20"
          stroke-width="1.5"
          stroke-dasharray="4 2"
        />

        <!-- 2025 YTD (Comparison Line) - Render first so active line sits on top -->
        <g v-if="compare" class="compare-series">
          <!-- Line -->
          <path
            :d="linePath(points2025)"
            fill="none"
            class="stroke-neutral-300"
            stroke-width="2"
            stroke-dasharray="5 5"
          />
          <!-- Dots -->
          <circle
            v-for="(pt, idx) in points2025"
            :key="idx"
            :cx="pt.x"
            :cy="pt.y"
            r="4.5"
            class="fill-neutral-300"
          />
        </g>

        <!-- 2026 YTD (Active Line) -->
        <g class="active-series">
          <!-- Gradient fill area -->
          <path
            :d="areaPath2026"
            fill="url(#greenAreaGrad)"
          />
          <!-- Line path -->
          <path
            :d="linePath(points2026)"
            fill="none"
            class="stroke-primary"
            stroke-width="3"
            filter="url(#glow)"
          />
          <!-- Data Point Circles -->
          <g v-for="(pt, idx) in points2026" :key="idx">
            <!-- Pulsing outer ring on hover -->
            <circle
              v-if="hoveredIndex === idx"
              :cx="pt.x"
              :cy="pt.y"
              r="9"
              class="fill-primary/20 animate-ping"
            />
            <!-- Outer circle -->
            <circle
              :cx="pt.x"
              :cy="pt.y"
              r="6"
              class="fill-primary stroke-white"
              stroke-width="1.5"
            />
            <!-- Inner dot -->
            <circle
              :cx="pt.x"
              :cy="pt.y"
              r="2.5"
              fill="white"
            />
            
            <!-- Value labels when showNames toggle is active -->
            <g v-if="showNames">
              <rect
                :x="pt.x - 22"
                :y="pt.y - 25"
                width="44"
                height="16"
                rx="4"
                class="fill-white stroke-neutral-100 shadow-sm"
                stroke-width="1"
              />
              <text
                :x="pt.x"
                :y="pt.y - 14"
                text-anchor="middle"
                class="text-[9px] font-semibold fill-neutral-700"
              >
                Rp {{ pt.val }}Jt
              </text>
            </g>
          </g>
        </g>
      </svg>

      <!-- Premium Float Tooltip Card -->
      <div
        v-if="tooltipData"
        class="absolute z-10 pointer-events-none p-3 bg-white/95 backdrop-blur-md border border-neutral-100 rounded-xl shadow-lg text-xs transition-all duration-100"
        :style="{
          left: `${tooltipData.x + 15}px`,
          top: `${tooltipData.y - 40}px`
        }"
      >
        <div class="font-semibold text-neutral-900 mb-2 pb-1 border-b border-neutral-100">
          {{ tooltipData.month }} 2026
        </div>
        <div class="space-y-1.5">
          <!-- Active Line -->
          <div class="flex items-center gap-4 justify-between">
            <div class="flex items-center gap-1.5 text-neutral-700">
              <span class="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
              <span>2026 YTD:</span>
            </div>
            <span class="font-semibold text-neutral-950">Rp {{ tooltipData.y2026 }}M</span>
          </div>

          <!-- Comparison Line -->
          <div v-if="compare" class="flex items-center gap-4 justify-between">
            <div class="flex items-center gap-1.5 text-neutral-700">
              <span class="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block"></span>
              <span>2025 YTD:</span>
            </div>
            <span class="font-semibold text-neutral-950">Rp {{ tooltipData.y2025 }}M</span>
          </div>

          <!-- Growth Indicator badge -->
          <div v-if="compare" class="pt-1.5 flex items-center justify-between border-t border-neutral-100">
            <span class="text-neutral-700">Pertumbuhan:</span>
            <span 
              class="font-semibold rounded px-1"
              :class="Number(tooltipData.change) >= 0 ? 'text-primary' : 'text-red-500'"
            >
              {{ Number(tooltipData.change) >= 0 ? '↑' : '↓' }} {{ tooltipData.change }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Legend/Key -->
    <div class="flex items-center justify-center gap-6 text-xs font-medium text-neutral-700 pt-4 mt-2 border-t border-neutral-100 select-none">
      <div class="flex items-center gap-2">
        <span class="w-3 h-1.5 bg-neutral-300 rounded-full inline-block"></span>
        <span>2025 YTD</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-1.5 bg-primary rounded-full inline-block"></span>
        <span>2026 YTD</span>
      </div>
    </div>
  </UCard>
</template>
