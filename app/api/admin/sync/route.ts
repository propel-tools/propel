import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { getTenantFromRequest } from "@/lib/tenant-utils"
import { syncLDAP, syncGoogle } from "@/scripts/sync-directory"

// POST /api/admin/sync - Trigger directory synchronization
export async function POST(req: NextRequest) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    // Get sync config for this tenant
    const syncConfigs = await prisma.syncConfig.findMany({
      where: { tenantId: tenant!.id },
    })

    if (syncConfigs.length === 0) {
      return errorResponse("No sync configuration found for this tenant", 404, "NO_SYNC_CONFIG")
    }

    // Start sync process
    for (const syncConfig of syncConfigs) {
      const config = syncConfig.config as any

      if (syncConfig.provider === "ldap") {
        await syncLDAP(tenant!.id, config)
      } else if (syncConfig.provider === "google") {
        await syncGoogle(tenant!.id, config)
      } else {
        return errorResponse(`Unknown provider: ${syncConfig.provider}`, 400, "UNKNOWN_PROVIDER")
      }
    }

    return successResponse({
      message: "Synchronization completed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error triggering sync:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to trigger synchronization", 500)
  }
}

