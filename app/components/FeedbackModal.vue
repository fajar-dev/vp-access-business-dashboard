<template>
  <UModal
    v-model:open="open"
    title="Laporkan Masalah"
    description="Berikan informasi detail tentang masalah tersebut."
    :ui="{
      content: 'sm:max-w-md',
      overlay: 'bg-black/40',
      footer: 'justify-between'
    }"
  >
    <template #body>
      <!-- Top Note -->
      <div class="mb-4 space-y-1">
        <p class="text-sm text-neutral-600 leading-relaxed">
          Kami terus meningkatkan sistem informasi agar berjalan dengan baik untuk semua orang. Terima kasih atas masukan Anda.
        </p>
        <div>
          <span class="text-blue-500 font-medium underline text-sm break-all">
            {{ state.url }}
          </span>
        </div>
      </div>

      <!-- Form matching the layout of other modals -->
      <UForm
        id="feedback-form"
        :schema="schema"
        :state="state"
        class="space-y-4 w-full"
        @submit="onSubmit"
      >
        <!-- Type Field -->
        <UFormField label="Tipe" name="type" required>
          <URadioGroup
            v-model="state.type"
            indicator="end"
            variant="card"
            :items="items"
            orientation="horizontal"
            class="w-full"
          />
        </UFormField>

        <!-- Description Field -->
        <UFormField label="Deskripsi" name="description" required>
          <UTextarea
            v-model="state.description"
            placeholder="Jelaskan masalah anda"
            class="w-full"
            :rows="4"
          />
        </UFormField>

        <!-- Attachment Field -->
        <UFormField label="Lampiran" name="images" required>
          <UFileUpload
            v-model="state.images"
            layout="grid"
            multiple
            :interactive="false"
            class="w-full min-h-25"
          >
            <template #actions="{ open: openFileSelect }">
              <UButton
                label="Unggah Gambar"
                icon="i-lucide-upload"
                color="neutral"
                variant="outline"
                :disabled="!canAddMoreImages"
                @click="openFileSelect()"
              />
            </template>

            <template #files-top="{ open: openFileSelect, files }">
              <div v-if="files?.length" class="mb-2 flex items-center justify-between">
                <p class="font-bold text-sm">
                  {{ `Lampiran (${files.length})` }}
                </p>
                <UButton
                  icon="i-lucide-plus"
                  label="Tambah Lampiran"
                  color="neutral"
                  variant="outline"
                  :disabled="!canAddMoreImages"
                  @click="openFileSelect()"
                />
              </div>
            </template>
          </UFileUpload>
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <!-- Action Buttons matching style of other modals -->
      <div class="flex justify-between items-center w-full">
        <UButton
          label="Riwayat"
          color="primary"
          variant="ghost"
          icon="i-lucide-history"
          to="/feedback"
          @click="open = false"
        />
        <div class="flex gap-2">
          <UButton
            label="Batal"
            color="neutral"
            variant="outline"
            :disabled="saving"
            @click="open = false"
          />
          <UButton
            label="Kirim"
            color="primary"
            variant="solid"
            type="submit"
            form="feedback-form"
            :loading="saving"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useFeedback } from '~/composables/useFeedback'
import { feedbackService } from '~/services/feedback-service'

const open = defineModel<boolean>('open', { default: false })

const { screenshotFile, currentUrl } = useFeedback()

const schema = computed(() => z.object({
  type: z.string().min(1, 'Tipe is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.any()).min(1, 'Image is required').max(3, 'Maximum 3 images allowed')
}))

const state = reactive({
  type: 'issue',
  description: '',
  images: [] as File[],
  url: ''
})

const items = computed(() => [
  { value: 'issue', label: 'Keluhan' },
  { value: 'suggestion', label: 'Saran' },
  { value: 'compliment', label: 'Pujian' }
])

const canAddMoreImages = computed(() => {
  return (state.images?.length || 0) < 3
})

const saving = ref(false)
const toast = useToast()

const onSubmit = async () => {
  saving.value = true
  try {
    const payload = {
      message: state.description,
      type: state.type,
      url: state.url,
      images: state.images
    }
    const response = await feedbackService.create(payload)
    if (response.success) {
      toast.add({
        title: 'Masukan berhasil dikirim',
        color: 'success',
        icon: 'i-lucide-circle-check'
      })
      open.value = false
    } 
  } finally {
    saving.value = false
  }
}

// Watch open state to pre-fill screenshot and URL
watch(open, (isOpenVal) => {
  if (isOpenVal) {
    state.url = currentUrl.value
    state.description = ''
    state.type = 'issue'
    if (screenshotFile.value) {
      state.images = [screenshotFile.value]
    } else {
      state.images = []
    }
  } else {
    // Clean up
    state.url = ''
    state.description = ''
    state.images = []
  }
})
</script>