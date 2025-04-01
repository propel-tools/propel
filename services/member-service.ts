import type { Member, MemberCreate, MemberUpdate } from "@/types/member"
import { apiClient } from "@/lib/api-client"
import { FileText, GitPullRequest, MessageSquare, Star } from "lucide-react"

// Mock data for fallback
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Team Lead",
    teamId: "1",
    teamName: "Engineering",
    isOnCall: true,
    badges: ["MVP", "5+ Years", "Mentor"],
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    joinedAt: "2020-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "Senior Member",
    teamId: "2",
    teamName: "Design",
    isOnCall: false,
    badges: ["Problem Solver", "Documentation"],
    skills: ["UI Design", "Figma", "User Research"],
    joinedAt: "2021-03-10T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Member",
    teamId: "1",
    teamName: "Engineering",
    isOnCall: false,
    badges: ["New Hire"],
    skills: ["Python", "Django", "AWS"],
    joinedAt: "2023-06-22T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    role: "Member",
    teamId: "3",
    teamName: "Product",
    isOnCall: false,
    badges: ["Bug Hunter", "Automation"],
    skills: ["Product Management", "Agile", "JIRA"],
    joinedAt: "2022-11-05T00:00:00.000Z",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    role: "Admin",
    teamId: "1",
    teamName: "Engineering",
    isOnCall: false,
    badges: ["MVP", "5+ Years"],
    skills: ["Architecture", "DevOps", "Kubernetes"],
    joinedAt: "2019-08-12T00:00:00.000Z",
  },
]

// Mock activities for member profile
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

/**
 * Fetch all members
 */
export async function getMembers(): Promise<Member[]> {
  const response = await apiClient<Member[]>({
    endpoint: "/members",
    mockData: mockMembers,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Fetch a single member by ID
 */
export async function getMember(id: string): Promise<Member> {
  // Find the mock member for fallback
  const mockMember = mockMembers.find((m) => m.id === id)

  if (!mockMember) {
    throw new Error(`Member with ID ${id} not found`)
  }

  // Add activities to the mock data
  const mockMemberWithActivities = {
    ...mockMember,
    activities: mockActivities,
  }

  const response = await apiClient<Member>({
    endpoint: `/members/${id}`,
    mockData: mockMemberWithActivities,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Add a new member
 */
export async function addMember(member: MemberCreate): Promise<Member> {
  // Create a mock response for fallback
  const mockResponse: Member = {
    id: Math.random().toString(36).substring(2, 9),
    name: member.name,
    email: member.email,
    role: member.role,
    teamId: member.teamId,
    teamName: member.teamId === "1" ? "Engineering" : member.teamId === "2" ? "Design" : "Product",
    isOnCall: member.isOnCall,
    badges: member.badges,
    skills: [],
    joinedAt: new Date().toISOString(),
  }

  const response = await apiClient<Member>({
    endpoint: "/members",
    method: "POST",
    body: member,
    mockData: mockResponse,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Update an existing member
 */
export async function updateMember(member: MemberUpdate): Promise<Member> {
  // Create a mock response for fallback
  const mockResponse: Member = {
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    teamId: member.teamId,
    teamName: member.teamId === "1" ? "Engineering" : member.teamId === "2" ? "Design" : "Product",
    isOnCall: member.isOnCall,
    badges: member.badges,
    skills: member.skills,
    phone: member.phone,
    joinedAt: new Date().toISOString(),
  }

  const response = await apiClient<Member>({
    endpoint: `/members/${member.id}`,
    method: "PUT",
    body: member,
    mockData: mockResponse,
  })

  if (response.error) {
    throw response.error
  }

  return response.data
}

/**
 * Delete a member
 */
export async function deleteMember(id: string): Promise<void> {
  const response = await apiClient<{ success: boolean }>({
    endpoint: `/members/${id}`,
    method: "DELETE",
    mockData: { success: true },
  })

  if (response.error) {
    throw response.error
  }
}

