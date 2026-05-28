<script setup lang="ts">
import { ref } from 'vue'

// Modal open state bound as a model
const open = defineModel<boolean>({ default: false })
const reason = ref('')

const emit = defineEmits<{
  (e: 'confirm', reason: string): void
}>()

const handleConfirm = () => {
  emit('confirm', reason.value)
  reason.value = ''
  open.value = false
}

const handleClose = () => {
  reason.value = ''
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'sm:max-w-md', overlay: 'bg-black/40' }">
    <template #content>
      <UCard :ui="{ body: 'flex flex-col gap-2 relative' }">
        <!-- Header -->
        <div class="flex items-start justify-between select-none">
          <h3 class="text-lg font-bold text-neutral-900 leading-none">
            Ubah Target
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            class="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 p-1 rounded-md shrink-0 cursor-pointer -mt-1"
            @click="handleClose"
            aria-label="Close"
          />
        </div>

        <!-- Description text -->
        <p class="text-sm text-neutral-600 leading-relaxed">
          Anda akan membuka kunci Target Revenue tahunan ini. Silakan isi alasan di bawah ini untuk melanjutkan.
        </p>

        <!-- Reason Input Area -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-neutral-900">
            Alasan
          </label>
          <textarea
            v-model="reason"
            placeholder="Isi alasan disini"
            class="w-full border border-neutral-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-24 text-neutral-800 shadow-xs"
          ></textarea>
        </div>

        <!-- Action triggers aligned to the bottom-right -->
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="subtle"
            size="md"
            label="Batal"
            @click="handleClose"
          />
          <UButton
            color="success"
            size="md"
            label="Ubah"
            :disabled="!reason.trim()"
            @click="handleConfirm"
          />
        </div>
      </UCard>
    </template>
  </UModal>
</template>
