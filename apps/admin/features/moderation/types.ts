import type { ItemRow, SubmissionLogAction } from "@drop-senpai/types";

export interface ModerationQueueItem extends ItemRow {
  profiles: {
    username: string | null;
  } | null;
}

export interface ModerationInput {
  itemId: string;
  reviewedBy: string;
  action: "approved" | "rejected";
  title: string;
  type: "event" | "drop";
  description: string | null;
  source_url: string;
  image_url: string | null;
  event_date: string | null;
  location: string | null;
  city: string | null;
  region: string | null;
  tags: string[];
  featured: boolean;
  duplicateOfItemId?: string | null;
  notes?: string | null;
}

export interface DuplicateCandidate {
  id: string;
  title: string;
  type: "event" | "drop";
  event_date: string | null;
  location: string | null;
  city: string | null;
  region: string | null;
}

export function moderationActionFromInput(
  action: ModerationInput["action"],
): SubmissionLogAction {
  return action;
}
