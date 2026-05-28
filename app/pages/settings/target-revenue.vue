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
            
            <!-- Large Formatted IDR Input using Nuxt UI -->
            <UInput
              type="text"
              v-model="annualTargetFormatted"
              @focus="isAnnualFocused = true"
              @blur="isAnnualFocused = false"
              :disabled="isLocked"
              size="xl"
              placeholder="0"
              class="w-full mt-2 font-semibold "
              :ui="{
                base: 'pl-12.5 py-2.5 '
              }"
            >
              <template #leading>
                <span class="text-neutral-400 font-medium text-lg pl-1">Rp.</span>
              </template>
            </UInput>
            <p class="text-xs text-neutral-500 mt-1.5">Isi target tahunan untuk revenue tahun ini</p>
          </div>

          <!-- Radio Selector for Distribution Mode using Nuxt UI URadioGroup -->
          <div class="space-y-2.5">
            <h4 class="text-sm font-semibold text-neutral-800">Metode Distribusi Bulanan</h4>
            <URadioGroup
              :model-value="distributionMethod"
              @update:model-value="val => handleMethodChange(val as 'same_rata' | 'manual')"
              :items="distributionOptions"
              orientation="horizontal"
              :disabled="isLocked"
              class="cursor-pointer select-none"
            />
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
              variant="subtle"
              title="Target Revenue belum teralokasi seluruhnya."
              class="border-none"
            />
            <UAlert
              v-else-if="allocationPercentage === 100"
              icon="i-lucide-circle-check"
              color="success"
              variant="subtle"
              title="Target Revenue telah teralokasi seluruhnya."
              class="border-none"
            />
            <UAlert
              v-else
              icon="i-lucide-circle-x"
              color="error"
              variant="subtle"
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
        <div class="p-3 rounded-lg border border-neutral-100 text-xs text-neutral-700 space-y-2">
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

      <!-- Monthly Target Nested Table using Nuxt UI -->
      <div class="overflow-x-auto">
        <UTable
          :data="tableRows"
          :columns="columns"
          :meta="{
            class: {
              tr: (row: any) => row.original.type === 'month' ? 'border-b-0 border-transparent' : 'border-b border-neutral-100'
            }
          }"
          class="w-full text-left text-sm text-neutral-800 min-w-[700px] border border-neutral-200 rounded-lg bg-white"
        >
          <!-- Custom Status Name Cell (renders quarter header collapse triggers & month names) -->
          <template #name-cell="{ row }">
            <div
              v-if="row.original.type === 'quarter'"
              class="flex items-center gap-2 w-full h-full cursor-pointer select-none"
              @click="toggleQuarter(row.original.id)"
            >
              <UIcon
                :name="isQuarterExpanded[row.original.id] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                class="w-4 h-4 text-neutral-400 transition-transform"
              />
              <span>{{ row.original.name }}</span>
            </div>
            <template v-else>
              {{ row.original.name }}
            </template>
          </template>

          <!-- Custom Target Revenue Input Cell -->
          <template #value-cell="{ row }">
            <div v-if="row.original.type === 'month' && row.original.idx !== undefined" class="w-full">
              <UInput
                type="text"
                :model-value="getMonthFormatted(row.original.idx)"
                @focus="focusedMonths[row.original.idx] = true"
                @blur="focusedMonths[row.original.idx] = false"
                @update:model-value="val => setMonthFormatted(row.original.idx as number, val)"
                :disabled="distributionMethod === 'same_rata' || isLocked"
                placeholder="0"
                class="w-full font-semibold text-neutral-900 shadow-xs"
              />
            </div>
          </template>

          <!-- Custom Allocation Cell -->
          <template #allocation-cell="{ row }">
            <template v-if="row.original.type === 'month'">
              <span v-if="annualTarget > 0">
                {{ (((row.original.value ?? 0) / annualTarget) * 100).toFixed(1).replace('.', ',') }}%
              </span>
              <span v-else>0%</span>
            </template>
          </template>

          <!-- Custom YoY Change Cell -->
          <template #yoy-cell="{ row }">
            <template v-if="row.original.type === 'month'">
              <span
                v-if="row.original.yoy !== undefined && row.original.yoy !== null"
                :class="[(row.original.yoy ?? 0) > 0 ? 'text-emerald-600' : 'text-error']"
              >
                {{ (row.original.yoy ?? 0) > 0 ? '+' : '' }}{{ row.original.yoy }}%
              </span>
              <span v-else class="text-neutral-400">-</span>
            </template>
          </template>
        </UTable>
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
        <!-- Ubah Target (Only visible when locked) -->
        <UButton
          v-if="isLocked"
          color="neutral"
          variant="outline"
          size="md"
          label="Ubah Target"
          icon="i-lucide-lock-keyhole-open"
          @click="isEditModalOpen = true"
          class="cursor-pointer"
        />

        <!-- Simpan Draf and Kunci Target (Only visible when NOT locked) -->
        <template v-else>
          <UButton
            color="neutral"
            variant="outline"
            size="md"
            label="Simpan Draf"
            @click="saveDraft"
            class="cursor-pointer bg-white hover:bg-neutral-50"
          />
          <UButton
            color="success"
            size="md"
            label="Kunci Target"
            icon="i-lucide-lock"
            @click="lockTarget"
            class="cursor-pointer"
          />
        </template>
      </div>
    </div>

    <!-- Lock Target Confirmation Modal -->
    <LockTargetModal
      v-model="isLockModalOpen"
      @confirm="confirmLock"
    />
    <!-- Edit Target (Unlock) Confirmation Modal -->
    <EditTargetModal
      v-model="isEditModalOpen"
      @confirm="confirmUnlock"
    />
  </div>
