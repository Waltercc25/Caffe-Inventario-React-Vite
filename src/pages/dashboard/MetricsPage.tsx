import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { productStore } from '@/lib/store'
import { Product } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { Database, TrendingUp, Package, DollarSign, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c']

export default function MetricsPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadProducts()
    } else if (user === null) {
      setLoading(false)
    }
  }, [user?.id])

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

  // Datos para gráfico de barras: Productos por tipo
  const productsByType = useMemo(() => {
    const typeCount: Record<string, number> = {}
    products.forEach(product => {
      const type = product.type || 'Sin tipo'
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }))
  }, [products])

  // Datos para gráfico de pastel: Distribución por tipo con valor total
  const distributionByType = useMemo(() => {
    const typeData: Record<string, { count: number; totalValue: number }> = {}
    products.forEach(product => {
      const type = product.type || 'Sin tipo'
      if (!typeData[type]) {
        typeData[type] = { count: 0, totalValue: 0 }
      }
      typeData[type].count += 1
      typeData[type].totalValue += (product.price || 0) * (product.stock || 0)
    })
    return Object.entries(typeData).map(([name, data]) => ({
      name,
      value: data.totalValue,
      count: data.count
    }))
  }, [products])

  // Datos para gráfico de líneas: Stock total por tipo
  const stockByType = useMemo(() => {
    const typeStock: Record<string, number> = {}
    products.forEach(product => {
      const type = product.type || 'Sin tipo'
      typeStock[type] = (typeStock[type] || 0) + (product.stock || 0)
    })
    return Object.entries(typeStock).map(([name, stock]) => ({ name, stock }))
  }, [products])

  // Datos para gráfico de área: Valor del inventario por tipo
  const valueByType = useMemo(() => {
    const typeValue: Record<string, number> = {}
    products.forEach(product => {
      const type = product.type || 'Sin tipo'
      const productValue = (product.price || 0) * (product.stock || 0)
      typeValue[type] = (typeValue[type] || 0) + productValue
    })
    return Object.entries(typeValue)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value)
  }, [products])

  // Estadísticas generales
  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0)
    const avgPrice = products.length > 0 
      ? products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length 
      : 0

    return {
      totalProducts,
      totalStock,
      totalValue,
      avgPrice
    }
  }, [products])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con indicador de Supabase */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas del Inventario</h1>
          <p className="text-muted-foreground mt-2">
            Análisis visual de los datos de tu inventario
          </p>
        </div>
        
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Fuente de datos:</strong> Los datos mostrados en estas métricas se obtienen directamente de la base de datos en Supabase en tiempo real.
          </AlertDescription>
        </Alert>
      </div>

      {/* Estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {productsByType.length} tipos diferentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              unidades en inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              valor del inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.avgPrice.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              por producto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Barras: Productos por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Productos por Tipo</CardTitle>
            <CardDescription>Distribución de productos según su categoría</CardDescription>
          </CardHeader>
          <CardContent>
            {productsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#0088FE" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Pastel: Distribución de Valor por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Valor</CardTitle>
            <CardDescription>Valor total del inventario por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            {distributionByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distributionByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Líneas: Stock por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Stock por Tipo</CardTitle>
            <CardDescription>Unidades disponibles por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            {stockByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="stock" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    name="Stock"
                    dot={{ fill: '#00C49F', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Área: Valor del Inventario por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle>Valor del Inventario</CardTitle>
            <CardDescription>Valor total por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            {valueByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={valueByType}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF8042" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#FF8042" 
                    fillOpacity={1} 
                    fill="url(#colorValue)"
                    name="Valor"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

