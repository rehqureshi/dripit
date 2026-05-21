/**
 * @file src/features/auth/types.ts
 *
 * Canonical auth type definitions for Dripit.
 *
 * Keeping types in the feature folder (not src/types/) co-locates them with
 * the logic that uses them, making the feature self-contained and portable.
 * Only types consumed ACROSS features belong in src/types/global.ts.
 */

import type { User, Session } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Core session shape
// ---------------------------------------------------------------------------

/**
 * The authenticated user context passed through server components and actions.
 * Wraps Supabase's User with Dripit-specific metadata.
 */
export interface AuthUser {
  id: string;
  email: string;
  /** Display name from user_metadata, falls back to email prefix */
  displayName: string;
  /** Avatar URL from user_metadata (OAuth providers) or storage */
  avatarUrl: string | null;
  /** Supabase confirmed_at — null means email not yet verified */
  emailVerified: boolean;
  /** Raw Supabase User for escape hatch access */
  raw: User;
}

/**
 * Full session context — used when you need both the user and the tokens.
 * Prefer AuthUser for most UI work; use AuthSession only when you need
 * the access_token (e.g., calling external APIs on behalf of the user).
 */
export interface AuthSession {
  user: AuthUser;
  session: Session;
}

// ---------------------------------------------------------------------------
// Auth state — used by client-side Zustand store
// ---------------------------------------------------------------------------

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

// ---------------------------------------------------------------------------
// Server Action result shapes
// ---------------------------------------------------------------------------

/**
 * All server actions return a discriminated union.
 * This forces consumers to handle both success and error explicitly —
 * no silent failures, no untyped `catch` blocks.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: AuthError };

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  /** Field-level validation errors from Zod */
  fieldErrors?: Partial<Record<string, string[]>>;
}

/**
 * Exhaustive error code enum.
 * Using string literals (not numbers) makes logs and debug output readable.
 *
 * Add new codes here as features expand — never use raw strings in action
 * files; always reference this enum so error handling stays centralised.
 */
export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_CONFIRMED"
  | "EMAIL_ALREADY_EXISTS"
  | "WEAK_PASSWORD"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR"
  | "SESSION_EXPIRED"
  | "UNAUTHORIZED";