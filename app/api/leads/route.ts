import { NextResponse, type NextRequest } from "next/server";

import { resolveSlug } from "@/lib/tenant";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

const ALLOWED_SOURCES = new Set(["VEHICLE_DETAIL", "CONTACT"]);

/**
 * Proxy same-origin para POST /showroom/{slug}/leads — o browser nunca fala
 * direto com a API (zero CORS) e o slug vem do host, não do cliente.
 */
export async function POST(request: NextRequest) {
  const slug =
    request.headers.get("x-branch-slug") ?? resolveSlug(request.headers.get("host"));

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = typeof body.source === "string" ? body.source : "";

  if (!name) {
    return NextResponse.json({ message: "Informe seu nome" }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json({ message: "Informe telefone ou e-mail" }, { status: 400 });
  }
  if (!ALLOWED_SOURCES.has(source)) {
    return NextResponse.json({ message: "Origem inválida" }, { status: 400 });
  }

  const payload = {
    name,
    phone: phone || undefined,
    email: email || undefined,
    message: typeof body.message === "string" ? body.message : undefined,
    vehiclePublicId:
      typeof body.vehiclePublicId === "string" && body.vehiclePublicId
        ? body.vehiclePublicId
        : undefined,
    source,
    website: typeof body.website === "string" ? body.website : "",
  };

  try {
    const res = await fetch(`${API_BASE_URL}/showroom/${encodeURIComponent(slug)}/leads`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Serviço indisponível, tente novamente" },
      { status: 502 },
    );
  }
}
