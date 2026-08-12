import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy / Middleware — Next.js 16+
 *
 * MVP aşaması: Auth guard devre dışı.
 * Supabase entegrasyonu tamamlandığında aşağıdaki bloğu aktif edin:
 *
 *   import { createServerClient } from "@supabase/ssr";
 *   const supabase = createServerClient(url, key, { cookies: ... });
 *   const { data: { user } } = await supabase.auth.getUser();
 *   if (isProtected && !user) redirect("/login");
 */
export async function proxy(request: NextRequest) {
  // Şimdilik tüm rotalar serbestçe erişilebilir.
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
