import type { ItemType } from "./database";

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
