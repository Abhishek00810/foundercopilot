// This should be your client-side Supabase instance file
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Define your environment variables here or directly
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}