import type { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-[0_10px_30px_var(--shadow)] backdrop-blur">
      {children}
    </div>
  );
}
