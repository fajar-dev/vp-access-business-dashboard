export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface FeedbackItem {
  timestamp: string
  userId: string
  name: string
  images: string[]
  url: string
  message: string
  type: string
  category: string
  reply?: string | null
}

export interface FeedbackPayload {
  message: string
  type: string
  url?: string
  images: File[]
}