import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, TrendingUp, AlertCircle, DollarSign, Plus, BarChart3, PackageSearch, ArrowRight } from 'lucide-react'
import { productStore } from '@/lib/store'
import { Product } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadProducts()
    } else if (user === null) {
      // User is not authenticated, stop loading
      setLoading(false)
    }
  }, [user?.id]) // Only depend on user.id, not the entire user object

  const loadProducts = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await productStore.getProducts(user.id)
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  const totalProducts = products.length
  const lowStock = products.filter(p => p.stock < 20).length
  const totalValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0)
  const lowStockProducts = products.filter(p => p.stock < 20).slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">Bienvenido al sistema de gestión de inventario.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Items registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Costo total estimado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStock}</div>
            <p className="text-xs text-muted-foreground">Requieren reordenar</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">Desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay productos registrados aún.</p>
              ) : (
                products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.type}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/dashboard/inventory')}
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Nuevo Producto</span>
              </Button>
              <Button
                onClick={() => navigate('/dashboard/inventory')}
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <PackageSearch className="h-5 w-5" />
                <span className="text-sm font-medium">Ver Inventario</span>
              </Button>
              <Button
                onClick={() => navigate('/dashboard/metrics')}
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm font-medium">Ver Métricas</span>
              </Button>
              <Button
                onClick={() => navigate('/dashboard/inventory')}
                variant="outline"
                className="h-auto flex-col items-center justify-center py-4 gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Bajo Stock</span>
                {lowStock > 0 && (
                  <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">
                    {lowStock}
                  </span>
                )}
              </Button>
            </div>
            
            {lowStockProducts.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-destructive">Productos con Bajo Stock</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard/inventory')}
                    className="h-6 text-xs"
                  >
                    Ver todos
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2 bg-destructive/10 rounded-md hover:bg-destructive/20 transition-colors cursor-pointer"
                      onClick={() => navigate('/dashboard/inventory')}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.type}</p>
                      </div>
                      <div className="ml-2 text-right">
                        <p className="text-sm font-bold text-destructive">{product.stock}</p>
                        <p className="text-xs text-muted-foreground">unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

