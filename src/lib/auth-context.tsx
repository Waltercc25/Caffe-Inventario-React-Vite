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
    // Check for hash fragments from magic link redirect FIRST
    // This must be done before getSession to ensure Supabase processes the tokens
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const error = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')
    
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      // If we have a hash with access_token, wait a bit for Supabase to process it
      if (accessToken && !session) {
        // Give Supabase time to process the hash tokens
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: newSession } }) => {
            if (newSession?.user) {
              setUser(newSession.user)
              // Clean up the URL hash after session is established
              window.history.replaceState({}, document.title, window.location.pathname)
              // Redirect to dashboard
              if (window.location.pathname === '/login' || window.location.pathname === '/') {
                window.location.href = '/dashboard'
              }
            }
            setLoading(false)
          })
        }, 500)
      } else if (accessToken && session) {
        // Session already exists, just clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname)
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          window.location.href = '/dashboard'
        }
      }
    })

    // Handle auth state changes (including magic link redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      
      // Handle magic link confirmation
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
        setLoading(false)
        // Clean up URL hash if present
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname)
        }
        // Redirect to dashboard after successful sign in
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          // Use setTimeout to ensure state is updated before redirect
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 100)
        }
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      } else {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })
    
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

