import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from '@/store/store'
import { queryClient } from '@/lib/queryClient'
import { AppRoutes } from '@/app/AppRoutes'

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  )
}

export default App
