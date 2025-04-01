export interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
}

export interface TeamCreate {
  name: string
  description: string
}

export interface TeamUpdate {
  id: string
  name: string
  description: string
  memberCount?: number
  createdAt?: string
}

