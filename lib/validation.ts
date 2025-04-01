import { z } from "zod"

// Team validation schemas
export const teamCreateSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100),
  description: z.string().max(500).optional().default(""),
})

export const teamUpdateSchema = teamCreateSchema.extend({
  id: z.string().min(1, "Team ID is required"),
})

// Member validation schemas
export const memberCreateSchema = z.object({
  name: z.string().min(1, "Member name is required").max(100),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  teamId: z.string().min(1, "Team ID is required"),
  isOnCall: z.boolean().optional().default(false),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
  badges: z.array(z.string()).optional().default([]),
})

export const memberUpdateSchema = memberCreateSchema
  .extend({
    id: z.string().min(1, "Member ID is required"),
  })
  .partial()
  .required({ id: true })

// Badge validation schemas
export const badgeCreateSchema = z.object({
  name: z.string().min(1, "Badge name is required").max(50),
  description: z.string().max(200).optional().default(""),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color format")
    .default("#000000"),
})

export const badgeUpdateSchema = badgeCreateSchema
  .extend({
    id: z.string().min(1, "Badge ID is required"),
  })
  .partial()
  .required({ id: true })

// Badge assignment schema
export const badgeAssignmentSchema = z.object({
  badgeId: z.string().min(1, "Badge ID is required"),
})

