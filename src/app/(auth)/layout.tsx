/**
 * @file src/app/(auth)/layout.tsx
 *
 * Auth route group layout — sign-in, sign-up, forgot-password pages.
 *
 * The key behavior: if a user IS already authenticated and navigates to
 * /sign-in or /sign-up, redirect them to /dashboard.
 * This prevents the awkward UX of a logged-in user seeing the sign-in form.
 *
 * We use `getOptionalUser()` here (not `getCurrentUser()`) because:
 * - We do NOT want to redirect unauthenticated users away — they belong here.
 * - We only redirect when there IS a session.
 *
 * Layout design:
 * Auth pages on Dripit use a split-screen editorial layout:
 * - Left: full-height campaign image / brand statement
 * - Right: centered auth form
 * This matches the SSENSE / Kith visual language referenced in the brief.
 */

import { redirect } from "next/navigation";
import { getOptionalUser } from "@/features/auth/utils/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();

  // Already authenticated — send them home
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Editorial brand panel — hidden on mobile */}
      <div
        className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12 text-white"
        aria-hidden="true"
      >
        {/* Brand mark */}
        <div className="text-xl font-semibold tracking-[0.2em] uppercase">
          Dripit
        </div>

        {/* Brand statement */}
        <blockquote className="space-y-2">
          <p className="text-2xl font-light leading-relaxed text-zinc-200">
            &ldquo;Independent design,
            <br />
            uncompromised.&rdquo;
          </p>
        </blockquote>
      </div>

      {/* Auth form panel */}
      <div className="flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}