export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}
export interface ChurnStats {
    trend: 'up' | 'down'
    customers: number
    customersPrevious: number
    customersGrowth: number
    churnRate: number
    revenue: number
    period: string
}