</template>

<script setup lang="ts">

// Set page metadata to use default sidebar layout
definePageMeta({
  layout: 'dashboard'
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

// Retrieve global dashboard filters
const { selectedBranch, selectedTimeframe, branchOptions, timeframeOptions } = useDashboardFilters()

// Core Page State
const annualTarget = ref(presets['2026'].annualTarget)
const distributionMethod = ref<'same_rata' | 'manual'>(presets['2026'].distributionMethod)

const distributionOptions = [
  { value: 'same_rata', label: 'Sama Rata per bulan' },
  { value: 'manual', label: 'Perencanaan Manual' }
]

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

// Table row representation for UTable
interface TableRowData {
  type: 'quarter' | 'month'
  id: string
  name: string
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  idx?: number
  value?: number
  yoy?: number | null
}

const tableRows = computed(() => {
  const rows: TableRowData[] = []
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const
  quarters.forEach(q => {
    // Add Quarter Row
    rows.push({
      type: 'quarter',
      id: q,
      name: q
    })
    
    // If expanded, add months belonging to this quarter
    if (isQuarterExpanded.value[q]) {
      monthlyTargets.value.forEach((month, idx) => {
        if (month.quarter === q) {
          rows.push({
            type: 'month',
            id: `${q}-${month.name}`,
            name: month.name,
            quarter: month.quarter,
            idx,
            value: month.value,
            yoy: month.yoy
          })
        }
      })
    }
  })
  return rows
})

const columns: any[] = [
  {
    accessorKey: 'name',
    header: 'Status',
    meta: {
      class: {
        th: 'py-3 px-6 w-[280px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return 'py-3 px-6 font-semibold text-neutral-700 text-sm bg-neutral-50/50 hover:bg-neutral-50/80 transition-colors cursor-pointer select-none align-middle border-b border-neutral-100'
          }
          return 'py-3.5 px-6 pl-12 font-medium text-neutral-800 align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return '4'
          }
          return '1'
        }
      }
    }
  },
  {
    accessorKey: 'value',
    header: 'Target Revenue (Rp)',
    meta: {
      class: {
        th: 'py-3 px-6 w-[350px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return 'hidden'
          }
          return 'py-3.5 px-6 align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return '0'
          }
          return '1'
        }
      }
    }
  },
  {
    accessorKey: 'allocation',
    header: 'Alokasi (%)',
    meta: {
      class: {
        th: 'py-3 px-6 w-[300px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return 'hidden'
          }
          return 'py-3.5 px-6 font-semibold text-neutral-700 align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return '0'
          }
          return '1'
        }
      }
    }
  },
  {
    accessorKey: 'yoy',
    header: 'Dengan 2025',
    meta: {
      class: {
        th: 'py-3 px-6 bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return 'hidden'
          }
          return 'py-3.5 px-6 font-semibold align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return '0'
          }
          return '1'
        }
      }
    }
  }
]

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
const isLockModalOpen = ref(false)
const isEditModalOpen = ref(false)

const saveDraft = () => {
  alert('Draf berhasil disimpan!')
}

const lockTarget = () => {
  isLockModalOpen.value = true
}

const confirmLock = () => {
  isLocked.value = true
  alert('Target Revenue berhasil dikunci!')
}

const confirmUnlock = (reason: string) => {
  isLocked.value = false
  alert(`Target Revenue dibuka kunci untuk diedit. Alasan: ${reason}`)
}
</script>
