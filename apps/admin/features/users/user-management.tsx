"use client";

import { useMemo, useState } from "react";
import type { ProfileRow } from "@drop-senpai/types";
import { Search, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

import { fetchProfiles, setVerifiedOrganizer } from "./api";

type RoleFilter = "all" | "organizers" | "regular";

export function UserManagement({
  initialProfiles,
}: {
  initialProfiles: ProfileRow[];
}) {
  const supabase = createClient();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const counts = useMemo(() => {
    const organizers = profiles.filter((p) => p.is_verified_organizer).length;
    return {
      total: profiles.length,
      organizers,
      regular: profiles.length - organizers,
    };
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const roleMatch =
        roleFilter === "all"
          ? true
          : roleFilter === "organizers"
            ? profile.is_verified_organizer
            : !profile.is_verified_organizer;

      const search = searchText.trim().toLowerCase();
      const nameMatch =
        !search ||
        (profile.username ?? "").toLowerCase().includes(search) ||
        (profile.display_name ?? "").toLowerCase().includes(search) ||
        profile.id.toLowerCase().includes(search);

      return roleMatch && nameMatch;
    });
  }, [profiles, searchText, roleFilter]);

  const refetchProfiles = async () => {
    const nextProfiles = await fetchProfiles(supabase);
    setProfiles(nextProfiles);
  };

  const handleToggleOrganizer = async (profile: ProfileRow) => {
    const nextValue = !profile.is_verified_organizer;

    try {
      setActiveUserId(profile.id);
      setMessage(null);
      await setVerifiedOrganizer(supabase, profile.id, nextValue);
      setMessage(
        nextValue
          ? `${profile.display_name ?? profile.username ?? "User"} is now a verified organizer.`
          : `${profile.display_name ?? profile.username ?? "User"} is no longer a verified organizer.`,
      );
      await refetchProfiles();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update organizer status.",
      );
    } finally {
      setActiveUserId(null);
    }
  };

  const resolveDisplayName = (profile: ProfileRow) =>
    profile.display_name ?? profile.username ?? "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-cyan-300" />
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Admin · Users
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Manage user profiles and verify trusted organizers.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
          {counts.organizers} organizer{counts.organizers !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            ["Total Users", counts.total, "text-slate-200"],
            ["Organizers", counts.organizers, "text-cyan-300"],
            ["Regular", counts.regular, "text-slate-300"],
          ] as const
        ).map(([label, count, accent]) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {label}
            </span>
            <p className={`mt-1 text-2xl font-bold ${accent}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            className="border-white/10 bg-white/[0.04] pl-10 text-sm text-slate-200 placeholder:text-slate-500"
            placeholder="Search name, username, or ID…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {(
            [
              ["all", "All"],
              ["organizers", "Organizers"],
              ["regular", "Regular"],
            ] as [RoleFilter, string][]
          ).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={roleFilter === value ? "default" : "outline"}
              className={
                roleFilter === value
                  ? "border-cyan-400/30 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
                  : "border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.06]"
              }
              onClick={() => setRoleFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Message */}
      {message ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </div>
      ) : null}

      {/* Profile list */}
      <div className="space-y-3">
        {filteredProfiles.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-slate-400">
            No users match your search.
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-base font-semibold text-white">
                    {resolveDisplayName(profile)}
                  </span>
                  {profile.is_verified_organizer ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-xs font-medium text-cyan-300">
                      <ShieldCheck className="h-3 w-3" />
                      Organizer
                    </span>
                  ) : null}
                  {profile.role === "admin" ? (
                    <span className="inline-flex rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-2 py-0.5 text-xs font-medium text-fuchsia-300">
                      Admin
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  {profile.username ? <span>@{profile.username}</span> : null}
                  <span>{profile.reputation_points} rep</span>
                  <span>
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                disabled={activeUserId === profile.id}
                onClick={() => handleToggleOrganizer(profile)}
                className={
                  profile.is_verified_organizer
                    ? "border-rose-400/30 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30"
                    : "border-cyan-400/30 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30"
                }
              >
                {activeUserId === profile.id
                  ? "Updating…"
                  : profile.is_verified_organizer
                    ? "Remove Organizer"
                    : "Make Organizer"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
