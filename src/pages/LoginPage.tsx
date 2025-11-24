import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signInWithEmail } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await signInWithEmail(email)

    if (error) {
      toast.error('Error al enviar el enlace de verificación')
      setIsLoading(false)
      return
    }

    setEmailSent(true)
    setIsLoading(false)
    toast.success('¡Enlace de verificación enviado! Revisa tu correo electrónico.')
  }

  // Check if user is already logged in (from magic link)
  const { user, loading } = useAuth()
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1447933601403-0c60e017bc32?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 text-white">
          <div className="text-center">Verificando sesión...</div>
        </div>
      </div>
    )
  }
  
  // Redirect if already logged in
  if (user) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1447933601403-0c60e017bc32?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <Card className="w-full max-w-md relative z-10 border-none shadow-2xl bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Coffee className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Café Manager</CardTitle>
          <CardDescription>
            {emailSent 
              ? 'Revisa tu correo para el enlace de acceso'
              : 'Ingresa tu correo para recibir un enlace de acceso'
            }
          </CardDescription>
        </CardHeader>
        {!emailSent ? (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    placeholder="tu@correo.com" 
                    type="email" 
                    className="pl-10"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Te enviaremos un enlace mágico a tu correo para iniciar sesión de forma segura.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" type="submit" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar enlace de acceso'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-medium">¡Enlace enviado!</p>
                <p className="text-sm text-muted-foreground">
                  Revisa tu correo <strong>{email}</strong> y haz clic en el enlace para acceder.
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  ¿No recibiste el correo? Revisa tu carpeta de spam.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }}
                className="mt-4"
              >
                Intentar con otro correo
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

