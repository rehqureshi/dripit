/**
 * @file src/features/auth/utils/session.ts
 *
 * Server-side session utilities.
 *
 * Three functions, three distinct use cases:
 *
 * 1. `getOptionalUser()`  → Returns AuthUser | null. Use in Server Components
 *    that render differently for logged-in vs anonymous users (e.g. nav bar,
 *    product pages with "add to wishlist"). Never redirects.
 *
 * 2. `getCurrentUser()`   → Returns AuthUser. Redirects to /sign-in if no
 *    session. Use in protected layouts and pages as the session gate.
 *
 * 3. `requireUser()`      → Returns AuthUser. Throws a typed AuthError if no
 *    session. Use inside Server Actions — actions can't redirect, they must
 *    return error objects.
 *
 * Why NOT call these from middleware?
 * These functions call `createDripitServerClient()` which reads from Next.js
 * `cookies()`. That's a per-request operation with overhead. Middleware runs
 * on every request; we only want this overhead when a layout/page actually
 * needs the user. Middleware only refreshes — it never inspects the user.
 */

import { redirect } from "next/navigation";
import { createDripitServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { AuthUser, AuthError } from "../types";

// ---------------------------------------------------------------------------
// Internal: map raw Supabase User → AuthUser
// ---------------------------------------------------------------------------

function toAuthUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  const emailPrefix = user.email?.split("@")[0] ?? "user";

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: (meta.display_name as string | undefined) ?? emailPrefix,
    avatarUrl: (meta.avatar_url as string | undefined) ?? null,
    emailVerified: !!user.confirmed_at,
    raw: user,
  };
}

// ---------------------------------------------------------------------------
// Public utilities
// ---------------------------------------------------------------------------

/**
 * Returns the current authenticated user or null.
 * Never redirects. Safe to use in any Server Component.
 *
 * @example
 * ```tsx
 * // app/(public)/page.tsx — shows different CTAs based on auth state
 * const user = await getOptionalUser();
 * return user ? <Dashboard /> : <HeroSection />;
 * ```
 */
export async function getOptionalUser(): Promise<AuthUser | null> {
  const supabase = await createDripitServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  return toAuthUser(data.user);
}

/**
 * Returns the current authenticated user.
 * Redirects to /sign-in if no valid session exists.
 * Use in protected layout.tsx files as the route guard.
 *
 * @example
 * ```tsx
 * // app/(protected)/layout.tsx
 * const user = await getCurrentUser();
 * // If we reach here, user is guaranteed to be defined.
 * ```
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const supabase = await createDripitServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/sign-in");
  }

  return toAuthUser(data.user);
}

/**
 * Returns the current authenticated user for use inside Server Actions.
 * Throws a typed AuthError (does NOT redirect — actions return data, not
 * responses).
 *
 * @example
 * ```ts
 * // features/products/actions/create-product.ts
 * export async function createProduct(input: CreateProductInput) {
 *   const user = await requireUser(); // throws if not authed
 *   // ...
 * }
 * ```
 *
 * @throws AuthError with code "UNAUTHORIZED"
 */
export async function requireUser(): Promise<AuthUser> {
  const supabase = await createDripitServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    const authError: AuthError = {
      code: "UNAUTHORIZED",
      message: "You must be signed in to perform this action.",
    };
    throw authError;
  }

  return toAuthUser(data.user);
}