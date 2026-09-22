import type { LoginCredentials, AuthResponse } from '../types/auth.types'

/**
 * Compliance Officer login API call
 */
export async function loginOfficer(credentials: LoginCredentials): Promise<AuthResponse> {
  // In production: const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock valid officer response for local testing
  return {
    token: `officer-jwt-${Date.now()}`,
    user: {
      id: 'usr-1092',
      name: 'Sarah Vance',
      email: credentials.email,
      role: 'COMPLIANCE_OFFICER',
      department: 'Corporate Ethics & Integrity',
    },
  }
}
