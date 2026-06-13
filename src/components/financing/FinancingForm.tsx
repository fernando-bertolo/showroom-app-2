"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Controller, useForm, type Path } from "react-hook-form";

import { Field } from "@/components/form/Field";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { Input } from "@/design-system/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/design-system/primitives/select";
import { formatCurrencyBRL, waHref } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  FINANCING_STEP_FIELDS,
  financingFormSchema,
  type FinancingFormValues,
  type FinancingRequestPayload,
} from "@/types/financing";

import type { VehicleSummary } from "@/types/vehicle";

const TOTAL = 4;

const STEP_TITLES = ["Veículo", "Dados pessoais", "Profissional", "Cônjuge"];

interface Opt {
  value: string;
  label: string;
}

const SEXO: Opt[] = [
  { value: "Masculino", label: "Masculino" },
  { value: "Feminino", label: "Feminino" },
];
const ESTADO_CIVIL: Opt[] = [
  { value: "Solteiro(a)", label: "Solteiro(a)" },
  { value: "Casado(a)", label: "Casado(a)" },
  { value: "Divorciado(a)", label: "Divorciado(a)" },
  { value: "Viúvo(a)", label: "Viúvo(a)" },
  { value: "União estável", label: "União estável" },
];
const TIPO_PESSOA: Opt[] = [
  { value: "Física", label: "Física" },
  { value: "Jurídica", label: "Jurídica" },
];
const GRAU_INSTRUCAO: Opt[] = [
  { value: "Fundamental", label: "Fundamental" },
  { value: "Médio", label: "Médio" },
  { value: "Superior", label: "Superior" },
  { value: "Pós-graduação", label: "Pós-graduação" },
];
const TIPO_RESIDENCIA: Opt[] = [
  { value: "Própria", label: "Própria" },
  { value: "Alugada", label: "Alugada" },
  { value: "Financiada", label: "Financiada" },
  { value: "Familiar", label: "Familiar" },
];
const TIPO_TELEFONE: Opt[] = [
  { value: "Celular", label: "Celular" },
  { value: "Residencial", label: "Residencial" },
  { value: "Comercial", label: "Comercial" },
  { value: "Recado", label: "Recado" },
];
const END_CORRESP: Opt[] = [
  { value: "Residencial", label: "Residencial" },
  { value: "Comercial", label: "Comercial" },
];

type FieldKind = "text" | "date" | "email" | "select" | "currency" | "cep";

/** Quais campos do formulário o CEP deve autopreencher (ViaCEP). */
interface CepFill {
  logradouro: keyof FinancingFormValues;
  bairro: keyof FinancingFormValues;
  cidade: keyof FinancingFormValues;
  uf: keyof FinancingFormValues;
}

interface FieldCfg {
  name: keyof FinancingFormValues;
  label: string;
  kind?: FieldKind;
  placeholder?: string;
  options?: Opt[];
  full?: boolean;
  required?: boolean;
  cepFill?: CepFill;
}

interface Section {
  title?: string;
  fields: FieldCfg[];
}

