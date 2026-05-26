<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)



// Close mobile sidebar when switching pages
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <div class="flex h-screen w-full font-sans text-neutral-900 overflow-hidden">
    
    <!-- 1. Sidebar Left (Desktop) -->
    <div class="hidden lg:block h-full">
      <Sidebar />
    </div>

    <!-- 2. Mobile Sidebar Overlay Drawer -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 lg:hidden">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs transition-opacity duration-300"
        @click="isMobileMenuOpen = false"
      />
      
      <!-- Drawer Sidebar Panel -->
      <div class="fixed inset-y-0 left-0 w-68 z-50 transform transition-transform duration-300 translate-x-0 h-full">
        <!-- Close overlay button inside sidebar header -->
        <div class="absolute top-4 right-0 z-50">
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="text-neutral-600 hover:text-neutral-800"
            @click="isMobileMenuOpen = false"
            aria-label="Close sidebar"
          />
        </div>
        <Sidebar class="h-full" />
      </div>
    </div>

    <!-- 3. Main Dashboard Content (Right) -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Top Mobile Navigation Bar -->
      <header class="flex items-center justify-between px-4 py-3 lg:hidden bg-white border-b border-neutral-200 shrink-0">
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
        <UPopover>
          <UAvatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Ali Putera"
            size="sm"
            class="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
          />

          <template #content>
            <div class="p-4 w-56 space-y-3 select-none">
              <div class="flex items-center gap-3">
                <UAvatar
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Ali Putera"
                  size="md"
                  class="ring-2 ring-primary/10 shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <h2 class="text-sm font-medium truncate">
                    Ali Putera
                  </h2>
                  <p class="text-xs text-neutral-600 truncate">
                    aliputera@nusa.net.id
                  </p>
                </div>
              </div>
              <div class="pt-3 border-t border-neutral-200">
                <UButton
                  color="error"
                  variant="ghost"
                  icon="i-lucide-log-out"
                  class="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  size="md"
                >
                  Logout
                </UButton>
              </div>
            </div>
          </template>
        </UPopover>
      </header>

      <!-- Scrollable content area -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
