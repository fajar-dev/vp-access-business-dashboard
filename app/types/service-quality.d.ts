export interface ApiResponse<T = any> {
    success: boolean
    statusCode: number
    message: string
    data: T
}

export interface TicketStats {
    value: number
    trend: 'up' | 'down'
    percentage: number
    period: string
}