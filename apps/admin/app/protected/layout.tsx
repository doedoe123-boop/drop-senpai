import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { AdminAccessDenied } from "@/features/auth/components/admin-access-denied";
import { getAdminAccess } from "@/features/auth/server";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ProtectedShellFallback />}>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </Suspense>
  );
}

async function ProtectedLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await getAdminAccess();

  if (access.profile.role !== "admin") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#020617_100%)] text-slate-50">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
          <AdminAccessDenied email={access.user.email ?? null} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#020617_100%)] text-slate-50">
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/protected"
            className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-cyan-300"
          >
            <ShieldCheck className="h-4 w-4" />
            ADMIN
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span className="hidden sm:inline">{access.user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}

function ProtectedShellFallback() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#020617_100%)] text-slate-50">
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.24em] text-cyan-300">
            <ShieldCheck className="h-4 w-4" />
            ADMIN
          </div>
          <div className="h-10 w-28 rounded-full border border-white/10 bg-white/[0.03]" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="space-y-6">
          <div className="h-10 w-72 rounded-2xl bg-white/[0.04]" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-3xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
          <div className="h-96 rounded-[28px] border border-white/10 bg-slate-950/70" />
        </div>
      </div>
    </main>
  );
}
