import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. ' +
    'See .env.example for reference.'
  )
}

// Configuración del cliente de Supabase optimizada para MCP
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'cafe-inventory-system@0.1.0'
    }
  }
})

// Función helper para verificar la conexión
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').select('count').limit(0)
    return !error
  } catch (error) {
    console.error('Error checking Supabase connection:', error)
    return false
  }
}

