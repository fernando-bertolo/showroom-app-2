"use client";

import * as React from "react";

import { ContactProvider } from "@/stores/contact";
import { FavoritesProvider } from "@/stores/favorites";
import { ThemeProvider } from "@/stores/theme";
import { ToastProvider } from "@/stores/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <FavoritesProvider>
          <ContactProvider>{children}</ContactProvider>
        </FavoritesProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
