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
  reason?: string;
}

export interface TargetRevenueResponse {
  year: number;
  yearlyTarget: number;
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
  isLocked: boolean;
  updatedAt?: string;
  updatedBy?: UserReference | null;
}

export interface UserReference {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  jobPosition: string | null;
}

export interface TargetLogResponse {
  id: number;
  year: number;
  reason: string | null;
  oldValue: any;
  newValue: any;
  createdAt: string;
  updatedAt: string | null;
  createdBy: UserReference | null;
  updatedBy: UserReference | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
