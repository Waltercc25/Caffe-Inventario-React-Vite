import { useState, useEffect } from 'react'
import { Plus, Search, QrCode, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ProductForm } from '@/components/product-form'
import { QRCodeDisplay } from '@/components/qr-code-display'
import { productStore } from '@/lib/store'
import { updateAllProductQRCodes } from '@/lib/update-qr-codes'
import { Product } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function InventoryPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingQR, setViewingQR] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingQR, setUpdatingQR] = useState(false)

  useEffect(() => {
    if (user) {
      loadProducts()
    }
  }, [user])

  const loadProducts = async () => {
    if (!user) return
    setLoading(true)
    const data = await productStore.getProducts(user.id)
    setProducts(data)
    setLoading(false)
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = async (data: Omit<Product, 'id' | 'lastUpdated' | 'user_id' | 'qr_code'>) => {
    if (!user) {
      toast.error('No estás autenticado. Por favor, inicia sesión.')
      return
    }
    
    try {
      const newProduct = await productStore.addProduct(data, user.id)
      if (newProduct) {
        toast.success('Producto agregado exitosamente')
        await loadProducts()
        setIsAddOpen(false)
      } else {
        toast.error('Error al agregar el producto')
      }
    } catch (error: any) {
      console.error('Error in handleAddProduct:', error)
      toast.error(error?.message || 'Error al agregar el producto. Revisa la consola para más detalles.')
    }
  }

  const handleEditProduct = async (data: Omit<Product, 'id' | 'lastUpdated' | 'user_id' | 'qr_code'>) => {
    if (!user || !editingProduct) return
    const updated = await productStore.updateProduct(editingProduct.id, data, user.id)
    if (updated) {
      toast.success('Producto actualizado exitosamente')
      await loadProducts()
      setEditingProduct(null)
    } else {
      toast.error('Error al actualizar el producto')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!user) return
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const success = await productStore.deleteProduct(id, user.id)
        if (success) {
          toast.success('Producto eliminado exitosamente')
          await loadProducts()
        } else {
          toast.error('Error al eliminar el producto')
        }
      } catch (error: any) {
        console.error('Error in handleDeleteProduct:', error)
        toast.error(error?.message || 'Error al eliminar el producto. Revisa la consola para más detalles.')
      }
    }
  }

  const handleUpdateQRCodes = async () => {
    if (!user) {
      toast.error('No estás autenticado. Por favor, inicia sesión.')
      return
    }

    setUpdatingQR(true)
    try {
      const result = await updateAllProductQRCodes()
      if (result.success) {
        toast.success(`Se actualizaron ${result.updated} códigos QR exitosamente`)
        await loadProducts() // Recargar productos para ver los cambios
      } else {
        toast.error(`Error al actualizar códigos QR: ${result.errors.join(', ')}`)
      }
    } catch (error: any) {
      console.error('Error updating QR codes:', error)
      toast.error(error?.message || 'Error al actualizar los códigos QR')
    } finally {
      setUpdatingQR(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-muted-foreground">Cargando productos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona tus productos y códigos QR.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleUpdateQRCodes} 
            variant="outline"
            disabled={updatingQR}
            title="Actualizar códigos QR existentes a formato URL"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${updatingQR ? 'animate-spin' : ''}`} />
            {updatingQR ? 'Actualizando...' : 'Actualizar QR'}
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Buscar por nombre, SKU o tipo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm relative overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>{product.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {product.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock < 10 ? "text-destructive font-bold" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setViewingQR(product)}
                        title="Ver QR"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setEditingProduct(product)}
                        title="Editar producto"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleAddProduct} 
            onCancel={() => setIsAddOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <ProductForm 
            initialData={editingProduct || undefined}
            onSubmit={handleEditProduct} 
            onCancel={() => setEditingProduct(null)} 
          />
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!viewingQR} onOpenChange={(open) => !open && setViewingQR(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Código QR del Producto</DialogTitle>
          </DialogHeader>
          {viewingQR && viewingQR.qr_code && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <QRCodeDisplay 
                value={viewingQR.qr_code} 
                label={viewingQR.name}
              />
              <div className="text-center space-y-1">
                <p className="font-medium">{viewingQR.name}</p>
                <p className="text-sm text-muted-foreground font-mono">{viewingQR.sku}</p>
              </div>
              <Button className="w-full" onClick={() => window.print()}>
                Imprimir Etiqueta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

