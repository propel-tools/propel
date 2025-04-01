import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { badgeAssignmentSchema } from "@/lib/validation"

// GET /api/members/[id]/badges - Get all badges for a member
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id },
    })

    if (!member) {
      return errorResponse(`Member with ID ${id} not found`, 404, "NOT_FOUND")
    }

    const memberBadges = await prisma.memberBadge.findMany({
      where: { memberId: id },
      include: {
        badge: true,
      },
    })

    // Transform the data to match our frontend model
    const formattedBadges = memberBadges.map((mb) => ({
      id: mb.badge.id,
      name: mb.badge.name,
      description: mb.badge.description,
      color: mb.badge.color,
      awardedAt: mb.awardedAt.toISOString(),
    }))

    return successResponse(formattedBadges)
  } catch (error) {
    console.error(`Error fetching badges for member ${params.id}:`, error)
    return errorResponse("Failed to fetch member badges", 500)
  }
}

// POST /api/members/[id]/badges - Assign a badge to a member
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id },
    })

    if (!member) {
      return errorResponse(`Member with ID ${id} not found`, 404, "NOT_FOUND")
    }

    const validation = await validateRequest(req, badgeAssignmentSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { badgeId } = validation.data

    // Check if badge exists
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId },
    })

    if (!badge) {
      return errorResponse(`Badge with ID ${badgeId} not found`, 404, "BADGE_NOT_FOUND")
    }

    // Check if badge is already assigned
    const existingAssignment = await prisma.memberBadge.findUnique({
      where: {
        memberId_badgeId: {
          memberId: id,
          badgeId,
        },
      },
    })

    if (existingAssignment) {
      return errorResponse("Badge is already assigned to this member", 400, "DUPLICATE_ASSIGNMENT")
    }

    // Assign the badge
    const memberBadge = await prisma.memberBadge.create({
      data: {
        memberId: id,
        badgeId,
      },
      include: {
        badge: true,
      },
    })

    return successResponse({
      id: memberBadge.badge.id,
      name: memberBadge.badge.name,
      description: memberBadge.badge.description,
      color: memberBadge.badge.color,
      awardedAt: memberBadge.awardedAt.toISOString(),
    })
  } catch (error) {
    console.error(`Error assigning badge to member ${params.id}:`, error)
    return errorResponse("Failed to assign badge", 500)
  }
}

