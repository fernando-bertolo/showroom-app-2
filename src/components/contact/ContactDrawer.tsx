"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Phone, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { postLead } from "@/components/contact/LeadForm";
import { Field } from "@/components/form/Field";
import { VehiclePhoto } from "@/components/vehicle/VehiclePhoto";
import { Button } from "@/design-system/primitives/button";
import { Input } from "@/design-system/primitives/input";
import { Textarea } from "@/design-system/primitives/textarea";
import { formatCurrencyBRL, telHref, waHref } from "@/lib/format";
import { useContact } from "@/stores/contact";
import { useToast } from "@/stores/toast";
import { leadFormSchema, type LeadFormValues } from "@/types/contact";

interface ContactDrawerProps {
  whatsapp: string | null;
  phone: string | null;
}

export function ContactDrawer({ whatsapp, phone }: ContactDrawerProps) {
  const { open, vehicle, closeContact } = useContact();
  const { notify } = useToast();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const defaultMessage = vehicle ? `Olá! Tenho interesse no ${vehicle.name}.` : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: "", phone: "", email: "", message: defaultMessage, website: "" },
  });

  // Reseta a mensagem ao abrir o drawer (pode trazer outro veículo).
  React.useEffect(() => {
    if (open) {
      setSubmitError(null);
      reset({ name: "", phone: "", email: "", message: defaultMessage, website: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, vehicle?.publicId]);

  // Fecha com Escape e trava o scroll do corpo.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContact();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeContact]);

  if (!open) return null;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const result = await postLead({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        message: values.message,
        vehiclePublicId: vehicle?.publicId,
        source: "CONTACT",
        website: values.website ?? "",
      });
      closeContact();
      notify(`Mensagem enviada — protocolo #${result.protocol}. Vamos te chamar em instantes.`);
    } catch {
      setSubmitError("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  });

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs duration-200 animate-in fade-in-0"
        onClick={closeContact}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-xl duration-300 animate-in slide-in-from-right"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="contact-drawer-title" className="text-lg font-semibold">
            Falar com a loja
          </h2>
          <Button variant="ghost" size="icon-sm" aria-label="Fechar" onClick={closeContact}>
            <X />
          </Button>
        </header>

        <form
          id="contact-form"
          onSubmit={onSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
        >
          {/* Honeypot anti-spam: invisível para humanos. */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            {...register("website")}
          />

          {vehicle && (
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
              <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md">
                {vehicle.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <VehiclePhoto seed={vehicle.publicId} iconClassName="size-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{vehicle.name}</p>
                <p className="num text-xs text-muted-foreground">
                  {vehicle.manufacturerYear}/{vehicle.modelYear} ·{" "}
                  {formatCurrencyBRL(vehicle.salePrice)}
                </p>
              </div>
            </div>
          )}

          {(whatsapp || phone) && (
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Resposta direta no canal de sua preferência:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {whatsapp && (
                  <a
                    href={waHref(
                      whatsapp,
                      vehicle ? `Olá! Tenho interesse no ${vehicle.name}.` : undefined,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md border border-border p-2.5 transition-colors hover:bg-accent"
                  >
                    <MessageCircle className="size-5 text-[oklch(0.6_0.14_145)]" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">WhatsApp</span>
                      <span className="block text-xs text-muted-foreground">
                        Resposta em minutos
                      </span>
                    </span>
                  </a>
                )}
                {phone && (
                  <a
                    href={telHref(phone)}
                    className="flex items-center gap-2 rounded-md border border-border p-2.5 transition-colors hover:bg-accent"
                  >
                    <Phone className="size-5 text-primary" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">Ligar</span>
                      <span className="num block text-xs text-muted-foreground">{phone}</span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
            Ou preencha abaixo que nosso consultor entra em contato:
          </p>

          <Field label="Seu nome" htmlFor="cd-nome" error={errors.name?.message}>
            <Input
              id="cd-nome"
              placeholder="Como devemos te chamar?"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field label="Telefone" htmlFor="cd-tel" error={errors.phone?.message}>
            <Input
              id="cd-tel"
              inputMode="tel"
              placeholder="(11) 99999-9999"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
          </Field>

          <Field label="E-mail" htmlFor="cd-mail" optional error={errors.email?.message}>
            <Input
              id="cd-mail"
              type="email"
              placeholder="seuemail@email.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          <Field label="Mensagem" htmlFor="cd-msg" error={errors.message?.message}>
            <Textarea
              id="cd-msg"
              rows={4}
              aria-invalid={Boolean(errors.message)}
              {...register("message")}
            />
          </Field>

          {submitError && <p className="text-xs text-destructive">{submitError}</p>}
        </form>

        <footer className="flex items-center gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" className="flex-1" type="button" onClick={closeContact}>
            Cancelar
          </Button>
          <Button className="flex-1" type="submit" form="contact-form" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </footer>
      </aside>
    </div>
  );
}
