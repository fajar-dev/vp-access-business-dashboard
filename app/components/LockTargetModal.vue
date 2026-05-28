<script setup lang="ts">
// Modal open state bound as a model
const open = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const handleConfirm = () => {
  emit('confirm')
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" :ui="{ content: 'sm:max-w-md', overlay: 'bg-black/40' }">
    <template #content>
      <UCard :ui="{ body: 'flex flex-col relative' }">
        <!-- Header -->
        <div class="flex items-start justify-between select-none">
          <h3 class="text-lg font-bold text-neutral-900 leading-none">
            Kunci Target
          </h3>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="open = false"
            aria-label="Close"
          />
        </div>

        <!-- Description text -->
        <p class="text-sm text-neutral-600 leading-relaxed">
          Apakah anda yakin untuk mengunci Target Revenue tahunan ini?
        </p>

        <!-- Action triggers aligned to the bottom-right -->
        <div class="flex justify-end gap-3">
          <UButton
            color="neutral"
            variant="subtle"
            size="md"
            label="Batal"
            @click="open = false"
          />
          <UButton
            color="success"
            size="md"
            label="Ya, Kunci"
            @click="handleConfirm"
          />
        </div>
      </UCard>
    </template>
  </UModal>
</template>
