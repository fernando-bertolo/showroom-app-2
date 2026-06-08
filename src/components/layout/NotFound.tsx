import { useNavigate } from "@tanstack/react-router";
import { Car } from "lucide-react";

import { EmptyState } from "@/design-system/patterns/EmptyState";
import { Button } from "@/design-system/primitives/button";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <EmptyState
        icon={Car}
        title="Página não encontrada"
        description="O endereço que você acessou não existe ou foi movido."
        action={
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/estoque" })}>
            Voltar ao estoque
          </Button>
        }
      />
    </main>
  );
}
