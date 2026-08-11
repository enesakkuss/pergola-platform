import { redirect } from "next/navigation";

/**
 * Kök sayfa — kullanıcıyı doğrudan /user rotasına yönlendirir.
 * Next.js App Router'da server-side redirect olduğu için
 * herhangi bir içerik flash'ı yaşanmaz.
 */
export default function RootPage() {
  redirect("/user");
}
