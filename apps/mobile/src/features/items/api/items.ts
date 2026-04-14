import {
  mapItemRowToCardModel,
  mapItemRowToDetailModel,
  type ItemCardModel,
  type ItemDetailModel,
  type ItemType,
  type ItemRowWithAuthor,
} from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";
import { sortItemsByNearestUpcomingEventDate } from "../utils/sort-items";

const ITEM_WITH_AUTHOR_SELECT =
  "*, profiles:submitted_by(id, display_name, username, avatar_url, is_verified_organizer, reputation_points)";

export interface ApprovedItemsFilters {
  searchText?: string;
  type?: ItemType | "all";
  region?: string;
  tag?: string;
}

export async function fetchApprovedItems(): Promise<ItemCardModel[]> {
  return fetchApprovedItemsWithFilters({});
}

export async function fetchFeaturedItems(): Promise<ItemCardModel[]> {
  const { data: explicit, error: explicitError } = await supabase
    .from("items")
    .select(ITEM_WITH_AUTHOR_SELECT)
    .eq("status", "approved")
    .eq("featured", true)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(5);

  if (explicitError) {
    throw explicitError;
  }

  return ((explicit ?? []) as unknown as ItemRowWithAuthor[]).map(
    mapItemRowToCardModel,
  );
}

export async function fetchUpcomingEvents(): Promise<ItemCardModel[]> {
  const { data, error } = await supabase
    .from("items")
    .select(ITEM_WITH_AUTHOR_SELECT)
    .eq("status", "approved")
    .eq("type", "event")
    .eq("featured", false)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(20);

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as ItemRowWithAuthor[]).map(
    mapItemRowToCardModel,
  );
}

export async function fetchLatestDrops(): Promise<ItemCardModel[]> {
  const { data, error } = await supabase
    .from("items")
    .select(ITEM_WITH_AUTHOR_SELECT)
    .eq("status", "approved")
    .eq("type", "drop")
    .eq("featured", false)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(20);

  if (error) {
    throw error;
  }

  return sortItemsByNearestUpcomingEventDate(
    data as unknown as ItemRowWithAuthor[],
  ).map(mapItemRowToCardModel);
}

export async function fetchApprovedItemsWithFilters(
  filters: ApprovedItemsFilters,
): Promise<ItemCardModel[]> {
  let query = supabase
    .from("items")
    .select(ITEM_WITH_AUTHOR_SELECT)
    .eq("status", "approved");

  if (filters.searchText?.trim()) {
    query = query.ilike("title", `%${filters.searchText.trim()}%`);
  }

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  if (filters.region?.trim()) {
    query = query.eq("region", filters.region.trim());
  }

  if (filters.tag?.trim()) {
    query = query.contains("tags", [filters.tag.trim().replace(/^#/, "")]);
  }

  const { data, error } = await query
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(50);

  if (error) {
    throw error;
  }

  const items = (data ?? []) as unknown as ItemRowWithAuthor[];

  return sortItemsByNearestUpcomingEventDate(items).map(mapItemRowToCardModel);
}

export async function fetchApprovedRegions(): Promise<string[]> {
  const { data, error } = await supabase
    .from("items")
    .select("region")
    .eq("status", "approved")
    .not("region", "is", null)
    .order("region", { ascending: true });

  if (error) {
    throw error;
  }

  return [
    ...new Set(
      (data ?? [])
        .map((item) => item.region)
        .filter((region): region is string => Boolean(region)),
    ),
  ];
}

export async function fetchApprovedItemById(
  itemId: string,
): Promise<ItemDetailModel> {
  const { data, error } = await supabase
    .from("items")
    .select(ITEM_WITH_AUTHOR_SELECT)
    .eq("status", "approved")
    .eq("id", itemId)
    .single();

  if (error) {
    throw error;
  }

  const row = data as unknown as ItemRowWithAuthor;

  return mapItemRowToDetailModel(row);
}
