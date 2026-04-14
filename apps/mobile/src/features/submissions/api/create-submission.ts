import type { SubmissionInput } from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";

export async function createSubmission(
  input: SubmissionInput,
  userId: string,
  isVerifiedOrganizer: boolean,
) {
  const status = isVerifiedOrganizer
    ? ("approved" as const)
    : ("pending" as const);

  const payload = {
    ...input,
    status,
    tags: input.tags ?? [],
    submitted_by: userId,
    image_url: input.image_url ?? null,
  };

  const { data, error } = await supabase
    .from("items")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
