<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-4 shrink-0 select-none">
    <!-- Top Row: Page Title & Description -->
    <div class="flex flex-col gap-1">
      <h2 class="text-sml md:text-2xl font-bold text-neutral-900 tracking-tight">
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm md:text-sm text-neutral-500">
        {{ description }}
      </p>
    </div>

    <!-- Middle Row: Tab links -->
    <div v-if="$slots.tabs" class="border-b border-neutral-200 mt-7">
      <nav class="flex gap-6 -mb-px">
        <slot name="tabs" />
      </nav>
    </div>

    <!-- Bottom Row: Actions selectors placed BELOW the tabs, right-aligned -->
    <div v-if="$slots.actions" class="flex justify-end items-center gap-3 pt-1">
      <slot name="actions" />
    </div>
  </div>
</template>
