import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Handle auth state changes (including magic link redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle magic link confirmation
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        // Redirect to dashboard after successful sign in
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          window.location.href = '/dashboard'
        }
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })

    // Check for hash fragments from magic link redirect
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const error = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')
    
    if (accessToken) {
      // Magic link redirect detected, session will be set by onAuthStateChange
      // Clean up the URL hash
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    if (error) {
      console.error('Auth error:', error, errorDescription)
      setLoading(false)
    }

    return () => subscription.unsubscribe()
  }, [])

  const signInWithEmail = async (email: string) => {
    // Determine the correct redirect URL based on environment
    const redirectUrl = import.meta.env.PROD 
      ? `${window.location.origin}/dashboard`
      : `${window.location.origin}/dashboard`
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

