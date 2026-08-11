import type { ReactNode } from "react";

export const metadata = {
  title: "Pergola Ara | Pergola Platform",
  description: "Size en uygun pergola firmalarını bulun.",
};

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-gray-50">
      {children}
    </section>
  );
}
