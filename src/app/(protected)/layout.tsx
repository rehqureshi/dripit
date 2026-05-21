/**
 * @file src/app/(protected)/layout.tsx
 *
 * Protected route group layout.
 *
 * This is the auth gate for all routes under (protected)/.
 * If `getCurrentUser()` finds no valid session, it calls `redirect("/sign-in")`
 * internally — the page never renders.
 *
 * If we reach `return children`, the user IS authenticated. Full stop.
 * No conditional rendering needed in any child page.tsx.
 *
 * What routes belong here:
 * - /dashboard
 * - /account
 * - /orders
 * - /designer/studio (creator dashboard)
 * - /checkout (payment flow)
 *
 * The `user` prop is intentionally passed to children via a React Context
 * (see AuthUserProvider) so child Server Components and Client Components can
 * access it without each making their own getUser() call — one call per
 * layout boundary is the correct pattern.
 */

import { getCurrentUser } from "@/features/auth/utils/session";
import { AuthUserProvider } from "@/features/auth/components/auth-user-provider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirects to /sign-in if unauthenticated. No need to handle the null case.
  const user = await getCurrentUser();

  return (
    <AuthUserProvider user={user}>
      {/* Add your authenticated shell here: sidebar, top nav, etc. */}
      <div className="flex min-h-screen flex-col">{children}</div>
    </AuthUserProvider>
  );
}