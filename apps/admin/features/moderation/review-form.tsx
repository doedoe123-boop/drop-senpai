"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ItemRow } from "@drop-senpai/types";
import { ArrowLeft, ExternalLink, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

import { fetchDuplicateCandidates, moderateItem } from "./api";
import type { DuplicateCandidate } from "./types";

interface ReviewDraft {
  title: string;
  type: "event" | "drop";
  description: string;
  source_url: string;
  image_url: string;
  event_date: string;
  location: string;
  city: string;
  region: string;
  tags: string;
  featured: boolean;
  notes: string;
}

function initialDraft(item: ItemRow): ReviewDraft {
  return {
    title: item.title,
    type: item.type,
    description: item.description ?? "",
    source_url: item.source_url,
    image_url: item.image_url ?? "",
    event_date: item.event_date ?? "",
    location: item.location ?? "",
    city: item.city ?? "",
    region: item.region ?? "",
    tags: item.tags.join(", "),
    featured: Boolean(item.featured),
    notes: "",
  };
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function buildDuplicateModerationNote(
  duplicateTitle: string,
  moderatorNote: string,
) {
  const baseNote = `Marked as duplicate of "${duplicateTitle}".`;
  const trimmedModeratorNote = moderatorNote.trim();

  if (!trimmedModeratorNote) {
    return baseNote;
  }

  return `${baseNote} ${trimmedModeratorNote}`;
}

export function ReviewForm({
  item,
  reviewerId,
}: {
  item: ItemRow;
  reviewerId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [draft, setDraft] = useState<ReviewDraft>(() => initialDraft(item));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [duplicateSearchText, setDuplicateSearchText] = useState("");
  const [duplicateCandidates, setDuplicateCandidates] = useState<
    DuplicateCandidate[]
  >([]);
  const [selectedDuplicateId, setSelectedDuplicateId] = useState<string | null>(
    item.duplicate_of_item_id,
  );
  const [isSearchingDuplicates, setIsSearchingDuplicates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDuplicate = useMemo(
    () =>
      duplicateCandidates.find(
        (candidate) => candidate.id === selectedDuplicateId,
      ) ?? null,
    [duplicateCandidates, selectedDuplicateId],
  );

  const runAction = async (
    action: "approved" | "rejected",
    options?: {
      duplicateOfItemId?: string | null;
      moderationNote?: string | null;
    },
  ) => {
    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      await moderateItem(supabase, {
        itemId: item.id,
        reviewedBy: reviewerId,
        action,
        title: draft.title,
        type: draft.type,
        description: draft.description || null,
        source_url: draft.source_url,
        image_url: draft.image_url || null,
        event_date: draft.event_date || null,
        location: draft.location || null,
        city: draft.city || null,
        region: draft.region || null,
        tags: parseTags(draft.tags),
        featured: draft.featured,
        duplicateOfItemId: options?.duplicateOfItemId ?? null,
        notes: options?.moderationNote ?? (draft.notes || null),
      });
      router.push(
        `/protected?moderated=${options?.duplicateOfItemId ? "duplicate" : action}`,
      );
      router.refresh();
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not save this moderation action.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicateSearch = async () => {
    try {
      setIsSearchingDuplicates(true);
      setStatusMessage(null);
      const results = await fetchDuplicateCandidates(
        supabase,
        item.id,
        duplicateSearchText,
      );
      setDuplicateCandidates(results);
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not load duplicate candidates.",
      );
    } finally {
      setIsSearchingDuplicates(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          className="text-slate-300 hover:text-white"
        >
          <Link href="/protected">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to queue
          </Link>
        </Button>
        <Badge variant="outline" className="border-white/15 text-slate-200">
          {item.status}
        </Badge>
      </div>

      <section className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Review {item.title}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Edit the core fields if needed, then approve, reject, or mark this
              submission as a duplicate.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
          >
            <a href={draft.source_url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open source
            </a>
          </Button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Field label="Title">
              <Input
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <Field label="Type">
              <select
                value={draft.type}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    type: event.target.value as "event" | "drop",
                  })
                }
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white"
              >
                <option value="event">event</option>
                <option value="drop">drop</option>
              </select>
            </Field>
            <Field label="Description">
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                className="min-h-32 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none"
              />
            </Field>
            <Field label="Source URL">
              <Input
                value={draft.source_url}
                onChange={(event) =>
                  setDraft({ ...draft, source_url: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <Field label="Image URL">
              <Input
                value={draft.image_url}
                onChange={(event) =>
                  setDraft({ ...draft, image_url: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
          </div>

          <div className="space-y-5">
            <Field label="Event date">
              <Input
                value={draft.event_date}
                onChange={(event) =>
                  setDraft({ ...draft, event_date: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <Field label="Location">
              <Input
                value={draft.location}
                onChange={(event) =>
                  setDraft({ ...draft, location: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <Field label="City">
              <Input
                value={draft.city}
                onChange={(event) =>
                  setDraft({ ...draft, city: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <Field label="Region">
              <Input
                value={draft.region}
                onChange={(event) =>
                  setDraft({ ...draft, region: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <Field label="Tags">
              <Input
                value={draft.tags}
                onChange={(event) =>
                  setDraft({ ...draft, tags: event.target.value })
                }
                className="border-white/10 bg-white/[0.03] text-white"
              />
            </Field>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <Checkbox
                checked={draft.featured}
                onCheckedChange={(checked) =>
                  setDraft({ ...draft, featured: checked === true })
                }
              />
              <Label className="text-sm text-slate-200">Feature on Home</Label>
            </div>
            <Field label="Moderation note">
              <textarea
                value={draft.notes}
                onChange={(event) =>
                  setDraft({ ...draft, notes: event.target.value })
                }
                className="min-h-28 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none"
              />
            </Field>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={duplicateSearchText}
                onChange={(event) => setDuplicateSearchText(event.target.value)}
                placeholder="Search approved items for duplicates..."
                className="border-white/10 bg-white/[0.03] pl-11 text-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => void handleDuplicateSearch()}
              disabled={isSearchingDuplicates}
              className="border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
            >
              {isSearchingDuplicates ? "Searching..." : "Find matches"}
            </Button>
          </div>

          {duplicateCandidates.length > 0 ? (
            <div className="mt-4 space-y-2">
              {duplicateCandidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelectedDuplicateId(candidate.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    selectedDuplicateId === candidate.id
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="font-medium">{candidate.title}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {candidate.type} ·{" "}
                    {candidate.city ?? candidate.location ?? "No location"}
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {selectedDuplicate ? (
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              Duplicate target selected: {selectedDuplicate.title}
            </div>
          ) : null}
        </div>

        {statusMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {item.status === "pending" ? (
            <>
              <Button
                disabled={isSubmitting}
                onClick={() => void runAction("approved")}
                className="rounded-full border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
              >
                {isSubmitting ? "Saving..." : "Approve"}
              </Button>
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => void runAction("rejected")}
                className="rounded-full border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
              >
                Reject
              </Button>
            </>
          ) : null}
          {item.status === "approved" ? (
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => void runAction("rejected")}
              className="rounded-full border-rose-400/20 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
            >
              {isSubmitting ? "Saving..." : "Suspend"}
            </Button>
          ) : null}
          {item.status === "rejected" ? (
            <Button
              disabled={isSubmitting}
              onClick={() => void runAction("approved")}
              className="rounded-full border-emerald-400/20 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
            >
              {isSubmitting ? "Saving..." : "Restore"}
            </Button>
          ) : null}
          <Button
            variant="outline"
            disabled={isSubmitting || !selectedDuplicateId}
            onClick={() =>
              void runAction("rejected", {
                duplicateOfItemId: selectedDuplicateId,
                moderationNote: selectedDuplicate
                  ? buildDuplicateModerationNote(
                      selectedDuplicate.title,
                      draft.notes,
                    )
                  : draft.notes || null,
              })
            }
            className="rounded-full border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
          >
            Mark duplicate
          </Button>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-slate-300">{label}</Label>
      {children}
    </div>
  );
}
