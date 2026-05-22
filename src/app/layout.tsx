/**
 * @file src/app/layout.tsx
 *
 * Root layout — wraps every page in the app.
 *
 * Responsibilities:
 * - HTML shell + lang attribute
 * - Font variables (Geist, configured in shadcn preset)
 * - Global CSS
 * - Provider tree (TanStack Query, Zustand initializer, Toaster)
 *
 * What does NOT belong here:
 * - Auth checks (those live in route-group layouts)
 * - Navigation (lives in (public) and (protected) layouts respectively)
 * - Page-specific metadata (lives in each page.tsx)
 */

import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "@/app/globals.css";

import { ReactQueryProvider } from "@/lib/react-query/provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s — Dripit",
    default: "Dripit — Independent Fashion Marketplace",
  },

  description:
    "Discover and shop independent fashion designers. Minimal. Editorial. Exclusive.",

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://dripit.com"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ReactQueryProvider>
          {children}

          {/* Global Toasts */}
          <Toaster
            richColors
            position="top-right"
            closeButton
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}