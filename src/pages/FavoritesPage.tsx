import { useNavigate } from "@tanstack/react-router";
import { HeartOff } from "lucide-react";

import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { EmptyState } from "@/design-system/patterns/EmptyState";
import { LoadingState } from "@/design-system/patterns/LoadingState";
import { Button } from "@/design-system/primitives/button";
import { DEFAULT_FILTERS } from "@/api/vehicles";
import { useVehicles } from "@/hooks/useVehicles";
import { useFavorites } from "@/stores/favorites";

export function FavoritesPage() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const { data, isPending } = useVehicles(DEFAULT_FILTERS);

  const favoriteVehicles = data?.vehicles.filter((v) => favorites.has(v.id)) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Meus favoritos</h1>
      <p className="mt-1 text-muted-foreground">
        {favorites.size > 0
          ? `${favorites.size} ${favorites.size === 1 ? "veículo salvo" : "veículos salvos"}.`
          : "Salve veículos para comparar com calma depois."}
      </p>

      <div className="mt-8">
        {isPending ? (
          <LoadingState />
        ) : favoriteVehicles.length === 0 ? (
          <EmptyState
            icon={HeartOff}
            title="Nenhum favorito ainda"
            description="Toque no coração de um veículo no estoque para salvá-lo aqui."
            action={
              <Button variant="outline" size="sm" onClick={() => navigate({ to: "/estoque" })}>
                Ver estoque
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
