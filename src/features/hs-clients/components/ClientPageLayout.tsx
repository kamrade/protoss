import type { ReactNode } from "react";

interface ClientPageLayoutProps {
  children: ReactNode;
}

export function ClientPageLayout({ children }: ClientPageLayoutProps) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </main>
  );
}
