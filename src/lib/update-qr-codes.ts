/**
 * Utilidad para actualizar los códigos QR de productos existentes
 * Convierte los QR codes de formato JSON a URLs
 */

import { supabase } from './supabase'

/**
 * Actualiza todos los códigos QR de productos existentes para que contengan URLs
 * en lugar de JSON. Esto permite que al escanear el QR se abra directamente
 * la página de detalles del producto.
 */
export async function updateAllProductQRCodes(): Promise<{ success: boolean; updated: number; errors: string[] }> {
  try {
    // Obtener todos los productos
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, sku, qr_code')

    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      return { success: false, updated: 0, errors: [fetchError.message] }
    }

    if (!products || products.length === 0) {
      return { success: true, updated: 0, errors: [] }
    }

    const baseUrl = window.location.origin
    const errors: string[] = []
    let updated = 0

    // Actualizar cada producto
    for (const product of products) {
      try {
        // Generar nueva URL del QR
        const encodedSku = encodeURIComponent(product.sku.trim().toUpperCase())
        const newQRUrl = `${baseUrl}/product/${encodedSku}`

        // Verificar si el QR ya es una URL (para no actualizar innecesariamente)
        if (product.qr_code && product.qr_code.startsWith('http')) {
          continue // Ya es una URL, no necesita actualización
        }

        // Actualizar el producto
        const { error: updateError } = await supabase
          .from('products')
          .update({ qr_code: newQRUrl })
          .eq('id', product.id)

        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError)
          errors.push(`Error actualizando ${product.sku}: ${updateError.message}`)
        } else {
          updated++
        }
      } catch (error: any) {
        console.error(`Error processing product ${product.id}:`, error)
        errors.push(`Error procesando ${product.sku}: ${error.message}`)
      }
    }

    return {
      success: errors.length === 0,
      updated,
      errors
    }
  } catch (error: any) {
    console.error('Error in updateAllProductQRCodes:', error)
    return {
      success: false,
      updated: 0,
      errors: [error.message || 'Error desconocido']
    }
  }
}

