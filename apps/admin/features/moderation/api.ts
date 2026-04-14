import type { ItemRow, SubmissionLogAction } from "@drop-senpai/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DuplicateCandidate,
  ModerationInput,
  ModerationQueueItem,
} from "./types";

type AdminSupabaseClient = SupabaseClient<any, "public", any>;

export async function fetchModerationItems(
  supabase: AdminSupabaseClient,
): Promise<ModerationQueueItem[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*, profiles:submitted_by (username)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ModerationQueueItem[];
}

export async function fetchItemById(
  supabase: AdminSupabaseClient,
  itemId: string,
): Promise<ItemRow> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    throw error;
  }

  return data as ItemRow;
}

export async function moderateItem(
  supabase: AdminSupabaseClient,
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
  supabase: AdminSupabaseClient,
  itemId: string,
  searchText: string,
): Promise<DuplicateCandidate[]> {
  let query = supabase
    .from("items")
    .select("id, title, type, event_date, location, city, region")
    .eq("status", "approved")
    .neq("id", itemId)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(8);

  if (searchText.trim()) {
    query = query.ilike("title", `%${searchText.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as DuplicateCandidate[];
}
