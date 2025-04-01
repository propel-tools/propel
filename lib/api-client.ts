import type { ApiResponse } from "@/types/api"

// Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
const USE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_USE_MOCK_FALLBACK === "true"
const API_TIMEOUT = 8000 // 8 seconds timeout

/**
 * Generic API client that handles requests with proper error handling,
 * timeout management, and mock data fallbacks
 */
export async function apiClient<T>({
  endpoint,
  method = "GET",
  body,
  mockData,
  headers = {},
}: {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: any
  mockData?: T
  headers?: Record<string, string>
}): Promise<ApiResponse<T>> {
  // If API URL is not set and mock fallback is enabled, return mock data
  if (!API_URL && USE_MOCK_FALLBACK && mockData) {
    console.log(`[API] Using mock data for ${endpoint}`)
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: mockData, error: null }
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

    // Prepare request options
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    }

    // Add body for non-GET requests
    if (method !== "GET" && body) {
      options.body = JSON.stringify(body)
    }

    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, options)
    clearTimeout(timeoutId)

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    // Parse response
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error(`[API] Error in ${method} ${endpoint}:`, error)

    // If mock fallback is enabled and mock data is provided, return it
    if (USE_MOCK_FALLBACK && mockData) {
      console.log(`[API] Falling back to mock data for ${endpoint}`)
      return { data: mockData, error: null }
    }

    // Otherwise return the error
    return {
      data: null as unknown as T,
      error: error instanceof Error ? error : new Error("Unknown error occurred"),
    }
  }
}

