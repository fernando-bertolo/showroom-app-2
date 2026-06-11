"use client";

import Link from "next/link";

import { Heart, MessageCircle } from "lucide-react";

import { LeadForm } from "@/components/contact/LeadForm";
import { Button } from "@/design-system/primitives/button";
import { Card } from "@/design-system/primitives/card";
import { formatCurrencyBRL, waHref } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/stores/favorites";

import type { VehicleSummary } from "@/types/vehicle";

interface PriceCardProps {
  vehicle: VehicleSummary;
  whatsapp: string | null;
}

/**
 * Card de preço + CTA principal (formulário de interesse → /api/leads,
 * source=VEHICLE_DETAIL). WhatsApp como ação secundária.
 */
export function PriceCard({ vehicle, whatsapp }: PriceCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(vehicle.publicId);

  return (
    <Card className="gap-0 p-6">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Preço à vista
      </p>
      <p className="num mt-1 text-3xl font-bold tracking-tight">
        {formatCurrencyBRL(vehicle.salePrice)}
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        ou em até <span className="num">60x</span> —{" "}
        <Link
          href={`/financiamento?valor=${vehicle.salePrice}`}
          className="text-primary underline underline-offset-2"
        >
          simule o financiamento
        </Link>
      </p>

      <hr className="my-5 border-border" />

      <h3 className="mb-3 font-semibold tracking-tight">Tenho interesse</h3>
      <LeadForm
        source="VEHICLE_DETAIL"
        vehiclePublicId={vehicle.publicId}
        defaultMessage={`Olá! Tenho interesse no ${vehicle.name}.`}
        submitLabel="Tenho interesse"
        idPrefix="vd"
      />

      <div className="mt-3 flex flex-col gap-2">
        {whatsapp && (
          <Button variant="outline" size="lg" asChild>
            <a
              href={waHref(whatsapp, `Olá! Tenho interesse no ${vehicle.name}.`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="text-[oklch(0.6_0.14_145)]" />
              WhatsApp
            </a>
          </Button>
        )}
        <Button variant="ghost" onClick={() => toggle(vehicle)}>
          <Heart className={cn(fav && "fill-destructive text-destructive")} />
          {fav ? "Favoritado" : "Favoritar"}
        </Button>
      </div>
    </Card>
  );
}
