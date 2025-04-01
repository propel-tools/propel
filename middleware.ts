import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get tenant information from the request
  const tenantId = "1"; // request.headers.get("x-tenant-id")
  const apiKey = "abc-test"; // request.headers.get("x-api-key")

  // For API routes that require tenant isolation
  if (
    request.nextUrl.pathname.startsWith("/api/") &&
    !request.nextUrl.pathname.startsWith("/api/auth") &&
    !request.nextUrl.pathname.startsWith("/api/health")
  ) {
    // Check if tenant information is provided
    if (!tenantId && !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Tenant information is required",
            code: "TENANT_REQUIRED",
          },
        },
        { status: 401 },
      )
    }

    // Continue with the request, tenant validation will happen in the API handlers
    return NextResponse.next()
  }

  // For non-API routes or routes that don't require tenant isolation
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}

