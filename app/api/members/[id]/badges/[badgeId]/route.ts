import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

// DELETE /api/members/[id]/badges/[badgeId] - Remove a badge from a member
export async function DELETE(req: NextRequest, { params }: { params: { id: string; badgeId: string } }) {
  try {
    const { id, badgeId } = params

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id },
    })

    if (!member) {
      return errorResponse(`Member with ID ${id} not found`, 404, "NOT_FOUND")
    }

    // Check if badge exists
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId },
    })

    if (!badge) {
      return errorResponse(`Badge with ID ${badgeId} not found`, 404, "BADGE_NOT_FOUND")
    }

    // Check if badge is assigned to member
    const memberBadge = await prisma.memberBadge.findUnique({
      where: {
        memberId_badgeId: {
          memberId: id,
          badgeId,
        },
      },
    })

    if (!memberBadge) {
      return errorResponse("Badge is not assigned to this member", 404, "ASSIGNMENT_NOT_FOUND")
    }

    // Remove the badge assignment
    await prisma.memberBadge.delete({
      where: {
        memberId_badgeId: {
          memberId: id,
          badgeId,
        },
      },
    })

    return successResponse({ success: true })
  } catch (error) {
    console.error(`Error removing badge ${params.badgeId} from member ${params.id}:`, error)
    return errorResponse("Failed to remove badge", 500)
  }
}

