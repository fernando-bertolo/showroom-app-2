"use client";

import * as React from "react";

import { Banknote, Calculator } from "lucide-react";

import { LeadForm } from "@/components/contact/LeadForm";
import { IconBadge } from "@/design-system/patterns/IconBadge";
import { Card } from "@/design-system/primitives/card";
import { formatCurrencyBRL } from "@/lib/format";

const PARCELAS_OPCOES = [12, 24, 36, 48, 60] as const;

interface SimState {
  valor: number;
  entrada: number;
  parcelas: number;
  taxa: number; // % ao mês
}

/** Tabela Price: parcela = P·i / (1 − (1+i)^−n). */
function calcParcela({ valor, entrada, parcelas, taxa }: SimState): number {
  const financiado = Math.max(0, valor - entrada);
  const i = taxa / 100;
  if (financiado <= 0) return 0;
  if (i === 0) return financiado / parcelas;
  return (financiado * i) / (1 - Math.pow(1 + i, -parcelas));
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="num text-sm font-semibold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
        aria-label={label}
      />
    </div>
  );
}

export function FinancingSimulator({ initialValor }: { initialValor?: number }) {
  const valorInicial = initialValor && initialValor > 0 ? initialValor : 100000;
  const [state, setState] = React.useState<SimState>({
    valor: valorInicial,
    entrada: Math.round(valorInicial * 0.3),
    parcelas: 48,
    taxa: 1.49,
  });

  const patch = (p: Partial<SimState>) => setState((s) => ({ ...s, ...p }));

  const parcela = calcParcela(state);
  const financiado = Math.max(0, state.valor - state.entrada);
  const totalPago = parcela * state.parcelas + state.entrada;
  const totalJuros = Math.max(0, totalPago - state.valor);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <IconBadge variant="primary" size="md">
          <Calculator />
        </IconBadge>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Simulador de financiamento</h1>
          <p className="text-sm text-muted-foreground">
            Estimativa pela Tabela Price. Sujeito a análise de crédito.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="gap-6 p-6">
          <Slider
            label="Valor do veículo"
            value={state.valor}
            min={20000}
            max={300000}
            step={1000}
            onChange={(v) => patch({ valor: v, entrada: Math.min(state.entrada, v) })}
            format={(v) => formatCurrencyBRL(v)}
          />
          <Slider
            label="Entrada"
            value={state.entrada}
            min={0}
            max={state.valor}
            step={1000}
            onChange={(v) => patch({ entrada: v })}
            format={(v) => formatCurrencyBRL(v)}
          />
          <Slider
            label="Taxa de juros (a.m.)"
            value={state.taxa}
            min={0.5}
            max={3}
            step={0.01}
            onChange={(v) => patch({ taxa: v })}
            format={(v) => `${v.toFixed(2)}%`}
          />

          <div>
            <span className="mb-2 block text-sm font-medium">Parcelas</span>
            <div className="flex flex-wrap gap-2">
              {PARCELAS_OPCOES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => patch({ parcelas: p })}
                  className={
                    "num rounded-md border px-4 py-2 text-sm font-medium transition-colors " +
                    (state.parcelas === p
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-accent")
                  }
                >
                  {p}x
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="gap-0 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Parcela estimada
          </p>
          <p className="num mt-1 text-3xl font-bold tracking-tight text-primary">
            {formatCurrencyBRL(Math.round(parcela))}
          </p>
          <p className="num mt-1 text-xs text-muted-foreground">em {state.parcelas}x</p>

          <hr className="my-4 border-border" />

          <dl className="flex flex-col gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Valor financiado</dt>
              <dd className="num font-medium">{formatCurrencyBRL(financiado)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Total de juros</dt>
              <dd className="num font-medium">{formatCurrencyBRL(Math.round(totalJuros))}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Total a pagar</dt>
              <dd className="num font-medium">{formatCurrencyBRL(Math.round(totalPago))}</dd>
            </div>
          </dl>

          <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Banknote className="mt-0.5 size-3.5 shrink-0" />
            Aprovação de crédito sujeita à análise do banco. Trabalhamos com as principais
            financeiras.
          </p>
        </Card>
      </div>

      {/* CTA: lead de financiamento */}
      <Card className="mt-6 gap-0 p-6 lg:max-w-xl">
        <h2 className="text-lg font-semibold tracking-tight">Falar com um consultor</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Deixe seu contato e um consultor retorna com as melhores condições para o seu perfil.
        </p>
        <LeadForm
          source="FINANCING"
          defaultMessage={`Olá! Simulei um financiamento de ${formatCurrencyBRL(valorInicial)} e quero falar com um consultor.`}
          submitLabel="Quero uma proposta"
          idPrefix="fin"
        />
      </Card>
    </main>
  );
}
