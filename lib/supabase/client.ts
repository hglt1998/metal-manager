import { createBrowserClient } from '@supabase/ssr'

const STORAGE_KEY_PREFIX = 'sb-'

/**
 * Limpia el storage de Supabase si está corrupto
 */
function cleanupCorruptedStorage() {
  if (typeof window === 'undefined') return

  try {
    const keysToCheck = Object.keys(localStorage).filter(key =>
      key.startsWith(STORAGE_KEY_PREFIX)
    )

    for (const key of keysToCheck) {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          // Intentar parsear para verificar que no está corrupto
          JSON.parse(value)
        }
      } catch (e) {
        // Si falla el parse, el dato está corrupto - eliminarlo
        console.warn(`[Supabase] Removing corrupted storage key: ${key}`)
        localStorage.removeItem(key)
      }
    }
  } catch (e) {
    console.error('[Supabase] Error cleaning storage:', e)
  }
}

/**
 * Storage personalizado con manejo robusto de errores
 */
const customStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null

    try {
      const value = localStorage.getItem(key)
      if (value) {
        // Validar que el valor es JSON válido
        JSON.parse(value)
      }
      return value
    } catch (e) {
      console.warn(`[Supabase] Corrupted storage for key: ${key}, removing...`)
      try {
        localStorage.removeItem(key)
      } catch (removeError) {
        console.error('[Supabase] Failed to remove corrupted key:', removeError)
      }
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error('[Supabase] Error writing to storage:', e)
      // Si falla, intentar limpiar storage corrupto y reintentar
      try {
        cleanupCorruptedStorage()
        localStorage.setItem(key, value)
      } catch (retryError) {
        console.error('[Supabase] Failed to write after cleanup:', retryError)
      }
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('[Supabase] Error removing from storage:', e)
    }
  }
}

/**
 * Creates a Supabase client for browser environments with robust error handling.
 *
 * Features:
 * - Automatic detection and cleanup of corrupted storage
 * - Custom storage implementation with error recovery
 * - Graceful fallback when localStorage is unavailable
 * - SSR-safe (checks for window before accessing localStorage)
 *
 * Note: createBrowserClient uses an internal singleton pattern.
 * Calling this function multiple times returns the same cached instance.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  // Limpiar storage corrupto antes de crear el cliente
  cleanupCorruptedStorage()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: customStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'sb-auth-token',
      }
    }
  )
}