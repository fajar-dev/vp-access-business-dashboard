<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TicketStats } from '~/types/service-quality'
import { formatPercentage } from '~/utils/format'

const props = defineProps<{
  ticketStats: TicketStats | null
  complaintStats: TicketStats | null
  solvedStats: TicketStats | null
  solvedPercentageStats: TicketStats | null
  isLoading: boolean
}>()

// Radar Chart Normalized Scores & Overall Calculation
const radarScores = computed(() => {
  /*
   CATATAN PERHITUNGAN SKOR RADAR (Skala 0 - 100):
   Agar tampilan hijau pada radar chart semakin meluas ketika performa baik,
   semua nilai mentah (raw) dari endpoint harus dikonversi ke skor 0-100 di mana 100 = Sempurna.
  */

  // 1. Solved Customers: Sudah dalam bentuk persentase, jadi nilainya langsung digunakan.
  const solvedCustomersScore = props.solvedPercentageStats?.value || 0
  
  // 2. Total Solved: Nilainya adalah jumlah numerik. 
  // Kita melonggarkan batas, berasumsi 40 kasus terselesaikan sudah mendapat skor sempurna (100).
  const rawTotalSolved = props.solvedStats?.value || 0
  const totalSolvedScore = Math.min(100, Math.round((rawTotalSolved / 40) * 100))
  
  // 3. Total Komplain: Semakin sedikit komplain, skornya semakin mendekati 100.
  // Untuk memperlunak penalti (agar area hijau tidak langsung habis), nilai mentah dibagi 2.
  const rawComplaint = props.complaintStats?.value || 0
  const complaintScore = Math.max(0, 100 - Math.round(rawComplaint / 2))
  
  // 4. Total Tiket: Sama seperti komplain, semakin sedikit semakin baik (skor 100).
  // Nilai mentah juga dibagi 2 agar pengurangan skor tidak terlalu ekstrem.
  const rawTicket = props.ticketStats?.value || 0
  const ticketScore = Math.max(0, 100 - Math.round(rawTicket / 2))

  return [solvedCustomersScore, totalSolvedScore, complaintScore, ticketScore]
})

const radarSeries = computed(() => [{
  name: 'Performance Score',
  data: radarScores.value
}])

const overallScore = computed(() => {
  const scores = radarScores.value
  if (scores.length === 0) return 0
  const sum = scores.reduce((a, b) => a + b, 0)
  return Math.round(sum / scores.length)
})

const overallBadgeColor = computed(() => {
  const score = overallScore.value
  if (score >= 75) return 'primary'
  if (score >= 50) return 'warning'
  return 'error'
})

const overallBadgeLabel = computed(() => {
  const score = overallScore.value
  if (score >= 75) return 'Baik'
  if (score >= 50) return 'Cukup'
  return 'Perlu Perbaikan'
})

