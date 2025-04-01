import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { badgeCreateSchema } from "@/lib/validation"

// GET /api/badges - Get all badges
export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { name: "asc" },
    })

    // Transform the data to match our frontend model
    const formattedBadges = badges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      color: badge.color,
      createdAt: badge.createdAt.toISOString(),
    }))

    return successResponse(formattedBadges)
  } catch (error) {
    console.error("Error fetching badges:", error)
    return errorResponse("Failed to fetch badges", 500)
  }
}

// POST /api/badges - Create a new badge
export async function POST(req: NextRequest) {
  try {
    const validation = await validateRequest(req, badgeCreateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, description, color } = validation.data

    // Check if badge with this name already exists
    const existingBadge = await prisma.badge.findFirst({
      where: { name },
    })

    if (existingBadge) {
      return errorResponse("Badge with this name already exists", 400, "DUPLICATE_NAME")
    }

    const badge = await prisma.badge.create({
      data: {
        name,
        description: description || "",
        color: color || "#000000",
      },
    })

    return successResponse({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      color: badge.color,
      createdAt: badge.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Error creating badge:", error)
    return errorResponse("Failed to create badge", 500)
  }
}

