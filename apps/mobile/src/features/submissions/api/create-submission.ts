import type { SubmissionInput } from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";

export async function createPendingSubmission(input: SubmissionInput, userId: string) {
  const payload = {
    ...input,
    status: "pending" as const,
    tags: input.tags ?? [],
    submitted_by: userId,
    image_url: input.image_url ?? null
  };

  const { data, error } = await supabase.from("items").insert(payload).select("id").single();

  if (error) {
    throw error;
  }

  return data;
}
