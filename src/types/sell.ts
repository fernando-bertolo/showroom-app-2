import { z } from "zod";

const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

export const cambioSellSchema = z.enum(["Manual", "Automático", "CVT", "Automatizado"]);
export const estadoSchema = z.enum(["excelente", "bom", "regular", "ruim"]);
export const simNaoSchema = z.enum(["sim", "nao"]);
export const docSchema = z.enum(["sim", "parcial", "nao"]);

export const sellFormSchema = z.object({
  // Passo 1 — sobre o veículo
  marca: z.string().trim().min(1, "Informe a marca"),
  modelo: z.string().trim().min(1, "Informe o modelo"),
  ano: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Ano inválido, ex: 2022"),
  // Passo 2 — versão e uso
  versao: z.string().trim().min(1, "Informe a versão"),
  km: z.string().trim().min(1, "Informe a quilometragem"),
  cambio: cambioSellSchema,
  // Passo 3 — condições
  estado: estadoSchema,
  unicoDono: simNaoSchema,
  docOk: docSchema,
  precoDesejado: z.string().trim().optional(),
  // Passo 4 — contato
  nome: z.string().trim().min(2, "Informe seu nome"),
  telefone: z
    .string()
    .trim()
    .min(1, "Informe seu telefone")
    .regex(phoneRegex, "Telefone inválido, ex: (11) 99999-9999"),
  email: z.union([z.string().trim().email("E-mail inválido"), z.literal("")]).optional(),
  cidade: z.string().trim().min(1, "Informe a cidade"),
  /** Honeypot — campo oculto que humano não preenche. */
  website: z.string().optional(),
});

export type SellFormValues = z.infer<typeof sellFormSchema>;

/** Campos validados em cada passo (para validação incremental com RHF). */
export const SELL_STEP_FIELDS: (keyof SellFormValues)[][] = [
  ["marca", "modelo", "ano"],
  ["versao", "km", "cambio"],
  ["estado", "unicoDono", "docOk", "precoDesejado"],
  ["nome", "telefone", "cidade", "email"],
];

/** Body do POST /showroom/{slug}/sell-offers. */
export interface SellOfferPayload {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  brand: string;
  model: string;
  version?: string;
  modelYear?: number;
  mileage?: number;
  askingPrice?: number;
  notes?: string;
  website?: string;
}
