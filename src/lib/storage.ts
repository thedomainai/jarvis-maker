import type { Architecture } from '../types/architecture'
import { STORAGE_KEYS } from './constants'

/**
 * Get architectures from localStorage
 */
export function getLocalArchitectures(): Architecture[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARCHITECTURES)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * Save architectures to localStorage
 */
export function saveLocalArchitectures(architectures: Architecture[]): void {
  localStorage.setItem(STORAGE_KEYS.ARCHITECTURES, JSON.stringify(architectures))
}

/**
 * Generate a unique local ID
 */
export function generateLocalId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
