<template>
  <div class="relative h-full shrink-0">
    <aside
      class="flex flex-col h-full bg-white border-r border-neutral-200 shrink-0 justify-between select-none transition-all duration-300"
      :class="[isCollapsed ? 'w-20 p-3' : 'w-68 p-4']"
    >
      <!-- Top Section -->
      <div class="space-y-4">
        <!-- App/Brand Logo Header -->
        <div 
          class="flex border-b border-neutral-200 pb-4" 
          :class="[isCollapsed ? 'justify-center' : 'items-center justify-between']"
        >
          <BrandLogo :is-collapsed="isCollapsed" />

          <!-- Inline Toggle Button (visible only when expanded) -->
          <UButton
            v-if="!isCollapsed"
            color="neutral"
            variant="ghost"
            icon="i-lucide-panel-left-close"
            class="hidden lg:inline-flex text-neutral-400 hover:text-neutral-700"
            @click="isCollapsed = true"
            aria-label="Collapse sidebar"
          />
        </div>

      <!-- User Profile Card -->
      <div class="flex pb-3" :class="[isCollapsed ? 'justify-center' : 'items-center gap-3']">
        <UTooltip
          :text="authState.user?.name || 'User'"
          :disabled="!isCollapsed"
          :content="{ align: 'center', side: 'right', sideOffset: 8 }"
        >
          <UAvatar
            :src="authState.user?.photo"
            :alt="authState.user?.name"
            size="md"
            class="ring-2 ring-primary/10 shrink-0"
          />
        </UTooltip>
        <div v-if="!isCollapsed" class="min-w-0 flex-1">
          <h2 class="text-sm font-medium truncate">
            {{ authState.user?.name }}
          </h2>
          <p class="text-xs text-neutral-600 truncate">
            {{ authState.user?.email }}
          </p>
        </div>
      </div>

      <!-- Navigation Menus -->
      <nav class="space-y-4">
        <div v-for="group in navGroups" :key="group.title" class="space-y-2">
          <!-- Group Title -->
          <h3
            v-if="!isCollapsed"
            class="px-1 text-sm font-medium text-neutral-600"
          >
            {{ group.title }}
          </h3>

          <!-- Group Items -->
          <div class="space-y-1">
            <template v-for="item in group.items" :key="item.label">
              <!-- Reusable NavLink with tooltip -->
              <UTooltip
                :text="item.label"
                :disabled="!isCollapsed"
                :content="{ align: 'center', side: 'right', sideOffset: 8 }"
              >
                <NuxtLink
                  :to="item.to"
                  class="flex items-center transition-colors group"
                  :class="[
                    isCollapsed ? 'w-10 h-10 mx-auto justify-center rounded-lg' : 'w-full gap-3 px-3 py-2 text-sm rounded-lg',
                    isItemActive(item)
                      ? 'bg-primary text-white'
                      : 'text-neutral-800 hover:bg-neutral-50 hover:text-neutral-900'
                  ]"
                >
                  <UIcon
                    :name="item.icon"
                    class="w-5 h-5 shrink-0 transition-colors"
                    :class="[
                      isItemActive(item)
                        ? 'text-white'
                        : 'text-neutral-600 group-hover:text-neutral-900'
                    ]"
                  />
                  <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
                </NuxtLink>
              </UTooltip>
            </template>
          </div>
        </div>
      </nav>
    </div>

    <!-- Bottom Section (Actions & Logout) -->
    <div class="pt-4 border-t border-neutral-200 space-y-1">
      <!-- Download Button with conditional tooltip wrapper -->
      <UTooltip
        text="Feedback"
        :disabled="!isCollapsed"
        :content="{ align: 'center', side: 'right', sideOffset: 8 }"
      >
        <button
          type="button"
          class="flex items-center transition-colors group cursor-pointer text-left w-full focus:outline-none"
          :class="[
            isCollapsed ? 'w-10 h-10 mx-auto justify-center rounded-md' : 'w-full gap-3 px-3 py-2 text-sm rounded-md font-medium',
            'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900',
            isCapturing ? 'opacity-60 cursor-not-allowed' : ''
          ]"
          :disabled="isCapturing"
          @click="triggerFeedback()"
        >
          <UIcon
            :name="isCapturing ? 'i-lucide-loader-2' : 'i-lucide-message-square-warning'"
            class="w-5 h-5 shrink-0 transition-colors"
          />
          <span v-if="!isCollapsed" class="truncate">
            {{ isCapturing ? 'Capturing' : 'Feedback' }}
          </span>
        </button>
      </UTooltip>
      <UTooltip
        text="Download as PDF"
        :disabled="!isCollapsed"
        :content="{ align: 'center', side: 'right', sideOffset: 8 }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-download"
          class="w-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer"
          :class="[isCollapsed ? 'text-sm flex justify-center p-2.5 rounded-lg' : 'justify-start text-sm px-3']"
          aria-label="Download as PDF"
          @click="isModalOpen = true"
        >
          <span v-if="!isCollapsed">Download as PDF</span>
        </UButton>
      </UTooltip>

      <!-- Logout Button with tooltip -->
      <UTooltip
        text="Logout"
        :disabled="!isCollapsed"
        :content="{ align: 'center', side: 'right', sideOffset: 8 }"
      >
        <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-log-out"
          class="w-full text-red-400 hover:bg-red-50 cursor-pointer"
          :class="[isCollapsed ? 'text-sm flex justify-center p-2.5 rounded-lg' : 'justify-start text-sm px-3']"
          aria-label="Logout"
          @click="handleLogout"
        >
          <span v-if="!isCollapsed">Logout</span>
        </UButton>
      </UTooltip>
    </div>
    </aside>

    <!-- Floating Toggle Sidebar Button on the Border (visible only when collapsed) -->
    <UTooltip
      text="Expand sidebar"
      :content="{ align: 'center', side: 'right', sideOffset: 8 }"
    >
      <button
        v-if="isCollapsed"
        class="hidden lg:flex absolute top-4.5 -right-3 z-30 w-7 h-7 rounded-full border border-neutral-200 bg-white shadow-sm items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-all cursor-pointer focus:outline-none"
        @click="isCollapsed = false"
        aria-label="Expand sidebar"
      >
        <UIcon
          name="i-lucide-panel-left-open"
          class="w-4 h-4"
        />
      </button>
    </UTooltip>

    <!-- Download Period Selection Modal -->
    <DownloadModal v-model="isModalOpen" />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useRoute } from 'vue-router'
