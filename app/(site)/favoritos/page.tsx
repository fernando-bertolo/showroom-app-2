"use client";

import Link from "next/link";

import { HeartOff } from "lucide-react";

import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EmptyState } from "@/design-system/patterns/EmptyState";
import { buttonVariants } from "@/design-system/primitives/button";
import { useFavorites } from "@/stores/favorites";

export default function FavoritesPage() {
  const { favorites, count } = useFavorites();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Meus favoritos</h1>
      <p className="mt-1 text-muted-foreground">
        {count > 0
          ? `${count} ${count === 1 ? "veículo salvo" : "veículos salvos"}.`
          : "Salve veículos para comparar com calma depois."}
      </p>

      <div className="mt-8">
        {favorites.length === 0 ? (
          <EmptyState
            icon={HeartOff}
            title="Nenhum favorito ainda"
            description="Toque no coração de um veículo no estoque para salvá-lo aqui."
            action={
              <Link
                href="/estoque"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Ver estoque
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((v) => (
              <VehicleCard key={v.publicId} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
