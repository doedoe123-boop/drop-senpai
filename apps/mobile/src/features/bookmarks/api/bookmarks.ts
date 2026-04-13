import type { ItemCardModel, ItemRow } from "@drop-senpai/types";
import { mapItemRowToCardModel } from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";

export async function fetchSavedItems(userId: string): Promise<ItemCardModel[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, item_id, items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const joinedItems = ((data ?? []) as Array<{ items: ItemRow | ItemRow[] | null }>)
    .map((entry) => {
      if (Array.isArray(entry.items)) {
        return entry.items[0] ?? null;
      }

      return entry.items;
    })
    .filter((item): item is ItemRow => Boolean(item));

  return joinedItems
    .map(mapItemRowToCardModel);
}

export async function fetchBookmarkState(userId: string, itemId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function saveBookmark(userId: string, itemId: string) {
  const { error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    item_id: itemId
  });

  if (error) {
    throw error;
  }
}

export async function removeBookmark(userId: string, itemId: string) {
  const { error } = await supabase.from("bookmarks").delete().eq("user_id", userId).eq("item_id", itemId);

  if (error) {
    throw error;
  }
}
