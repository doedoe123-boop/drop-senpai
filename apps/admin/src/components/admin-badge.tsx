import type { ItemStatus, ItemType } from "@drop-senpai/types";

type BadgeTone = ItemType | ItemStatus;

interface AdminBadgeProps {
  tone: BadgeTone;
  children: string;
}

export function AdminBadge({ tone, children }: AdminBadgeProps) {
  return <span className={`admin-badge admin-badge--${tone}`}>{children}</span>;
}
