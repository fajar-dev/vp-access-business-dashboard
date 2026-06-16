import { useAuth } from "~/composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { state } = useAuth()
    
    const isPublic = to.path === '/auth/sign-in' || to.path.startsWith('/public/')
    
    if (!state.token && !isPublic) {
      return navigateTo('/auth/sign-in')
    }
})