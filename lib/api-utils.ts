import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  })
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  details?: any,
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status },
  )
}

export async function validateRequest<T>(
  req: NextRequest,
  schema: any,
): Promise<{ data: T; isValid: true } | { error: string; isValid: false }> {
  try {
    const body = await req.json()
    const validatedData = schema.parse(body)
    return { data: validatedData, isValid: true }
  } catch (error: any) {
    return {
      error: error.message || "Invalid request data",
      isValid: false,
    }
  }
}

