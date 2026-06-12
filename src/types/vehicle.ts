/**
 * Tipos espelhando os payloads públicos da API do showroom
 * (GET /showroom/{slug}, /vehicles e /vehicles/{publicId}).
 */

export interface PageMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PageResponse<T> {
  content: T[];
  metadata: PageMetadata;
}

/** Item da listagem pública de veículos. */
export interface VehicleSummary {
  publicId: string;
  name: string;
  brandName: string;
  modelName: string;
  versionName: string | null;
  /** Enum da API (ex.: "FLEX", "GASOLINE"). */
  fuelType: string | null;
  manufacturerYear: number;
  modelYear: number;
  mileage: number;
  salePrice: number;
  /** Enum da API (ex.: "WHITE", "BLACK"). */
  color: string | null;
  coverImage: string | null;
}

/** Marca presente no estoque, com os modelos disponíveis dela. */
export interface BrandFacet {
  name: string;
  models: string[];
}

/** Valores distintos do estoque (GET /vehicles/facets) — alimentam os selects de filtro. */
export interface VehicleFacets {
  brands: BrandFacet[];
  years: number[];
}

/** Detalhe público de um veículo (sem coverImage; usa images[]). */
export interface VehicleDetail extends Omit<VehicleSummary, "coverImage"> {
  engine: string | null;
  transmission: string | null;
  optionals: string[];
  images: string[];
}

/** Configuração pública da vitrine de uma loja. */
export interface Storefront {
  tradeName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  whatsapp: string | null;
  phone: string | null;
  address: string | null;
  businessHours: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  planWatermark: boolean;
}
