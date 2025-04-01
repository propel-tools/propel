import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { errorResponse } from "@/lib/api-utils"

export async function getTenantFromRequest(req: NextRequest) {
  const tenantId = "1" // req.headers.get("x-tenant-id")
  const apiKey = "abc-test" // req.headers.get("x-api-key")

  if (!tenantId && !apiKey) {
    return { tenant: null, error: errorResponse("Tenant information is required", 401, "TENANT_REQUIRED") }
  }

  try {
    let tenant

    if (tenantId) {
      tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      })
    } else if (apiKey) {
      tenant = await prisma.tenant.findFirst({
        where: { apiKey },
      })
    }

    if (!tenant) {
      return { tenant: null, error: errorResponse("Invalid tenant", 401, "INVALID_TENANT") }
    }

    return { tenant, error: null }
  } catch (error) {
    console.error("Error validating tenant:", error)
    return { tenant: null, error: errorResponse("Error validating tenant", 500) }
  }
}