const PESSOAIS_SECTIONS: Section[] = [
  {
    title: "Identificação",
    fields: [
      { name: "nome", label: "Nome completo", full: true, required: true },
      { name: "cpf", label: "CPF", placeholder: "123.456.789-00", required: true },
      { name: "nascimento", label: "Data de nascimento", kind: "date", required: true },
      { name: "rgNumero", label: "RG nº" },
      { name: "rgOrgao", label: "Órgão emissor" },
      { name: "rgUf", label: "UF do RG" },
      { name: "rgDataEmissao", label: "Data de emissão", kind: "date" },
      { name: "sexo", label: "Sexo", kind: "select", options: SEXO },
      { name: "estadoCivil", label: "Estado civil", kind: "select", options: ESTADO_CIVIL },
      { name: "nacionalidade", label: "Nacionalidade", placeholder: "Ex.: Brasileira" },
      { name: "naturalidadeCidade", label: "Naturalidade (cidade)" },
      { name: "naturalidadeUf", label: "UF de naturalidade" },
      { name: "nomePai", label: "Nome do pai", full: true },
      { name: "nomeMae", label: "Nome da mãe", full: true },
      { name: "tipoPessoa", label: "Tipo de pessoa", kind: "select", options: TIPO_PESSOA },
      { name: "grauInstrucao", label: "Grau de instrução", kind: "select", options: GRAU_INSTRUCAO },
      { name: "numDependentes", label: "Nº de dependentes" },
    ],
  },
  {
    title: "Contato",
    fields: [
      { name: "email", label: "E-mail", kind: "email", placeholder: "seuemail@email.com", full: true },
      { name: "celular", label: "Celular (WhatsApp)", placeholder: "(11) 99999-9999", required: true },
      { name: "telefoneResidencial", label: "Telefone residencial" },
      { name: "tipoTelefone", label: "Tipo de telefone", kind: "select", options: TIPO_TELEFONE },
      { name: "telefoneRecado", label: "Telefone de recado" },
    ],
  },
  {
    title: "Endereço residencial",
    fields: [
      {
        name: "cep",
        label: "CEP",
        kind: "cep",
        placeholder: "00000-000",
        cepFill: { logradouro: "endereco", bairro: "bairro", cidade: "cidade", uf: "estado" },
      },
      { name: "endereco", label: "Endereço", full: true },
      { name: "enderecoNumero", label: "Nº" },
      { name: "complemento", label: "Complemento" },
      { name: "bairro", label: "Bairro" },
      { name: "cidade", label: "Cidade" },
      { name: "estado", label: "Estado (UF)" },
      { name: "endCorrespondencia", label: "Endereço p/ correspondência", kind: "select", options: END_CORRESP },
      { name: "tempoResidencia", label: "Tempo de residência" },
      { name: "tipoResidencia", label: "Tipo de residência", kind: "select", options: TIPO_RESIDENCIA },
    ],
  },
];

const PROFISSIONAIS_SECTIONS: Section[] = [
  {
    title: "Empresa",
    fields: [
      { name: "empresa", label: "Empresa", full: true },
      { name: "cnpjEmpresaPropria", label: "CNPJ (empresa própria)" },
      { name: "dataAdmissao", label: "Data de admissão", kind: "date" },
      { name: "rendaMensal", label: "Renda mensal / faturamento (R$)", kind: "currency", placeholder: "Ex.: 6.500", required: true },
      { name: "cargoFuncao", label: "Cargo / função" },
      { name: "telefoneComercial", label: "Telefone comercial" },
    ],
  },
  {
    title: "Endereço comercial",
    fields: [
      {
        name: "cepComercial",
        label: "CEP",
        kind: "cep",
        placeholder: "00000-000",
        cepFill: {
          logradouro: "endComercial",
          bairro: "bairroComercial",
          cidade: "cidadeComercial",
          uf: "ufComercial",
        },
      },
      { name: "endComercial", label: "Endereço comercial", full: true },
      { name: "bairroComercial", label: "Bairro" },
      { name: "cidadeComercial", label: "Cidade" },
      { name: "ufComercial", label: "UF" },
    ],
  },
];

const CONJUGE_SECTIONS: Section[] = [
  {
    fields: [
      { name: "conjugeNome", label: "Nome completo", full: true },
      { name: "conjugeCpf", label: "CPF" },
      { name: "conjugeRg", label: "RG nº" },
      { name: "conjugeNascimento", label: "Data de nascimento", kind: "date" },
      { name: "conjugeEmpresa", label: "Empresa onde trabalha" },
      { name: "conjugeTelefone", label: "Telefone" },
      { name: "conjugeOcupacao", label: "Ocupação" },
      { name: "conjugeRenda", label: "Renda" },
    ],
  },
];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <ol className="flex items-center gap-2">
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
      {/* No mobile os títulos ao lado dos números ficam ocultos; mostramos o da etapa atual aqui. */}
      <p className="mt-2 text-sm font-semibold text-foreground md:hidden">
        {step}. {STEP_TITLES[step - 1]}
      </p>
    </div>
  );
}

