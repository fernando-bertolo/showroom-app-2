import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { ContactDrawer } from "@/components/contact/ContactDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSlug, getStorefront } from "@/lib/api";
import { buildSkinCss } from "@/lib/skin";

export async function generateMetadata(): Promise<Metadata> {
  const slug = await getSlug();
  const storefront = await getStorefront(slug);
  if (!storefront) {
    return { title: "Vitrine não encontrada" };
  }
  return {
    title: {
      default: storefront.tradeName,
      template: `%s | ${storefront.tradeName}`,
    },
    description: `Estoque de veículos da ${storefront.tradeName}. Confira preços, fotos e fale direto com a loja.`,
    // Favicon por loja: o browser aceita PNG/WebP como ícone; sem logo,
    // fica o ícone padrão do app.
    ...(storefront.logoUrl ? { icons: { icon: storefront.logoUrl } } : {}),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const slug = await getSlug();
  const storefront = await getStorefront(slug);
  if (!storefront) notFound();

  const skinCss = buildSkinCss(storefront.primaryColor, storefront.secondaryColor);

  return (
    <div className="flex min-h-screen flex-col">
      {skinCss && <style dangerouslySetInnerHTML={{ __html: skinCss }} />}
      <Header
        tradeName={storefront.tradeName}
        logoUrl={storefront.logoUrl}
        phone={storefront.phone}
      />
      <div className="flex-1">{children}</div>
      <Footer storefront={storefront} />
      <ContactDrawer whatsapp={storefront.whatsapp} phone={storefront.phone} />
    </div>
  );
}
