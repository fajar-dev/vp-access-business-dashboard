export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}
export interface ForecastPaymentStats {
    trend: 'up' | 'down'
    percentage: number
    revenue: number
    period: string
}

export interface RetentionForecastChurnStats {
  forecastMrc: {
    value: number;
    trend: 'up' | 'down';
    percentage: number;
    period: string;
  };
  details: {
    blocked: number;
    contractEnd: number;
    ticketIssues: number;
    lowUsage: number;
  };
  customerLose: {
    service_group: string;
    total_churn: number;
  }[];
}

export interface RetentionForecastNetMrcStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface RetentionNetMrcStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
  newMrc: {
    value: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  churnMrc: {
    value: number;
    trend: 'up' | 'down';
    percentage: number;
  };
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

export interface ContractExpiringStats {
    total: number
    total_30: number
    total_60: number
    total_90: number
}

export interface TicketStats {
    value: number
    trend: 'up' | 'down'
    percentage: number
    period: string
}

export interface UsageStats {
    value: number
    trend: 'up' | 'down'
    percentage: number
    period: string
}

export interface PaymentStats {
    monthly: number
    annual: number
}