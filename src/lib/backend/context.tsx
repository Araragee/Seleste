import { createContext, useContext, type ReactNode } from 'react'
import type { Backend } from './types'

const BackendContext = createContext<Backend | null>(null)

export function BackendProvider({ backend, children }: { backend: Backend; children: ReactNode }) {
  return <BackendContext.Provider value={backend}>{children}</BackendContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBackend(): Backend {
  const backend = useContext(BackendContext)
  if (!backend) throw new Error('useBackend must be used inside <BackendProvider>')
  return backend
}
