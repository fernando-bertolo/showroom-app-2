import type { Metadata } from "next";

import { AppProviders } from "./providers";

import "@/index.css";

export const metadata: Metadata = {
  title: "Vitrine de veículos",
  description: "Vitrine pública de veículos.",
};

/** Aplica o tema salvo antes do primeiro paint (evita flash light→dark). */
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem("patio:theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
