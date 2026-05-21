/**
 * @file src/lib/supabase/client.ts
 *
 * Browser-side Supabase client — safe to import in Client Components.
 *
 * Design decisions:
 * - Singleton via module-level variable: one GoTrue instance per tab, which
 *   prevents duplicate auth listeners, ghost sessions, and token-refresh races.
 * - `@supabase/ssr` (not the deprecated auth-helpers) gives us explicit cookie
 *   control rather than opaque middleware magic.
 * - Environment variables are validated at module load time so misconfiguration
 *   surfaces immediately in development rather than at runtime in production.
 * - The client is intentionally NOT exported as a default to force consumers to
 *   call `createBrowserClient()` — this makes the singleton boundary explicit.
 */

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    "[Dripit] Missing NEXT_PUBLIC_SUPABASE_URL in .env.local"
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "[Dripit] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let browserClient: SupabaseClient<Database> | undefined;

/**
 * Returns the singleton Supabase client for use in Client Components.
 *
 * Call this inside a component or hook — never at module level outside this
 * file, because `document.cookie` is not available during SSR.
 *
 * @example
 * ```tsx
 * "use client";
 * import { createBrowserClient } from "@/lib/supabase/client";
 *
 * export function useUser() {
 *   const supabase = createBrowserClient();
 *   // ...
 * }
 * ```
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  browserClient = createSupabaseBrowserClient<Database>(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!
  );

  return browserClient;
}