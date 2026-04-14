import type { ItemRow, SubmissionLogAction } from "@drop-senpai/types";

import type { ReturnTypeOfSupabase } from "./types";

export interface PendingQueueItem extends ItemRow {
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

export async function fetchPendingItems(
  supabase: ReturnTypeOfSupabase,
): Promise<PendingQueueItem[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*, profiles:submitted_by (username)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as PendingQueueItem[];
}

export async function fetchPendingItemById(
  supabase: ReturnTypeOfSupabase,
  itemId: string,
): Promise<ItemRow> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .eq("status", "pending")
    .single();

  if (error) {
    throw error;
  }

  return data as ItemRow;
}

export async function moderateItem(
  supabase: ReturnTypeOfSupabase,
  input: ModerationInput,
) {
  const { error: updateError } = await supabase
    .from("items")
    .update({
      title: input.title,
      type: input.type,
      description: input.description,
      source_url: input.source_url,
      image_url: input.image_url,
      event_date: input.event_date,
      location: input.location,
      city: input.city,
      region: input.region,
      tags: input.tags,
      featured: input.featured,
      duplicate_of_item_id: input.duplicateOfItemId ?? null,
      status: input.action,
    })
    .eq("id", input.itemId);

  if (updateError) {
    throw updateError;
  }

  const logAction: SubmissionLogAction = input.action;

  const { error: logError } = await supabase.from("submission_logs").insert({
    item_id: input.itemId,
    reviewed_by: input.reviewedBy,
    action: logAction,
    notes: input.notes ?? null,
  });

  if (logError) {
    throw logError;
  }
}

export async function fetchDuplicateCandidates(
  supabase: ReturnTypeOfSupabase,
  itemId: string,
  searchText: string,
): Promise<DuplicateCandidate[]> {
  let query = supabase
    .from("items")
    .select("id, title, type, event_date, location, city, region")
    .eq("status", "approved")
    .neq("id", itemId)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(6);

  if (searchText.trim()) {
    query = query.ilike("title", `%${searchText.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as DuplicateCandidate[];
}