const radarChartOptions = {
  chart: {
    type: 'radar',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Geist, sans-serif'
  },
  colors: ['#009838'], // Brand primary green
  stroke: {
    width: 3,
    colors: ['#009838']
  },
  fill: {
    opacity: 0.45,
    colors: ['#009838'] // Elegant light green area
  },
  markers: {
    size: 5,
    colors: ['#009838'],
    strokeColors: '#ffffff',
    strokeWidth: 2
  },
  xaxis: {
    categories: ['', '', '', ''], // Blank out since we overlay premium HTML custom labels!
    labels: {
      show: false
    }
  },
  yaxis: {
    show: false,
    min: 0,
    max: 100,
    tickAmount: 4
  },
  grid: {
    circular: true
  },
  tooltip: {
    enabled: false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Middle Section: Radar Chart and Insight Panel -->
    <UCard 
      class="border border-neutral-100"
      :ui="{ body: 'p-0 flex flex-col lg:flex-row items-stretch' }"
    >
      
      <!-- Left Area: Interactive Overall Radar Chart (3/4 width) -->
      <div class="lg:w-3/4 md:p-0 md:pr-4 p-4 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-100">
        <!-- Header area of Radar card -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0 z-10">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-semibold text-neutral-900">
                Overall Service Quality
              </h3>
              <UIcon name="i-lucide-info" class="w-4 h-4 text-neutral-400 cursor-help" />
            </div>
            <p class="text-sm text-neutral-500 mt-0.5">
              Performa kualitas layanan secara keseluruhan berdasarkan 4 metric utama
            </p>
          </div>

        </div>

        <!-- Radar Render Area with HTML Absolute Overlays -->
        <div class="relative flex-1 min-h-[380px] w-full flex items-center justify-center my-4 select-none">
          
          <!-- Single large skeleton for the entire chart area -->
          <USkeleton v-if="isLoading" class="w-full h-full min-h-[380px] rounded-xl opacity-50" />

          <template v-else>
            <!-- Outer Radar Chart wrapper -->
            <div class="w-[300px] h-[300px] flex items-center justify-center relative">
              <ClientOnly>
                <apexchart
                  type="radar"
                  width="320"
                  height="320"
                  :options="radarChartOptions"
                  :series="radarSeries"
                />
              </ClientOnly>
            </div>

            <!-- 1. Center circular score badge -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xs w-26 h-26 rounded-full border border-neutral-100 shadow-md flex flex-col items-center justify-center text-center z-20">
              <span class="text-xs text-neutral-500">Overall Score</span>
              <div class="flex flex-col">
                <span class="text-xl font-bold text-primary">{{ overallScore }}</span>
                <span class="text-xs text-neutral-400">/ 100</span>
              </div>
              <UBadge :color="overallBadgeColor" variant="soft" size="xs" class="rounded-full mt-2">
                {{ overallBadgeLabel }}
              </UBadge>
            </div>

            <!-- 2. Top Label (Solved Customers) -->
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 z-10 max-w-[150px]">
              <span class="text-sm font-medium text-neutral-700">Solved Customers</span>
              <span class="text-base font-bold text-primary">
                {{ solvedPercentageStats ? formatPercentage(solvedPercentageStats.value) : '0%' }}
              </span>
              <div class="flex items-center gap-3 bg-primary/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
                <UIcon name="i-lucide-thumbs-up" class="w-8 h-8 text-primary" />
                <span>Semakin tinggi, semakin baik</span>
              </div>
            </div>

            <!-- 3. Right Label (Total Solved) -->
            <div class="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end gap-1 z-10 max-w-[150px]">
              <span class="text-sm font-medium text-neutral-700">Total Solved</span>
              <span class="text-base font-bold text-neutral-900">
                {{ solvedStats ? solvedStats.value : '0' }}
              </span>
              <div class="flex items-center gap-3 bg-primary/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
                <UIcon name="i-lucide-circle-check-big" class="w-8 h-8 text-primary" />
                <span>Semakin tinggi, semakin baik</span>
              </div>
            </div>

            <!-- 4. Bottom Label (Total Komplain Customer) -->
            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-center gap-1 z-10 max-w-[150px]">
              <div class="flex items-center text-start gap-3 bg-error/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
                <UIcon name="i-lucide-arrow-down" class="w-8 h-8 text-error" />
                <span>Semakin rendah, semakin baik</span>
              </div>
              <span class="text-sm font-medium text-neutral-700 mt-1">Total Komplain Customer</span>
              <span class="text-base font-bold text-red-600">
                {{ complaintStats ? complaintStats.value : '0' }}
              </span>
            </div>

            <!-- 5. Left Label (Total Tiket) -->
            <div class="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start gap-1 z-10 max-w-[150px]">
              <span class="text-sm font-medium text-neutral-700">Total Tiket</span>
              <span class="text-base font-bold text-red-600">
                {{ ticketStats ? ticketStats.value : '0' }}
              </span>
              <div class="flex items-center gap-3 bg-error/10 text-neutral-700 text-xs px-2 py-0.5 rounded">
                <UIcon name="i-lucide-arrow-down" class="w-8 h-8 text-error" />
                <span>Semakin rendah, semakin baik</span>
              </div>
            </div>
          </template>

        </div>
      </div>

      <!-- Right Area: Insight Panel & Rating System (1/4 width) -->
      <div class="lg:w-1/4 p-4 flex flex-col gap-6 justify-between select-none">
        <!-- Section 1: Cara Membaca -->
        <div class="space-y-3">
          <h4 class="text-sm font-bold text-neutral-900">
            Cara membaca
          </h4>
          <div class="flex gap-4 items-start">
            <!-- Miniature Radar SVG Indicator -->
            <div class="flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" class="w-19 h-19">
                <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="#e5e7eb" stroke-width="1.5" />
                <polygon points="50,25 75,50 50,75 25,50" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" />
                <circle cx="50" cy="50" r="2" fill="#10b981" />
              </svg>
            </div>
            <p class="text-sm text-neutral-600 leading-relaxed">
              Semakin luas area hijau, semakin baik kualitas layanan secara keseluruhan.
            </p>
          </div>
        </div>

        <!-- Section 2: Skala Penilaian -->
        <div class="space-y-3 pt-5 border-t border-neutral-200/60">
          <h4 class="text-sm font-bold text-neutral-900">
            Skala Penilaian
          </h4>
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
                <span class="text-neutral-700 font-medium">75 - 100</span>
              </div>
              <span class="text-neutral-600">Baik</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm"></span>
                <span class="text-neutral-700 font-medium">50 - 74</span>
              </div>
              <span class="text-neutral-600">Cukup</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm"></span>
                <span class="text-neutral-700 font-medium">0 - 49</span>
              </div>
              <span class="text-neutral-600">Perlu Perbaikan</span>
            </div>
          </div>
        </div>

        <!-- Section 3: Insight -->
        <div class="space-y-2 pt-5 border-t border-neutral-200/60">
          <h4 class="text-sm font-bold text-neutral-900">
            Insight
          </h4>
          <p class="text-sm text-neutral-600 leading-relaxed">
            Performa cukup baik pada solved customers dan total solved. Perlu perhatian pada total komplain customer dan total tiket untuk meningkatkan kualitas layanan.
          </p>
        </div>

      </div>
    </UCard>

    <!-- Bottom Full Width Info Bar -->
    <UAlert
      class="text-neutral-600 border-none"
      icon="i-lucide-info"
      color="info"
      variant="soft"
      title="Nilai pada grafik merupakan skor performa (0-100) yang telah dinormalisasi berdasarkan target dan benchmark."
    />
  </div>
</template>
