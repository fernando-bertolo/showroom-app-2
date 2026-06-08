import { useMutation, useQuery } from "@tanstack/react-query";

import {
  fetchAvailableCount,
  fetchMarcas,
  fetchVehicle,
  fetchVehicles,
  submitContact,
  submitSellLead,
  type ContactPayload,
  type SellLeadPayload,
  type VehicleFilters,
} from "@/api/vehicles";

export const vehicleKeys = {
  all: ["vehicles"] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.all, "list", filters] as const,
  detail: (id: string) => [...vehicleKeys.all, "detail", id] as const,
  marcas: () => ["marcas"] as const,
  availableCount: () => ["available-count"] as const,
};

export function useVehicles(filters: VehicleFilters) {
  return useQuery({
    queryKey: vehicleKeys.list(filters),
    queryFn: () => fetchVehicles(filters),
    placeholderData: (prev) => prev,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => fetchVehicle(id),
    enabled: Boolean(id),
  });
}

export function useMarcas() {
  return useQuery({
    queryKey: vehicleKeys.marcas(),
    queryFn: fetchMarcas,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvailableCount() {
  return useQuery({
    queryKey: vehicleKeys.availableCount(),
    queryFn: fetchAvailableCount,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (payload: ContactPayload) => submitContact(payload),
  });
}

export function useSubmitSellLead() {
  return useMutation({
    mutationFn: (payload: SellLeadPayload) => submitSellLead(payload),
  });
}
