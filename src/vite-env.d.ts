/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** 'hash' for hosts that can't rewrite every path to index.html. */
  readonly VITE_ROUTER?: 'hash' | 'browser'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
