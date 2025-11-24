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
  const [lastSignInAttempt, setLastSignInAttempt] = useState<number>(0)
  const RATE_LIMIT_COOLDOWN = 60000 // 60 segundos entre solicitudes

  useEffect(() => {
    let isMounted = true
    let processedMagicLink = false
    
    // Check for hash fragments from magic link redirect FIRST
    // This must be done before getSession to ensure Supabase processes the tokens
    const hash = window.location.hash
    const hashParams = new URLSearchParams(hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const error = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')
    
    // Si hay un access_token en el hash, Supabase lo procesará automáticamente
    // Solo necesitamos esperar a que onAuthStateChange lo detecte
    if (accessToken) {
      processedMagicLink = true
      console.log('🔗 Magic Link detected, waiting for Supabase to process...', {
        hasHash: !!hash,
        pathname: window.location.pathname
      })
    }
    
    // Check active sessions and sets the user (solo una vez)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return
      
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Si hay access_token pero no hay sesión aún, esperar a que Supabase lo procese
      if (accessToken && !session && processedMagicLink) {
        // El onAuthStateChange debería manejar esto, pero por si acaso esperamos un poco
        console.log('Access token found but no session yet, waiting for auth state change...')
      } else if (accessToken && session && processedMagicLink) {
        // Ya hay sesión, solo limpiar el hash y mostrar mensaje
        sessionStorage.setItem('magicLinkVerified', 'true')
        // Limpiar el hash sin recargar
        window.history.replaceState({}, document.title, '/login')
      }
    })

    // Handle auth state changes (including magic link redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      
      const newUser = session?.user ?? null
      const hasAccessToken = window.location.hash.includes('access_token')
      const isOnLoginPage = window.location.pathname === '/login'
      
      console.log('Auth state change:', event, { hasAccessToken, isOnLoginPage, hasUser: !!newUser })
      
      // Handle magic link confirmation
      if (event === 'SIGNED_IN') {
        setUser(newUser)
        setLoading(false)
        
        // Si hay access_token, es un Magic Link
        if (hasAccessToken) {
          // Marcar que el Magic Link fue verificado
          sessionStorage.setItem('magicLinkVerified', 'true')
          
          // Limpiar el hash de la URL
          const currentPath = window.location.pathname
          window.history.replaceState({}, document.title, currentPath)
          
          // Si estamos en login o root, LoginPage manejará la redirección
          if (isOnLoginPage || currentPath === '/') {
            console.log('Magic Link verified on login page, LoginPage will redirect')
            return
          }
          
          // Si estamos en otra página, redirigir al dashboard
          if (currentPath !== '/dashboard' && !currentPath.startsWith('/dashboard')) {
            console.log('Redirecting to dashboard after Magic Link')
            setTimeout(() => {
              window.location.href = '/dashboard'
            }, 100)
          }
        }
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

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithEmail = async (email: string) => {
    // Rate limiting: prevenir múltiples solicitudes en poco tiempo
    const now = Date.now()
    const timeSinceLastAttempt = now - lastSignInAttempt
    
    if (timeSinceLastAttempt < RATE_LIMIT_COOLDOWN) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_COOLDOWN - timeSinceLastAttempt) / 1000)
      return { 
        error: { 
          message: `Por favor espera ${remainingSeconds} segundos antes de solicitar otro enlace. Esto previene el spam.` 
        } 
      }
    }
    
    setLastSignInAttempt(now)
    
    // Redirect to login page so user sees the verification message
    const redirectUrl = `${window.location.origin}/login`
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })
      
      if (error) {
        // Si es error 429, dar mensaje más claro
        if (error.status === 429 || error.message?.includes('429')) {
          return {
            error: {
              ...error,
              message: 'Demasiadas solicitudes. Por favor espera unos minutos antes de intentar nuevamente.'
            }
          }
        }
        return { error }
      }
      
      return { error: null }
    } catch (err: any) {
      return { 
        error: { 
          message: err.message || 'Error al enviar el enlace de verificación. Por favor intenta más tarde.' 
        } 
      }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      // Reset rate limit al cerrar sesión para permitir nuevo login
      setLastSignInAttempt(0)
    } catch (error) {
      console.error('Error signing out:', error)
      // Aún así, limpiar el estado local
      setUser(null)
      setLastSignInAttempt(0)
    }
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

