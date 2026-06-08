import { z } from "zod";

/** Estados de um veículo no pátio (domínio automotivo). */
export const vehicleStatusSchema = z.enum(["available", "reserved", "maintenance", "sold"]);
export type VehicleStatus = z.infer<typeof vehicleStatusSchema>;

export const cambioSchema = z.enum(["Automático", "CVT", "Manual"]);
export type Cambio = z.infer<typeof cambioSchema>;

export const combustivelSchema = z.enum(["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"]);
export type Combustivel = z.infer<typeof combustivelSchema>;

/** Schema de um veículo. Em produção, valida o payload da API. */
export const vehicleSchema = z.object({
  id: z.string(),
  marca: z.string(),
  modelo: z.string(),
  versao: z.string(),
  ano: z.number().int(),
  anoModelo: z.number().int(),
  km: z.number().int().nonnegative(),
  preco: z.number().nonnegative(),
  precoAntigo: z.number().nonnegative().optional(),
  combustivel: combustivelSchema,
  cambio: cambioSchema,
  cor: z.string(),
  portas: z.number().int(),
  potencia: z.number().int(),
  status: vehicleStatusSchema,
  destaque: z.boolean(),
  opcionais: z.array(z.string()),
  descricao: z.string(),
  local: z.string(),
  /** Par de cores para o gradiente placeholder (sem foto real). */
  accent: z.tuple([z.string(), z.string()]),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const marcaSchema = z.object({
  name: z.string(),
  count: z.number().int().nonnegative(),
});
export type Marca = z.infer<typeof marcaSchema>;

/** Opções de ordenação do estoque. */
export const sortSchema = z.enum([
  "relevant",
  "price-asc",
  "price-desc",
  "km-asc",
  "year-desc",
]);
export type SortBy = z.infer<typeof sortSchema>;
