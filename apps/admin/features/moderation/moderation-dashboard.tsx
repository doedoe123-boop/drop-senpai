"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ItemStatus } from "@drop-senpai/types";
import {
  Ban,
  Check,
  Eye,
  ListFilter,
  Search,
  ShieldCheck,
  ShieldX,
  TimerReset,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

import { moderateItem } from "./api";
import type { ModerationQueueItem } from "./types";

type StatusFilter = ItemStatus | "all";
type TypeFilter = "all" | "event" | "drop";

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDescriptionPreview(item: ModerationQueueItem) {
  if (!item.description) {
    return "No description provided.";
  }

  return item.description.length > 120
    ? `${item.description.slice(0, 117)}...`
    : item.description;
}

function getStatusBadgeClasses(status: ItemStatus) {
  if (status === "approved") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "rejected") {
    return "border-rose-400/25 bg-rose-400/10 text-rose-300";
  }

  return "border-amber-400/25 bg-amber-400/10 text-amber-300";
}

function getTypeBadgeClasses(type: "event" | "drop") {
  if (type === "event") {
    return "border-fuchsia-400/20 bg-fuchsia-500/15 text-fuchsia-200";
  }

  return "border-yellow-400/20 bg-yellow-500/15 text-yellow-200";
}

function getActionMessage(
  currentStatus: ItemStatus,
  nextAction: "approved" | "rejected",
) {
  if (currentStatus === "approved" && nextAction === "rejected") {
    return "Item suspended successfully.";
  }

  if (currentStatus === "rejected" && nextAction === "approved") {
    return "Item restored successfully.";
  }

  return `Item ${nextAction === "approved" ? "approved" : "rejected"} successfully.`;
}

export function ModerationDashboard({
  initialItems,
  userId,
}: {
  initialItems: ModerationQueueItem[];
  userId: string;
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialItems);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchText, setSearchText] = useState("");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const counts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[item.status] += 1;
        return acc;
      },
      {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const statusMatch =
        statusFilter === "all" ? true : item.status === statusFilter;
      const typeMatch = typeFilter === "all" ? true : item.type === typeFilter;
      const searchMatch = item.title
        .toLowerCase()
        .includes(searchText.trim().toLowerCase());

      return statusMatch && typeMatch && searchMatch;
    });
  }, [items, searchText, statusFilter, typeFilter]);

  const refetchItems = async () => {
    const { fetchModerationItems } = await import("./api");
    const nextItems = await fetchModerationItems(supabase);
    setItems(nextItems);
  };

  const handleQuickAction = async (
    item: ModerationQueueItem,
    action: "approved" | "rejected",
    notes?: string | null,
  ) => {
    try {
      setActiveActionId(item.id);
      setMessage(null);
      await moderateItem(supabase, {
        itemId: item.id,
        reviewedBy: userId,
        action,
        title: item.title,
        type: item.type,
        description: item.description,
        source_url: item.source_url,
        image_url: item.image_url,
        event_date: item.event_date,
        location: item.location,
        city: item.city,
        region: item.region,
        tags: item.tags,
        featured: item.featured,
        duplicateOfItemId: item.duplicate_of_item_id,
        notes: notes ?? null,
      });
      setMessage(getActionMessage(item.status, action));
      await refetchItems();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not complete moderation action.",
      );
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Admin · Moderation
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Review submissions, clean up metadata, and publish trusted items.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
          {counts.pending} pending
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total", counts.total, <ListFilter className="h-4 w-4" />, "text-slate-200"],
          ["Pending", counts.pending, <TimerReset className="h-4 w-4" />, "text-amber-300"],
          ["Approved", counts.approved, <ShieldCheck className="h-4 w-4" />, "text-emerald-300"],
          ["Rejected", counts.rejected, <ShieldX className="h-4 w-4" />, "text-rose-300"],
        ].map(([label, count, icon, accent]) => (
          <div
            key={String(label)}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{label}</span>
              <span className={String(accent)}>{icon}</span>
            </div>
            <div className="mt-4 text-4xl font-semibold tracking-tight text-white">
              {count as number}
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-[28px] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center">
          <div className="inline-flex w-full max-w-fit rounded-2xl border border-white/10 bg-white/5 p-1">
            {([
              ["pending", `Pending (${counts.pending})`],
              ["approved", "Approved"],
              ["rejected", "Rejected"],
              ["all", "All"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  statusFilter === value
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search submissions..."
              className="h-12 rounded-2xl border-white/10 bg-white/[0.03] pl-11 text-white placeholder:text-slate-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
            className="h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none"
          >
            <option value="all">All</option>
            <option value="event">Event</option>
            <option value="drop">Drop</option>
          </select>
        </div>

        {message ? (
          <div className="border-b border-white/10 px-4 py-3 text-sm text-slate-200">
            {message}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 text-sm text-slate-400">
              <span>Submission</span>
              <span>Type</span>
              <span>Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="px-6 py-10 text-sm text-slate-400">
                No submissions match the current filters.
              </div>
            ) : (
              filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 border-t border-white/10 px-6 py-5"
                >
                  <div>
                    <div className="text-xl font-semibold text-white">
                      {item.title}
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      {getDescriptionPreview(item)}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getTypeBadgeClasses(
                        item.type,
                      )}`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-slate-300">
                    {formatDate(item.event_date)}
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${getStatusBadgeClasses(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="rounded-full border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                    >
                      <Link href={`/protected/items/${item.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {item.status === "pending" ? (
                      <>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={activeActionId === item.id}
                          onClick={() => void handleQuickAction(item, "approved")}
                          className="rounded-full border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={activeActionId === item.id}
                          onClick={() => void handleQuickAction(item, "rejected")}
                          className="rounded-full border-rose-400/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </>
                    ) : null}
                    {item.status === "approved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={activeActionId === item.id}
                        onClick={() =>
                          void handleQuickAction(
                            item,
                            "rejected",
                            "Suspended by admin from approved items.",
                          )
                        }
                        className="rounded-full border-rose-400/20 bg-rose-500/10 px-4 text-rose-300 hover:bg-rose-500/20"
                      >
                        Suspend
                      </Button>
                    ) : null}
                    {item.status === "rejected" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={activeActionId === item.id}
                        onClick={() =>
                          void handleQuickAction(
                            item,
                            "approved",
                            "Restored by admin from rejected items.",
                          )
                        }
                        className="rounded-full border-emerald-400/20 bg-emerald-500/10 px-4 text-emerald-300 hover:bg-emerald-500/20"
                      >
                        Restore
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
