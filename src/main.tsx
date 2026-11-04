import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import { loadBackend } from './lib/backend'
import { BackendProvider } from './lib/backend/context'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
})

const backend = await loadBackend()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackendProvider backend={backend}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster position="top-right" richColors closeButton toastOptions={{ style: { fontFamily: 'Outfit, sans-serif' } }} />
        </AuthProvider>
      </QueryClientProvider>
    </BackendProvider>
  </StrictMode>,
)
