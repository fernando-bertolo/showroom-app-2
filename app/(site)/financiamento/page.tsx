import type { Metadata } from "next";

import { FinancingSimulator } from "@/components/financing/Simulator";

export const metadata: Metadata = {
  title: "Financiamento",
};

export default async function FinancingPage({
  searchParams,
}: {
  searchParams: Promise<{ valor?: string | string[] }>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.valor) ? sp.valor[0] : sp.valor;
  const valor = raw ? Number(raw) : undefined;

  return (
    <FinancingSimulator initialValor={valor && Number.isFinite(valor) ? valor : undefined} />
  );
}
