"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";

import { Field } from "@/components/form/Field";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { Input } from "@/design-system/primitives/input";
import { Textarea } from "@/design-system/primitives/textarea";
import { leadFormSchema, type LeadFormValues, type LeadSource } from "@/types/contact";

interface LeadFormProps {
  source: LeadSource;
  vehiclePublicId?: string;
  defaultMessage?: string;
  submitLabel?: string;
  /** Prefixo único para os ids dos campos (várias instâncias na página). */
  idPrefix?: string;
}

/** Envia o lead via proxy same-origin (sem CORS). Lança em erro. */
export async function postLead(payload: Record<string, unknown>): Promise<{ protocol: string }> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Falha ao enviar (${res.status})`);
  }
  return (await res.json()) as { protocol: string };
}

/**
 * Formulário de interesse → POST /api/leads. Inclui honeypot oculto
 * (`website`) e tela de sucesso com o protocolo retornado pela API.
 */
export function LeadForm({
  source,
  vehiclePublicId,
  defaultMessage = "",
  submitLabel = "Enviar mensagem",
  idPrefix = "lead",
}: LeadFormProps) {
  const [protocol, setProtocol] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: "", phone: "", email: "", message: defaultMessage, website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const result = await postLead({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        message: values.message,
        vehiclePublicId,
        source,
        website: values.website ?? "",
      });
      setProtocol(result.protocol);
    } catch {
      setSubmitError("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  });

  if (protocol) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-status-available/30 bg-status-available/5 px-5 py-7 text-center">
        <IconBadge variant="status-available" size="md">
          <Check />
        </IconBadge>
        <div>
          <p className="font-semibold">Mensagem enviada!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            A loja vai entrar em contato em breve.
          </p>
        </div>
        <div className="num rounded-md bg-muted px-4 py-2 text-sm">
          Protocolo <span className="font-bold">#{protocol}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Honeypot anti-spam: invisível para humanos. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <Field label="Seu nome" htmlFor={`${idPrefix}-name`} error={errors.name?.message}>
        <Input
          id={`${idPrefix}-name`}
          placeholder="Como devemos te chamar?"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
      </Field>

      <Field label="Telefone" htmlFor={`${idPrefix}-phone`} error={errors.phone?.message}>
        <Input
          id={`${idPrefix}-phone`}
          inputMode="tel"
          placeholder="(11) 99999-9999"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
      </Field>

      <Field label="E-mail" htmlFor={`${idPrefix}-email`} optional error={errors.email?.message}>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="seuemail@email.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Field label="Mensagem" htmlFor={`${idPrefix}-message`} error={errors.message?.message}>
        <Textarea
          id={`${idPrefix}-message`}
          rows={4}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </Field>

      {submitError && <p className="text-xs text-destructive">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : submitLabel}
      </Button>
    </form>
  );
}
