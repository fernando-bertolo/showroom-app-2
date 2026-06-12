import "server-only";

import { headers } from "next/headers";

import { titleCase } from "@/lib/format";
import { defaultSlug } from "@/lib/tenant";

import type {
  PageResponse,
  Storefront,
  VehicleDetail,
  VehicleFacets,
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

export type VehicleSort =
  | "price_asc"
  | "price_desc"
  | "year_desc"
  | "year_asc"
  | "km_asc"
  | "km_desc";

export interface VehicleQuery {
  page?: number;
  size?: number;
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  maxKm?: number;
  sort?: VehicleSort;
}

/** Marca/modelo chegam da API em caixa irregular — exibimos em Title Case. */
function normalizeNames<T extends { brandName: string; modelName: string }>(vehicle: T): T {
  return {
    ...vehicle,
    brandName: titleCase(vehicle.brandName),
    modelName: titleCase(vehicle.modelName),
  };
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
  const data = await fetchJson<PageResponse<VehicleSummary>>(
    `/showroom/${encodeURIComponent(slug)}/vehicles${qs ? `?${qs}` : ""}`,
  );
  return data ? { ...data, content: data.content.map(normalizeNames) } : null;
}

/** Marcas/modelos/anos distintos do estoque — opções dos selects de filtro. */
export async function getVehicleFacets(slug: string): Promise<VehicleFacets | null> {
  const data = await fetchJson<VehicleFacets>(
    `/showroom/${encodeURIComponent(slug)}/vehicles/facets`,
  );
  if (!data) return null;
  return {
    ...data,
    brands: data.brands.map((b) => ({
      name: titleCase(b.name),
      models: b.models.map(titleCase),
    })),
  };
}

/** Detalhe público de um veículo. null em 404. */
export async function getVehicle(
  slug: string,
  publicId: string,
): Promise<VehicleDetail | null> {
  const data = await fetchJson<VehicleDetail>(
    `/showroom/${encodeURIComponent(slug)}/vehicles/${encodeURIComponent(publicId)}`,
  );
  return data ? normalizeNames(data) : null;
}
