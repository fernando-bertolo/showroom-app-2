import { z } from "zod";

/** Telefone BR: aceita formatos com DDD, espaços, traços e parênteses. */
const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

/**
 * Form de lead (POST /showroom/{slug}/leads). A API exige name e
 * (phone OU email); aqui pedimos telefone sempre para garantir retorno.
 * `website` é honeypot — campo oculto que humano não preenche.
 */
export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome"),
  phone: z
    .string()
    .trim()
    .min(1, "Informe seu telefone")
    .regex(phoneRegex, "Telefone inválido, ex: (11) 99999-9999"),
  email: z
    .union([z.string().trim().email("E-mail inválido"), z.literal("")])
    .optional(),
  message: z.string().trim().min(1, "Escreva uma mensagem"),
  website: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export type LeadSource = "VEHICLE_DETAIL" | "CONTACT" | "FINANCING";

export interface LeadPayload {
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  vehiclePublicId?: string;
  source: LeadSource;
  website?: string;
}
