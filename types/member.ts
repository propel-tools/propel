import type { LucideIcon } from "lucide-react"

export interface Member {
  id: string
  name: string
  email: string
  role: string
  teamId: string
  teamName: string
  isOnCall: boolean
  badges: string[]
  skills?: string[]
  phone?: string
  joinedAt?: string
  activities?: Activity[]
}

export interface Activity {
  id: string
  title: string
  description: string
  timestamp: string
  icon: LucideIcon
}

export interface MemberCreate {
  name: string
  email: string
  role: string
  teamId: string
  isOnCall: boolean
  badges: string[]
}

export interface MemberUpdate {
  id: string
  name: string
  email: string
  role: string
  teamId: string
  isOnCall: boolean
  badges: string[]
  skills: string[]
  phone?: string
  joinedAt?: string
}

