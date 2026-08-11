// ============================================================
// Global Tip Tanımları — Pergola Platform
// ============================================================

// --------------- Kullanıcı Rolleri ---------------
export type UserRole = "user" | "company" | "admin";

// --------------- Kullanıcı ---------------
export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// --------------- Firma ---------------
export interface Company {
  id: string;
  ownerId: string;      // AppUser.id
  name: string;
  slug: string;
  city: string;
  district: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  verified: boolean;
  createdAt: string;
}

// --------------- Pergola Ürünü ---------------
export type PergolaType =
  | "alüminyum"
  | "ahşap"
  | "pvc"
  | "biyoklimatik"
  | "diğer";

export interface PergolaProduct {
  id: string;
  companyId: string;    // Company.id
  title: string;
  type: PergolaType;
  description?: string;
  priceMin?: number;
  priceMax?: number;
  currency: "TRY" | "USD" | "EUR";
  imageUrls: string[];
  active: boolean;
  createdAt: string;
}

// --------------- Teklif / Talep ---------------
export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface Lead {
  id: string;
  userId: string;       // AppUser.id
  companyId: string;    // Company.id
  productId?: string;   // PergolaProduct.id
  message?: string;
  status: LeadStatus;
  createdAt: string;
}

// --------------- Sayfa Props Yardımcıları ---------------
export type PageProps<
  TParams = Record<string, string>,
  TSearch = Record<string, string>
> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearch>;
};
