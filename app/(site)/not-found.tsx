import Link from "next/link";

import { SearchX } from "lucide-react";

import { EmptyState } from "@/design-system/patterns/EmptyState";
import { buttonVariants } from "@/design-system/primitives/button";

export default function SiteNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <EmptyState
        icon={SearchX}
        title="Página não encontrada"
        description="O veículo ou a página que você procura não existe ou saiu do estoque."
        action={
          <Link href="/estoque" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Voltar ao estoque
          </Link>
        }
      />
    </main>
  );
}
