import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useForm, type Path } from "react-hook-form";

import { Field } from "@/components/form/Field";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { Input } from "@/design-system/primitives/input";
import { useSubmitSellLead } from "@/hooks/useVehicles";
import { cn } from "@/lib/utils";
import { SELL_STEP_FIELDS, sellFormSchema, type SellFormValues } from "@/types/sell";

const TOTAL = 4;

const STEP_TITLES = ["Sobre seu veículo", "Versão e uso", "Condições gerais", "Seu contato"];

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2">
      {STEP_TITLES.map((title, idx) => {
        const n = idx + 1;
        const done = step > n;
        const current = step === n;
        return (
          <li key={title} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                current && "border-primary text-primary",
                !done && !current && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5" /> : n}
            </span>
            <span
              className={cn(
                "hidden text-xs font-medium md:block",
                current ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {title}
            </span>
            {n < TOTAL && <span className="ml-1 hidden h-px flex-1 bg-border sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}

interface PillOption {
  value: string;
  label: string;
}

function PillRadio({
  label,
  hint,
  options,
  value,
  error,
  onChange,
}: {
  label: string;
  hint?: string;
  options: PillOption[];
  value?: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                on
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-accent",
              )}
            >
              {on && <Check className="size-3.5" />}
              {o.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function SellCarPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [protocolo, setProtocolo] = React.useState<string | null>(null);
  const submitLead = useSubmitSellLead();

  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    mode: "onTouched",
    defaultValues: {
      marca: "",
      modelo: "",
      ano: "",
      versao: "",
      km: "",
      nome: "",
      telefone: "",
      email: "",
      cidade: "",
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const next = async () => {
    const fields = SELL_STEP_FIELDS[step - 1] as Path<SellFormValues>[];
    const valid = await trigger(fields);
    if (!valid) return;
    if (step < TOTAL) {
      setStep((s) => s + 1);
    } else {
      void handleSubmit(onSubmit)();
    }
  };

  const prev = () => {
    if (step === 1) navigate({ to: "/estoque" });
    else setStep((s) => s - 1);
  };

  const onSubmit = async (values: SellFormValues) => {
    const result = await submitLead.mutateAsync({
      ...values,
      email: values.email || undefined,
    });
    setProtocolo(result.protocolo);
    window.scrollTo(0, 0);
  };

  // Tela de confirmação
  if (protocolo) {
    const { marca, modelo, ano } = getValues();
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="items-center gap-0 p-9 text-center">
          <IconBadge variant="status-available" size="lg">
            <Check />
          </IconBadge>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Recebemos sua solicitação</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Um consultor da nossa equipe de compra vai analisar seu {marca} {modelo} {ano} e entrar
            em contato pelo WhatsApp em até 24h úteis com uma proposta inicial.
          </p>

          <div className="mt-6 flex w-full justify-around gap-4 rounded-md bg-muted px-5 py-4 text-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Protocolo
              </div>
              <div className="num mt-0.5 font-bold">#{protocolo}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Resposta em
              </div>
              <div className="mt-0.5 font-bold">até 24h úteis</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/estoque">Ir para o estoque</Link>
            </Button>
            <Button asChild>
              <a href="https://wa.me/5511999990000" target="_blank" rel="noreferrer">
                <MessageCircle /> Falar agora
              </a>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Navegação"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link to="/estoque" className="transition-colors hover:text-foreground">
          Estoque
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Venda seu carro</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Venda seu carro com a gente
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Avaliamos seu veículo em até 24h. Compramos à vista ou aceitamos como entrada em um
          seminovo do pátio.
        </p>
      </header>

      <StepIndicator step={step} />

      <Card className="p-6 sm:p-7">
        <div className="flex flex-col gap-5">
          {step === 1 && (
            <>
              <Field label="Marca" htmlFor="sf-marca" error={errors.marca?.message}>
                <Input id="sf-marca" placeholder="Ex.: Honda" {...register("marca")} />
              </Field>
              <Field label="Modelo" htmlFor="sf-modelo" error={errors.modelo?.message}>
                <Input id="sf-modelo" placeholder="Ex.: Civic" {...register("modelo")} />
              </Field>
              <Field label="Ano modelo" htmlFor="sf-ano" error={errors.ano?.message}>
                <Input
                  id="sf-ano"
                  inputMode="numeric"
                  placeholder="Ex.: 2022"
                  className="num"
                  {...register("ano", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    },
                  })}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Versão / acabamento" htmlFor="sf-versao" error={errors.versao?.message}>
                <Input id="sf-versao" placeholder="Ex.: EXL 2.0 Flex" {...register("versao")} />
              </Field>
              <Field
                label="Quilometragem aproximada"
                htmlFor="sf-km"
                error={errors.km?.message}
              >
                <Input
                  id="sf-km"
                  inputMode="numeric"
                  placeholder="Ex.: 35000"
                  className="num"
                  {...register("km", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                />
              </Field>
              <PillRadio
                label="Câmbio"
                value={watch("cambio")}
                error={errors.cambio?.message}
                onChange={(v) =>
                  setValue("cambio", v as SellFormValues["cambio"], { shouldValidate: true })
                }
                options={[
                  { value: "Manual", label: "Manual" },
                  { value: "Automático", label: "Automático" },
                  { value: "CVT", label: "CVT" },
                  { value: "Automatizado", label: "Automatizado" },
                ]}
              />
            </>
          )}

          {step === 3 && (
            <>
              <PillRadio
                label="Estado geral"
                hint="Como você descreveria a aparência e a mecânica?"
                value={watch("estado")}
                error={errors.estado?.message}
                onChange={(v) =>
                  setValue("estado", v as SellFormValues["estado"], { shouldValidate: true })
                }
                options={[
                  { value: "excelente", label: "Excelente" },
                  { value: "bom", label: "Bom" },
                  { value: "regular", label: "Regular" },
                  { value: "ruim", label: "Precisa de reparos" },
                ]}
              />
              <PillRadio
                label="É único dono?"
                value={watch("unicoDono")}
                error={errors.unicoDono?.message}
                onChange={(v) =>
                  setValue("unicoDono", v as SellFormValues["unicoDono"], { shouldValidate: true })
                }
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "nao", label: "Não" },
                ]}
              />
              <PillRadio
                label="Documentação em dia?"
                hint="IPVA, multas e licenciamento sem pendências"
                value={watch("docOk")}
                error={errors.docOk?.message}
                onChange={(v) =>
                  setValue("docOk", v as SellFormValues["docOk"], { shouldValidate: true })
                }
                options={[
                  { value: "sim", label: "Sim" },
                  { value: "parcial", label: "Em parte" },
                  { value: "nao", label: "Não" },
                ]}
              />
            </>
          )}

          {step === 4 && (
            <>
              <Field label="Seu nome" htmlFor="sf-nome" error={errors.nome?.message}>
                <Input id="sf-nome" placeholder="Como devemos te chamar?" {...register("nome")} />
              </Field>
              <Field
                label="Telefone (WhatsApp)"
                htmlFor="sf-tel"
                error={errors.telefone?.message}
              >
                <Input
                  id="sf-tel"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  {...register("telefone")}
                />
              </Field>
              <Field label="E-mail" htmlFor="sf-mail" optional error={errors.email?.message}>
                <Input
                  id="sf-mail"
                  type="email"
                  placeholder="seuemail@email.com"
                  {...register("email")}
                />
              </Field>
              <Field label="Cidade" htmlFor="sf-cidade" error={errors.cidade?.message}>
                <Input id="sf-cidade" placeholder="Onde está o veículo?" {...register("cidade")} />
              </Field>
            </>
          )}
        </div>
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" onClick={prev}>
          <ChevronLeft />
          {step === 1 ? "Cancelar" : "Voltar"}
        </Button>
        <span className="num text-xs text-muted-foreground">
          Passo {step} de {TOTAL}
        </span>
        <Button onClick={next} disabled={submitLead.isPending}>
          {step === TOTAL ? (submitLead.isPending ? "Enviando..." : "Enviar solicitação") : "Continuar"}
          {step !== TOTAL && <ChevronRight />}
        </Button>
      </div>
    </main>
  );
}
