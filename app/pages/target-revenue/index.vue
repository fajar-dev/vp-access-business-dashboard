<template>
  <div class="space-y-4">
    <!-- 1. Page Title Header (matching Growth page styling) -->
    <Header
      title="Target Revenue Tahunan"
      description="Baseline untuk performa dashboard • Senin, 4 Mei 2026"
    >
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
            <p class="text-sm text-neutral-500 mt-4">Total Target Revenue (Rupiah)</p>
            
            <template v-if="isLoading">
              <USkeleton class="h-[60px] w-full mt-2 rounded-lg" />
              <USkeleton class="h-3 w-40 mt-1.5" />
            </template>
            <template v-else>
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
                  base: 'pl-12.5 py-3 '
                }"
              >
                <template #leading>
                  <span class="text-neutral-400 font-medium text-lg pl-1">Rp.</span>
                </template>
              </UInput>
              <p class="text-xs text-neutral-500 mt-1.5">Isi target tahunan untuk revenue tahun ini</p>
            </template>
          </div>
        </div>

          <!-- Metric Details Output Row (Inside Box) -->
          <div class="border border-neutral-100 rounded-lg p-2 divide-y divide-neutral-100">
            <!-- Avg Monthly -->
            <div class="flex items-center justify-between pb-1 py-1">
              <div class="flex items-center gap-1">
                <span class="w-8 h-8 text-info flex items-center justify-center">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                </span>
                <span class="text-sm text-neutral-900 font-medium">Rata-rata per bulan</span>
              </div>
              <USkeleton v-if="isLoading" class="h-5 w-24" />
              <span v-else class="text-sm font-semibold text-neutral-900">
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
              <USkeleton v-if="isLoading" class="h-5 w-16" />
              <span v-else class="text-sm font-semibold text-neutral-900">+ 9 %</span>
            </div>

            <!-- Target Run rate percentage -->
            <div class="flex items-center justify-between pt-1 py-1">
              <div class="flex items-center gap-1">
                <span class="w-8 h-8 text-warning flex items-center justify-center">
                  <UIcon name="i-lucide-target" class="w-4 h-4" />
                </span>
                <span class="text-sm text-neutral-900 font-medium">Kebutuhan Pencapaian per bulan</span>
              </div>
              <USkeleton v-if="isLoading" class="h-5 w-12" />
              <span v-else class="text-sm font-semibold text-neutral-900">8,3 %</span>
            </div>
          </div>
      </UCard>

      <!-- Right Dashboard Info Card (2 Cols / ~40%) -->
      <UCard
        class="lg:col-span-2 border border-neutral-100 transition-all hover:shadow-sm flex flex-col justify-between"
        :ui="{ body: 'flex-1 flex flex-col justify-between h-full space-y-6' }"
      >
        <div class="space-y-5 h-full flex flex-col">
          <h3 class="text-base font-semibold text-neutral-900">Informasi Target</h3>
          
          <template v-if="isLoading">
            <div class="space-y-5">
              <USkeleton class="h-12 w-full rounded-lg" />
              
              <div class="flex flex-col sm:flex-row items-center gap-8 w-full mt-6">
                <!-- Donut Skeleton -->
                <USkeleton class="w-24 h-24 rounded-full shrink-0" />
                
                <!-- Metrics Skeleton -->
                <div class="space-y-2 w-full text-center sm:text-left">
                  <div>
                    <span class="text-xs text-neutral-400 font-medium block mb-1">Total Teralokasikan</span>
                    <USkeleton class="h-6 w-32 mx-auto sm:mx-0" />
                  </div>
                  <div>
                    <span class="text-xs text-neutral-400 font-medium block mb-1">Sisa yang belum teralokasi</span>
                    <USkeleton class="h-6 w-40 mx-auto sm:mx-0" />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
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
                v-else-if="allocationPercentage >= 100"
                icon="i-lucide-circle-check"
                color="success"
                variant="subtle"
                title="Target Revenue telah teralokasi seluruhnya."
                class="border-none"
              />
            </div>

            <!-- Donut Progress and Metrics Container using ApexCharts -->
            <AllocationDonutChart
              :allocation-percentage="allocationPercentage"
              :total-allocated="totalAllocated"
              :unallocated-amount="unallocatedAmount"
            />
          </template>

          <!-- Updating Meta Footer -->
          <div class="p-3 rounded-lg border border-neutral-100 text-xs text-neutral-700 space-y-2 mt-auto">
            <div class="flex justify-between font-medium">
              <span>Terakhir diperbarui</span>
              <USkeleton v-if="isLoading" class="h-4 w-40" />
              <span v-else class="text-neutral-900">{{ formatDateTime(updatedAt) }}</span>
            </div>
            <div class="flex justify-between font-medium">
              <span>Diperbarui oleh</span>
              <USkeleton v-if="isLoading" class="h-4 w-36" />
              <span v-else class="text-neutral-900">{{ updatedBy?.name || '-' }} ({{ updatedBy?.jobPosition || '-' }})</span>
            </div>
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
            v-if="!isLocked && !isLoading"
            icon="i-lucide-layout-grid"
            color="neutral"
            variant="outline"
            size="md"
            label="Isi Sama Rata"
            @click="fillSameRataAction"
          />
          <UButton
            v-if="!isLocked && !isLoading"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            size="md"
            label="Atur Ulang"
            @click="resetAction"
          />
        </div>
      </template>

      <!-- Monthly Target Nested Table using Nuxt UI -->
      <div class="overflow-x-auto">
        <!-- Warning Alert for Invalid Allocation -->
        <UAlert
          v-if="!isLocked && totalFormAllocated !== annualTarget"
          icon="i-lucide-alert-triangle"
          class="mb-4"
          color="error"
          variant="soft"
          title="Alokasi Belum Valid"
          description="Total alokasi target per bulan harus sama persis dengan Target Revenue Tahunan (100%) sebelum dapat dikunci."
        />
        <UTable
          :data="tableRows"
          :loading="isLoading"
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
                :disabled="isLocked || isLoading"
                placeholder="0"
                size="lg"
                class="w-full"
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

          <!-- Custom Actual Revenue Cell -->
          <template #actualRevenue-cell="{ row }">
            <template v-if="row.original.type === 'month'">
              <span class="text-neutral-900 font-medium">Rp. {{ formatIDR(row.original.actualRevenue ?? 0) }}</span>
            </template>
          </template>

          <!-- Custom Progress Cell -->
          <template #progress-cell="{ row }">
            <template v-if="row.original.type === 'month'">
              <span :class="[(row.original.progress ?? 0) >= 100 ? 'text-success font-semibold' : 'text-error font-medium']">
                {{ (row.original.progress ?? 0).toFixed(1).replace('.', ',') }}%
              </span>
            </template>
          </template>

          <!-- Custom YoY Change Cell -->
          <template #yoy-cell="{ row }">
            <template v-if="row.original.type === 'month'">
              <span
                v-if="row.original.yoy !== undefined && row.original.yoy !== null"
                :class="[(row.original.yoy ?? 0) > 0 ? 'text-emerald-600' : ((row.original.yoy ?? 0) < 0 ? 'text-error' : 'text-neutral-500')]"
                class="whitespace-nowrap"
              >
                {{ (row.original.yoy ?? 0) > 0 ? '+' : '' }}{{ (row.original.yoy ?? 0).toFixed(1).replace('.', ',') }}%
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
        to="/target-revenue/log"
        icon="i-lucide-history"
        color="neutral"
        variant="ghost"
        size="md"
        label="Riwayat Perubahan"
        class="cursor-pointer truncate"
      />

      <!-- Primary Action triggers -->
      <div class="flex items-center gap-3 w-full sm:w-auto" :class="isLoading ? 'hidden' : 'block'">
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
            :disabled="totalFormAllocated !== annualTarget"
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
import { ref, computed, watch, onMounted } from 'vue'
import { formatIDR, parseIDR, formatDateTime } from '~/utils/format'
import { targetRevenueService } from '~/services/target-revenue'
import AllocationDonutChart from '~/components/AllocationDonutChart.vue'

