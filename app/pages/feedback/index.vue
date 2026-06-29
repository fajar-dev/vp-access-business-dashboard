<template>
  <div class="space-y-4">
    <!-- Header -->
    <Header
      title="Feedback"
      description="Riwayat feedback saya"
    />

    <!-- Search & Per Page Controls -->
    <div class="flex flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Cari.."
          class="w-64"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-neutral-600">Per halaman:</span>
        <USelect
          v-model="perPage"
          :items="perPageOptions"
          class="w-20"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <UTable
        :columns="columns"
        :data="paginatedData"
        :loading="isLoading"
        class="w-full text-left text-sm text-neutral-900 min-w-[700px] border border-neutral-200 rounded-lg bg-white"
      >
        <!-- Date Cell -->
        <template #timestamp-cell="{ row }: any">
          <span class="font-medium text-neutral-600">
            {{ formatDate(row.original.timestamp) }}
          </span>
        </template>

        <!-- URL Cell -->
        <template #url-cell="{ row }: any">
          <span class="font-medium text-neutral-900 truncate block max-w-[180px]" :title="row.original.url">
            {{ row.original.url || '-' }}
          </span>
        </template>

        <!-- Description Cell -->
        <template #message-cell="{ row }: any">
          <div class="flex flex-col py-1">
            <div class="text-md font-semibold text-primary-900">{{ row.original.category }}</div>
            <span class="text-neutral-600 whitespace-pre-wrap">{{ row.original.message }}</span>
          </div>
        </template>

        <!-- Attachment Cell -->
        <template #images-cell="{ row }: any">
          <div v-if="row.original.images?.length" class="flex flex-wrap gap-1.5 py-1">
            <NuxtImg
              v-for="(img, idx) in row.original.images"
              :key="idx"
              :src="img"
              alt="Screenshot"
              class="w-16 h-10 object-cover rounded border border-neutral-200 cursor-pointer hover:border-neutral-400 transition-colors shadow-2xs shrink-0"
              @click.stop="openLightbox(img)"
            />
          </div>
          <span v-else class="text-neutral-400 text-sm">-</span>
        </template>

        <!-- Reply Cell -->
        <template #reply-cell="{ row }: any">
          <div class="flex flex-col py-1">
            <span class="text-neutral-600 whitespace-pre-wrap">{{ row.original.reply || '-' }}</span>
          </div>
        </template>
      </UTable>
    </div>

    <!-- Pagination Footer -->
    <div class="flex items-center justify-between text-sm text-neutral-600">
      <span v-if="meta.total > 0">
        Menampilkan {{ meta.from }}-{{ meta.to }} dari {{ meta.total }}
      </span>
      <span v-else class="text-neutral-400 italic">Tidak ada data</span>

      <UPagination
        v-if="totalPages > 1"
        v-model="page"
        :total="meta.total"
        :items-per-page="Number(perPage)"
      />
    </div>

    <!-- Lightbox Modal -->
    <Lightbox />
  </div>
</template>

<script setup lang="ts">
import { feedbackService } from '~/services/feedback-service'
import type { FeedbackItem } from '~/types/feedback'

definePageMeta({
  layout: 'dashboard'
})

// Table controls state
const search = ref('')
const perPage = ref('10')
const page = ref(1)
const perPageOptions = ['5', '10', '25', '50']

const feedbacks = ref<FeedbackItem[]>([])
const isLoading = ref(false)

const { openLightbox } = useLightbox()

const fetchFeedback = async () => {
  isLoading.value = true
  try {
    const response = await feedbackService.getAll()
    if (response.success && response.data) {
      // Sort feedback by date descending
      feedbacks.value = response.data.sort((a, b) => {
        const timeA = Number(a.timestamp) || 0
        const timeB = Number(b.timestamp) || 0
        return timeB - timeA
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Watch search to reset page
watch(search, () => {
  page.value = 1
})

// Filter and Paginate client-side
const filteredData = computed(() => {
  let result = feedbacks.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(item =>
      item.message.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.url && item.url.toLowerCase().includes(q))
    )
  }
  return result
})

const paginatedData = computed(() => {
  const pp = Number(perPage.value)
  const start = (page.value - 1) * pp
  const end = start + pp
  return filteredData.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / Number(perPage.value))
})

const meta = computed(() => {
  const total = filteredData.value.length
  const pp = Number(perPage.value)
  const from = total > 0 ? (page.value - 1) * pp + 1 : 0
  const to = Math.min(page.value * pp, total)
  return { total, from, to }
})

// Table columns
const columns: any[] = [
  {
    accessorKey: 'timestamp',
    header: 'Tanggal',
    meta: { class: { td: 'w-[140px]' } }
  },
  {
    accessorKey: 'url',
    header: 'URL',
    meta: { class: { td: 'w-[180px] max-w-[180px]' } }
  },
  {
    accessorKey: 'message',
    header: 'Deskripsi',
    meta: { class: { td: 'min-w-[300px]' } }
  },
  {
    accessorKey: 'images',
    header: 'Lampiran',
    meta: { class: { td: 'w-[150px]' } }
  },
  {
    accessorKey: 'reply',
    header: 'Balasan',
    meta: { class: { td: 'min-w-[250px]' } }
  }
]

onMounted(() => {
  fetchFeedback()
})
</script>