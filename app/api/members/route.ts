import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { memberCreateSchema } from "@/lib/validation"

// GET /api/members - Get all members
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        team: true,
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
      teamName: member.team.name,
      isOnCall: member.isOnCall,
      badges: member.badges.map((mb) => mb.badge.name),
      skills: member.skills,
      phone: member.phone || undefined,
      joinedAt: member.joinedAt.toISOString(),
    }))

    return successResponse(formattedMembers)
  } catch (error) {
    console.error("Error fetching members:", error)
    return errorResponse("Failed to fetch members", 500)
  }
}

// POST /api/members - Create a new member
export async function POST(req: NextRequest) {
  try {
    const validation = await validateRequest(req, memberCreateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, email, role, teamId, isOnCall, phone, skills, badges } = validation.data

    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      return errorResponse(`Team with ID ${teamId} not found`, 404, "NOT_FOUND")
    }

    // Check if email is already in use
    const existingMember = await prisma.member.findUnique({
      where: { email },
    })

    if (existingMember) {
      return errorResponse("Email is already in use", 400, "DUPLICATE_EMAIL")
    }

    // Create the member
    const member = await prisma.member.create({
      data: {
        name,
        email,
        role,
        teamId,
        isOnCall: isOnCall || false,
        phone,
        skills: skills || [],
      },
      include: {
        team: true,
      },
    })

    // If badges are provided, assign them to the member
    if (badges && badges.length > 0) {
      // Verify all badges exist
      const existingBadges = await prisma.badge.findMany({
        where: {
          name: {
            in: badges,
          },
        },
      })

      if (existingBadges.length !== badges.length) {
        // Some badges don't exist, but we'll continue with the ones that do
        console.warn("Some badges do not exist and will be skipped")
      }

      // Create badge assignments
      if (existingBadges.length > 0) {
        await prisma.memberBadge.createMany({
          data: existingBadges.map((badge) => ({
            memberId: member.id,
            badgeId: badge.id,
          })),
          skipDuplicates: true,
        })
      }
    }

    // Fetch the member with badges to return
    const memberWithBadges = await prisma.member.findUnique({
      where: { id: member.id },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
      },
    })

    return successResponse({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      teamId: member.teamId,
      teamName: member.team.name,
      isOnCall: member.isOnCall,
      badges: memberWithBadges?.badges.map((mb) => mb.badge.name) || [],
      skills: member.skills,
      phone: member.phone || undefined,
      joinedAt: member.joinedAt.toISOString(),
    })
  } catch (error) {
    console.error("Error creating member:", error)
    return errorResponse("Failed to create member", 500)
  }
}

