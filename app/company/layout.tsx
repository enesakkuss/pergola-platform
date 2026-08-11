import type { ReactNode } from "react";

export const metadata = {
  title: "Firma Paneli | Pergola Platform",
  description: "Firma hesabınızı yönetin, tekliflerinizi takip edin.",
};

export default function CompanyLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-white">
      {children}
    </section>
  );
}
