"use client";

import * as React from "react";

import type { VehicleSummary } from "@/types/vehicle";

/**
 * Favoritos no localStorage. Armazenamos o RESUMO do veículo (não só o id)
 * para a página /favoritos renderizar sem precisar de endpoint batch.
 */
const STORAGE_KEY = "patio:favorites:v2";

interface FavoritesContextValue {
  favorites: VehicleSummary[];
  isFavorite: (publicId: string) => boolean;
  toggle: (vehicle: VehicleSummary) => void;
  count: number;
}

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null);

function readStored(): VehicleSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (x): x is VehicleSummary =>
          typeof x === "object" && x !== null && typeof (x as VehicleSummary).publicId === "string",
      );
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Começa vazio no SSR; hidrata do localStorage após montar.
  const [favorites, setFavorites] = React.useState<VehicleSummary[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setFavorites(readStored());
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites, hydrated]);

  const toggle = React.useCallback((vehicle: VehicleSummary) => {
    setFavorites((prev) => {
      const exists = prev.some((v) => v.publicId === vehicle.publicId);
      if (exists) return prev.filter((v) => v.publicId !== vehicle.publicId);
      return [...prev, vehicle];
    });
  }, []);

  const value = React.useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite: (publicId: string) => favorites.some((v) => v.publicId === publicId),
      toggle,
      count: favorites.length,
    }),
    [favorites, toggle],
  );

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

export function useFavorites() {
  const ctx = React.useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  return ctx;
}
