<script setup lang="ts">
import { ref } from 'vue'

// Prevent using the main dashboard layout shell
definePageMeta({
  layout: false
})

// SEO meta configurations for auth flow
useHead({
  title: 'Sign In - VP Access Business Dashboard'
})

// Form state
const employeeId = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)

// Actions simulations
const handleLogin = async () => {
  if (!employeeId.value.trim() || !password.value.trim()) {
    alert('Harap isi ID Karyawan dan Password Anda.')
    return
  }

  isSubmitting.value = true
  
  // Simulate a network authentication latency
  setTimeout(() => {
    isSubmitting.value = false
    alert('Login Berhasil! Selamat datang di VP Access Business Dashboard.')
    navigateTo('/growth/lagging-indicator')
  }, 1200)
}

const handleGoogleLogin = () => {
  isSubmitting.value = true
  
  // Simulate Google authentication delay
  setTimeout(() => {
    isSubmitting.value = false
    alert('Login Google Berhasil!')
    navigateTo('/growth/lagging-indicator')
  }, 1000)
}

const handleForgotPassword = () => {
  alert('Silakan hubungi IT Administrator atau Branch Manager untuk mereset password Anda.')
}
</script>

<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-[#e6f7ec] overflow-hidden font-sans select-none">
    
    <!-- Glowing brand-themed background radial gradients -->
    <div class="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-green-200/40 opacity-50 blur-[120px]"></div>
    <div class="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-green-300/40 opacity-50 blur-[150px]"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white opacity-70 blur-[100px]"></div>
    
    <!-- Low-opacity grid overlay blending into the glowing backgrounds -->
    <div class="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-cover bg-center opacity-[0.06] pointer-events-none"></div>

    <!-- Central Authentication Container -->
    <div class="relative z-10 w-full max-w-[420px] px-4">
      <UCard
        class="w-full rounded-xl"
        :ui="{ 
          body: 'flex flex-col gap-5'
        }"
      >
        <!-- Logo and Header -->
        <div class="flex flex-col items-center text-center gap-4">
          <!-- Perfectly circular logo container mirroring Nusanet style -->
          <div class="w-[60px] h-[60px] rounded-full  border border-neutral-200 flex items-center justify-center p-3">
            <img src="/logo.png" alt="Nusanet Logo" class="w-full h-full object-contain" />
          </div>
          <div class="space-y-1">
            <h1 class="text-md font-bold text-neutral-900 leading-tight tracking-tight">
              VP Access Business Dashboard
            </h1>
            <p class="text-xs text-neutral-600">
              Masukkan ID Karyawan dan Password anda untuk login
            </p>
          </div>
        </div>

        <!-- Form fields and direct triggers -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <!-- ID Karyawan Input Container -->
          <UFormField label="ID Karyawan" class="w-full font-medium text-neutral-800" :ui="{ label: 'text-sm font-medium text-neutral-800 mb-1.5' }">
            <UInput
              id="employeeId"
              v-model="employeeId"
              type="text"
              placeholder="Masukkan ID Karyawan"
              size="lg"
              required
              class="w-full"
            />
          </UFormField>

          <!-- Password Input Container -->
          <UFormField label="Password" class="w-full" :ui="{ label: 'text-sm font-medium text-neutral-800' }">
            <template #hint>
              <a
                href="#"
                class="text-sm font-medium text-green-500 hover:text-green-600 transition-colors"
                @click.prevent="handleForgotPassword"
              >
                Forgot password?
              </a>
            </template>
            <UInput
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Masukkan Password"
              size="lg"
              required
              class="w-full mt-1.5"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="ghost"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  class="text-neutral-400 hover:text-neutral-600 p-1 hover:bg-transparent cursor-pointer"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle Password Visibility"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Main Actions -->
          <div class="flex flex-col gap-3 pt-2">
            <!-- Submit Login Button -->
            <UButton
              type="submit"
              size="lg"
              block
              color="primary"
              :loading="isSubmitting"
            >
              Login
            </UButton>

            <!-- Sign In with Google Button -->
            <UButton
              type="button"
              size="lg"
              block
              variant="subtle"
              color="neutral"
              :disabled="isSubmitting"
              @click="handleGoogleLogin"
            >
              <template #leading>
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </template>
              Login with Google
            </UButton>
          </div>

        </form>
      </UCard>
    </div>

  </div>
</template>
