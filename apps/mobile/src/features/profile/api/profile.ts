import type { ItemCardModel, ItemRow } from "@drop-senpai/types";
import { mapItemRowToCardModel } from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";

export async function fetchMySubmissions(userId: string): Promise<ItemCardModel[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ItemRow[]).map(mapItemRowToCardModel);
}
