/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // MCP Configuration (opcional)
  readonly SUPABASE_ACCESS_TOKEN?: string
  readonly PROJECT_REF?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

