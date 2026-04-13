import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: AdminButtonVariant;
}

export function AdminButton({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      className={`admin-button admin-button--${variant}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
