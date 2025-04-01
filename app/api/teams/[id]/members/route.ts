import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

// GET /api/teams/[id]/members - Get all members of a team
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id },
    })

    if (!team) {
      return errorResponse(`Team with ID ${id} not found`, 404, "NOT_FOUND")
    }

    const members = await prisma.member.findMany({
      where: { teamId: id },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    // Transform the data to match our frontend model
    const formattedMembers = members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      teamId: member.teamId,
      teamName: team.name,
      isOnCall: member.isOnCall,
      badges: member.badges.map((mb) => mb.badge.name),
      skills: member.skills,
      phone: member.phone || undefined,
      joinedAt: member.joinedAt.toISOString(),
    }))

    return successResponse(formattedMembers)
  } catch (error) {
    console.error(`Error fetching members for team ${params.id}:`, error)
    return errorResponse("Failed to fetch team members", 500)
  }
}

