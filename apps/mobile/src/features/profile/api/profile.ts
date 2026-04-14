import type {
  ItemRow,
  ProfileRow,
  SubmissionListItemModel,
  SubmissionLogAction,
  SubmissionLogRow,
} from "@drop-senpai/types";
import { mapItemRowToCardModel } from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";

interface ModerationLogSummary extends Pick<
  SubmissionLogRow,
  "item_id" | "action" | "notes" | "created_at"
> {}

export async function fetchUserProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data as ProfileRow;
}

export async function updateDisplayName(
  userId: string,
  displayName: string,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName.trim() || null })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function fetchMySubmissions(
  userId: string,
): Promise<SubmissionListItemModel[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const items = (data ?? []) as ItemRow[];
  const itemIds = items.map((item) => item.id);
  const duplicateIds = items
    .map((item) => item.duplicate_of_item_id)
    .filter((itemId): itemId is string => Boolean(itemId));

  const latestLogsByItemId = new Map<
    string,
    { action: SubmissionLogAction; note: string | null; createdAt: string }
  >();
  const latestRejectedNoteByItemId = new Map<string, string>();
  const duplicateTitlesById = new Map<string, string>();

  if (itemIds.length > 0) {
    const { data: logs, error: logsError } = await supabase
      .from("submission_logs")
      .select("item_id, action, notes, created_at")
      .in("item_id", itemIds)
      .order("created_at", { ascending: false });

    if (logsError) {
      throw logsError;
    }

    for (const log of (logs ?? []) as ModerationLogSummary[]) {
      if (!latestLogsByItemId.has(log.item_id)) {
        latestLogsByItemId.set(log.item_id, {
          action: log.action,
          note: log.notes ?? null,
          createdAt: log.created_at,
        });
      }

      if (
        log.action === "rejected" &&
        log.notes &&
        !latestRejectedNoteByItemId.has(log.item_id)
      ) {
        latestRejectedNoteByItemId.set(log.item_id, log.notes);
      }
    }
  }

  if (duplicateIds.length > 0) {
    const { data: duplicateItems, error: duplicateItemsError } = await supabase
      .from("items")
      .select("id, title")
      .in("id", duplicateIds);

    if (duplicateItemsError) {
      throw duplicateItemsError;
    }

    for (const duplicateItem of duplicateItems ?? []) {
      duplicateTitlesById.set(
        duplicateItem.id as string,
        duplicateItem.title as string,
      );
    }
  }

  return items.map((item) => {
    const base = mapItemRowToCardModel(item);
    const latestLog = latestLogsByItemId.get(item.id);
    const duplicateOfItemId = item.duplicate_of_item_id ?? null;

    return {
      ...base,
      status: item.status,
      latestModerationAction: latestLog?.action ?? null,
      latestModerationAt: latestLog?.createdAt ?? null,
      latestRejectionNote:
        item.status === "rejected"
          ? (latestRejectedNoteByItemId.get(item.id) ?? null)
          : null,
      duplicateOfItemId,
      duplicateOfItemTitle: duplicateOfItemId
        ? (duplicateTitlesById.get(duplicateOfItemId) ?? null)
        : null,
    };
  });
}
