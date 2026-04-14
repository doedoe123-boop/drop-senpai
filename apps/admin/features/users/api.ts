import type { ProfileRow } from "@drop-senpai/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type AdminSupabaseClient = SupabaseClient<any, "public", any>;

export async function fetchProfiles(
  supabase: AdminSupabaseClient,
): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProfileRow[];
}

export async function setVerifiedOrganizer(
  supabase: AdminSupabaseClient,
  userId: string,
  isVerified: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_verified_organizer: isVerified })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}
