import { MARCAS, VEHICLES } from "@/data/vehicles";
import { marcaSchema, vehicleSchema } from "@/types/vehicle";

import type { Marca, SortBy, Vehicle } from "@/types/vehicle";

/** Filtros aplicados sobre o estoque (espelham os search params da URL). */
export interface VehicleFilters {
  marcas: string[];
  cambio: string[];
  portas: number[];
  precoMin: number | null;
  precoMax: number | null;
  busca: string;
  sort: SortBy;
}

export const DEFAULT_FILTERS: VehicleFilters = {
  marcas: [],
  cambio: [],
  portas: [],
  precoMin: null,
  precoMax: null,
  busca: "",
  sort: "relevant",
};

/** Simula latência de rede para exercitar estados de carregamento. */
function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function matchesFilters(v: Vehicle, f: VehicleFilters): boolean {
  if (f.marcas.length && !f.marcas.includes(v.marca)) return false;
  if (f.cambio.length && !f.cambio.includes(v.cambio)) return false;
  if (f.portas.length && !f.portas.includes(v.portas)) return false;
  if (f.precoMin != null && v.preco < f.precoMin) return false;
  if (f.precoMax != null && v.preco > f.precoMax) return false;
  if (f.busca.trim()) {
    const q = f.busca.trim().toLowerCase();
    const haystack = `${v.marca} ${v.modelo} ${v.versao}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function sortVehicles(list: Vehicle[], sort: SortBy): Vehicle[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.preco - b.preco);
    case "price-desc":
      return sorted.sort((a, b) => b.preco - a.preco);
    case "km-asc":
      return sorted.sort((a, b) => a.km - b.km);
    case "year-desc":
      return sorted.sort((a, b) => b.anoModelo - a.anoModelo);
    case "relevant":
    default:
      return sorted.sort((a, b) => Number(b.destaque) - Number(a.destaque));
  }
}

export interface VehicleListResult {
  vehicles: Vehicle[];
  total: number;
  matched: number;
}

/** Lista o estoque aplicando filtros e ordenação. */
export async function fetchVehicles(filters: VehicleFilters): Promise<VehicleListResult> {
  await delay(350);
  const all = VEHICLES.map((v) => vehicleSchema.parse(v));
  const matched = all.filter((v) => matchesFilters(v, filters));
  return {
    vehicles: sortVehicles(matched, filters.sort),
    total: all.length,
    matched: matched.length,
  };
}

/** Busca um veículo por id. Lança se não existir. */
export async function fetchVehicle(id: string): Promise<Vehicle> {
  await delay(300);
  const found = VEHICLES.find((v) => v.id === id);
  if (!found) {
    throw new Error(`Veículo não encontrado: ${id}`);
  }
  return vehicleSchema.parse(found);
}

/** Lista de marcas com contagem para a barra de filtros. */
export async function fetchMarcas(): Promise<Marca[]> {
  await delay(200);
  return MARCAS.map((m) => marcaSchema.parse(m));
}

/** Total de veículos disponíveis (para o hero). */
export async function fetchAvailableCount(): Promise<number> {
  await delay(150);
  return VEHICLES.filter((v) => v.status === "available").length;
}

export interface ContactPayload {
  nome: string;
  telefone: string;
  email?: string;
  mensagem: string;
  vehicleId?: string;
}

/** Envia uma mensagem de contato (stub). Retorna um protocolo. */
export async function submitContact(payload: ContactPayload): Promise<{ protocolo: string }> {
  await delay(700);
  void payload;
  const protocolo = `PT-${Math.floor(100000 + Math.random() * 900000)}`;
  return { protocolo };
}

export interface SellLeadPayload {
  marca: string;
  modelo: string;
  ano: string;
  versao: string;
  km: string;
  cambio: string;
  estado: string;
  unicoDono: string;
  docOk: string;
  nome: string;
  telefone: string;
  email?: string;
  cidade: string;
}

/** Registra um lead de "venda seu carro" (stub). Retorna um protocolo. */
export async function submitSellLead(payload: SellLeadPayload): Promise<{ protocolo: string }> {
  await delay(800);
  void payload;
  const protocolo = `PT-${Math.floor(100000 + Math.random() * 900000)}`;
  return { protocolo };
}
