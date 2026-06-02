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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
