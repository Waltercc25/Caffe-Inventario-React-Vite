import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product, ProductType } from '@/lib/types'
import { generateSKUPreview } from '@/lib/sku-generator'
import { Sparkles } from 'lucide-react'

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: Omit<Product, 'id' | 'lastUpdated' | 'user_id' | 'qr_code'>) => void
  onCancel: () => void
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  // Usar strings para precio y stock para permitir campos vacíos mientras se escribe
  const [formData, setFormData] = useState<{
    name: string
    type: ProductType
    price: string | number
    stock: string | number
    sku: string
    description: string
    supplier: string
  }>({
    name: '',
    type: 'Coffee Bean',
    price: '',
    stock: '',
    sku: '',
    description: '',
    supplier: '',
  })
  const [skuPreview, setSkuPreview] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Coffee Bean',
        price: initialData.price ?? '',
        stock: initialData.stock ?? '',
        sku: initialData.sku || '',
        description: initialData.description || '',
        supplier: initialData.supplier || '',
      })
      setSkuPreview('') // No mostrar preview al editar
    } else {
      // Si es un producto nuevo, limpiar el formulario
      setFormData({
        name: '',
        type: 'Coffee Bean',
        price: '',
        stock: '',
        sku: '',
        description: '',
        supplier: '',
      })
      setSkuPreview('')
    }
  }, [initialData])

  // Generar preview del SKU cuando cambia el nombre (solo para productos nuevos)
  useEffect(() => {
    if (!initialData && formData.name && formData.name.trim().length > 0) {
      const preview = generateSKUPreview(formData.name)
      setSkuPreview(preview)
      
      // Si el SKU está vacío, establecer el preview como valor sugerido
      if (!formData.sku) {
        setFormData(prev => ({ ...prev, sku: preview }))
      }
    } else if (!formData.name || formData.name.trim().length === 0) {
      setSkuPreview('')
      if (!initialData) {
        setFormData(prev => ({ ...prev, sku: '' }))
      }
    }
  }, [formData.name, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos (SKU es opcional, se generará automáticamente si no se proporciona)
    if (!formData.name || formData.type === undefined) {
      console.error('Campos requeridos faltantes:', formData)
      return
    }

    // Preparar datos limpios para enviar
    // Si no hay SKU, se generará automáticamente en el store
    
    // Convertir precio y stock a números, permitiendo valores vacíos que se convertirán a 0
    const priceValue = formData.price === '' || formData.price === null || formData.price === undefined
      ? 0
      : typeof formData.price === 'number'
      ? formData.price
      : parseFloat(String(formData.price)) || 0

    const stockValue = formData.stock === '' || formData.stock === null || formData.stock === undefined
      ? 0
      : typeof formData.stock === 'number'
      ? formData.stock
      : parseInt(String(formData.stock), 10) || 0

    const cleanData: Omit<Product, 'id' | 'lastUpdated' | 'user_id' | 'qr_code'> = {
      name: formData.name || '',
      type: formData.type || 'Coffee Bean',
      price: priceValue,
      stock: stockValue,
      sku: formData.sku?.trim() || '', // SKU opcional, se generará si está vacío
      description: formData.description || undefined,
      supplier: formData.supplier || undefined,
    }

    // Validar que precio y stock sean números válidos
    if (isNaN(cleanData.price) || cleanData.price < 0) {
      console.error('Precio inválido:', cleanData.price)
      return
    }

    if (isNaN(cleanData.stock) || cleanData.stock < 0) {
      console.error('Stock inválido:', cleanData.stock)
      return
    }

    console.log('Submitting product data:', cleanData)
    onSubmit(cleanData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Producto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Ej. Café Colombia"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku" className="flex items-center gap-2">
            SKU / Código
            {!initialData && skuPreview && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Generado automáticamente
              </span>
            )}
          </Label>
          <div className="relative">
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder={initialData ? "COF-001" : "Se generará automáticamente"}
              className={!initialData && skuPreview ? "pr-20" : ""}
            />
            {!initialData && skuPreview && formData.sku === skuPreview && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                Auto
              </span>
            )}
          </div>
          {!initialData && skuPreview && (
            <p className="text-xs text-muted-foreground">
              El SKU se generará automáticamente basado en el nombre. Puedes editarlo si lo deseas.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value as ProductType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Coffee Bean">Grano de Café</SelectItem>
              <SelectItem value="Pastry">Repostería</SelectItem>
              <SelectItem value="Equipment">Equipo</SelectItem>
              <SelectItem value="Ingredient">Ingrediente</SelectItem>
              <SelectItem value="Merchandise">Mercancía</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">Proveedor</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Ej. Distribuidora Local"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price === 0 ? '' : formData.price}
            onChange={(e) => {
              const value = e.target.value
              // Permitir campo vacío mientras se escribe
              if (value === '') {
                setFormData({ ...formData, price: '' })
              } else {
                const numValue = parseFloat(value)
                if (!isNaN(numValue)) {
                  setFormData({ ...formData, price: numValue })
                }
              }
            }}
            onBlur={(e) => {
              // Si el campo queda vacío al perder el foco, establecer 0
              if (e.target.value === '') {
                setFormData({ ...formData, price: 0 })
              }
            }}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Actual</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock === 0 ? '' : formData.stock}
            onChange={(e) => {
              const value = e.target.value
              // Permitir campo vacío mientras se escribe
              if (value === '') {
                setFormData({ ...formData, stock: '' })
              } else {
                const numValue = parseInt(value, 10)
                if (!isNaN(numValue)) {
                  setFormData({ ...formData, stock: numValue })
                }
              }
            }}
            onBlur={(e) => {
              // Si el campo queda vacío al perder el foco, establecer 0
              if (e.target.value === '') {
                setFormData({ ...formData, stock: 0 })
              }
            }}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detalles adicionales del producto..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {initialData ? 'Actualizar Producto' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  )
}

