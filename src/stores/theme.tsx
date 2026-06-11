"use client";

import * as React from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "patio:theme";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function readStored(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Começa em "light" no SSR; sincroniza com o localStorage após montar
  // (o script inline no <head> já aplicou a classe .dark antes do paint).
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    setTheme(readStored());
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = React.useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = React.useMemo<ThemeContextValue>(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  return ctx;
}
