<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-6 shrink-0 select-none">
    <!-- Top Row: Page Title, Description & Action Dropdowns -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
          {{ title }}
        </h2>
        <p v-if="description" class="text-xs md:text-sm text-neutral-500 mt-1">
          {{ description }}
        </p>
      </div>

      <!-- Actions slot (for custom filters, dropdown selectors, buttons) -->
      <div v-if="$slots.actions" class="flex items-center gap-3 shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- Bottom Row: Tab links (visible only when slots are passed) -->
    <div v-if="$slots.tabs" class="border-b border-neutral-200">
      <nav class="flex gap-6 -mb-px">
        <slot name="tabs" />
      </nav>
    </div>
  </div>
</template>