// Set page metadata to use default sidebar layout
definePageMeta({
  layout: 'dashboard'
})

const { selectedYear, yearOptions } = useDashboardFilters()

import type { UserReference } from '~/types/target-revenue'

const annualTarget = ref(0)
const distributionMethod = ref<'same_rata' | 'manual'>('manual')
const updatedAt = ref<string | undefined>('')
const updatedBy = ref<UserReference | undefined>()
const isLoading = ref(false)
const toast = useToast()
const prevMonthlyTargets = ref<number[]>(Array(12).fill(0))

// Handle Year Change
const handleYearChange = async (year: string) => {
  selectedYear.value = year
  isLoading.value = true
  await fetchTarget()
  await fetchTotalAllocated()
  isLoading.value = false
}

const fetchTarget = async () => {
  const currentYear = Number(selectedYear.value)
  const [res, prevRes] = await Promise.all([
    targetRevenueService.getTarget(currentYear),
    targetRevenueService.getTarget(currentYear - 1)
  ])

  if (prevRes?.success && prevRes.data) {
    const pd = prevRes.data
    prevMonthlyTargets.value = [
      pd.jan, pd.feb, pd.mar, pd.apr, pd.may, pd.jun,
      pd.jul, pd.aug, pd.sep, pd.oct, pd.nov, pd.dec
    ]
  } else {
    prevMonthlyTargets.value = Array(12).fill(0)
  }

  if (res?.success && res.data) {
    const data = res.data
    annualTarget.value = data.yearlyTarget
    monthlyTargets.value[0]!.value = data.jan
    monthlyTargets.value[1]!.value = data.feb
    monthlyTargets.value[2]!.value = data.mar
    monthlyTargets.value[3]!.value = data.apr
    monthlyTargets.value[4]!.value = data.may
    monthlyTargets.value[5]!.value = data.jun
    monthlyTargets.value[6]!.value = data.jul
    monthlyTargets.value[7]!.value = data.aug
    monthlyTargets.value[8]!.value = data.sep
    monthlyTargets.value[9]!.value = data.oct
    monthlyTargets.value[10]!.value = data.nov
    monthlyTargets.value[11]!.value = data.dec
    isLocked.value = data.isLocked
    updatedAt.value = data.updatedAt
    updatedBy.value = data.updatedBy ?? undefined
  } else {
    // Reset to 0 if no data found
    annualTarget.value = 0
    distributionMethod.value = 'manual'
    monthlyTargets.value.forEach((month) => {
      month.value = 0
    })
    isLocked.value = false
    updatedAt.value = undefined
    updatedBy.value = undefined
  }
}

