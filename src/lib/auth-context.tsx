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
      
      // If we have a hash with access_token, process the magic link
      if (accessToken && !session) {
        // Give Supabase time to process the hash tokens
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: newSession } }) => {
            if (newSession?.user) {
              setUser(newSession.user)
              // Store flag in sessionStorage to show success message
              sessionStorage.setItem('magicLinkVerified', 'true')
              // Clean up the URL hash
              window.history.replaceState({}, document.title, '/login')
              // Reload to show the login page with success message
              window.location.reload()
            }
            setLoading(false)
          })
        }, 500)
      } else if (accessToken && session) {
        // Session already exists, store flag and reload
        sessionStorage.setItem('magicLinkVerified', 'true')
        window.history.replaceState({}, document.title, '/login')
        window.location.reload()
      }
    })

    // Handle auth state changes (including magic link redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null
      const hasAccessToken = window.location.hash.includes('access_token')
      const isOnLoginPage = window.location.pathname === '/login'
      
      // Handle magic link confirmation
      if (event === 'SIGNED_IN') {
        setUser(newUser)
        setLoading(false)
        
        // Only handle redirects if we have an access token in the URL (magic link)
        if (hasAccessToken) {
          // Clean up URL hash
          window.history.replaceState({}, document.title, window.location.pathname)
          
          // Only redirect if we're on login page or root
          if (isOnLoginPage || window.location.pathname === '/') {
            // LoginPage will handle the redirect, don't do it here
            return
          }
        }
        // Don't redirect if already on dashboard or other protected routes
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(newUser)
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      } else {
        // For other events, update user state
        setUser(newUser)
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
    // Redirect to login page so user sees the verification message
    const redirectUrl = `${window.location.origin}/login`
    
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

