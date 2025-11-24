import { supabase } from './supabase'
import { Product } from './types'
import { generateSKU } from './sku-generator'

// Helper function to map database row to Product type
function mapProductFromDB(row: any): Product {
  return {
    ...row,
    lastUpdated: row.lastupdated || row.lastUpdated || new Date().toISOString(),
  }
}

// Helper function to generate QR code URL
function generateQRUrl(sku: string): string {
  const baseUrl = window.location.origin
  // Codificar el SKU para la URL (por si tiene caracteres especiales)
  const encodedSku = encodeURIComponent(sku.trim().toUpperCase())
  return `${baseUrl}/product/${encodedSku}`
}

export class ProductStore {
  async getProducts(userId: string): Promise<Product[]> {
    if (!userId) {
      console.error('Error: userId is required to fetch products')
      return []
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('lastupdated', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return []
    }

    return (data || []).map(mapProductFromDB)
  }

  async getProduct(id: string, userId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data ? mapProductFromDB(data) : null
  }

  // Función pública para buscar productos por SKU (sin necesidad de autenticación)
  // Esta función permite que cualquiera pueda ver los detalles del producto escaneando el QR
  async getProductBySku(sku: string): Promise<Product | null> {
    if (!sku) {
      console.error('Error: SKU is required')
      return null
    }

    // Buscar por SKU (case-insensitive)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('sku', sku.trim().toUpperCase())
      .single()

    if (error) {
      console.error('Error fetching product by SKU:', error)
      return null
    }

    return data ? mapProductFromDB(data) : null
  }

  async addProduct(product: Omit<Product, 'id' | 'lastUpdated' | 'user_id' | 'qr_code'>, userId: string): Promise<Product | null> {
    if (!userId) {
      console.error('Error: userId is required to add a product')
      throw new Error('Usuario no autenticado. Por favor, inicia sesión.')
    }

    // Validar campos requeridos
    if (!product.name || !product.type) {
      console.error('Error: Campos requeridos faltantes:', product)
      throw new Error('Faltan campos requeridos: nombre o tipo')
    }

    // Generar SKU automáticamente si no se proporciona
    let finalSku = product.sku?.trim()
    if (!finalSku) {
      try {
        finalSku = await generateSKU(product.name, userId)
        console.log('SKU generado automáticamente:', finalSku)
      } catch (error: any) {
        console.error('Error generando SKU:', error)
        throw new Error(`Error al generar SKU: ${error.message}`)
      }
    }

    // Validar tipos de datos
    if (typeof product.price !== 'number' || isNaN(product.price) || product.price < 0) {
      console.error('Error: Precio inválido:', product.price)
      throw new Error('El precio debe ser un número válido mayor o igual a 0')
    }

    if (typeof product.stock !== 'number' || isNaN(product.stock) || product.stock < 0) {
      console.error('Error: Stock inválido:', product.stock)
      throw new Error('El stock debe ser un número válido mayor o igual a 0')
    }

    // Generate QR code URL - El QR contiene una URL que lleva a la página de detalles del producto
    // Cuando se escanea, abre directamente la página con los detalles del producto
    // El QR se genera DESPUÉS de tener el SKU final (generado o proporcionado)
    const qrData = generateQRUrl(finalSku)
    
    // Preparar datos para insertar (solo campos que existen en la BD)
    // Asegurar que price sea un número decimal válido
    const priceValue = typeof product.price === 'number' 
      ? product.price 
      : parseFloat(String(product.price || 0))
    
    const stockValue = typeof product.stock === 'number'
      ? product.stock
      : parseInt(String(product.stock || 0), 10)

    const newProduct: any = {
      name: String(product.name).trim(),
      type: String(product.type),
      price: priceValue,
      stock: stockValue,
      sku: String(finalSku).trim().toUpperCase(),
      user_id: userId,
      qr_code: qrData,
      lastupdated: new Date().toISOString(),
    }

    // Agregar campos opcionales solo si tienen valor
    if (product.description) {
      newProduct.description = product.description
    }
    if (product.supplier) {
      newProduct.supplier = product.supplier
    }

    console.log('Attempting to insert product:', { ...newProduct, qr_code: '[hidden]' })
    console.log('User ID:', userId)

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Error al guardar producto: ${error.message}`)
    }

    console.log('Product added successfully:', data)
    return data ? mapProductFromDB(data) : null
  }

  async updateProduct(id: string, updates: Partial<Product>, userId: string): Promise<Product | null> {
    const updateData: any = {
      ...updates,
      lastupdated: new Date().toISOString(),
    }
    
    // Remove lastUpdated if it exists (camelCase version)
    if ('lastUpdated' in updateData) {
      delete updateData.lastUpdated
    }

    // If SKU or name changed, update QR code - Regenera URL basada en SKU
    if (updates.sku || updates.name) {
      const currentProduct = await this.getProduct(id, userId)
      if (currentProduct) {
        const newSku = updates.sku ? String(updates.sku).trim().toUpperCase() : currentProduct.sku
        // Regenerar URL del QR con el nuevo SKU
        const qrData = generateQRUrl(newSku)
        updateData.qr_code = qrData
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return null
    }

    return data ? mapProductFromDB(data) : null
  }

  async deleteProduct(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting product:', error)
      return false
    }

    return true
  }
}

export const productStore = new ProductStore()

