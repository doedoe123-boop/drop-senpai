import { Suspense } from "react";

import { getAdminAccess } from "@/features/auth/server";
import { fetchProfiles } from "@/features/users/api";
import { UserManagement } from "@/features/users/user-management";

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersPageFallback />}>
      <UsersPageContent />
    </Suspense>
  );
}

async function UsersPageContent() {
  const { supabase } = await getAdminAccess();
  const initialProfiles = await fetchProfiles(supabase);

  return <UserManagement initialProfiles={initialProfiles} />;
}

function UsersPageFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-10 w-64 rounded-2xl bg-white/[0.04]" />
        <div className="h-5 w-96 rounded-xl bg-white/[0.03]" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-3xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-20 rounded-3xl border border-white/10 bg-white/[0.03]"
          />
        ))}
      </div>
    </div>
  );
}
