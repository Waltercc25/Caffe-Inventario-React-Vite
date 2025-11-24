/**
 * Generador de SKU automático basado en el nombre del producto
 * Genera un SKU único que tiene relación con el nombre pero incluye elementos aleatorios
 */

import { supabase } from './supabase'

/**
 * Extrae las iniciales del nombre del producto
 * Ejemplo: "Café Colombia" -> "CFCL"
 */
function extractInitials(name: string): string {
  // Remover caracteres especiales y convertir a mayúsculas
  const cleanName = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remover caracteres especiales
    .toUpperCase()
    .trim()

  // Si el nombre tiene espacios, tomar la primera letra de cada palabra
  if (cleanName.includes(' ')) {
    return cleanName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 4) // Máximo 4 letras
  }

  // Si es una sola palabra, tomar las primeras 4 letras
  return cleanName.substring(0, 4)
}

/**
 * Genera un número aleatorio de 4 dígitos
 */
function generateRandomNumber(): string {
  return Math.floor(1000 + Math.random() * 9000).toString() // Número entre 1000 y 9999
}

/**
 * Genera un SKU único basado en el nombre del producto
 * Formato: INICIALES-NUMERO (ej: "CFCL-1234")
 * 
 * @param productName - Nombre del producto
 * @param userId - ID del usuario (para verificar unicidad)
 * @returns SKU único generado
 */
export async function generateSKU(productName: string, userId: string): Promise<string> {
  if (!productName || !productName.trim()) {
    throw new Error('El nombre del producto es requerido para generar el SKU')
  }

  if (!userId) {
    throw new Error('El ID de usuario es requerido para generar el SKU')
  }

  const initials = extractInitials(productName.trim())
  
  // Si las iniciales son muy cortas, completar con letras aleatorias
  let baseSKU = initials
  if (baseSKU.length < 2) {
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    while (baseSKU.length < 2) {
      baseSKU += randomLetters.charAt(Math.floor(Math.random() * randomLetters.length))
    }
  }

  // Intentar generar un SKU único (máximo 10 intentos)
  let attempts = 0
  const maxAttempts = 10

  while (attempts < maxAttempts) {
    const randomNumber = generateRandomNumber()
    const candidateSKU = `${baseSKU}-${randomNumber}`

    // Verificar si el SKU ya existe
    const exists = await checkSKUExists(candidateSKU, userId)
    
    if (!exists) {
      return candidateSKU
    }

    attempts++
  }

  // Si después de 10 intentos no encontramos uno único, agregar timestamp
  const timestamp = Date.now().toString().slice(-4)
  return `${baseSKU}-${timestamp}`
}

/**
 * Verifica si un SKU ya existe en la base de datos para el usuario dado
 * 
 * @param sku - SKU a verificar
 * @param userId - ID del usuario
 * @returns true si el SKU existe, false si no existe
 */
export async function checkSKUExists(sku: string, userId: string): Promise<boolean> {
  if (!sku || !userId) {
    return false
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('sku', sku.trim().toUpperCase())
      .eq('user_id', userId)
      .limit(1)

    if (error) {
      console.error('Error checking SKU existence:', error)
      return false // En caso de error, asumimos que no existe para permitir el intento
    }

    return (data && data.length > 0)
  } catch (error) {
    console.error('Exception checking SKU existence:', error)
    return false
  }
}

/**
 * Genera un SKU simple sin verificar en la base de datos (para preview)
 * Útil para mostrar al usuario antes de guardar
 * 
 * @param productName - Nombre del producto
 * @returns SKU generado (puede no ser único)
 */
export function generateSKUPreview(productName: string): string {
  if (!productName || !productName.trim()) {
    return ''
  }

  const initials = extractInitials(productName.trim())
  
  // Si las iniciales son muy cortas, completar con letras aleatorias
  let baseSKU = initials
  if (baseSKU.length < 2) {
    const randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    while (baseSKU.length < 2) {
      baseSKU += randomLetters.charAt(Math.floor(Math.random() * randomLetters.length))
    }
  }

  const randomNumber = generateRandomNumber()
  return `${baseSKU}-${randomNumber}`
}

