import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,    // 10 minutes (wipe sensitive memory safely)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Utility to completely flush sensitive whistleblower cache from memory (e.g. on panic/logout)
export const clearSensitiveCache = () => {
  queryClient.clear()
}
