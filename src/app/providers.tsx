'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client"; 
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { ThemeProvider } from "next-themes"

// ✅ Providers component wraps the app with necessary context providers
export function Providers({ children }: { children: React.ReactNode }) {
  // React Query client initialization (state persisted across re-renders)
  const [queryClient] = useState(() => new QueryClient());

  // tRPC client initialization
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc", // Endpoint for tRPC API
          transformer: superjson, // Allows sending complex data structures (like Dates) safely
        }),
      ],
    })
  );

  return (
    // 🟢 tRPC provider allows any component to use `trpc` hooks
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {/* 🟢 React Query provider for caching, fetching, and state management */}
      <QueryClientProvider client={queryClient}>
        {/* 🌗 ThemeProvider enables light/dark/system theme switching */}
        <ThemeProvider
          attribute="class"              // Uses className on <html> to apply theme
          defaultTheme="system"          // Fallback to system preference
          enableSystem={true}            // Enable switching with OS theme
          themes={['light', 'dark']}     // Supported themes
          disableTransitionOnChange={false} // Animate theme changes
          storageKey="3c-theme"          // Key in localStorage to persist choice
        >
          {children} {/* Render the rest of the app */}
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
