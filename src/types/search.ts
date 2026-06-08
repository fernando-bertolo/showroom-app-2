import { z } from "zod";

import { sortSchema } from "@/types/vehicle";

import type { VehicleFilters } from "@/api/vehicles";

/** Schema dos search params do estoque — fonte da verdade dos filtros na URL. */
export const estoqueSearchSchema = z.object({
  marcas: z.array(z.string()).default([]),
  cambio: z.array(z.string()).default([]),
  portas: z.array(z.number()).default([]),
  precoMin: z.number().nullable().default(null),
  precoMax: z.number().nullable().default(null),
  busca: z.string().default(""),
  sort: sortSchema.default("relevant"),
});

export type EstoqueSearch = z.infer<typeof estoqueSearchSchema>;

/** Search params do simulador de financiamento (valor pré-preenchido). */
export const financiamentoSearchSchema = z.object({
  valor: z.number().positive().optional(),
});

export type FinanciamentoSearch = z.infer<typeof financiamentoSearchSchema>;

/** Converte os search params validados em filtros para a API/query. */
export function searchToFilters(search: EstoqueSearch): VehicleFilters {
  return {
    marcas: search.marcas,
    cambio: search.cambio,
    portas: search.portas,
    precoMin: search.precoMin,
    precoMax: search.precoMax,
    busca: search.busca,
    sort: search.sort,
  };
}
