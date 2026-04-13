"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ItemType } from "@drop-senpai/types";

import { AdminBadge } from "../../../components/admin-badge";
import { AdminButton } from "../../../components/admin-button";
import { AdminField } from "../../../components/admin-field";
import { Panel } from "../../../components/panel";
import { useAdminAuth } from "../../auth/hooks/use-admin-auth";
import { moderateItem } from "../api/moderation";
import { usePendingItem } from "../hooks/use-pending-item";

interface ReviewFormProps {
  itemId: string;
}

interface ReviewDraft {
  title: string;
  type: ItemType;
  description: string;
  source_url: string;
  image_url: string;
  event_date: string;
  location: string;
  city: string;
  region: string;
  tags: string;
  notes: string;
}

export function ReviewForm({ itemId }: ReviewFormProps) {
  const router = useRouter();
  const { user, supabase } = useAdminAuth();
  const pendingItem = usePendingItem(itemId);
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!pendingItem.data) {
      return;
    }

    setDraft({
      title: pendingItem.data.title,
      type: pendingItem.data.type,
      description: pendingItem.data.description ?? "",
      source_url: pendingItem.data.source_url,
      image_url: pendingItem.data.image_url ?? "",
      event_date: pendingItem.data.event_date ?? "",
      location: pendingItem.data.location ?? "",
      city: pendingItem.data.city ?? "",
      region: pendingItem.data.region ?? "",
      tags: pendingItem.data.tags.join(", "),
      notes: "",
    });
  }, [pendingItem.data]);

  const handleAction = async (action: "approved" | "rejected") => {
    if (!draft || !user || !supabase) {
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      await moderateItem(supabase, {
        itemId,
        reviewedBy: user.id,
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
        notes: draft.notes || null,
      });
      router.push(`/?moderated=${action}`);
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

  if (pendingItem.isLoading || !draft) {
    return (
      <Panel
        title="Review item"
        description="Loading the pending item and preparing the moderation form."
      >
        <div className="admin-empty">
          <span className="admin-muted">
            Preparing the moderation editor and source details.
          </span>
        </div>
      </Panel>
    );
  }

  if (pendingItem.error) {
    return (
      <Panel
        title="Review item"
        description="This pending item could not be loaded."
      >
        <div className="admin-empty">
          <div className="admin-banner admin-banner--error">
            {pendingItem.error}
          </div>
          <AdminButton onClick={() => void pendingItem.refetch()}>
            Try again
          </AdminButton>
        </div>
      </Panel>
    );
  }

  const item = pendingItem.data;

  if (!item) {
    return (
      <Panel
        title="Review item"
        description="This pending item could not be found."
      >
        <span>It may already have been moderated or removed.</span>
      </Panel>
    );
  }

  return (
    <Panel
      title={`Review ${item.title}`}
      description="Edit the core fields if needed, then approve or reject the submission."
      eyebrow="Moderation review"
    >
      <div className="admin-form-grid">
        <div className="admin-hero-row">
          <AdminBadge tone={item.status}>{item.status}</AdminBadge>
          <AdminBadge tone={draft.type}>{draft.type}</AdminBadge>
        </div>
        <div className="admin-form-grid admin-form-grid--two">
          <AdminField label="Title">
            <input
              className="admin-input"
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
            />
          </AdminField>
          <AdminField label="Type">
            <select
              className="admin-select"
              value={draft.type}
              onChange={(event) =>
                setDraft({ ...draft, type: event.target.value as ItemType })
              }
            >
              <option value="event">event</option>
              <option value="drop">drop</option>
            </select>
          </AdminField>
        </div>
        <AdminField label="Description">
          <textarea
            className="admin-textarea"
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
          />
        </AdminField>
        <div className="admin-form-grid admin-form-grid--two">
          <AdminField label="Source URL">
            <input
              className="admin-input"
              value={draft.source_url}
              onChange={(event) =>
                setDraft({ ...draft, source_url: event.target.value })
              }
            />
          </AdminField>
          <AdminField label="Image URL">
            <input
              className="admin-input"
              value={draft.image_url}
              onChange={(event) =>
                setDraft({ ...draft, image_url: event.target.value })
              }
            />
          </AdminField>
        </div>
        <div className="admin-form-grid admin-form-grid--two">
          <AdminField label="Event date">
            <input
              className="admin-input"
              value={draft.event_date}
              onChange={(event) =>
                setDraft({ ...draft, event_date: event.target.value })
              }
            />
          </AdminField>
          <AdminField label="Location">
            <input
              className="admin-input"
              value={draft.location}
              onChange={(event) =>
                setDraft({ ...draft, location: event.target.value })
              }
            />
          </AdminField>
        </div>
        <div className="admin-form-grid admin-form-grid--two">
          <AdminField label="City">
            <input
              className="admin-input"
              value={draft.city}
              onChange={(event) =>
                setDraft({ ...draft, city: event.target.value })
              }
            />
          </AdminField>
          <AdminField label="Region">
            <input
              className="admin-input"
              value={draft.region}
              onChange={(event) =>
                setDraft({ ...draft, region: event.target.value })
              }
            />
          </AdminField>
        </div>
        <AdminField label="Tags">
          <input
            className="admin-input"
            value={draft.tags}
            onChange={(event) =>
              setDraft({ ...draft, tags: event.target.value })
            }
          />
        </AdminField>
        <AdminField label="Moderation notes">
          <textarea
            className="admin-textarea"
            value={draft.notes}
            onChange={(event) =>
              setDraft({ ...draft, notes: event.target.value })
            }
          />
        </AdminField>
        <div className="admin-form-grid">
          {draft.image_url ? (
            <div className="admin-image-preview">
              <img src={draft.image_url} alt={draft.title} />
            </div>
          ) : (
            <div className="admin-image-preview">No image provided</div>
          )}
          <a
            href={draft.source_url}
            target="_blank"
            rel="noreferrer"
            className="admin-link"
          >
            Open source link
          </a>
          {draft.image_url ? (
            <AdminButton
              variant="danger"
              onClick={() => setDraft({ ...draft, image_url: "" })}
            >
              Remove image URL
            </AdminButton>
          ) : null}
          <div className="admin-meta-grid">
            <div className="admin-meta-grid__group">
              <div className="admin-kv">
                <span className="admin-kv__label">Submitted by</span>
                <span className="admin-kv__value">
                  {item.submitted_by ?? "Unknown"}
                </span>
              </div>
            </div>
            <div className="admin-meta-grid__group">
              <div className="admin-kv">
                <span className="admin-kv__label">Created</span>
                <span className="admin-kv__value">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        {statusMessage ? (
          <div className="admin-banner admin-banner--error">
            {statusMessage}
          </div>
        ) : null}
        <div className="admin-actions">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AdminButton
              variant="secondary"
              onClick={() => void handleAction("approved")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Approve"}
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={() => void handleAction("rejected")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Reject"}
            </AdminButton>
          </div>
          <Link href="/" className="admin-muted">
            Back to queue
          </Link>
        </div>
      </div>
    </Panel>
  );
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}
