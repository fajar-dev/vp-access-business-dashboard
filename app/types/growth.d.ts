export interface GrowthMrcDetails {
  mrc: number;
  mrc_unpaid: number;
  mrc_paid: number;
}

export interface GrowthMrcStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
  details: GrowthMrcDetails;
}

export interface GrowthNewCustomerStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthTotalMrcYtdStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthForecastRevenueStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthForecastMrcStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthForecastChurnStats {
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

export interface GrowthForecastNetMrcStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthNetMrcStats {
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

export interface GrowthArpuDetails {
  serviceGroup: string;
  jumlahService: number;
  totalRevenue: number;
  avgPerService: number;
}

export interface GrowthArpuStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
  details: GrowthArpuDetails[];
}

export interface GrowthRevenueMonthData {
  revenue: number;
}

export interface GrowthRevenueData {
  period: string;
  month: Record<string, GrowthRevenueMonthData>;
}

export interface GrowthRevenueAchievementStats {
  target: number;
  revenue: number;
  percentage: number;
  trendPercentage: number;
  trend: 'up' | 'down';
  period: string;
}

export interface GrowthLeadsStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthOpportunityStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthActivityStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthPipelineStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}
export interface GrowthPipelineStageDetail {
  name: string;
  value: number;
  percentage: number;
}

export interface GrowthPipelineStageStats {
  qualification: GrowthPipelineStageDetail;
  proposal: GrowthPipelineStageDetail;
  negotiation: GrowthPipelineStageDetail;
}

export interface GrowthCycleStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
}

export interface GrowthDiscountDetail {
  serviceGroup: string;
  discount: number;
}

export interface GrowthDiscountStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
  details: GrowthDiscountDetail[];
}

export interface GrowthWinRateDetail {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
}

export interface GrowthWinRateStats {
  value: number;
  trend: 'up' | 'down';
  percentage: number;
  period: string;
  details: {
    win: GrowthWinRateDetail;
    lose: GrowthWinRateDetail;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
