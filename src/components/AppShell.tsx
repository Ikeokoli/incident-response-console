import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">
          IR
        </div>
        <div>
          <p className="eyebrow">Operations workspace</p>
          <h1>Incident response</h1>
        </div>
        <div className="environment-pill">
          <span className="environment-dot" aria-hidden="true" />
          Production
        </div>
      </header>
      <main id="main-content">{children}</main>
    </div>
  );
}

