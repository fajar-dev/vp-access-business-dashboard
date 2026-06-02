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

export interface GrowthRevenueMonthData {
  revenue: number;
}

export interface GrowthRevenueData {
  period: string;
  month: Record<string, GrowthRevenueMonthData>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
