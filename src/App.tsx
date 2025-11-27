import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import LoginPage from '@/pages/LoginPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import DashboardLayout from '@/pages/dashboard/DashboardLayout'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import InventoryPage from '@/pages/dashboard/InventoryPage'
import MetricsPage from '@/pages/dashboard/MetricsPage'

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Ruta pública para ver detalles del producto escaneando el QR */}
      <Route path="/product/:sku" element={<ProductDetailPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="metrics" element={<MetricsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

