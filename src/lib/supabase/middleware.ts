/**
 * @file src/lib/supabase/middleware.ts
 *
 * Supabase auth token refresh logic for Next.js middleware.
 *
 * Design decisions:
 * - Middleware's SOLE responsibility: call `supabase.auth.getUser()` so that
 *   the GoTrue client refreshes the JWT before it expires and writes the new
 *   token into both the request and response cookies. Nothing more.
 * - Route protection (redirects, role checks) lives in layouts and pages, NOT
 *   here. Middleware runs on every matched request at the edge; keeping it thin
 *   keeps cold starts fast and logic easy to reason about.
 * - We forward the auth-refreshed request via `supabaseResponse` — this is
 *   critical. Returning a plain `NextResponse.next()` loses the updated cookie,
 *   which breaks session propagation to Server Components.
 * - `getUser()` is used instead of `getSession()`. `getSession()` reads from
 *   the cookie without re-validating with the Supabase server, making it
 *   unsuitable for security-sensitive decisions. `getUser()` always validates
 *   the JWT signature and expiry against the auth server.
 *
 * Wire-up (src/middleware.ts):
 * ```ts
 * import { type NextRequest } from "next/server";
 * import { updateSession } from "@/lib/supabase/middleware";
 *
 * export async function middleware(request: NextRequest) {
 *   return updateSession(request);
 * }
 *
 * export const config = {
 *   matcher: [
 *     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
 *   ],
 * };
 * ```
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

/**
 * Refreshes the Supabase session token and forwards it to the response.
 *
 * Call this from `src/middleware.ts` and return the result directly.
 * Do NOT add route protection logic here — handle that in layouts/pages.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  /**
   * Start with a pass-through response. We will attach updated cookies to this
   * response object as Supabase performs its token refresh.
   */
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Read all cookies from the incoming request.
         * `getAll` is required by @supabase/ssr for the middleware context.
         */
        getAll() {
          return request.cookies.getAll();
        },

        /**
         * Write updated cookies to BOTH the request and the response.
         *
         * Writing to the request ensures that any subsequent Server Component
         * rendered in this same request cycle sees the refreshed session.
         *
         * Writing to the response ensures the browser receives the updated
         * cookie for future requests.
         */
        setAll(cookiesToSet) {
          // 1. Stamp cookies onto the request (for downstream Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // 2. Rebuild the response so it carries the mutated request
          supabaseResponse = NextResponse.next({ request });

          // 3. Stamp cookies onto the response (for the browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /**
   * IMPORTANT: Do not add any logic between createServerClient and getUser().
   *
   * A simple mistake like an early return can cause the session to desync
   * between the browser, the server-side cookie, and the GoTrue server,
   * making users intermittently appear logged out.
   *
   * getUser() makes a network call to Supabase Auth to validate the JWT.
   * This is intentional — it's the only way to be certain the token is valid.
   */
  await supabase.auth.getUser();

  return supabaseResponse;
}