import { Outlet } from "@tanstack/react-router";

import { ContactDrawer } from "@/components/contact/ContactDrawer";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <ContactDrawer />
    </div>
  );
}
