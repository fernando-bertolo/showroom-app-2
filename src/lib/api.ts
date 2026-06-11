import "server-only";

import { headers } from "next/headers";

import { defaultSlug } from "@/lib/tenant";

import type {
  PageResponse,
  Storefront,
  VehicleDetail,
  VehicleSummary,
} from "@/types/vehicle";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

const REVALIDATE_SECONDS = 60;

/** Slug do tenant atual, propagado pelo middleware via `x-branch-slug`. */
export async function getSlug(): Promise<string> {
  const h = await headers();
  return h.get("x-branch-slug") ?? defaultSlug();
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { accept: "application/json" },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`[showroom-api] ${path} respondeu ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    // API fora do ar (inclusive durante o build) — degrada com fallback.
    console.error(`[showroom-api] falha ao buscar ${path}`, error);
    return null;
  }
}

/** Configuração pública da vitrine. null = inexistente/inativa/indisponível. */
export async function getStorefront(slug: string): Promise<Storefront | null> {
  return fetchJson<Storefront>(`/showroom/${encodeURIComponent(slug)}`);
}

export interface VehicleQuery {
  page?: number;
  size?: number;
  brand?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  minKm?: number;
  maxKm?: number;
}

/** Listagem pública paginada (página 0-indexed na API, máx. 60 por página). */
export async function getVehicles(
  slug: string,
  query: VehicleQuery = {},
): Promise<PageResponse<VehicleSummary> | null> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return fetchJson<PageResponse<VehicleSummary>>(
    `/showroom/${encodeURIComponent(slug)}/vehicles${qs ? `?${qs}` : ""}`,
  );
}

/** Detalhe público de um veículo. null em 404. */
export async function getVehicle(
  slug: string,
  publicId: string,
): Promise<VehicleDetail | null> {
  return fetchJson<VehicleDetail>(
    `/showroom/${encodeURIComponent(slug)}/vehicles/${encodeURIComponent(publicId)}`,
  );
}
