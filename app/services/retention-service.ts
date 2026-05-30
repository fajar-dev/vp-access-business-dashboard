import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse, ChurnStats } from "../types/retention"

export class RetentionService {

    private get authHeaders() {
        return { headers: { Authorization: `Bearer ${useAuth().state.token}` } }
    }

    async getChurnStats(branchId: string, period: string): Promise<ApiResponse<ChurnStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<ChurnStats>>(`/vp-access-business/retention/churn-revenue?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const retentionService = new RetentionService()