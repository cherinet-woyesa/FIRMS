/**
 * Centralized Route Paths
 * Prevents hardcoded URL strings across components
 */
export const ROUTES = {
  // Public Reporter Routes
  HOME: '/',
  REPORT: '/report',
  TRACK: '/track',

  // Compliance Officer Auth
  LOGIN: '/login',

  // Compliance Officer Dashboard
  DASHBOARD: '/dashboard',
  CASES: '/dashboard/cases',
  CASE_DETAIL: (id: string) => `/dashboard/cases/${id}`,
  USERS: '/dashboard/users',
  ACCESS_MANAGEMENT: '/dashboard/access',
  AUDIT_LOGS: '/dashboard/audit',
  SETTINGS: '/dashboard/settings',
} as const
