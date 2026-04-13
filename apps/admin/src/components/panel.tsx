import type { PropsWithChildren } from "react";

interface PanelProps extends PropsWithChildren {
  title: string;
  description: string;
  eyebrow?: string;
  className?: string;
}

export function Panel({
  title,
  description,
  children,
  eyebrow = "Admin",
  className,
}: PanelProps) {
  return (
    <section className={`admin-card${className ? ` ${className}` : ""}`}>
      <div className="admin-card__header">
        <span className="admin-card__eyebrow">{eyebrow}</span>
        <h2 className="admin-card__title">{title}</h2>
        <p className="admin-card__description">{description}</p>
      </div>
      <div className="admin-card__content">{children}</div>
    </section>
  );
}
