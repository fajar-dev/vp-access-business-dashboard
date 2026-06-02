export interface SettingRevenueDetail {
  month: number;
  total: number;
}

export interface SettingRevenueData {
  total: number;
  details: SettingRevenueDetail[];
}

export interface TargetRevenuePayload {
  year: number;
  yearly_target: number;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  is_locked: boolean;
  updated_at?: string;
  updated_by_name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
