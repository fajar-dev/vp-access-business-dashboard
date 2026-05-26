<script setup lang="ts">
withDefaults(
  defineProps<{
    isCollapsed?: boolean
  }>(),
  {
    isCollapsed: false
  }
)
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-white shadow-sm shrink-0">
      <UIcon name="i-lucide-gallery-vertical-end" class="w-5 h-5 text-white" />
    </div>
    <div v-if="!isCollapsed" class="min-w-0">
      <h1 class="text-sm font-medium text-neutral-900 truncate">
        PT Media Antar Nusa
      </h1>
      <p class="text-sm text-neutral-600">
        Executive Dashboard
      </p>
    </div>
  </div>
</template>
