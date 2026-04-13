"use client";

import Link from "next/link";

import { AdminBadge } from "../../../components/admin-badge";
import { AdminButton } from "../../../components/admin-button";
import { Panel } from "../../../components/panel";
import { usePendingItems } from "../hooks/use-pending-items";

export function PendingQueue() {
  const pendingItems = usePendingItems();

  if (pendingItems.isLoading) {
    return (
      <Panel
        title="Pending moderation queue"
        description="Loading pending submissions and calculating the current queue."
      >
        <div className="admin-empty">
          <span className="admin-muted">
            Pulling the latest items waiting for review.
          </span>
        </div>
      </Panel>
    );
  }

  if (pendingItems.error) {
    return (
      <Panel title="Pending moderation queue" description="The queue could not be loaded.">
        <div className="admin-empty">
          <div className="admin-banner admin-banner--error">
            {pendingItems.error}
          </div>
          <AdminButton onClick={() => void pendingItems.refetch()}>
            Try again
          </AdminButton>
        </div>
      </Panel>
    );
  }

  if (pendingItems.data.length === 0) {
    return (
      <Panel title="Pending moderation queue" description="Nothing is waiting for review right now.">
        <div className="admin-empty">
          <span className="admin-muted">
            Pending submissions will appear here as soon as users send them in.
          </span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title={`Pending moderation queue (${pendingItems.data.length})`}
      description="Review pending items and publish or reject them."
    >
      <div className="admin-list">
        {pendingItems.data.map((item) => (
          <article key={item.id} className="admin-list-item">
            <div className="admin-list-item__title-row">
              <div style={{ display: "grid", gap: 8 }}>
                <strong>{item.title}</strong>
                <AdminBadge tone={item.type}>{item.type}</AdminBadge>
              </div>
              <Link href={`/items/${item.id}`} className="admin-link">
                Review
              </Link>
            </div>
            <div className="admin-meta-grid">
              <div className="admin-meta-grid__group">
                <div className="admin-kv">
                  <span className="admin-kv__label">Source</span>
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-link"
                  >
                    Open source link
                  </a>
                </div>
                <div className="admin-kv">
                  <span className="admin-kv__label">Submitted by</span>
                  <span className="admin-kv__value">
                    {item.profiles?.username ?? item.submitted_by ?? "Unknown"}
                  </span>
                </div>
              </div>
              <div className="admin-meta-grid__group">
                <div className="admin-kv">
                  <span className="admin-kv__label">Event date</span>
                  <span className="admin-kv__value">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleString()
                      : "Not set"}
                  </span>
                </div>
                <div className="admin-kv">
                  <span className="admin-kv__label">Created</span>
                  <span className="admin-kv__value">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <a href={item.source_url} target="_blank" rel="noreferrer" className="admin-link">
              Open source link
            </a>
          </article>
        ))}
      </div>
    </Panel>
  );
}
