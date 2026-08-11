import type { ReactNode } from "react";

export const metadata = {
  title: "Yönetici Paneli | Pergola Platform",
  description: "Platform yönetim merkezi.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gray-900">
      {children}
    </section>
  );
}
