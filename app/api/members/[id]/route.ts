import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { memberUpdateSchema } from "@/lib/validation"
import { FileText, GitPullRequest, MessageSquare, Star } from "lucide-react"

// Mock activities for member profile
// In a real app, these would come from a database
const mockActivities = [
  {
    id: "1",
    title: "Completed project documentation",
    description: "Finished the API documentation for the new feature",
    timestamp: "2 hours ago",
    icon: FileText,
  },
  {
    id: "2",
    title: "Merged pull request",
    description: "PR #123: Fix authentication bug in login flow",
    timestamp: "Yesterday",
    icon: GitPullRequest,
  },
  {
    id: "3",
    title: "Received MVP badge",
    description: "Awarded for exceptional contribution to the team",
    timestamp: "3 days ago",
    icon: Star,
  },
  {
    id: "4",
    title: "Commented on issue",
    description: "Issue #456: Improve performance of dashboard",
    timestamp: "1 week ago",
    icon: MessageSquare,
  },
]

// GET /api/members/[id] - Get a specific member
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        team: true,
        badges: {
          include: {
            badge: true,
          },
        },
      },
    })

    if (!member) {
      return errorResponse(`Member with ID ${id} not found`, 404, "NOT_FOUND")
    }

    // Transform the data to match our frontend model
    return successResponse({
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
      activities: mockActivities, // In a real app, fetch real activities
    })
  } catch (error) {
    console.error(`Error fetching member ${params.id}:`, error)
    return errorResponse("Failed to fetch member", 500)
  }
}

// PUT /api/members/[id] - Update a member
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    })

    if (!existingMember) {
      return errorResponse(`Member with ID ${id} not found`, 404, "NOT_FOUND")
    }

    const validation = await validateRequest(req, memberUpdateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, email, role, teamId, isOnCall, phone, skills, badges } = validation.data

    // If email is changing, check if it's already in use
    if (email && email !== existingMember.email) {
      const emailExists = await prisma.member.findUnique({
        where: { email },
      })

      if (emailExists) {
        return errorResponse("Email is already in use", 400, "DUPLICATE_EMAIL")
      }
    }

    // If team is changing, check if it exists
    if (teamId && teamId !== existingMember.teamId) {
      const teamExists = await prisma.team.findUnique({
        where: { id: teamId },
      })

      if (!teamExists) {
        return errorResponse(`Team with ID ${teamId} not found`, 404, "TEAM_NOT_FOUND")
      }
    }

    // Update the member
    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        name: name || existingMember.name,
        email: email || existingMember.email,
        role: role || existingMember.role,
        teamId: teamId || existingMember.teamId,
        isOnCall: isOnCall !== undefined ? isOnCall : existingMember.isOnCall,
        phone,
        skills: skills || existingMember.skills,
      },
      include: {
        team: true,
      },
    })

    // If badges are provided, update them
    if (badges) {
      // First, get all badge IDs from names
      const badgeEntities = await prisma.badge.findMany({
        where: {
          name: {
            in: badges,
          },
        },
      })

      const badgeIds = badgeEntities.map((b) => b.id)

      // Remove all existing badges
      await prisma.memberBadge.deleteMany({
        where: { memberId: id },
      })

      // Add new badges
      if (badgeIds.length > 0) {
        await prisma.memberBadge.createMany({
          data: badgeIds.map((badgeId) => ({
            memberId: id,
            badgeId,
          })),
        })
      }
    }

    // Fetch the updated member with badges
    const memberWithBadges = await prisma.member.findUnique({
      where: { id },
      include: {
        badges: {
          include: {
            badge: true,
          },
        },
      },
    })

    return successResponse({
      id: updatedMember.id,
      name: updatedMember.name,
      email: updatedMember.email,
      role: updatedMember.role,
      teamId: updatedMember.teamId,
      teamName: updatedMember.team.name,
      isOnCall: updatedMember.isOnCall,
      badges: memberWithBadges?.badges.map((mb) => mb.badge.name) || [],
      skills: updatedMember.skills,
      phone: updatedMember.phone || undefined,
      joinedAt: updatedMember.joinedAt.toISOString(),
    })
  } catch (error) {
    console.error(`Error updating member ${params.id}:`, error)
    return errorResponse("Failed to update member", 500)
  }
}

// DELETE /api/members/[id] - Delete a member
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id },
    })

    if (!existingMember) {
      return errorResponse(`Member with ID ${id} not found`, 404, "NOT_FOUND")
    }

    // Delete the member
    await prisma.member.delete({
      where: { id },
    })

    return successResponse({ success: true })
  } catch (error) {
    console.error(`Error deleting member ${params.id}:`, error)
    return errorResponse("Failed to delete member", 500)
  }
}

