import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { teamUpdateSchema } from "@/lib/validation"

// GET /api/teams/[id] - Get a specific team
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })

    if (!team) {
      return errorResponse(`Team with ID ${id} not found`, 404, "NOT_FOUND")
    }

    return successResponse({
      id: team.id,
      name: team.name,
      description: team.description,
      memberCount: team._count.members,
      createdAt: team.createdAt.toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching team ${params.id}:`, error)
    return errorResponse("Failed to fetch team", 500)
  }
}

// PUT /api/teams/[id] - Update a team
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    })

    if (!existingTeam) {
      return errorResponse(`Team with ID ${id} not found`, 404, "NOT_FOUND")
    }

    const validation = await validateRequest(req, teamUpdateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, description } = validation.data

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name,
        description: description || existingTeam.description,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })

    return successResponse({
      id: updatedTeam.id,
      name: updatedTeam.name,
      description: updatedTeam.description,
      memberCount: updatedTeam._count.members,
      createdAt: updatedTeam.createdAt.toISOString(),
    })
  } catch (error) {
    console.error(`Error updating team ${params.id}:`, error)
    return errorResponse("Failed to update team", 500)
  }
}

// DELETE /api/teams/[id] - Delete a team
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if team exists
    const existingTeam = await prisma.team.findUnique({
      where: { id },
    })

    if (!existingTeam) {
      return errorResponse(`Team with ID ${id} not found`, 404, "NOT_FOUND")
    }

    // Delete the team (this will cascade delete members due to our schema)
    await prisma.team.delete({
      where: { id },
    })

    return successResponse({ success: true })
  } catch (error) {
    console.error(`Error deleting team ${params.id}:`, error)
    return errorResponse("Failed to delete team", 500)
  }
}

