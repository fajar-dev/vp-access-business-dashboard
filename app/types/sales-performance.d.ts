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
    data: number[]
}
