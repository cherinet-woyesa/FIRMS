import { create } from 'zustand'
import type { User, SystemRole } from '@/types/common.types'
import { SYSTEM_ROLES } from '@/constants/systemRoles'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  currentRole: SystemRole
  setAuth: (user: User, token: string) => void
  setRole: (role: SystemRole) => void
  logout: () => void
}

const defaultOfficer: User = {
  id: 'usr-officer-lead',
  name: 'Lead Compliance Officer',
  email: 'compliance.officer@cbe.com.et',
  role: 'LEAD_INVESTIGATOR',
  department: 'Ethics & Internal Audit Directorate',
}

const storedToken = sessionStorage.getItem('officer_access_token') || 'demo_officer_token_lead'
const initialRole: SystemRole = (sessionStorage.getItem('active_system_role') as SystemRole) || 'FI_DIRECTOR'

export const useAuthStore = create<AuthState>((set) => ({
  user: defaultOfficer,
  token: storedToken,
  isAuthenticated: true,
  currentRole: initialRole,

  setAuth: (user, token) => {
    sessionStorage.setItem('officer_access_token', token)
    set({ user, token, isAuthenticated: true })
  },

  setRole: (role: SystemRole) => {
    sessionStorage.setItem('active_system_role', role)
    const roleMeta = SYSTEM_ROLES[role]
    set({
      currentRole: role,
      user: {
        id: `usr-${role.toLowerCase()}`,
        name: roleMeta.title,
        email: `${role.toLowerCase()}@cbe.com.et`,
        role,
        department: roleMeta.department,
      },
    })
  },

  logout: () => {
    sessionStorage.removeItem('officer_access_token')
    sessionStorage.removeItem('active_system_role')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
