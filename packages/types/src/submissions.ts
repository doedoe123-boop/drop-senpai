import type { ItemStatus, ItemType, SubmissionLogAction } from "./database";
import type { ItemCardModel } from "./items";

export interface SubmissionInput {
  type: ItemType;
  title: string;
  source_url: string;
  description?: string | null;
  image_url?: string | null;
  event_date?: string | null;
  location?: string | null;
  city?: string | null;
  region?: string | null;
  tags?: string[];
}

export interface SubmissionListItemModel extends ItemCardModel {
  status: ItemStatus;
  latestModerationAction: SubmissionLogAction | null;
  latestModerationAt: string | null;
  latestRejectionNote: string | null;
  duplicateOfItemId: string | null;
  duplicateOfItemTitle: string | null;
}
