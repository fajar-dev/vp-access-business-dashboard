<script setup lang="ts">
import { ref, computed } from 'vue'

// Set page metadata to use default sidebar layout
definePageMeta({
  layout: 'default'
})



// Year preset mockups to show a realistic, complete UX
interface PresetData {
  annualTarget: number
  distributionMethod: 'same_rata' | 'manual'
  monthlyValues: number[]
}

const presets = {
  '2026': {
    annualTarget: 1000000000,
    distributionMethod: 'manual' as const,
    // 25% allocated: Q1 has 120M, 55M, 75M. Q2, Q3, Q4 are empty.
    monthlyValues: [120000000, 55000000, 75000000, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  '2025': {
    annualTarget: 800000000,
    distributionMethod: 'same_rata' as const,
    // Fully allocated equally: ~66,666,666 each
    monthlyValues: Array(12).fill(Math.round(800000000 / 12))
  },
  '2024': {
    annualTarget: 600000000,
    distributionMethod: 'manual' as const,
    // Fully allocated manually
    monthlyValues: [50000000, 50000000, 50000000, 50000000, 50000000, 50000000, 50000000, 50000000, 50000000, 50000000, 50000000, 50000000]
  }
}

// Year and context selectors
const selectedYear = ref('2026')
const yearOptions = ['2026', '2025', '2024']

const selectedBranch = ref('All Branch')
const branchOptions = ['All Branch', 'Medan', 'Surabaya', 'Jakarta', 'Bali']

const selectedTimeframe = ref('This Month')
const timeframeOptions = ['This Month', 'Last Month', 'This Quarter', 'This Year']

// Core Page State
const annualTarget = ref(presets['2026'].annualTarget)
const distributionMethod = ref<'same_rata' | 'manual'>(presets['2026'].distributionMethod)

// Handle Year Change
const handleYearChange = (year: string) => {
  selectedYear.value = year
  const preset = presets[year as keyof typeof presets]
  if (preset) {
    annualTarget.value = preset.annualTarget
    distributionMethod.value = preset.distributionMethod
    monthlyTargets.value.forEach((month, idx) => {
      month.value = preset.monthlyValues[idx] || 0
    })
  }
}

// Monthly Target definitions with localized names and YoY presets
interface MonthTarget {
  name: string
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  value: number
  yoy: number | null
}

const monthlyTargets = ref<MonthTarget[]>([
  { name: 'Januari', quarter: 'Q1', value: 120000000, yoy: 3 },
  { name: 'Februari', quarter: 'Q1', value: 55000000, yoy: -1 },
  { name: 'Maret', quarter: 'Q1', value: 75000000, yoy: -2 },
  { name: 'April', quarter: 'Q2', value: 0, yoy: null },
  { name: 'Mei', quarter: 'Q2', value: 0, yoy: null },
  { name: 'Juni', quarter: 'Q2', value: 0, yoy: null },
  { name: 'Juli', quarter: 'Q3', value: 0, yoy: null },
  { name: 'Agustus', quarter: 'Q3', value: 0, yoy: null },
  { name: 'September', quarter: 'Q3', value: 0, yoy: null },
  { name: 'Oktober', quarter: 'Q4', value: 0, yoy: null },
  { name: 'November', quarter: 'Q4', value: 0, yoy: null },
  { name: 'Desember', quarter: 'Q4', value: 0, yoy: null }
])

// Input focus tracking
const isAnnualFocused = ref(false)
const focusedMonths = ref<Record<number, boolean>>({})

// Annual Target Input computed property
const annualTargetFormatted = computed({
  get() {
    if (isAnnualFocused.value) {
      return annualTarget.value === 0 ? '' : annualTarget.value.toString()
    }
    return formatIDR(annualTarget.value)
  },
  set(val: string) {
    const cleanVal = parseIDR(val)
    annualTarget.value = cleanVal
    
    // If Same Rata is active, propagate automatically
    if (distributionMethod.value === 'same_rata') {
      redistributeEqually()
    }
  }
})

// Helper functions for formatting monthly values in inputs
const getMonthFormatted = (index: number) => {
  const target = monthlyTargets.value[index]
  if (!target) return '0'
  if (focusedMonths.value[index]) {
    return target.value === 0 ? '' : target.value.toString()
  }
  return formatIDR(target.value)
}

const setMonthFormatted = (index: number, val: string) => {
  const cleanVal = parseIDR(val)
  const target = monthlyTargets.value[index]
  if (target) {
    target.value = cleanVal
  }
}

// Collapsible Quarters State
const isQuarterExpanded = ref<Record<string, boolean>>({
  Q1: true,
  Q2: true,
  Q3: false,
  Q4: false
})

const toggleQuarter = (q: string) => {
  isQuarterExpanded.value[q] = !isQuarterExpanded.value[q]
}

// Compute allocations
const totalAllocated = computed(() => {
  return monthlyTargets.value.reduce((sum, item) => sum + item.value, 0)
})

const allocationPercentage = computed(() => {
  if (annualTarget.value <= 0) return 0
  return Math.round((totalAllocated.value / annualTarget.value) * 100)
})

const unallocatedAmount = computed(() => {
  return annualTarget.value - totalAllocated.value
})

// Distribution Actions
const redistributeEqually = () => {
  if (annualTarget.value <= 0) {
    monthlyTargets.value.forEach(m => m.value = 0)
    return
  }
  const baseVal = Math.floor(annualTarget.value / 12)
  const remainder = annualTarget.value % 12
  
  monthlyTargets.value.forEach((m, idx) => {
    // Add remainder to December to keep totals perfectly matched
    m.value = idx === 11 ? baseVal + remainder : baseVal
  })
}

const handleMethodChange = (method: 'same_rata' | 'manual') => {
  distributionMethod.value = method
  if (method === 'same_rata') {
    redistributeEqually()
  }
}

const fillSameRataAction = () => {
  distributionMethod.value = 'same_rata'
  redistributeEqually()
}

const resetAction = () => {
  distributionMethod.value = 'manual'
  monthlyTargets.value.forEach(m => m.value = 0)
}

// Action log / toast trigger mockup
const isLocked = ref(false)
const saveDraft = () => {
  alert('Draf berhasil disimpan!')
}
const lockTarget = () => {
  isLocked.value = true
  alert('Target Revenue berhasil dikunci!')
}
</script>

<template>
  <div class="space-y-4">
    <!-- 1. Page Title Header (matching Growth page styling) -->
    <Header
      title="Target Revenue Tahunan"
      description="Baseline untuk performa dashboard • Senin, 4 Mei 2026"
    >
      <template #actions>
        <USelect
          v-model="selectedBranch"
          :items="branchOptions"
          class="md:w-32 w-full"
          aria-label="Select Branch"
        />
        <USelect
          v-model="selectedTimeframe"
          :items="timeframeOptions"
          class="md:w-32 w-full"
          aria-label="Select Date Range"
        />
      </template>
    </Header>

    <!-- 2. Year & Status Select Bar -->
    <div class="flex flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-neutral-700">Tahun:</span>
        <USelect
          :model-value="selectedYear"
          @update:model-value="handleYearChange"
          :items="yearOptions"
          class="w-32"
          aria-label="Select Year"
        />
      </div>
      <div class="flex items-center gap-3 border border-neutral-100 rounded px-2.5 py-1">
        <span class="text-sm text-neutral-900 font-medium">Status:</span>
        <UBadge color="neutral" variant="soft" class="font-medium text-xs px-2.5 py-1">
          <UIcon name="i-lucide-file-pen-line" />
          {{ isLocked ? 'Terkunci' : 'Draf' }}
        </UBadge>
      </div>
    </div>

    <!-- 3. Two-Column Config Section -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
      <!-- Left Config Card (3 Cols / ~60%) -->
      <UCard
        class="lg:col-span-3 border border-neutral-100 transition-all hover:shadow-sm flex flex-col justify-between"
        :ui="{ body: 'flex-1 flex flex-col justify-between h-full space-y-6' }"
      >
        <div class="space-y-5">
          <div>
            <h3 class="text-base font-semibold text-neutral-900 mb-2">Target Revenue Tahunan</h3>
            <p class="text-sm text-neutral-500 mt-1">Total Target Revenue (Rupiah)</p>
            
            <!-- Large Formatted IDR Input -->
            <div class="relative mt-2">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400 font-semibold text-lg">
                Rp.
              </span>
              <input
                type="text"
                v-model="annualTargetFormatted"
                @focus="isAnnualFocused = true"
                @blur="isAnnualFocused = false"
                :disabled="isLocked"
                class="w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-lg text-2xl font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-neutral-50 disabled:text-neutral-400 transition-all select-all shadow-xs"
                placeholder="0"
              />
            </div>
            <p class="text-xs text-neutral-500 mt-1.5">Isi target tahunan untuk revenue tahun ini</p>
          </div>

          <!-- Radio Selector for Distribution Mode -->
          <div class="space-y-2.5">
            <h4 class="text-sm font-semibold text-neutral-800">Metode Distribusi Bulanan</h4>
            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="distribution"
                  value="same_rata"
                  :checked="distributionMethod === 'same_rata'"
                  @change="handleMethodChange('same_rata')"
                  :disabled="isLocked"
                  class="w-4 h-4 text-emerald-600 border-neutral-300 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <span class="text-sm text-neutral-700 font-medium">Sama Rata per bulan</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="distribution"
                  value="manual"
                  :checked="distributionMethod === 'manual'"
                  @change="handleMethodChange('manual')"
                  :disabled="isLocked"
                  class="w-4 h-4 text-emerald-600 border-neutral-300 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                />
                <span class="text-sm text-neutral-700 font-medium">Perencanaan Manual</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Metric Details Output Row (Inside Box) -->
        <div class="border border-neutral-100 rounded-lg p-2 divide-y divide-neutral-100">
          <!-- Avg Monthly -->
          <div class="flex items-center justify-between pb-1">
            <div class="flex items-center gap-1">
              <span class="w-8 h-8 text-info flex items-center justify-center">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
              </span>
              <span class="text-sm text-neutral-900 font-medium">Rata-rata per bulan</span>
            </div>
            <span class="text-sm font-semibold text-neutral-900">
              Rp. {{ formatIDR(Math.round(annualTarget / 12)) }}
            </span>
          </div>

          <!-- YoY comparison indicator -->
          <div class="flex items-center justify-between py-1">
            <div class="flex items-center gap-1">
              <span class="w-8 h-8 text-primary flex items-center justify-center">
                <UIcon name="i-lucide-trending-up" class="w-4 h-4" />
              </span>
              <span class="text-sm text-neutral-900 font-medium">Kenaikan dari tahun lalu</span>
            </div>
            <span class="text-sm font-semibold text-neutral-900">+ 9 %</span>
          </div>

          <!-- Target Run rate percentage -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-1">
              <span class="w-8 h-8 text-warning flex items-center justify-center">
                <UIcon name="i-lucide-target" class="w-4 h-4" />
              </span>
              <span class="text-sm text-neutral-900 font-medium">Kebutuhan Pencapaian per bulan</span>
            </div>
            <span class="text-sm font-semibold text-neutral-900">8,3 %</span>
          </div>
        </div>
      </UCard>

      <!-- Right Dashboard Info Card (2 Cols / ~40%) -->
      <UCard
        class="lg:col-span-2 border border-neutral-100 transition-all hover:shadow-sm flex flex-col justify-between"
        :ui="{ body: 'flex-1 flex flex-col justify-between h-full space-y-6' }"
      >
        <div class="space-y-5">
          <h3 class="text-base font-semibold text-neutral-900">Informasi Target</h3>
          
          <!-- Dynamic Alert depending on allocated targets -->
          <div>
            <UAlert
              v-if="allocationPercentage < 100"
              icon="i-lucide-triangle-alert"
              color="warning"
              variant="soft"
              title="Target Revenue belum teralokasi seluruhnya."
              class="border-none"
            />
            <UAlert
              v-else-if="allocationPercentage === 100"
              icon="i-lucide-circle-check"
              color="success"
              variant="soft"
              title="Target Revenue telah teralokasi seluruhnya."
              class="border-none"
            />
            <UAlert
              v-else
              icon="i-lucide-circle-x"
              color="error"
              variant="soft"
              :title="`Target teralokasi melebihi total (Kelebihan Rp. ${formatIDR(Math.abs(unallocatedAmount))})`"
              class="border-none"
            />
          </div>

          <!-- Donut Progress and Metrics Container using ApexCharts -->
          <AllocationDonutChart
            :allocation-percentage="allocationPercentage"
            :total-allocated="totalAllocated"
            :unallocated-amount="unallocatedAmount"
          />
        </div>

        <!-- Updating Meta Footer -->
        <div class="p-3 rounded-lg border border-neutral-100 text-xs text-neutral-600 space-y-2">
          <div class="flex justify-between font-medium">
            <span>Terakhir diperbarui</span>
            <span class="text-neutral-900">Kamis, 7 Mei 2026 - 16:12</span>
          </div>
          <div class="flex justify-between font-medium">
            <span>Diperbarui oleh</span>
            <span class="text-neutral-900">Ali Putera (VP Akses Bisnis)</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 4. Monthly Target Sheet Accordion Card -->
    <UCard
      class="border border-neutral-100 transition-all hover:shadow-sm overflow-hidden flex flex-col"
      :ui="{ body: 'p-0 flex-1 flex flex-col', header: 'border-b border-neutral-100 bg-white flex items-center justify-between' }"
    >
      <template #header>
        <h3 class="text-base font-semibold text-neutral-900 select-none">Target Per Bulan</h3>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-layout-grid"
            color="neutral"
            variant="outline"
            size="md"
            label="Isi Sama Rata"
            :disabled="isLocked"
            @click="fillSameRataAction"
          />
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            size="md"
            label="Atur Ulang"
            :disabled="isLocked"
            @click="resetAction"
          />
        </div>
      </template>

      <!-- Monthly Target Nested Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-neutral-800 min-w-[700px] border border-neutral-200 rounded-xl">
          <!-- Table Header -->
          <thead class="bg-neutral-50 text-xs font-medium text-neutral-600 border-b border-neutral-200 select-none">
            <tr>
              <th class="py-3 px-6 w-[280px]">Status</th>
              <th class="py-3 px-6 w-[220px]">Target Revenue (Rp)</th>
              <th class="py-3 px-6 w-[150px]">Alokasi (%)</th>
              <th class="py-3 px-6">Dengan 2025</th>
            </tr>
          </thead>
          
          <!-- Table Quarters Loop -->
          <tbody v-for="q in (['Q1', 'Q2', 'Q3', 'Q4'] as const)" :key="q">
            <!-- Collapsible Quarter Row Header -->
            <tr
              class="border-b border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50/80 transition-colors cursor-pointer select-none"
              @click="toggleQuarter(q)"
            >
              <td colspan="4" class="py-3 px-6 font-semibold text-neutral-700 text-xs">
                <div class="flex items-center gap-2">
                  <UIcon
                    :name="isQuarterExpanded[q] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                    class="w-4 h-4 text-neutral-400 transition-transform"
                  />
                  <span>{{ q }}</span>
                </div>
              </td>
            </tr>

            <!-- Render months inside Quarter if expanded -->
            <template v-if="isQuarterExpanded[q]">
              <tr
                v-for="(month, idx) in monthlyTargets"
                v-show="month.quarter === q"
                :key="month.name"
                class="align-middle"
              >
                <!-- Month Label -->
                <td class="py-3.5 px-6 pl-12 font-medium text-neutral-800">
                  {{ month.name }}
                </td>

                <!-- Month Formatted Input Box -->
                <td class="py-3.5 px-6">
                  <div class="relative w-44">
                    <input
                      type="text"
                      :value="getMonthFormatted(idx)"
                      @focus="focusedMonths[idx] = true"
                      @blur="focusedMonths[idx] = false"
                      @input="e => setMonthFormatted(idx, (e.target as HTMLInputElement).value)"
                      :disabled="distributionMethod === 'same_rata' || isLocked"
                      class="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all"
                      placeholder="0"
                    />
                  </div>
                </td>

                <!-- Computed Allocation % of total -->
                <td class="py-3.5 px-6 font-semibold text-neutral-600">
                  <span v-if="annualTarget > 0">
                    {{ ((month.value / annualTarget) * 100).toFixed(1).replace('.', ',') }}%
                  </span>
                  <span v-else>0%</span>
                </td>

                <!-- Comparison change indicator compared to 2025 -->
                <td class="py-3.5 px-6 font-semibold">
                  <span
                    v-if="month.yoy !== null"
                    :class="[month.yoy > 0 ? 'text-emerald-600' : 'text-red-500']"
                  >
                    {{ month.yoy > 0 ? '+' : '' }}{{ month.yoy }}%
                  </span>
                  <span v-else class="text-neutral-400">-</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- 5. Bottom Action & Footer Buttons bar -->
    <div class="flex flex-row justify-between items-center gap-4 pt-4">
      <!-- Change Log Trigger -->
      <UButton
        icon="i-lucide-history"
        color="neutral"
        variant="ghost"
        size="md"
        label="Riwayat Perubahan"
        class="cursor-pointer truncate"
      />

      <!-- Primary Action triggers -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          label="Ubah Target"
          icon="i-lucide-lock"
          @click="saveDraft"
        />
        <UButton
          color="neutral"
          variant="outline"
          size="md"
          label="Simpan Draf"
          :disabled="isLocked"
          @click="saveDraft"
        />
        <UButton
          color="success"
          size="md"
          label="Kunci Target"
          icon="i-lucide-lock"
          :disabled="isLocked"
          @click="lockTarget"
        />
      </div>
    </div>
  </div>
</template>