// Monthly Target definitions with localized names
interface MonthTarget {
  name: string
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  value: number
  yoy: number | null
}

const monthlyTargets = ref<MonthTarget[]>([
  { name: 'Januari', quarter: 'Q1', value: 0, yoy: null },
  { name: 'Februari', quarter: 'Q1', value: 0, yoy: null },
  { name: 'Maret', quarter: 'Q1', value: 0, yoy: null },
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

const isQuarterExpanded = ref<Record<string, boolean>>({
  Q1: true,
  Q2: true,
  Q3: true,
  Q4: true
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
  actualRevenue?: number
  progress?: number
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
          const actual = actualMonthlyRevenues.value[idx + 1] || 0
          const progress = month.value > 0 ? (actual / month.value) * 100 : 0
          const prevValue = prevMonthlyTargets.value[idx] || 0
          const diff = month.value - prevValue
          const pct = prevValue > 0 ? (diff / prevValue) * 100 : (month.value > 0 ? 100 : null)

          rows.push({
            type: 'month',
            id: `${q}-${month.name}`,
            name: month.name,
            quarter: month.quarter,
            idx,
            value: month.value,
            yoy: pct,
            actualRevenue: actual,
            progress: progress
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
            return 'py-3 px-6 font-medium text-neutral-700 text-sm bg-neutral-50/50 hover:bg-neutral-50/80 transition-colors cursor-pointer select-none align-middle border-b border-neutral-100'
          }
          return 'py-2 px-6 pl-12 font-medium text-neutral-800 align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return '6'
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
          return 'py-2 px-6 align-middle border-b-0'
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
        th: 'py-3 px-6 w-[250px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return 'hidden'
          }
          return 'py-2 px-6 font-medium text-neutral-700 align-middle border-b-0'
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
    header: 'Pertumbuhan Target',
    meta: {
      class: {
        th: 'py-3 px-6  w-[300px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') {
            return 'hidden'
          }
          return 'py-2 px-6 font-semibold align-middle border-b-0'
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
    accessorKey: 'actualRevenue',
    header: 'Revenue Bulanan (Rp)',
    meta: {
      class: {
        th: 'py-3 px-6 w-[200px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') return 'hidden'
          return 'py-2 px-6 align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') return '0'
          return '1'
        }
      }
    }
  },
  {
    accessorKey: 'progress',
    header: 'Progress (%)',
    meta: {
      class: {
        th: 'py-3 px-6 w-[150px] bg-neutral-50 text-sm font-medium text-neutral-700 border-b border-neutral-200 select-none',
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') return 'hidden'
          return 'py-2 px-6 align-middle border-b-0'
        }
      },
      colspan: {
        td: (cell: any) => {
          if (cell.row.original.type === 'quarter') return '0'
          return '1'
        }
      }
    }
  }
]

