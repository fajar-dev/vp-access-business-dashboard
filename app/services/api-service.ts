import axios from 'axios'
import type { AxiosInstance } from 'axios'

export class ApiService {
    private refreshHandler: (() => Promise<string | null>) | null = null
    private abortControllers = new Set<AbortController>()

    public cancelPendingRequests() {
        this.abortControllers.forEach(controller => controller.abort())
        this.abortControllers.clear()
    }

    public setRefreshHandler(handler: () => Promise<string | null>) {
        this.refreshHandler = handler
    }

    public get client(): AxiosInstance {
        const config = useRuntimeConfig()
        
        const instance = axios.create({
        baseURL: config.public.apiUrl as string,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        })

        instance.interceptors.request.use((config) => {
            const controller = new AbortController()
            config.signal = controller.signal
            this.abortControllers.add(controller)
            ;(config as any)._abortController = controller
            return config
        })

        instance.interceptors.response.use(
        (response) => {
            const controller = (response.config as any)._abortController
            if (controller) this.abortControllers.delete(controller)
            return response
        },
        async (error) => {
            const controller = (error.config as any)?._abortController
            if (controller) this.abortControllers.delete(controller)

            const originalRequest = error.config

            if (error.response?.status === 403) {
                if (typeof window !== 'undefined') {
                    navigateTo('/')
                }
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (typeof window !== 'undefined' && window.location.pathname === '/sign-in') {
                    return Promise.reject(error)
                }

                originalRequest._retry = true

            if (this.refreshHandler) {
                try {
                const newToken = await this.refreshHandler()
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return instance(originalRequest)
                }
                } catch (refreshError) {
                // Refresh failed, proceed to logout
                }
            }

            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                localStorage.removeItem('user')
                navigateTo('/auth/sign-in')
            }
            }
            return Promise.reject(error)
        }
        )

        return instance
    }
}

export const apiService = new ApiService()