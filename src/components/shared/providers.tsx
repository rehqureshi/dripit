"use client";

/**
 * @file src/components/shared/providers.tsx
 *
 * Global client-side provider tree.
 *
 * Lives here (not in app/layout.tsx) because layout.tsx is a Server Component
 * and providers need "use client". This wrapper keeps the root layout clean
 * and makes providers easy to extend (add Zustand hydration, theme, etc.).
 *
 * QueryClient is created with `useState` so it's stable across re-renders
 * and not shared between server requests (critical for SSR correctness).
 */

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus in development — too noisy
            refetchOnWindowFocus: process.env.NODE_ENV === "production",
            // 60s stale time is a sensible default for fashion catalog data
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}