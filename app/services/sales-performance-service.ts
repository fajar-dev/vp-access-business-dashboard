import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse, Manager, SalesPerformanceData, SalesPerformanceDetail } from "../types/sales-performance"

export class SalesPerformanceService {

    async getManagers(type?: string): Promise<ApiResponse<Manager[]>> {
        try {
            const query = type ? `?type=${type}` : ''
            const response = await apiService.client.get<ApiResponse<Manager[]>>(`/public/sales-performance/manager${query}`)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getDetail(salesId: number, year: number, month: number, day: number): Promise<ApiResponse<SalesPerformanceDetail>> {
        try {
            const params = new URLSearchParams()
            params.set('salesId', String(salesId))
            params.set('year', String(year))
            params.set('month', String(month))
            params.set('day', String(day))
            const response = await apiService.client.get<ApiResponse<SalesPerformanceDetail>>(`/public/sales-performance/detail?${params.toString()}`)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getSalesData(managerId?: string, branchId?: string, type?: string): Promise<ApiResponse<SalesPerformanceData[]>> {
        try {
            const params = new URLSearchParams()
            if (managerId) params.set('managerId', managerId)
            if (branchId) params.set('branchId', branchId)
            if (type) params.set('type', type)
            const query = params.toString() ? `?${params.toString()}` : ''
            const response = await apiService.client.get<ApiResponse<SalesPerformanceData[]>>(`/public/sales-performance${query}`)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const salesPerformanceService = new SalesPerformanceService()
