import { z } from "zod";

/** Telefone BR: aceita formatos com DDD, espaços, traços e parênteses. */
const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

export const contactFormSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome"),
  telefone: z
    .string()
    .trim()
    .min(1, "Informe seu telefone")
    .regex(phoneRegex, "Telefone inválido, ex: (11) 99999-9999"),
  email: z
    .union([z.string().trim().email("E-mail inválido"), z.literal("")])
    .optional(),
  mensagem: z.string().trim().min(1, "Escreva uma mensagem"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
