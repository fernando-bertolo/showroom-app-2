import type { Metadata } from "next";

import { FinancingForm } from "@/components/financing/FinancingForm";
import { getSlug, getStorefront, getVehicles } from "@/lib/api";

export const metadata: Metadata = {
  title: "Financiamento",
};

interface PageProps {
  searchParams: Promise<{ veiculo?: string }>;
}

export default async function FinancingPage({ searchParams }: PageProps) {
  const slug = await getSlug();
  const [storefront, vehicles, params] = await Promise.all([
    getStorefront(slug),
    getVehicles(slug, { size: 60, sort: "price_asc" }),
    searchParams,
  ]);

  return (
    <FinancingForm
      whatsapp={storefront?.whatsapp ?? null}
      vehicles={vehicles?.content ?? []}
      initialVehicleId={params.veiculo}
    />
  );
}
