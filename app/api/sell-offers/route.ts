import { NextResponse, type NextRequest } from "next/server";

import { resolveSlug } from "@/lib/tenant";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/** Proxy same-origin para POST /showroom/{slug}/sell-offers (zero CORS). */
export async function POST(request: NextRequest) {
  const slug =
    request.headers.get("x-branch-slug") ?? resolveSlug(request.headers.get("host"));

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
  const customerPhone = optionalString(body.customerPhone);
  const customerEmail = optionalString(body.customerEmail);
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";

  if (!customerName) {
    return NextResponse.json({ message: "Informe seu nome" }, { status: 400 });
  }
  if (!customerPhone && !customerEmail) {
    return NextResponse.json({ message: "Informe telefone ou e-mail" }, { status: 400 });
  }
  if (!brand || !model) {
    return NextResponse.json({ message: "Informe marca e modelo" }, { status: 400 });
  }

  const payload = {
    customerName,
    customerPhone,
    customerEmail,
    brand,
    model,
    version: optionalString(body.version),
    modelYear: optionalNumber(body.modelYear),
    mileage: optionalNumber(body.mileage),
    askingPrice: optionalNumber(body.askingPrice),
    notes: optionalString(body.notes),
    website: typeof body.website === "string" ? body.website : "",
  };

  try {
    const res = await fetch(
      `${API_BASE_URL}/showroom/${encodeURIComponent(slug)}/sell-offers`,
      {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { message: "Serviço indisponível, tente novamente" },
      { status: 502 },
    );
  }
}
