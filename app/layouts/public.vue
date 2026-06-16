<template>
  <div class="flex h-screen w-full font-sans text-neutral-900 overflow-hidden">
    <!-- 3. Main Dashboard Content (Right) -->
    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Scrollable content area -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>