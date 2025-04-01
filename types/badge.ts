export interface Badge {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}

export interface BadgeCreate {
  name: string
  description: string
  color: string
}

export interface BadgeUpdate {
  id: string
  name: string
  description: string
  color: string
  createdAt?: string
}