import { useFeedback } from '~/composables/useFeedback'

const { triggerFeedback, isCapturing } = useFeedback()

const { state: authState, service: authService } = useAuth()
const toast = useToast()
const route = useRoute()

// Shared sidebar collapse state
const isCollapsed = useState('sidebar-collapsed', () => false)
const isModalOpen = ref(false)

const handleLogout = async () => {
  await authService.logout()
  toast.add({
    title: 'Logout success',
    icon: 'i-lucide-circle-check',
    color: 'success'
  })
}

// Define navigation structures
interface NavItem {
  label: string
  to: string
  icon: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    items: [
      {
        label: 'Growth',
        to: '/growth/lagging-indicator', // Main growth landing page
        icon: 'i-lucide-sprout'
      },
      {
        label: 'Retention',
        to: '/retention',
        icon: 'i-lucide-hand'
      },
      {
        label: 'Service Quality',
        to: '/service-quality',
        icon: 'i-lucide-star'
      }
    ]
  },
  {
    title: 'Pengaturan',
    items: [
      {
        label: 'Target Revenue',
        to: '/target-revenue',
        icon: 'i-lucide-target'
      }
    ]
  }
]

// Helper to determine if a route is active
// Active highlighting remains for both indicator sub-pages
const isItemActive = (item: NavItem) => {
  if (item.label === 'Growth') {
    return route.path.startsWith('/growth')
  }
  if (item.label === 'Retention') {
    return route.path.startsWith('/retention')
  }
  if (item.label === 'Service Quality') {
    return route.path.startsWith('/service-quality')
  }
  if (item.label === 'Target Revenue') {
    return route.path.startsWith('/target-revenue')
  }
  return route.path === item.to
}
</script>
