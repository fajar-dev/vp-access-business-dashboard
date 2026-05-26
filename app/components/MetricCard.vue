<script setup lang="ts">
interface Props {
  title: string
  value: string
  subtext?: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  trendColor?: 'primary' | 'error' | 'neutral'
  icon?: string
  iconColor?: string
}

withDefaults(defineProps<Props>(), {
  trendDirection: 'up',
  iconColor: 'text-primary'
})
</script>

<template>
  <UCard 
    class="h-full border border-neutral-100 transition-all hover:shadow-sm flex flex-col"
    :ui="{ body: 'flex-1 flex flex-col' }"
  >
    <div class="flex flex-col justify-between h-full flex-1 gap-4">
      <!-- Card Header -->
      <div class="flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <UIcon
            v-if="icon"
            :name="icon"
            class="w-5 h-5"
            :class="iconColor"
          />
          <span class="text-sm text-neutral-600">
            {{ title }}
          </span>
        </div>

        <!-- Trend Badge -->
        <UBadge
          v-if="trend"
          :color="trendColor || (trendDirection === 'down' ? 'error' : 'primary')"
          variant="subtle"
          size="sm"
          class="rounded-full font-medium"
        >
          <template #leading>
            <UIcon
              v-if="trendDirection === 'up'"
              name="i-lucide-arrow-up"
              class="w-3 h-3"
              :class="(trendColor === 'error') ? 'text-red-danger' : 'text-primary'"
            />
            <UIcon
              v-else-if="trendDirection === 'down'"
              name="i-lucide-arrow-down"
              class="w-3 h-3 text-red-danger"
            />
          </template>
          {{ trend }}
        </UBadge>
      </div>

      <!-- Card Content -->
      <div class="flex-1 flex flex-col justify-between min-h-[68px]">
        <div class="text-4xl font-semibold tracking-tight text-neutral-900">
          {{ value }}
        </div>
        <p v-if="subtext" class="text-sm text-neutral-500">
          {{ subtext }}
        </p>
      </div>

      <!-- Slots for breakdowns / lists (optional) -->
      <div v-if="$slots.details" class="pt-3 border-t border-neutral-100 shrink-0">
        <slot name="details" />
      </div>
    </div>
  </UCard>
</template>
