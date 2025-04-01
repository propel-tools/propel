import type { Badge, BadgeCreate, BadgeUpdate } from "@/types/badge"
import { apiClient } from "@/lib/api-client"
import { apiRoutes } from "@/lib/api-routes"

// Mock data for fallback
const mockBadges: Badge[] = [
  {
    id: "1",
    name: "MVP",
    description: "Most Valuable Player - Exceptional contribution to team goals",
    color: "#FFD700",
    createdAt: "2020-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Problem Solver",
    description: "Consistently resolves complex issues",
    color: "#4CAF50",
    createdAt: "2020-02-10T00:00:00.000Z",
  },
  {
    id: "3",
    name: "5+ Years",
    description: "More than 5 years with the team",
    color: "#2196F3",
    createdAt: "2020-03-05T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Mentor",
    description: "Actively mentors other team members",
    color: "#9C27B0",
    createdAt: "2020-04-20T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Documentation",
    description: "Excellence in documentation",
    color: "#607D8B",
    createdAt: "2020-05-15T00:00:00.000Z",
  },
  {
    id: "6",
    name: "Bug Hunter",
    description: "Finds and fixes critical bugs",
    color: "#F44336",
    createdAt: "2020-06-10T00:00:00.000Z",
  },
  {
    id: "7",
    name: "Automation",
    description: "Creates tools and scripts to automate processes",
    color: "#FF9800",
    createdAt: "2020-07-05T00:00:00.000Z",
  },
  {
    id: "8",
    name: "New Hire",
    description: "Recently joined the team",
    color: "#03A9F4",
    createdAt: "2020-08-20T00:00:00.000Z",
  },
]

/**
 * Fetch all badges
 */
export async function getBadges(): Promise<Badge[]> {
  const response = await apiClient<Badge[]>({
    endpoint: apiRoutes.badges.list,
    mockData: mockBadges,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Fetch a single badge by ID
 */
export async function getBadge(id: string): Promise<Badge> {
  // Find the mock badge for fallback
  const mockBadge = mockBadges.find((b) => b.id === id)

  if (!mockBadge) {
    throw new Error(`Badge with ID ${id} not found`)
  }

  const response = await apiClient<Badge>({
    endpoint: apiRoutes.badges.detail(id),
    mockData: mockBadge,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Add a new badge
 */
export async function addBadge(badge: BadgeCreate): Promise<Badge> {
  // Create a mock response for fallback
  const mockResponse: Badge = {
    id: Math.random().toString(36).substring(2, 9),
    name: badge.name,
    description: badge.description,
    color: badge.color,
    createdAt: new Date().toISOString(),
  }

  const response = await apiClient<Badge>({
    endpoint: apiRoutes.badges.create,
    method: "POST",
    body: badge,
    mockData: mockResponse,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Update an existing badge
 */
export async function updateBadge(badge: BadgeUpdate): Promise<Badge> {
  // Create a mock response for fallback
  const mockResponse: Badge = {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    color: badge.color,
    createdAt: badge.createdAt || new Date().toISOString(),
  }

  const response = await apiClient<Badge>({
    endpoint: apiRoutes.badges.update(badge.id),
    method: "PUT",
    body: badge,
    mockData: mockResponse,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Delete a badge
 */
export async function deleteBadge(id: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>({
    endpoint: apiRoutes.badges.delete(id),
    method: "DELETE",
    mockData: { success: true },
  })

  if (response.error) {
    throw response.error
  }
}

/**
 * Assign a badge to a member
 */
export async function assignBadgeToMember(memberId: string, badgeId: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>({
    endpoint: apiRoutes.members.addBadge(memberId),
    method: "POST",
    body: { badgeId },
    mockData: { success: true },
  })

  if (response.error) {
    throw response.error
  }
}

/**
 * Remove a badge from a member
 */
export async function removeBadgeFromMember(memberId: string, badgeId: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>({
    endpoint: apiRoutes.members.removeBadge(memberId, badgeId),
    method: "DELETE",
    mockData: { success: true },
  })

  if (response.error) {
    throw response.error
  }
}

