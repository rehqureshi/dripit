"use server";

/**
 * @file src/features/auth/actions/auth-actions.ts
 *
 * Supabase auth server actions for Dripit.
 *
 * Architecture principles:
 *
 * 1. "use server" — marks every export as a Server Action. Never importable
 *    by client bundles, never exposes credentials or Supabase keys.
 *
 * 2. Actions are THIN. Validate → call Supabase → redirect or return error.
 *    No business logic, no UI concerns, no state management lives here.
 *
 * 3. All actions return AuthActionResult (never throw to the client).
 *    redirect() is the only exception — Next.js throws it internally and
 *    MUST live outside try/catch blocks or it gets swallowed.
 *
 * 4. createDripitServerClient() creates a per-request Supabase client that
 *    reads/writes cookies via next/headers, keeping the browser session in
 *    sync with the server on every action call.
 *
 * 5. getUser() not getSession() for auth checks. getSession() trusts the
 *    cookie without server validation. getUser() validates the JWT against
 *    Supabase Auth server — the only safe choice for security-sensitive paths.
 */

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createDripitServerClient } from "@/lib/supabase/server";

// ─────────────────────────────────────────────────────────────────────────────
// Return type
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Discriminated union returned by every action.
 * Forces UI components to handle both success and error explicitly.
 * No silent failures, no untyped catch blocks on the client.
 */
export type AuthActionResult =
  | { success: true }
  | { success: false; error: string; code?: string };

// ─────────────────────────────────────────────────────────────────────────────
// Error mapper
// ─────────────────────────────────────────────────────────────────────────────

function mapSupabaseError(message: string): { error: string; code: string } {
  const msg = message.toLowerCase();

  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return { code: "INVALID_CREDENTIALS", error: "The email or password you entered is incorrect." };
  }
  if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
    return { code: "EMAIL_NOT_CONFIRMED", error: "Please verify your email before signing in. Check your inbox." };
  }
  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return { code: "EMAIL_EXISTS", error: "An account with this email already exists. Try signing in." };
  }
  if (msg.includes("password should be") || msg.includes("weak_password")) {
    return { code: "WEAK_PASSWORD", error: "Password must be at least 8 characters." };
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return { code: "RATE_LIMITED", error: "Too many attempts. Please wait a moment and try again." };
  }

  console.error("[Dripit Auth] Unmapped Supabase error:", message);
  return { code: "UNKNOWN", error: "Something went wrong. Please try again." };
}

// ─────────────────────────────────────────────────────────────────────────────
// signUp
// ─────────────────────────────────────────────────────────────────────────────

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const displayName = (formData.get("displayName") as string)?.trim();
  const role = (formData.get("role") as string) ?? "buyer";

  if (!email || !password) {
    return { success: false, error: "Email and password are required.", code: "MISSING_FIELDS" };
  }
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters.", code: "WEAK_PASSWORD" };
  }

  try {
    const supabase = await createDripitServerClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName ?? email.split("@")[0],
          role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, ...mapSupabaseError(error.message) };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, ...mapSupabaseError(message) };
  }

  redirect("/signup/check-email");
}

// ─────────────────────────────────────────────────────────────────────────────
// signIn
// ─────────────────────────────────────────────────────────────────────────────

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) ?? "/dashboard";

  if (!email || !password) {
    return { success: false, error: "Email and password are required.", code: "MISSING_FIELDS" };
  }

  try {
    const supabase = await createDripitServerClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { success: false, ...mapSupabaseError(error.message) };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, ...mapSupabaseError(message) };
  }

  // Validate next to prevent open redirect — only allow relative paths
  const safePath = next.startsWith("/") ? next : "/dashboard";
  redirect(safePath);
}

// ─────────────────────────────────────────────────────────────────────────────
// signOut
// ─────────────────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  try {
    const supabase = await createDripitServerClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.error("[Dripit Auth] signOut error:", err);
  }

  redirect("/login");
}

// ─────────────────────────────────────────────────────────────────────────────
// signInWithGoogle
// ─────────────────────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<AuthActionResult> {
  let redirectUrl: string;

  try {
    const supabase = await createDripitServerClient();

    const headersList = await headers();
    const origin =
      headersList.get("origin") ??
      headersList.get("x-forwarded-host") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error || !data.url) {
      return { success: false, ...mapSupabaseError(error?.message ?? "OAuth URL missing") };
    }

    redirectUrl = data.url;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, ...mapSupabaseError(message) };
  }

  redirect(redirectUrl);
}