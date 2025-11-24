import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, DollarSign, Box, Hash, Calendar, User, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { QRCodeDisplay } from '@/components/qr-code-display'
import { productStore } from '@/lib/store'
import { Product } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export default function ProductDetailPage() {
  const { sku } = useParams<{ sku: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      if (!sku) {
        setError('SKU no proporcionado')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const decodedSku = decodeURIComponent(sku)
        const productData = await productStore.getProductBySku(decodedSku)
        
        if (productData) {
          setProduct(productData)
        } else {
          setError('Producto no encontrado')
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [sku])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Producto no encontrado</CardTitle>
            <CardDescription>
              {error || 'El producto que buscas no existe o ha sido eliminado.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'Coffee Bean': 'Grano de Café',
      'Pastry': 'Repostería',
      'Equipment': 'Equipo',
      'Ingredient': 'Ingrediente',
      'Merchandise': 'Mercancía'
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalles del Producto</h1>
            <p className="text-muted-foreground">Información completa del producto escaneado</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información del Producto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                <p className="text-lg font-semibold">{product.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    SKU
                  </label>
                  <p className="text-base font-mono">{product.sku}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Box className="h-3 w-3" />
                    Tipo
                  </label>
                  <Badge variant="secondary" className="mt-1">
                    {getTypeLabel(product.type)}
                  </Badge>
                </div>
              </div>

              {product.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Descripción
                  </label>
                  <p className="text-sm mt-1 text-muted-foreground">{product.description}</p>
                </div>
              )}

              {product.supplier && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Proveedor
                  </label>
                  <p className="text-sm mt-1">{product.supplier}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Precio y Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Precio y Disponibilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Precio</label>
                <p className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Stock Disponible</label>
                <p className={`text-2xl font-bold ${product.stock < 10 ? 'text-destructive' : 'text-primary'}`}>
                  {product.stock} unidades
                </p>
                {product.stock < 10 && (
                  <p className="text-sm text-destructive mt-1">
                    ⚠️ Stock bajo
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Última actualización
                </label>
                <p className="text-sm mt-1 text-muted-foreground">
                  {new Date(product.lastUpdated).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Código QR */}
        <Card>
          <CardHeader>
            <CardTitle>Código QR del Producto</CardTitle>
            <CardDescription>
              Escanea este código para compartir o acceder rápidamente a este producto
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {product.qr_code && (
              <QRCodeDisplay 
                value={product.qr_code} 
                size={200}
                label={product.name}
              />
            )}
            <div className="text-center space-y-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground font-mono">{product.sku}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

