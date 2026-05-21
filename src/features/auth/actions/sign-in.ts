/**
 * @file src/features/auth/actions/sign-in.ts
 *
 * Sign-in Server Action.
 *
 * Uses `signInWithPassword` — Dripit is credential-based (not OAuth-only).
 * OAuth provider sign-ins are handled separately via route handlers because
 * they require a browser redirect flow that server actions can't manage.
 *
 * `rememberMe` maps to Supabase session persistence:
 * - true  → session stored in localStorage (survives tab close)
 * - false → session stored in memory only (cleared on tab close)
 * This is handled on the client-side Supabase client, but we pass the intent
 * through so a future client hook can act on it.
 */

"use server";

import { redirect } from "next/navigation";
import { createDripitServerClient } from "@/lib/supabase/server";
import { signInSchema, type SignInInput } from "../schemas";
import { mapAuthError, mapValidationError } from "../utils/error-handler";
import type { ActionResult } from "../types";

export async function signIn(input: SignInInput): Promise<ActionResult<void>> {
  // 1. Validate
  const parsed = signInSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: mapValidationError(parsed.error.flatten().fieldErrors),
    };
  }

  const { email, password } = parsed.data;

  // 2. Authenticate
  try {
    const supabase = await createDripitServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }
  } catch (err) {
    return { success: false, error: mapAuthError(err) };
  }

  // 3. Redirect after successful auth
  redirect("/dashboard");
}