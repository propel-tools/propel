import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { getTenantFromRequest } from "@/lib/tenant-utils"
import { z } from "zod"

// Validation schema for sync config
const syncConfigSchema = z.object({
  provider: z.enum(["ldap", "google"]),
  config: z.record(z.any()),
})

// GET /api/admin/sync-config - Get sync configurations for a tenant
export async function GET(req: NextRequest) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const syncConfigs = await prisma.syncConfig.findMany({
      where: { tenantId: tenant!.id },
    })

    return successResponse(syncConfigs)
  } catch (error) {
    console.error("Error fetching sync configs:", error)
    return errorResponse("Failed to fetch sync configurations", 500)
  }
}

// POST /api/admin/sync-config - Create a new sync configuration
export async function POST(req: NextRequest) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const validation = await validateRequest(req, syncConfigSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { provider, config } = validation.data

    // Check if a config for this provider already exists
    const existingConfig = await prisma.syncConfig.findFirst({
      where: {
        tenantId: tenant!.id,
        provider,
      },
    })

    if (existingConfig) {
      return errorResponse(`A sync configuration for ${provider} already exists`, 400, "DUPLICATE_CONFIG")
    }

    // Create new sync config
    const syncConfig = await prisma.syncConfig.create({
      data: {
        provider,
        config,
        tenant: {
          connect: { id: tenant!.id },
        },
      },
    })

    return successResponse(syncConfig)
  } catch (error) {
    console.error("Error creating sync config:", error)
    return errorResponse("Failed to create sync configuration", 500)
  }
}

