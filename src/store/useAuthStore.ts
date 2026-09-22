import { create } from 'zustand'
import type { User } from '@/types/common.types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: sessionStorage.getItem('officer_access_token'),
  isAuthenticated: !!sessionStorage.getItem('officer_access_token'),
  setAuth: (user, token) => {
    sessionStorage.setItem('officer_access_token', token)
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    sessionStorage.removeItem('officer_access_token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
