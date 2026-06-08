import * as React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ContactProvider } from "@/stores/contact";
import { FavoritesProvider } from "@/stores/favorites";
import { ThemeProvider } from "@/stores/theme";
import { ToastProvider } from "@/stores/toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <FavoritesProvider>
            <ContactProvider>{children}</ContactProvider>
          </FavoritesProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
