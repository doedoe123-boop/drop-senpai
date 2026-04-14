import { Suspense } from "react";

import { fetchModerationItems } from "@/features/moderation/api";
import { ModerationDashboard } from "@/features/moderation/moderation-dashboard";
import { getAdminAccess } from "@/features/auth/server";

export default function ProtectedPage({
  searchParams,
}: {
  searchParams?: Promise<{ moderated?: string }>;
}) {
  return (
    <Suspense fallback={<ModerationDashboardFallback />}>
      <ProtectedPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProtectedPageContent({
  searchParams,
}: {
  searchParams?: Promise<{ moderated?: string }>;
}) {
  const { supabase, user } = await getAdminAccess();
  const initialItems = await fetchModerationItems(supabase);
  const params = searchParams ? await searchParams : undefined;

  return (
    <div className="space-y-4">
      {params?.moderated ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {params.moderated === "approved"
            ? "Item approved successfully."
            : params.moderated === "duplicate"
              ? "Item marked as duplicate successfully."
              : "Item rejected successfully."}
        </div>
      ) : null}
      <ModerationDashboard initialItems={initialItems} userId={user.id} />
    </div>
  );
}

function ModerationDashboardFallback() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="h-10 w-80 rounded-2xl bg-white/[0.04]" />
          <div className="h-5 w-96 rounded-xl bg-white/[0.03]" />
        </div>
        <div className="h-12 w-32 rounded-full border border-white/10 bg-white/[0.03]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-3xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
      <div className="h-[32rem] rounded-[28px] border border-white/10 bg-slate-950/70" />
    </div>
  );
}
