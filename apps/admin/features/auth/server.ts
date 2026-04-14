import type { ProfileRole } from "@drop-senpai/types";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

interface AdminProfileState {
  exists: boolean;
  role: ProfileRole | null;
}

export async function ensureProfile(userId: string, email: string | null) {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return {
      exists: true,
      role: (data as { role?: ProfileRole }).role ?? null,
    } satisfies AdminProfileState;
  }

  const { error: insertError } = await (supabase as any).from("profiles").insert({
    id: userId,
    username: email,
  });

  if (insertError) {
    return {
      exists: false,
      role: null,
    } satisfies AdminProfileState;
  }

  return {
    exists: true,
    role: "user" satisfies ProfileRole,
  };
}

export async function getAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await ensureProfile(user.id, user.email ?? null);

  return {
    supabase,
    user,
    profile,
  };
}
