/**
 * @file src/features/auth/components/auth-user-provider.tsx
 *
 * AuthUserProvider — bridges the server-fetched AuthUser into the client
 * component tree via React Context.
 *
 * Why this pattern?
 * Server Components can fetch the user once in a layout and pass it as a prop
 * to a Client Component provider. Every client component below it can then
 * read the user synchronously from context — no additional getUser() calls,
 * no loading states, no waterfalls.
 *
 * The user data is serialized as a plain object (AuthUser) when crossing the
 * Server→Client boundary. The Supabase User type is NOT safe to pass across
 * this boundary (it contains non-serializable methods), so we use our AuthUser
 * DTO which is a plain serializable object.
 *
 * This is intentionally a thin context — it holds ONLY the user object.
 * Derived state (isDesigner, isPremium, etc.) is computed in feature-specific
 * hooks, not here.
 */

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AuthUser } from "../types";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AuthUserContextValue {
  user: AuthUser;
}

const AuthUserContext = createContext<AuthUserContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface AuthUserProviderProps {
  user: AuthUser;
  children: ReactNode;
}

export function AuthUserProvider({ user, children }: AuthUserProviderProps) {
  return (
    <AuthUserContext.Provider value={{ user }}>
      {children}
    </AuthUserContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the authenticated user from context.
 *
 * Only call this inside components rendered within the (protected) route group.
 * If called outside a provider, it throws a helpful error rather than silently
 * returning null — this surfaces misuse immediately in development.
 *
 * @example
 * ```tsx
 * "use client";
 * import { useAuthUser } from "@/features/auth/components/auth-user-provider";
 *
 * export function AccountButton() {
 *   const { user } = useAuthUser();
 *   return <span>{user.displayName}</span>;
 * }
 * ```
 */
export function useAuthUser(): AuthUserContextValue {
  const context = useContext(AuthUserContext);

  if (!context) {
    throw new Error(
      "[Dripit] useAuthUser() must be used inside an <AuthUserProvider>. " +
        "This hook is only available in the (protected) route group. " +
        "For optional user access in public routes, use the Supabase client directly."
    );
  }

  return context;
}