export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}
export interface ChurnStats {
    trend: 'up' | 'down'
    percentage: number
    revenue: number
    period: string
}

export interface CustomerLoseDetail {
    service_group: string
    value: number
    trend: 'up' | 'down'
    percentage: number
}

export interface CustomerLoseStats {
    total: {
        value: number
        trend: 'up' | 'down'
        percentage: number
        period: string
    }
    detail: CustomerLoseDetail[]
}

export interface WirelessMigrationStats {
    totalCustomer: {
        value: number
        trend: 'up' | 'down'
        percentage: number
        period: string
    }
    migrated: {
        value: number
        trend: 'up' | 'down'
        percentage: number
        period: string
    }
    migrationRate: {
        value: number
        trend: 'up' | 'down'
        percentage: number
        migratedValue: number
        totalValue: number
        period: string
    }
}

export interface ChurnRateMonthData {
    churn: number
    active: number
    ret: number
}

export interface ChurnRateData {
    period: string
    month: {
        [year: string]: ChurnRateMonthData
    }
}