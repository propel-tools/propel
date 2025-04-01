import type { Team, TeamCreate, TeamUpdate } from "@/types/team"
import { apiClient } from "@/lib/api-client"

// Mock data for fallback
const mockTeams: Team[] = [
  {
    id: "1",
    name: "Engineering",
    description: "Frontend and backend development team",
    memberCount: 12,
    createdAt: "2020-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Design",
    description: "UI/UX and graphic design team",
    memberCount: 8,
    createdAt: "2021-03-10T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Product",
    description: "Product management and strategy",
    memberCount: 5,
    createdAt: "2022-06-22T00:00:00.000Z",
  },
]

/**
 * Fetch all teams
 */
export async function getTeams(): Promise<Team[]> {
  const response = await apiClient<Team[]>({
    endpoint: "/teams",
    mockData: mockTeams,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Fetch a single team by ID
 */
export async function getTeam(id: string): Promise<Team> {
  // Find the mock team for fallback
  const mockTeam = mockTeams.find((t) => t.id === id)

  if (!mockTeam) {
    throw new Error(`Team with ID ${id} not found`)
  }

  const response = await apiClient<Team>({
    endpoint: `/teams/${id}`,
    mockData: mockTeam,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Add a new team
 */
export async function addTeam(team: TeamCreate): Promise<Team> {
  // Create a mock response for fallback
  const mockResponse: Team = {
    id: Math.random().toString(36).substring(2, 9),
    name: team.name,
    description: team.description,
    memberCount: 0,
    createdAt: new Date().toISOString(),
  }

  const response = await apiClient<Team>({
    endpoint: "/teams",
    method: "POST",
    body: team,
    mockData: mockResponse,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Update an existing team
 */
export async function updateTeam(team: TeamUpdate): Promise<Team> {
  // Create a mock response for fallback
  const mockResponse: Team = {
    id: team.id,
    name: team.name,
    description: team.description,
    memberCount: team.memberCount || 0,
    createdAt: team.createdAt || new Date().toISOString(),
  }

  const response = await apiClient<Team>({
    endpoint: `/teams/${team.id}`,
    method: "PUT",
    body: team,
    mockData: mockResponse,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>({
    endpoint: `/teams/${id}`,
    method: "DELETE",
    mockData: { success: true },
  })

  if (response.error) {
    throw response.error
  }
}

