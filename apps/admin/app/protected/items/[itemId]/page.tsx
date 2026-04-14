import { notFound } from "next/navigation";

import { getAdminAccess } from "@/features/auth/server";
import { fetchItemById } from "@/features/moderation/api";
import { ReviewForm } from "@/features/moderation/review-form";

export default async function ReviewItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const { supabase, user } = await getAdminAccess();

  try {
    const item = await fetchItemById(supabase, itemId);

    return <ReviewForm item={item} reviewerId={user.id} />;
  } catch {
    notFound();
  }
}
