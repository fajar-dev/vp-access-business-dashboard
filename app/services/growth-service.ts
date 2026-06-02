import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { GrowthMrcStats, GrowthRevenueData, GrowthLeadsStats, GrowthOpportunityStats, ApiResponse } from "../types/growth"

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

    async getRevenue(branchId: string): Promise<ApiResponse<GrowthRevenueData[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthRevenueData[]>>(`/vp-access-business/growth/revenue?branchId=${branchId}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getLeads(period: string): Promise<ApiResponse<GrowthLeadsStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthLeadsStats>>(`/vp-access-business/growth/leads?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getOpportunity(period: string): Promise<ApiResponse<GrowthOpportunityStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthOpportunityStats>>(`/vp-access-business/growth/opportunity?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const growthService = new GrowthService()
