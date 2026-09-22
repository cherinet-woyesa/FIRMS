import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Valid corporate email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginCredentials = z.infer<typeof loginSchema>

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'COMPLIANCE_OFFICER' | 'LEAD_INVESTIGATOR' | 'ADMIN'
    department: string
  }
}
