import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { teamCreateSchema } from "@/lib/validation"
import { getTenantFromRequest } from "@/lib/tenant-utils"

// GET /api/teams - Get all teams for a tenant
export async function GET(req: NextRequest) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const teams = await prisma.team.findMany({
      where: { tenantId: tenant!.id },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { name: "asc" },
    })

    // Transform the data to match our frontend model
    const formattedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      memberCount: team._count.members,
      createdAt: team.createdAt.toISOString(),
    }))

    return successResponse(formattedTeams)
  } catch (error) {
    console.error("Error fetching teams:", error)
    return errorResponse("Failed to fetch teams", 500)
  }
}

// POST /api/teams - Create a new team for a tenant
export async function POST(req: NextRequest) {
  // Validate tenant
  const { tenant, error } = await getTenantFromRequest(req)
  if (error) return error

  try {
    const validation = await validateRequest(req, teamCreateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, description } = validation.data

    const team = await prisma.team.create({
      data: {
        name,
        description: description || "",
        tenant: {
          connect: { id: tenant!.id },
        },
      },
    })

    return successResponse({
      id: team.id,
      name: team.name,
      description: team.description,
      memberCount: 0,
      createdAt: team.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Error creating team:", error)
    return errorResponse("Failed to create team", 500)
  }
}

