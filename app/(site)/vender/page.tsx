import type { Metadata } from "next";

import { SellCarForm } from "@/components/sell/SellCarForm";
import { getSlug, getStorefront } from "@/lib/api";

export const metadata: Metadata = {
  title: "Venda seu carro",
};

export default async function SellCarPage() {
  const slug = await getSlug();
  const storefront = await getStorefront(slug);

  return <SellCarForm whatsapp={storefront?.whatsapp ?? null} />;
}
