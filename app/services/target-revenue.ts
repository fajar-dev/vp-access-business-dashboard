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

    async getRevenue(branch: string, year: number): Promise<ApiResponse<TargetRevenueData>> {
        try {
            const response = await apiService.client.get<ApiResponse<TargetRevenueData>>(`/vp-access-business/setting/revenue?year=${year}&displayBranchId=${branch}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getTarget(branch: string, year: number): Promise<ApiResponse<TargetRevenueResponse | null>> {
        try {
            const response = await apiService.client.get<ApiResponse<TargetRevenueResponse | null>>(`/vp-access-business/setting/target?year=${year}&displayBranchId=${branch}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getTargetLog(branch?: string, year?: number): Promise<ApiResponse<TargetLogResponse[]>> {
        try {
            const params = new URLSearchParams()
            if (year) params.set('year', String(year))
            if (branch) params.set('displayBranchId', branch)
            const qs = params.toString()
            const url = qs ? `/vp-access-business/setting/target/log?${qs}` : '/vp-access-business/setting/target/log'
            const response = await apiService.client.get<ApiResponse<TargetLogResponse[]>>(url, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async saveTarget(branch: string, year: number, payload: TargetRevenuePayload): Promise<ApiResponse<null>> {
        try {
            const response = await apiService.client.post<ApiResponse<null>>(`/vp-access-business/setting/target?year=${year}&displayBranchId=${branch}`, payload, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const targetRevenueService = new TargetRevenueService()
