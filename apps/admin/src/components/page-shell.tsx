import type { PropsWithChildren } from "react";

interface PageShellProps extends PropsWithChildren {
  narrow?: boolean;
}

export function PageShell({ children, narrow = false }: PageShellProps) {
  return (
    <main className="admin-shell">
      <div
        className={`admin-shell__inner${narrow ? " admin-shell__inner--narrow" : ""}`}
      >
        {children}
      </div>
    </main>
  );
}
