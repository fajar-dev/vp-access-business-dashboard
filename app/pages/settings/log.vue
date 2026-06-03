<template>
  <div class="space-y-4">
    <!-- 1. Header Section -->
     <Header
      title="Riwayat Perubahan"
      description="Log semua perubahan yang dilakukan pada Target Revenue"
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
    </div>

    <div class="overflow-x-auto">
      <UTable
        :columns="columns"
        :data="logData"
        :loading="isLoading"
        :meta="{
          class: {
            tr: (row: any) => row.original.type === 'month' ? 'border-b-0 border-transparent' : 'border-b border-neutral-100'
          }
        }"
        class="w-full text-left text-sm text-neutral-800 min-w-[700px] border border-neutral-200 rounded-lg bg-white"
      >
        <!-- Custom Date Formats -->
        <template #createdAt-cell="{ row }: any">
          {{ formatDateTime(row.original.createdAt) }}
        </template>
        
        <template #updatedAt-cell="{ row }: any">
          <span v-if="row.original.updatedAt">{{ formatDateTime(row.original.updatedAt) }}</span>
          <span v-else class="text-neutral-400 italic">Belum Dikunci</span>
        </template>

        <template #createdByName-cell="{ row }: any">
          <span v-if="row.original.createdByName">{{ row.original.createdByName }}</span>
          <span v-else class="text-neutral-400 italic">-</span>
        </template>
        
        <template #updatedByName-cell="{ row }: any">
          <span v-if="row.original.updatedByName">{{ row.original.updatedByName }}</span>
          <span v-else class="text-neutral-400 italic">-</span>
        </template>

        <!-- Reason styling -->
        <template #reason-cell="{ row }: any">
          <UBadge v-if="row.original.reason === 'Initial Lock'" color="primary" variant="subtle">Initial Lock</UBadge>
          <span v-else-if="row.original.reason" class="text-neutral-900 font-medium">{{ row.original.reason }}</span>
          <span v-else class="text-neutral-400 italic">-</span>
        </template>

        <!-- Expand Toggle -->
        <template #expand-cell="{ row }: any">
          <UButton
            color="neutral"
            variant="ghost"
            :icon="row.getIsExpanded() ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
            @click="row.toggleExpanded()"
          />
        </template>

        <!-- Expanded Row Detail -->
        <template #expanded="{ row }: any">
          <div class="p-4 bg-neutral-50/50 border-t border-neutral-100">
            <div class="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <table class="w-full text-sm text-left">
                <thead class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-medium">
                  <tr>
                    <th class="px-4 py-3 w-[200px]">Periode</th>
                    <th class="px-4 py-3">Target Lama</th>
                    <th class="px-4 py-3">Target Baru</th>
                    <th class="px-4 py-3">Selisih Pertumbuhan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="item in buildComparisonRows(row.original.oldValue, row.original.newValue)" 
                    :key="item.label"
                    :class="[item.isTotal ? 'bg-primary-50/30 font-semibold border-b-2 border-primary-100' : 'border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 transition-colors']"
                  >
                    <td class="px-4 py-2" :class="item.isTotal ? 'text-neutral-900' : 'text-neutral-600'">{{ item.label }}</td>
                    <td class="px-4 py-2">
                      <span v-if="item.old > 0">Rp. {{ formatIDR(item.old) }}</span>
                      <span v-else class="text-neutral-400">-</span>
                    </td>
                    <td class="px-4 py-2">
                      <span v-if="item.new > 0">Rp. {{ formatIDR(item.new) }}</span>
                      <span v-else class="text-neutral-400">-</span>
                    </td>
                    <td class="px-4 py-2">
                      <div class="flex items-center gap-2" v-if="item.diff !== 0">
                        <span :class="item.diff > 0 ? 'text-success' : 'text-error'" class="font-medium">
                          {{ item.diff > 0 ? '+' : '' }}Rp. {{ formatIDR(item.diff) }}
                        </span>
                        <UBadge :color="item.diff > 0 ? 'success' : 'error'" variant="subtle" size="sm">
                          {{ item.diff > 0 ? '+' : '' }}{{ item.pct.toFixed(1).replace('.', ',') }}%
                        </UBadge>
                      </div>
                      <span v-else class="text-neutral-400">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { settingService } from '~/services/setting-service'
import type { TargetLogResponse } from '~/types/setting'

definePageMeta({
  layout: 'dashboard'
})

// UI States
const isLoading = ref(true)
const logData = ref<TargetLogResponse[]>([])

const { selectedYear, yearOptions } = useDashboardFilters()

const handleYearChange = async (year: string) => {
  selectedYear.value = year
  await fetchLogs()
}

// Table Columns
const columns: any[] = [
  { accessorKey: 'expand', header: '' },
  { accessorKey: 'createdAt', header: 'Waktu Dibuat', meta: { sortable: true } },
  { accessorKey: 'createdByName', header: 'Dibuat Oleh' },
  { accessorKey: 'year', header: 'Tahun Target' },
  { accessorKey: 'reason', header: 'Aksi / Alasan' },
  { accessorKey: 'updatedAt', header: 'Waktu Dikunci', meta: { sortable: true } },
  { accessorKey: 'updatedByName', header: 'Dikunci Oleh' },
]

// Helpers
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const buildComparisonRows = (oldVal: any, newVal: any) => {
  const labels = [
    { key: 'yearlyTarget', label: 'Target Tahunan' },
    { key: 'jan', label: 'Januari' },
    { key: 'feb', label: 'Februari' },
    { key: 'mar', label: 'Maret' },
    { key: 'apr', label: 'April' },
    { key: 'may', label: 'Mei' },
    { key: 'jun', label: 'Juni' },
    { key: 'jul', label: 'Juli' },
    { key: 'aug', label: 'Agustus' },
    { key: 'sep', label: 'September' },
    { key: 'oct', label: 'Oktober' },
    { key: 'nov', label: 'November' },
    { key: 'dec', label: 'Desember' }
  ]

  return labels.map(item => {
    const o = (oldVal && oldVal[item.key]) || 0
    const n = (newVal && newVal[item.key]) || 0
    const diff = n - o
    const pct = o > 0 ? (diff / o) * 100 : (n > 0 ? 100 : 0)
    return {
      label: item.label,
      isTotal: item.key === 'yearlyTarget',
      old: o,
      new: n,
      diff,
      pct
    }
  })
}

// Fetch logs
const fetchLogs = async () => {
  isLoading.value = true
  const res = await settingService.getTargetLog(Number(selectedYear.value))
  if (res?.success) {
    logData.value = res.data
  }
  isLoading.value = false
}

onMounted(() => {
  fetchLogs()
})
</script>
