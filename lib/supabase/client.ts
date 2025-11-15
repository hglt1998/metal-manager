import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for browser environments.
 *
 * Note: createBrowserClient uses an internal singleton pattern.
 * Calling this function multiple times returns the same cached instance.
 * This is the official pattern recommended by Supabase for Next.js App Router.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}