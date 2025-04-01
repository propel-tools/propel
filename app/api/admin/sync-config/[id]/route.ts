import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { getTenantFromRequest } from "@/lib/tenant-utils"
import { z } from "zod"

// Validation schema for sync config update
const syncConfigUpdateSchema = z.object({
  config: z.record(z.any()),
})

// GET /api/admin/sync-config/[id] - Get a specific sync configuration
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const { id } = params

    const syncConfig = await prisma.syncConfig.findUnique({
      where: { id },
    })

    if (!syncConfig) {
      return errorResponse(`Sync configuration with ID ${id} not found`, 404, "NOT_FOUND")
    }

    // Ensure the sync config belongs to the tenant
    if (syncConfig.tenantId !== tenant!.id) {
      return errorResponse("Access denied", 403, "ACCESS_DENIED")
    }

    return successResponse(syncConfig)
  } catch (error) {
    console.error(`Error fetching sync config ${params.id}:`, error)
    return errorResponse("Failed to fetch sync configuration", 500)
  }
}

// PUT /api/admin/sync-config/[id] - Update a sync configuration
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const { id } = params

    // Check if sync config exists and belongs to the tenant
    const existingConfig = await prisma.syncConfig.findUnique({
      where: { id },
    })

    if (!existingConfig) {
      return errorResponse(`Sync configuration with ID ${id} not found`, 404, "NOT_FOUND")
    }

    if (existingConfig.tenantId !== tenant!.id) {
      return errorResponse("Access denied", 403, "ACCESS_DENIED")
    }

    const validation = await validateRequest(req, syncConfigUpdateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { config } = validation.data

    // Update sync config
    const updatedConfig = await prisma.syncConfig.update({
      where: { id },
      data: { config },
    })

    return successResponse(updatedConfig)
  } catch (error) {
    console.error(`Error updating sync config ${params.id}:`, error)
    return errorResponse("Failed to update sync configuration", 500)
  }
}

// DELETE /api/admin/sync-config/[id] - Delete a sync configuration
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const { id } = params

    // Check if sync config exists and belongs to the tenant
    const existingConfig = await prisma.syncConfig.findUnique({
      where: { id },
    })

    if (!existingConfig) {
      return errorResponse(`Sync configuration with ID ${id} not found`, 404, "NOT_FOUND")
    }

    if (existingConfig.tenantId !== tenant!.id) {
      return errorResponse("Access denied", 403, "ACCESS_DENIED")
    }

    // Delete the sync config
    await prisma.syncConfig.delete({
      where: { id },
    })

    return successResponse({ success: true })
  } catch (error) {
    console.error(`Error deleting sync config ${params.id}:`, error)
    return errorResponse("Failed to delete sync configuration", 500)
  }
}

