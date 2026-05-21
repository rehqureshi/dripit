/**
 * @file src/features/auth/actions/sign-out.ts
 *
 * Sign-out Server Action.
 *
 * `supabase.auth.signOut()` does two things:
 * 1. Calls the Supabase Auth server to invalidate the refresh token
 * 2. Clears the session cookies via our cookie handler in server.ts
 *
 * We always redirect to "/" after sign-out, even if the sign-out API call
 * fails. A failed sign-out API call means the server-side token persists
 * briefly, but our cookies are cleared — the user is effectively logged out
 * on this device. Leaving them on a protected page would be a worse UX.
 *
 * The `scope` option:
 * - "local"  (default) → signs out this device only
 * - "global" → invalidates ALL sessions across all devices
 * - "others" → signs out all OTHER devices, keeps current session
 *
 * For Dripit's MVP, "local" is correct. Add a "Sign out everywhere" option
 * in account settings later using scope: "global".
 */

"use server";

import { redirect } from "next/navigation";
import { createDripitServerClient } from "@/lib/supabase/server";

export async function signOut(): Promise<void> {
  try {
    const supabase = await createDripitServerClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    // Log but don't block the redirect — cookies are cleared regardless
    console.error("[Dripit Auth] Sign-out error:", err);
  }

  // Always redirect — outside try/catch per Next.js convention
  redirect("/");
}