import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse, validateRequest } from "@/lib/api-utils"
import { z } from "zod"
import { randomBytes } from "crypto"

// Only accessible by super admin - would need proper auth in a real app
// This is just for demonstration purposes

// Validation schema for tenant creation
const tenantCreateSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
  domain: z.string().min(1, "Domain is required"),
  customerId: z.string().min(1, "Customer ID is required"),
})

// GET /api/admin/tenants - Get all tenants
export async function GET(req: NextRequest) {
  // In a real app, you would check if the user is a super admin

  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { name: "asc" },
    })

    return successResponse(tenants)
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return errorResponse("Failed to fetch tenants", 500)
  }
}

// POST /api/admin/tenants - Create a new tenant
export async function POST(req: NextRequest) {
  // In a real app, you would check if the user is a super admin

  try {
    const validation = await validateRequest(req, tenantCreateSchema)

    if (!validation.isValid) {
      return errorResponse(validation.error, 400, "VALIDATION_ERROR")
    }

    const { name, domain, customerId } = validation.data

    // Check if domain or customerId already exists
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        OR: [{ domain }, { customerId }],
      },
    })

    if (existingTenant) {
      return errorResponse("A tenant with this domain or customer ID already exists", 400, "DUPLICATE_TENANT")
    }

    // Generate API key
    const apiKey = randomBytes(32).toString("hex")

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name,
        domain,
        customerId,
        apiKey,
      },
    })

    // Create a default team for the tenant
    await prisma.team.create({
      data: {
        name: "Default Team",
        description: "Default team for new members",
        tenantId: tenant.id,
      },
    })

    return successResponse(tenant)
  } catch (error) {
    console.error("Error creating tenant:", error)
    return errorResponse("Failed to create tenant", 500)
  }
}

