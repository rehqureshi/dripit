/**
 * @file src/app/auth/callback/route.ts
 *
 * Auth callback Route Handler.
 *
 * Handles TWO flows:
 * 1. Email confirmation: user clicks link in their inbox → Supabase sends them
 *    to this route with a `code` param.
 * 2. OAuth sign-in (Google, Apple, etc.): Supabase redirects here after the
 *    OAuth provider confirms identity.
 *
 * In both cases, we exchange the one-time `code` for a session using
 * `exchangeCodeForSession()`, which writes the session cookies via our server
 * client's cookie handler.
 *
 * The `next` query param allows deep-linking: after sign-in via an email sent
 * from a protected page, the user lands back where they intended.
 * Default fallback is /dashboard.
 *
 * IMPORTANT: This route is NOT in a route group — it lives at /auth/callback
 * outside of (public), (auth), and (protected) so it has no layout wrapping
 * that might redirect the user before the code is exchanged.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createDripitServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // If no code, redirect to sign-in with an error hint
  if (!code) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=missing_code`
    );
  }

  try {
    const supabase = await createDripitServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Dripit Auth] Code exchange failed:", error.message);
      return NextResponse.redirect(
        `${origin}/sign-in?error=exchange_failed`
      );
    }

    // Successful exchange — redirect to intended destination
    // `next` must start with "/" to prevent open redirect attacks
    const safeNext = next.startsWith("/") ? next : "/dashboard";
    return NextResponse.redirect(`${origin}${safeNext}`);
  } catch (err) {
    console.error("[Dripit Auth] Callback error:", err);
    return NextResponse.redirect(`${origin}/sign-in?error=unknown`);
  }
}