import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de CSS usando clsx y tailwind-merge
 * Útil para combinar clases condicionales de Tailwind CSS
 * @param inputs - Clases CSS a combinar
 * @returns String con las clases combinadas y optimizadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

