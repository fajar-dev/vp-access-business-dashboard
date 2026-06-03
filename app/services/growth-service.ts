import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { GrowthMrcStats, GrowthRevenueData, GrowthRevenueAchievementStats, GrowthNewCustomerStats, GrowthArpuStats, GrowthLeadsStats, GrowthOpportunityStats, GrowthWinRateStats, GrowthActivityStats, GrowthPipelineStats, GrowthPipelineStageStats, GrowthCycleStats, GrowthDiscountStats, ApiResponse } from "../types/growth"

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

    async getArpu(branchId: string, period: string): Promise<ApiResponse<GrowthArpuStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthArpuStats>>(`/vp-access-business/growth/arpu?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getNewCustomer(branchId: string, period: string): Promise<ApiResponse<GrowthNewCustomerStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthNewCustomerStats>>(`/vp-access-business/growth/new-customer?branchId=${branchId}&period=${period}`, this.authHeaders)
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

    async getRevenueAchievement(branchId: string, period: string): Promise<ApiResponse<GrowthRevenueAchievementStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthRevenueAchievementStats>>(`/vp-access-business/growth/revenue-achievement?branchId=${branchId}&period=${period}`, this.authHeaders)
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

    async getPipelineValue(period: string): Promise<ApiResponse<GrowthPipelineStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthPipelineStats>>(`/vp-access-business/growth/pipeline-value?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getPipelineStage(period: string): Promise<ApiResponse<GrowthPipelineStageStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<GrowthPipelineStageStats>>(`/vp-access-business/growth/pipeline-stage?period=${period}`, this.authHeaders)
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
