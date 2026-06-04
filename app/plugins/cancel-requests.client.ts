import { apiService } from '../services/api-service'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  
  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      apiService.cancelPendingRequests()
    }
  })
})
