/**
 * @file src/proxy.ts
 *
 * Root Next.js proxy.
 *
 * Responsibility: ONE thing only — refresh the Supabase auth token before
 * it expires and forward the updated session cookie to both the request and
 * response so every downstream Server Component sees a valid session.
 *
 * What does NOT belong here:
 * - Route protection / redirects  → live in layout.tsx files
 * - Role-based access control     → live in layout.tsx or page.tsx
 * - Business logic of any kind    → live in features/
 *
 * Why keep proxy thin?
 * Proxy runs at the edge on EVERY matched request. Any slowdown here
 * multiplies across every page load. The updateSession call already makes one
 * network round-trip to Supabase Auth; that's the budget.
 */

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /**
     * Match all request paths EXCEPT:
     * - _next/static  (Next.js static assets)
     * - _next/image   (Next.js image optimization)
     * - favicon.ico   (browser default)
     * - Common static file extensions (images, fonts, etc.)
     *
     * This keeps middleware off the hot path for assets that will never
     * need a session — every ms counts at the edge.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};