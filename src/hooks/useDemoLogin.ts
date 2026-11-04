import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useBackend } from '@/lib/backend/context'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/backend/seed'
import { useAuth } from './useAuth'

/** Returns a one-click demo sign-in in demo mode, or undefined with a real backend. */
export function useDemoLogin(next = '/app') {
  const backend = useBackend()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  if (backend.mode !== 'demo') return undefined
  return async () => {
    try {
      await signIn(DEMO_EMAIL, DEMO_PASSWORD)
      toast.success('Signed in to the demo account', { description: 'Explore orders, the production queue and settings.' })
      navigate(next)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Demo sign-in failed')
    }
  }
}
