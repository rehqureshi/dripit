/**
 * @file src/features/auth/actions/sign-up.ts
 *
 * Sign-up Server Action.
 *
 * Architecture rules followed:
 * - Returns ActionResult<void> — NEVER throws to the client
 * - Validates with Zod BEFORE touching Supabase (fail fast, save round-trips)
 * - Maps all Supabase errors to typed AuthError via the central error handler
 * - Passes displayName into user_metadata so the profile is set from day one
 * - Uses `redirect()` OUTSIDE the try/catch — Next.js redirect() works by
 *   throwing a special error internally; catching it would swallow the redirect
 */

"use server";

import { redirect } from "next/navigation";
import { createDripitServerClient } from "@/lib/supabase/server";
import { signUpSchema, type SignUpInput } from "../schemas";
import { mapAuthError, mapValidationError } from "../utils/error-handler";
import type { ActionResult } from "../types";

export async function signUp(input: SignUpInput): Promise<ActionResult<void>> {
  // 1. Validate input
  const parsed = signUpSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: mapValidationError(parsed.error.flatten().fieldErrors),
    };
  }

  const { email, password, displayName } = parsed.data;

  // 2. Attempt sign-up
  try {
    const supabase = await createDripitServerClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        /**
         * emailRedirectTo: where the user lands after clicking the confirm
         * link in their email. Customize per environment via env var.
         */
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }
  } catch (err) {
    return { success: false, error: mapAuthError(err) };
  }

  // 3. Redirect OUTSIDE try/catch (Next.js redirect throws internally)
  redirect("/sign-up/check-email");
}