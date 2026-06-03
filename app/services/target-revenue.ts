import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { TargetRevenueData, ApiResponse, TargetRevenuePayload, TargetLogResponse, TargetRevenueResponse } from "../types/target-revenue"

export class TargetRevenueService {
    private get authHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    }

    async getRevenue(year: number): Promise<ApiResponse<TargetRevenueData>> {
        try {
            const response = await apiService.client.get<ApiResponse<TargetRevenueData>>(`/vp-access-business/setting/revenue?year=${year}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getTarget(year: number): Promise<ApiResponse<TargetRevenueResponse | null>> {
        try {
            const response = await apiService.client.get<ApiResponse<TargetRevenueResponse | null>>(`/vp-access-business/setting/target?year=${year}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getTargetLog(year?: number): Promise<ApiResponse<TargetLogResponse[]>> {
        try {
            const url = year ? `/vp-access-business/setting/target/log?year=${year}` : '/vp-access-business/setting/target/log'
            const response = await apiService.client.get<ApiResponse<TargetLogResponse[]>>(url, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async saveTarget(year: number, payload: TargetRevenuePayload): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.post<ApiResponse<null>>(`/vp-access-business/setting/target?year=${year}`, payload, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const targetRevenueService = new TargetRevenueService()
