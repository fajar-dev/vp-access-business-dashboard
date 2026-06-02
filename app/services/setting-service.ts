import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { SettingRevenueData, ApiResponse, TargetRevenuePayload } from "../types/setting"

export class SettingService {
    private get authHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    }

    async getRevenue(year: number): Promise<ApiResponse<SettingRevenueData>> {
        try {
            const response = await apiService.client.get<ApiResponse<SettingRevenueData>>(`/vp-access-business/setting/revenue?year=${year}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getTarget(year: number): Promise<ApiResponse<TargetRevenuePayload | null>> {
        try {
            const response = await apiService.client.get<ApiResponse<TargetRevenuePayload | null>>(`/vp-access-business/setting/target?year=${year}`, this.authHeaders)
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

export const settingService = new SettingService()