// Compute allocations
const totalFormAllocated = computed(() => {
  return monthlyTargets.value.reduce((sum, item) => sum + item.value, 0)
})

const totalAllocated = ref(0)
const actualMonthlyRevenues = ref<Record<number, number>>({})

const fetchTotalAllocated = async () => {
  const res = await targetRevenueService.getRevenue(Number(selectedYear.value))
  if (res?.success) {
    totalAllocated.value = res.data.total
    const revenues: Record<number, number> = {}
    res.data.details.forEach(d => {
      revenues[d.month] = d.total
    })
    actualMonthlyRevenues.value = revenues
  }
}

onMounted(async () => {
  isLoading.value = true
  await fetchTarget()
  await fetchTotalAllocated()
  isLoading.value = false
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

const buildPayload = (locked: boolean, reason?: string) => ({
  year: Number(selectedYear.value),
  yearly_target: annualTarget.value,
  jan: monthlyTargets.value[0]?.value || 0,
  feb: monthlyTargets.value[1]?.value || 0,
  mar: monthlyTargets.value[2]?.value || 0,
  apr: monthlyTargets.value[3]?.value || 0,
  may: monthlyTargets.value[4]?.value || 0,
  jun: monthlyTargets.value[5]?.value || 0,
  jul: monthlyTargets.value[6]?.value || 0,
  aug: monthlyTargets.value[7]?.value || 0,
  sep: monthlyTargets.value[8]?.value || 0,
  oct: monthlyTargets.value[9]?.value || 0,
  nov: monthlyTargets.value[10]?.value || 0,
  dec: monthlyTargets.value[11]?.value || 0,
  is_locked: locked,
  reason: reason
})

const saveDraft = async () => {
  const payload = buildPayload(false)
  await targetRevenueService.saveTarget(Number(selectedYear.value), payload)
  toast.add({
    title: 'Draf berhasil disimpan!',
    color: 'primary',
    icon: 'i-lucide-check-circle'
  })
  await fetchTarget()
}

const lockTarget = () => {
  if (totalFormAllocated.value !== annualTarget.value) {
    toast.add({ 
      title: 'Gagal mengunci target.', 
      description: 'Total alokasi harus persis 100% dari Target Revenue Tahunan.', 
      color: 'error', 
      icon: 'i-lucide-alert-circle' 
    })
    return
  }
  isLockModalOpen.value = true
}

const confirmLock = async () => {
  const payload = buildPayload(true)
  await targetRevenueService.saveTarget(Number(selectedYear.value), payload)
  isLocked.value = true
  toast.add({
    title: 'Target Revenue berhasil dikunci!',
    color: 'primary',
    icon: 'i-lucide-lock'
  })
  await fetchTarget()
}

const confirmUnlock = async (reason: string) => {
  // Pass reason for logging purpose
  const payload = buildPayload(false, reason)
  await targetRevenueService.saveTarget(Number(selectedYear.value), payload)
  isLocked.value = false
  toast.add({
    title: 'Target Revenue dibuka kunci untuk diedit.',
    color: 'primary',
    icon: 'i-lucide-unlock'
  })
  await fetchTarget()
}
</script>
