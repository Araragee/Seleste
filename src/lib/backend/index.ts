import type { Backend } from './types'

export * from './types'

/**
 * Picks the backend at startup. With Supabase env vars set the app talks to
 * a real Postgres + Auth + Storage project; otherwise it runs in demo mode
 * entirely in the browser. Both are code-split so only one is downloaded.
 */
export async function loadBackend(): Promise<Backend> {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (url && key) {
    const { createSupabaseBackend } = await import('./supabase')
    return createSupabaseBackend(url, key)
  }
  const { createLocalBackend } = await import('./local')
  return createLocalBackend()
}
