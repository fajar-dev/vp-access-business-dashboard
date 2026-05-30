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