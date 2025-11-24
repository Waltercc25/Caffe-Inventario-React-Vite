'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, we would set a cookie/token here
    router.push('/dashboard');
  };

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
            Ingrese sus credenciales para acceder al inventario
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  placeholder="admin@cafe.com" 
                  type="email" 
                  className="pl-10"
                  required
                  defaultValue="admin@cafe.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  required
                  defaultValue="password"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90" type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
