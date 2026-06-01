import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse, TicketStats } from "../types/service-quality"

export class ServiceQualityService {

    private get authHeaders() {
        return { headers: { Authorization: `Bearer ${useAuth().state.token}` } }
    }

    async getTicket(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/service-quality/ticket?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getComplaint(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/service-quality/complaint?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getSolved(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/service-quality/solved?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getSolvedPercentage(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/service-quality/solved-percentage?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getIssue(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/service-quality/issue?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getIncident(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/service-quality/incident?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const serviceQualityService = new ServiceQualityService()