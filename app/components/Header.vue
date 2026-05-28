<script setup lang="ts">
const { state: authState, service: authService } = useAuth()
const toast = useToast()

interface Props {
  title: string
  description?: string
}

defineProps<Props>()

// Share mobile sidebar menu open state globally across layout and headers
const isMobileMenuOpen = useState('isMobileMenuOpen', () => false)

const handleLogout = async () => {
  await authService.logout()
  toast.add({
    title: 'Logout success',
    icon: 'i-lucide-circle-check',
    color: 'success'
  })
}
</script>

<template>
  <div class="space-y-4 shrink-0 select-none">
    <!-- Top Mobile Navigation Bar (Visible on mobile viewports only) -->
    <header class="flex items-center justify-between px-4 py-3 lg:hidden bg-white border-b border-neutral-200 shrink-0 -mx-4 -mt-4 mb-4">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          @click="isMobileMenuOpen = true"
          aria-label="Open menu"
        />
        <BrandLogo />
      </div>
      
      <!-- Profile Avatar Popover with Dynamic Active Session Metadata -->
      <UPopover>
        <UAvatar
          :src="authState.user?.photo"
          :alt="authState.user?.name"
          size="sm"
          class="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
        />

        <template #content>
          <div class="p-4 w-56 space-y-3 select-none">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="authState.user?.photo"
                :alt="authState.user?.name"
                size="md"
                class="ring-2 ring-primary/10 shrink-0"
              />
              <div class="min-w-0 flex-1">
                <h2 class="text-sm font-medium truncate text-neutral-900">
                  {{ authState.user?.name }}
                </h2>
                <p class="text-sm text-neutral-600 truncate">
                  {{ authState.user?.email }}
                </p>
              </div>
            </div>
            
            <div class="pt-3 border-t border-neutral-200">
              <UButton
                color="error"
                variant="ghost"
                icon="i-lucide-log-out"
                class="w-full justify-start text-sm px-3 text-red-400  hover:bg-red-50 cursor-pointer"
                size="md"
                @click="handleLogout"
              >
                Logout
              </UButton>
            </div>
          </div>
        </template>
      </UPopover>
    </header>

    <!-- Top Row: Page Title & Description -->
    <div class="flex flex-col gap-1">
      <h2 class="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">
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
