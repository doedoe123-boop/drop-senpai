import type { ReactNode } from "react";

interface AdminFieldProps {
  label: string;
  children: ReactNode;
}

export function AdminField({ label, children }: AdminFieldProps) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      {children}
    </label>
  );
}
