/**
 * API route definitions
 * This centralizes all API endpoints for easier management
 */
export const apiRoutes = {
  members: {
    list: "/members",
    detail: (id: string) => `/members/${id}`,
    create: "/members",
    update: (id: string) => `/members/${id}`,
    delete: (id: string) => `/members/${id}`,
    badges: (id: string) => `/members/${id}/badges`,
    addBadge: (id: string) => `/members/${id}/badges`,
    removeBadge: (id: string, badgeId: string) => `/members/${id}/badges/${badgeId}`,
  },
  teams: {
    list: "/teams",
    detail: (id: string) => `/teams/${id}`,
    create: "/teams",
    update: (id: string) => `/teams/${id}`,
    delete: (id: string) => `/teams/${id}`,
    members: (id: string) => `/teams/${id}/members`,
    addMember: (id: string) => `/teams/${id}/members`,
    removeMember: (id: string, memberId: string) => `/teams/${id}/members/${memberId}`,
  },
  badges: {
    list: "/badges",
    detail: (id: string) => `/badges/${id}`,
    create: "/badges",
    update: (id: string) => `/badges/${id}`,
    delete: (id: string) => `/badges/${id}`,
  },
}

