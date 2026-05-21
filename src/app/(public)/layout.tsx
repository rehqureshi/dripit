/**
 * @file src/app/(public)/layout.tsx
 *
 * Public route group layout — marketing pages, product browsing, designer profiles.
 *
 * No auth check here. Public pages are accessible to everyone.
 *
 * We DO fetch the optional user so the navigation bar can show the correct
 * state (sign in button vs user avatar), but we never redirect based on it.
 *
 * Routes in this group:
 * - / (home / editorial landing)
 * - /products
 * - /products/[slug]
 * - /designers
 * - /designers/[handle]
 * - /collections/[slug]
 */

import { getOptionalUser } from "@/features/auth/utils/session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Optional — used only to render the correct nav state.
  // No redirect, no gate.
  const user = await getOptionalUser();

  return (
    <div className="flex min-h-screen flex-col">
      {/*
        <PublicNav user={user} />
        Add your public navigation component here.
        Pass `user` so it can show "Sign in" or the user avatar.
      */}
      <main className="flex-1">{children}</main>
      {/*
        <Footer />
      */}
    </div>
  );
}