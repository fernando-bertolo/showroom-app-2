"use client";

import * as React from "react";

import type { VehicleSummary } from "@/types/vehicle";

interface ContactContextValue {
  open: boolean;
  vehicle: VehicleSummary | null;
  openContact: (vehicle?: VehicleSummary | null) => void;
  closeContact: () => void;
}

const ContactContext = React.createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [vehicle, setVehicle] = React.useState<VehicleSummary | null>(null);

  const openContact = React.useCallback((v?: VehicleSummary | null) => {
    setVehicle(v ?? null);
    setOpen(true);
  }, []);

  const closeContact = React.useCallback(() => setOpen(false), []);

  const value = React.useMemo<ContactContextValue>(
    () => ({ open, vehicle, openContact, closeContact }),
    [open, vehicle, openContact, closeContact],
  );

  return <ContactContext value={value}>{children}</ContactContext>;
}

export function useContact() {
  const ctx = React.useContext(ContactContext);
  if (!ctx) throw new Error("useContact deve ser usado dentro de ContactProvider");
  return ctx;
}
