import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse, Manager, SalesPerformanceData } from "../types/sales-performance"

export class SalesPerformanceService {

    async getManagers(): Promise<ApiResponse<Manager[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<Manager[]>>('/public/sales-performance/manager')
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getSalesData(managerId?: string): Promise<ApiResponse<SalesPerformanceData[]>> {
        try {
            const query = managerId ? `?managerId=${managerId}` : ''
            const response = await apiService.client.get<ApiResponse<SalesPerformanceData[]>>(`/public/sales-performance${query}`)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const salesPerformanceService = new SalesPerformanceService()