function digits(value?: string): number | undefined {
  if (!value) return undefined;
  const n = Number(value.replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Remove campos vazios; retorna undefined se a seção ficar vazia. */
function clean(obj: Record<string, string | undefined>): Record<string, string> | undefined {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const s = (v ?? "").trim();
    if (s) out[k] = s;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Monta o body do POST /showroom/{slug}/financing-requests a partir do wizard. */
function toPayload(v: FinancingFormValues): FinancingRequestPayload {
  const details: Record<string, Record<string, string>> = {};

  const pessoais = clean({
    rgNumero: v.rgNumero,
    rgOrgao: v.rgOrgao,
    rgUf: v.rgUf,
    rgDataEmissao: v.rgDataEmissao,
    nacionalidade: v.nacionalidade,
    naturalidadeCidade: v.naturalidadeCidade,
    naturalidadeUf: v.naturalidadeUf,
    sexo: v.sexo,
    nomePai: v.nomePai,
    nomeMae: v.nomeMae,
    estadoCivil: v.estadoCivil,
    endCorrespondencia: v.endCorrespondencia,
    tipoPessoa: v.tipoPessoa,
    grauInstrucao: v.grauInstrucao,
    numDependentes: v.numDependentes,
    endereco: v.endereco,
    enderecoNumero: v.enderecoNumero,
    complemento: v.complemento,
    bairro: v.bairro,
    cidade: v.cidade,
    cep: v.cep,
    estado: v.estado,
    tempoResidencia: v.tempoResidencia,
    tipoResidencia: v.tipoResidencia,
    telefoneResidencial: v.telefoneResidencial,
    tipoTelefone: v.tipoTelefone,
    telefoneRecado: v.telefoneRecado,
  });
  if (pessoais) details.pessoais = pessoais;

  const profissionais = clean({
    empresa: v.empresa,
    cnpjEmpresaPropria: v.cnpjEmpresaPropria,
    dataAdmissao: v.dataAdmissao,
    endComercial: v.endComercial,
    bairroComercial: v.bairroComercial,
    cidadeComercial: v.cidadeComercial,
    cepComercial: v.cepComercial,
    ufComercial: v.ufComercial,
    telefoneComercial: v.telefoneComercial,
  });
  if (profissionais) details.profissionais = profissionais;

  const conjuge = clean({
    nome: v.conjugeNome,
    cpf: v.conjugeCpf,
    rg: v.conjugeRg,
    nascimento: v.conjugeNascimento,
    empresa: v.conjugeEmpresa,
    telefone: v.conjugeTelefone,
    ocupacao: v.conjugeOcupacao,
    renda: v.conjugeRenda,
  });
  if (conjuge) details.conjuge = conjuge;

  return {
    customerName: v.nome,
    customerCpf: v.cpf,
    customerPhone: v.celular,
    customerEmail: v.email || undefined,
    birthDate: v.nascimento || undefined,
    occupation: v.cargoFuncao || undefined,
    monthlyIncome: digits(v.rendaMensal),
    vehiclePublicId: v.veiculoPublicId || undefined,
    vehicleName: v.veiculoNome || undefined,
    vehiclePrice: digits(v.veiculoValor),
    downPayment: digits(v.entrada),
    installments: v.parcelas ? Number(v.parcelas) : undefined,
    notes: v.observacoes || undefined,
    details: Object.keys(details).length ? details : undefined,
    website: v.website ?? "",
  };
}

export function FinancingForm({
  whatsapp,
  vehicles,
  initialVehicleId,
}: {
  whatsapp: string | null;
  vehicles: VehicleSummary[];
  initialVehicleId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [protocol, setProtocol] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const initialVehicle = initialVehicleId
    ? vehicles.find((v) => v.publicId === initialVehicleId)
    : undefined;

  const form = useForm<FinancingFormValues>({
    resolver: zodResolver(financingFormSchema),
    mode: "onTouched",
    defaultValues: {
      veiculoPublicId: initialVehicle?.publicId ?? "",
      veiculoNome: initialVehicle?.name ?? "",
      veiculoValor: initialVehicle ? String(initialVehicle.salePrice) : "",
      entrada: "",
      parcelas: "",
      nome: "",
      cpf: "",
      nascimento: "",
      celular: "",
      email: "",
      rendaMensal: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const selectedVehicleId = watch("veiculoPublicId");
  const selectedVehicle = vehicles.find((v) => v.publicId === selectedVehicleId);

  const handleVehicleChange = (publicId: string) => {
    const vehicle = vehicles.find((v) => v.publicId === publicId);
    setValue("veiculoPublicId", publicId, { shouldValidate: true });
    setValue("veiculoNome", vehicle?.name ?? "");
    setValue("veiculoValor", vehicle ? String(vehicle.salePrice) : "");
  };

  const onSubmit = async (values: FinancingFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/financing-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toPayload(values)),
      });
      if (!res.ok) throw new Error(`Falha ao enviar (${res.status})`);
      const data = (await res.json()) as { protocol: string };
      setProtocol(data.protocol);
      window.scrollTo(0, 0);
    } catch {
      setSubmitError("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  };

  const next = async () => {
    const fields = FINANCING_STEP_FIELDS[step - 1] as Path<FinancingFormValues>[];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (!valid) return;
    if (step < TOTAL) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
    } else {
      void handleSubmit(onSubmit)();
    }
  };

  const prev = () => {
    if (step === 1) router.push("/estoque");
    else {
      setStep((s) => s - 1);
      window.scrollTo(0, 0);
    }
  };

  // Máscara de moeda: exibe com separador de milhar pt-BR, guarda só dígitos no value.
  const currencyOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/\D/g, "");
    e.target.value = d ? Number(d).toLocaleString("pt-BR") : "";
  };

  // Autocomplete de endereço pelo CEP (ViaCEP). Falha silenciosa: o usuário pode
  // preencher manualmente se o serviço estiver fora do ar ou o CEP não existir.
  const lookupCep = async (cep: string, fill: CepFill) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };
      if (data.erro) return;
      if (data.logradouro) setValue(fill.logradouro, data.logradouro);
      if (data.bairro) setValue(fill.bairro, data.bairro);
      if (data.localidade) setValue(fill.cidade, data.localidade);
      if (data.uf) setValue(fill.uf, data.uf);
    } catch {
      // serviço indisponível — segue com preenchimento manual
    }
  };

  // Máscara de CEP (00000-000) + dispara o autocomplete ao completar 8 dígitos.
  const cepOnChange = (fill: CepFill) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 8);
    e.target.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    if (d.length === 8) void lookupCep(d, fill);
  };

  /** Renderiza um campo da ficha a partir da config (texto, data, e-mail ou select). */
  const renderField = (cfg: FieldCfg) => {
    const error = errors[cfg.name]?.message as string | undefined;
    const id = `ff-${cfg.name}`;
    return (
      <Field
        key={cfg.name}
        label={cfg.label}
        htmlFor={id}
        optional={!cfg.required}
        error={error}
        className={cfg.full ? "sm:col-span-2" : undefined}
      >
        {cfg.kind === "select" ? (
          <Controller
            control={control}
            name={cfg.name}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id={id} className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {cfg.options!.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : cfg.kind === "cep" ? (
          <Input
            id={id}
            inputMode="numeric"
            placeholder={cfg.placeholder}
            className="num"
            {...register(cfg.name, { onChange: cepOnChange(cfg.cepFill!) })}
          />
        ) : cfg.kind === "currency" ? (
          <Input
            id={id}
            inputMode="numeric"
            placeholder={cfg.placeholder}
            className="num"
            {...register(cfg.name, { onChange: currencyOnChange })}
          />
        ) : (
          <Input
            id={id}
            type={cfg.kind === "date" ? "date" : cfg.kind === "email" ? "email" : "text"}
            placeholder={cfg.placeholder}
            className={cfg.kind === "date" ? "num" : undefined}
            {...register(cfg.name)}
          />
        )}
      </Field>
    );
  };

  const renderSections = (sections: Section[]) =>
    sections.map((section, i) => (
      <div key={section.title ?? i} className="flex flex-col gap-3">
        {section.title && (
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{section.title}</h3>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {section.fields.map(renderField)}
        </div>
      </div>
    ));

  // Tela de confirmação
  if (protocol) {
    const { veiculoNome } = getValues();
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="items-center gap-0 p-9 text-center">
          <IconBadge variant="status-available" size="lg">
            <Check />
          </IconBadge>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Recebemos sua solicitação</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Um consultor vai analisar sua simulação{veiculoNome ? ` para o ${veiculoNome}` : ""} e
            entrar em contato em até 24h úteis com as melhores condições de financiamento.
          </p>

          <div className="mt-6 flex w-full justify-around gap-4 rounded-md bg-muted px-5 py-4 text-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Protocolo
              </div>
              <div className="num mt-0.5 font-bold">#{protocol}</div>
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
              <Link href="/estoque">Ir para o estoque</Link>
            </Button>
            {whatsapp && (
              <Button asChild>
                <a href={waHref(whatsapp)} target="_blank" rel="noreferrer">
                  <MessageCircle /> Falar agora
                </a>
              </Button>
            )}
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <nav
        aria-label="Navegação"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link href="/estoque" className="transition-colors hover:text-foreground">
          Estoque
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">Financiamento</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Simule seu financiamento</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Preencha a ficha abaixo e nossa equipe calcula as melhores condições com bancos e
          financeiras. Sem compromisso e sujeito à análise de crédito.
        </p>
      </header>

      <StepIndicator step={step} />

      <Card className="p-6 sm:p-7">
        {/* Honeypot anti-spam: invisível para humanos. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          {...register("website")}
        />

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <Field
              label="Veículo de interesse"
              htmlFor="ff-veiculo"
              hint="Escolha o veículo do estoque que deseja financiar"
              error={errors.veiculoPublicId?.message}
            >
              {vehicles.length > 0 ? (
                <Select value={selectedVehicleId || undefined} onValueChange={handleVehicleChange}>
                  <SelectTrigger id="ff-veiculo" className="w-full">
                    <SelectValue placeholder="Selecione um veículo do estoque" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.publicId} value={v.publicId}>
                        {v.name} — {formatCurrencyBRL(v.salePrice)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum veículo disponível no estoque no momento. Fale com a loja pelo WhatsApp.
                </p>
              )}
            </Field>
            {selectedVehicle && (
              <div className="rounded-md bg-muted px-4 py-3 text-sm">
                <span className="text-muted-foreground">Valor do veículo:</span>{" "}
                <span className="num font-semibold">
                  {formatCurrencyBRL(selectedVehicle.salePrice)}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Valor de entrada (R$)"
                htmlFor="ff-entrada"
                hint="Quanto pretende dar de entrada?"
                error={errors.entrada?.message}
              >
                <Input
                  id="ff-entrada"
                  inputMode="numeric"
                  placeholder="Ex.: 20.000"
                  className="num"
                  {...register("entrada", { onChange: currencyOnChange })}
                />
              </Field>
              <Field
                label="Número de parcelas"
                htmlFor="ff-parcelas"
                hint="Em quantas vezes? (ex.: 48)"
                error={errors.parcelas?.message}
              >
                <Input
                  id="ff-parcelas"
                  inputMode="numeric"
                  placeholder="Ex.: 48"
                  className="num"
                  {...register("parcelas", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
                    },
                  })}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">{renderSections(PESSOAIS_SECTIONS)}</div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">{renderSections(PROFISSIONAIS_SECTIONS)}</div>
        )}

        {step === 4 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Preencha apenas se for casado(a) ou tiver companheiro(a). Todos os campos são opcionais.
            </p>
            <div className="flex flex-col gap-6">{renderSections(CONJUGE_SECTIONS)}</div>
          </>
        )}

        {submitError && <p className="mt-4 text-xs text-destructive">{submitError}</p>}
      </Card>

      <div className="mt-5 flex items-center justify-between">
        <Button variant="ghost" onClick={prev}>
          <ChevronLeft />
          {step === 1 ? "Cancelar" : "Voltar"}
        </Button>
        <span className="num text-xs text-muted-foreground">
          Passo {step} de {TOTAL}
        </span>
        <Button onClick={next} disabled={isSubmitting}>
          {step === TOTAL ? (isSubmitting ? "Enviando..." : "Enviar solicitação") : "Continuar"}
          {step !== TOTAL && <ChevronRight />}
        </Button>
      </div>
    </main>
  );
}
