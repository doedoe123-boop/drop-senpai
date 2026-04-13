import type { ItemStatus, ItemType } from "@drop-senpai/types";

export const ITEM_TYPES = ["event", "drop"] as const satisfies readonly ItemType[];

export const ITEM_STATUSES = ["pending", "approved", "rejected"] as const satisfies readonly ItemStatus[];

export const MOBILE_TABS = ["home", "explore", "saved", "submit", "profile"] as const;
