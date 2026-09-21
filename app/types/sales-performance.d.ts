export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}

export interface Manager {
    id: number
    name: string
    employeeId: string
    photoProfile: string
}

export interface SalesPerformanceData {
    id: number
    employeeId: string
    name: string
    photoProfile: string
    organizationName: string
    type: string
    data: number[]
}

export interface HomeDetailItem {
    customerId: string
    customerName: string
    accountName: string
    serviceId: string
    serviceName: string
    weight: number
    date: string
}

export interface BusinessDetailItem {
    type: string
    at: string
}

export interface SalesPerformanceDetail {
    type: string
    items: HomeDetailItem[] | BusinessDetailItem[]
}

export interface BusinessWeeklyRow {
    id: number
    employeeId: string
    name: string
    photoProfile: string
    organizationName: string
    activityThisWeek: number
    mrcThisMonth: number
    target: number
    achievementPct: number | null
}

export interface BusinessWeekly {
    week: { label: string; start: string; end: string }
    month: string
    rows: BusinessWeeklyRow[]
}
