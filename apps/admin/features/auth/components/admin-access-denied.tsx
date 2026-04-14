import { ShieldAlert } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";

export function AdminAccessDenied({ email }: { email: string | null }) {
  return (
    <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="mb-6 flex items-center gap-3 text-cyan-300">
        <ShieldAlert className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase tracking-[0.3em]">
          Admin
        </span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        Access denied
      </h1>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        {email
          ? `Signed in as ${email}, but this account does not have the admin role in profiles.`
          : "This account does not have the admin role in profiles."}
      </p>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        Ask an existing admin to update your profile role before trying again.
      </p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </section>
  );
}
