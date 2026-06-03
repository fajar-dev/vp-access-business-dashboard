import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { GrowthMrcStats, GrowthRevenueData, GrowthLeadsStats, GrowthOpportunityStats, GrowthWinRateStats, GrowthActivityStats, GrowthPipelineStats, GrowthCycleStats, GrowthDiscountStats, ApiResponse } from "../types/growth"

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

    async getWinRate(period: string): Promise<ApiResponse<GrowthWinRateStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthWinRateStats>>(`/vp-access-business/growth/win-rate?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getActivity(period: string): Promise<ApiResponse<GrowthActivityStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthActivityStats>>(`/vp-access-business/growth/activity?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getPipeline(period: string): Promise<ApiResponse<GrowthPipelineStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthPipelineStats>>(`/vp-access-business/growth/pipeline-value?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getCycle(period: string): Promise<ApiResponse<GrowthCycleStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthCycleStats>>(`/vp-access-business/growth/cycle?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getDiscount(period: string): Promise<ApiResponse<GrowthDiscountStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthDiscountStats>>(`/vp-access-business/growth/discount?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const growthService = new GrowthService()
