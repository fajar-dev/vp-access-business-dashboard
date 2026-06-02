import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { GrowthMrcStats, ApiResponse } from "../types/growth"

export class GrowthService {

    private get authHeaders() {
        return { headers: { Authorization: `Bearer ${useAuth().state.token}` } }
    }

    async getNewMrc(branchId: string, period: string): Promise<ApiResponse<GrowthMrcStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthMrcStats>>(`/vp-access-business/growth/new-mrc?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const growthService = new GrowthService()
