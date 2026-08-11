import type { ReactNode } from "react";

export const metadata = {
  title: "Yönetici Paneli | Pergola Platform",
  description: "Platform yönetim merkezi.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
