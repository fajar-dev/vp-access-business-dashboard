import { apiService } from "./api-service"
import { handleServiceError } from "../composables/error-helper"
import type { ApiResponse, ChurnStats, CustomerLoseStats, WirelessMigrationStats, ChurnRateData, ContractExpiringStats, TicketStats, UsageStats, PaymentStats, RetentionForecastChurnStats, RetentionForecastNetMrcStats, RetentionNetMrcStats } from "../types/retention"

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

    async getCustomerLose(branchId: string, period: string): Promise<ApiResponse<CustomerLoseStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<CustomerLoseStats>>(`/vp-access-business/retention/customer-lose?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
    async getWirelessMigration(branchId: string, period: string): Promise<ApiResponse<WirelessMigrationStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<WirelessMigrationStats>>(`/vp-access-business/retention/wireless-migration?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getChurnRate(branchId: string): Promise<ApiResponse<ChurnRateData[]>> {
        try {
            const response = await apiService.client.get<ApiResponse<ChurnRateData[]>>(`/vp-access-business/retention/churn-rate?branchId=${branchId}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getContractExpiring(branchId: string): Promise<ApiResponse<ContractExpiringStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<ContractExpiringStats>>(`/vp-access-business/retention/contract-expiring?branchId=${branchId}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getTicket(branchId: string, period: string): Promise<ApiResponse<TicketStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<TicketStats>>(`/vp-access-business/retention/ticket?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getUsage(branchId: string, period: string): Promise<ApiResponse<UsageStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<UsageStats>>(`/vp-access-business/retention/usage?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getPayment(branchId: string): Promise<ApiResponse<PaymentStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<PaymentStats>>(`/vp-access-business/retention/payment?branchId=${branchId}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getForecastChurn(period: string): Promise<ApiResponse<RetentionForecastChurnStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<RetentionForecastChurnStats>>(`/vp-access-business/retention/forecast-churn?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getForecastNetMrc(period: string): Promise<ApiResponse<RetentionForecastNetMrcStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<RetentionForecastNetMrcStats>>(`/vp-access-business/retention/forecast-net-mrc?period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }

    async getNetMrc(branchId: string, period: string): Promise<ApiResponse<RetentionNetMrcStats>> {
        try {
            const response = await apiService.client.get<ApiResponse<RetentionNetMrcStats>>(`/vp-access-business/retention/net-mrc?branchId=${branchId}&period=${period}`, this.authHeaders)
            return response.data
        } catch (error: any) {
            return handleServiceError(error)
        }
    }
}

export const retentionService = new RetentionService()