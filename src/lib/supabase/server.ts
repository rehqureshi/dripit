/**
 * @file src/lib/supabase/server.ts
 *
 * Server-side Supabase client factory — for Server Components, Server Actions,
 * and Route Handlers.
 *
 * Design decisions:
 * - A NEW client instance is created per call (not a singleton). Server
 *   requests are isolated; sharing state across requests leaks session data.
 * - `cookies()` from `next/headers` is the only correct way to access cookies
 *   in the App Router. We call it inside the factory function (not at module
 *   level) to ensure it runs inside a request context.
 * - Cookie mutation (`set` / `remove`) is wrapped in a try/catch. In Server
 *   Components, `cookies()` is read-only and will throw on write — that is
 *   expected and safe. Writes succeed in Server Actions and Route Handlers.
 * - The `Database` generic threads Supabase's type generation through every
 *   query, giving full end-to-end type safety without manual casting.
 *
 * Usage contexts:
 * - Server Component  → read session / data, cookie writes will silently no-op
 * - Server Action     → read + write, full cookie lifecycle
 * - Route Handler     → read + write, full cookie lifecycle
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// ---------------------------------------------------------------------------
// Environment validation (server-side; no NEXT_PUBLIC_ required)
// ---------------------------------------------------------------------------

function getServerEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Dripit] Missing required server environment variable: "${key}". ` +
        `Ensure it is set in your .env.local (or Vercel environment settings) ` +
        `and is NOT prefixed with NEXT_PUBLIC_.`
    );
  }
  return value;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a Supabase client bound to the current request's cookie store.
 *
 * Must be called inside a Server Component render, Server Action body, or
 * Route Handler — never at module level.
 *
 * @example
 * ```ts
 * // Server Component
 * import { createServerClient } from "@/lib/supabase/server";
 *
 * export default async function ProfilePage() {
 *   const supabase = await createDripitServerClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // ...
 * }
 * ```
 *
 * @example
 * ```ts
 * // Server Action
 * "use server";
 * import { createDripitServerClient } from "@/lib/supabase/server";
 *
 * export async function signOut() {
 *   const supabase = await createDripitServerClient();
 *   await supabase.auth.signOut();
 * }
 * ```
 */
export async function createDripitServerClient(): Promise<
  SupabaseClient<Database>
> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getServerEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getServerEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        /**
         * Read a single cookie by name.
         * Called by Supabase to retrieve the session token on every request.
         */
        get(name: string) {
          return cookieStore.get(name)?.value;
        },

        /**
         * Write a cookie (e.g. after token refresh or sign-in).
         * Silently ignored in Server Components (read-only context).
         */
        set(name: string, value: string, options: Parameters<typeof cookieStore.set>[2]) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Expected in Server Components; safe to swallow.
          }
        },

        /**
         * Delete a cookie (e.g. on sign-out).
         * Silently ignored in Server Components (read-only context).
         */
        remove(name: string, options: Parameters<typeof cookieStore.set>[2]) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch {
            // Expected in Server Components; safe to swallow.
          }
        },
      },
    }
  );
}