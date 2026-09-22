/**
 * Type-safe access to Vite environment variables
 */
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'TrustBridge Whistleblower Portal',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
