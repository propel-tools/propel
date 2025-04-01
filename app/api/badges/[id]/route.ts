import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { badgeUpdateSchema } from "@/lib/validation"

// GET /api/badges/[id] - Get a specific badge
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const badge = await prisma.badge.findUnique({
      where: { id },
    })

    if (!badge) {
      return errorResponse(`Badge with ID ${id} not found`, 404, "NOT_FOUND")
    }

    return successResponse({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      color: badge.color,
      createdAt: badge.createdAt.toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching badge ${params.id}:`, error)
    return errorResponse("Failed to fetch badge", 500)
  }
}

// PUT /api/badges/[id] - Update a badge
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if badge exists
    const existingBadge = await prisma.badge.findUnique({
      where: { id },
    })

    if (!existingBadge) {
      return errorResponse(`Badge with ID ${id} not found`, 404, "NOT_FOUND")
    }

    const validation = await validateRequest(req, badgeUpdateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, description, color } = validation.data

    // If name is changing, check if it's already in use
    if (name && name !== existingBadge.name) {
      const nameExists = await prisma.badge.findFirst({
        where: { name },
      })

      if (nameExists) {
        return errorResponse("Badge with this name already exists", 400, "DUPLICATE_NAME")
      }
    }

    const updatedBadge = await prisma.badge.update({
      where: { id },
      data: {
        name: name || existingBadge.name,
        description: description || existingBadge.description,
        color: color || existingBadge.color,
      },
    })

    return successResponse({
      id: updatedBadge.id,
      name: updatedBadge.name,
      description: updatedBadge.description,
      color: updatedBadge.color,
      createdAt: updatedBadge.createdAt.toISOString(),
    })
  } catch (error) {
    console.error(`Error updating badge ${params.id}:`, error)
    return errorResponse("Failed to update badge", 500)
  }
}

// DELETE /api/badges/[id] - Delete a badge
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if badge exists
    const existingBadge = await prisma.badge.findUnique({
      where: { id },
    })

    if (!existingBadge) {
      return errorResponse(`Badge with ID ${id} not found`, 404, "NOT_FOUND")
    }

    // Delete the badge
    await prisma.badge.delete({
      where: { id },
    })

    return successResponse({ success: true })
  } catch (error) {
    console.error(`Error deleting badge ${params.id}:`, error)
    return errorResponse("Failed to delete badge", 500)
  }
}

