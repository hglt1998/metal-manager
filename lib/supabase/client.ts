import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for Client Components.
 *
 * This client handles authentication in the browser.
 * Use this in Client Components and client-side hooks.
 *
 * Note: createBrowserClient uses an internal singleton pattern.
 * Calling this function multiple times returns the same cached instance.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}