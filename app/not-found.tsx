import Link from "next/link";

import { Car } from "lucide-react";

import { EmptyState } from "@/design-system/patterns/EmptyState";
import { buttonVariants } from "@/design-system/primitives/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <EmptyState
        className="w-full"
        icon={Car}
        title="Vitrine não encontrada ou indisponível"
        description="Verifique o endereço digitado — esta vitrine pode ter sido desativada, ou a página que você procura não existe."
        action={
          <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Ir para o início
          </Link>
        }
      />
    </main>
  );
}
