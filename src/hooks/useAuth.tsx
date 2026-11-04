import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useBackend } from '@/lib/backend/context'
import type { AuthUser } from '@/lib/backend/types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const backend = useBackend()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    backend
      .getUser()
      .then((u) => active && setUser(u))
      .finally(() => active && setLoading(false))
    const unsubscribe = backend.onAuthChange((u) => {
      setUser(u)
      queryClient.clear()
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [backend, queryClient])

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await backend.signIn(email, password))
  }, [backend])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    setUser(await backend.signUp(email, password, fullName))
  }, [backend])

  const signOut = useCallback(async () => {
    await backend.signOut()
    setUser(null)
    queryClient.clear()
  }, [backend, queryClient])

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading, signIn, signUp, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
