export interface ApiResponse<T> {
  data: T
  error: Error | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

