/**
 * @file src/features/auth/utils/error-handler.ts
 *
 * Translates raw Supabase auth errors into typed Dripit AuthError objects.
 *
 * Why a dedicated error handler?
 * Supabase error messages are implementation details — they can change between
 * SDK versions, vary by locale, and expose internal system language to users.
 * This layer:
 * 1. Maps Supabase error codes → our AuthErrorCode enum (stable contract)
 * 2. Produces user-facing messages appropriate for a premium brand (not "User
 *    already registered" — that's GoTrue internal language)
 * 3. Centralises the mapping so a single change here fixes every action
 *
 * When Supabase changes an error message (it happens), you fix it here once.
 */

import type { AuthError, AuthErrorCode } from "../types";

/**
 * Known Supabase Auth error message fragments (lowercased for matching).
 * We match substrings rather than exact strings for forward-compatibility.
 */
const SUPABASE_ERROR_MAP: Array<{
  match: string | RegExp;
  code: AuthErrorCode;
  message: string;
}> = [
  {
    match: "invalid login credentials",
    code: "INVALID_CREDENTIALS",
    message: "The email or password you entered is incorrect.",
  },
  {
    match: "email not confirmed",
    code: "EMAIL_NOT_CONFIRMED",
    message:
      "Please verify your email address before signing in. Check your inbox for a confirmation link.",
  },
  {
    match: "user already registered",
    code: "EMAIL_ALREADY_EXISTS",
    message: "An account with this email already exists. Try signing in.",
  },
  {
    match: "password should be",
    code: "WEAK_PASSWORD",
    message: "Your password does not meet the security requirements.",
  },
  {
    match: "rate limit",
    code: "RATE_LIMITED",
    message: "Too many attempts. Please wait a moment and try again.",
  },
  {
    match: /network|fetch|failed to fetch/i,
    code: "NETWORK_ERROR",
    message: "A network error occurred. Check your connection and try again.",
  },
  {
    match: "session_not_found",
    code: "SESSION_EXPIRED",
    message: "Your session has expired. Please sign in again.",
  },
];

/**
 * Maps any thrown error (Supabase AuthError or unknown) to a typed AuthError.
 *
 * @param error - The raw error from Supabase SDK or a caught unknown
 * @returns A typed AuthError safe to return from a Server Action
 */
export function mapAuthError(error: unknown): AuthError {
  const rawMessage =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  for (const { match, code, message } of SUPABASE_ERROR_MAP) {
    const matched =
      typeof match === "string"
        ? rawMessage.includes(match)
        : match.test(rawMessage);

    if (matched) {
      return { code, message };
    }
  }

  // Log unknown errors server-side for observability (Vercel logs / Sentry)
  console.error("[Dripit Auth] Unmapped error:", error);

  return {
    code: "UNKNOWN_ERROR",
    message: "Something went wrong. Please try again.",
  };
}

/**
 * Converts a Zod field-error map into a flat AuthError for server actions.
 * Used when schema.safeParse() fails — returns the field errors alongside
 * a generic validation code so clients can highlight specific form fields.
 */
export function mapValidationError(
  fieldErrors: Partial<Record<string, string[]>>
): AuthError {
  return {
    code: "VALIDATION_ERROR",
    message: "Please check the form for errors.",
    fieldErrors,
  };
}