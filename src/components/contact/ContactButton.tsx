"use client";

import { Button } from "@/design-system/primitives/button";
import { useContact } from "@/stores/contact";

import type { ComponentProps } from "react";

type ContactButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

/** Botão que abre o drawer global de contato (usável em páginas server). */
export function ContactButton({ children, ...props }: ContactButtonProps) {
  const { openContact } = useContact();
  return (
    <Button {...props} onClick={() => openContact()}>
      {children}
    </Button>
  );
}
