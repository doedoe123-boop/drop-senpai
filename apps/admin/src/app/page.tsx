"use client";

import { useEffect, useState } from "react";

import { AdminButton } from "../components/admin-button";
import { PageShell } from "../components/page-shell";
import { Panel } from "../components/panel";
import { AdminGuard } from "../features/auth/components/admin-guard";
import { useAdminAuth } from "../features/auth/hooks/use-admin-auth";
import { PendingQueue } from "../features/moderation/components/pending-queue";

function DashboardContent() {
  const { user, signOut } = useAdminAuth();
  const [moderated, setModerated] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setModerated(new URLSearchParams(window.location.search).get("moderated"));
  }, []);

  return (
    <>
      <Panel
        title="Moderation dashboard"
        description="Review pending submissions, clean up core fields, and publish or reject items."
        eyebrow="Control center"
      >
        <div className="admin-hero-row">
          <span className="admin-muted">Signed in as {user?.email}</span>
          <AdminButton variant="ghost" onClick={() => void signOut()}>
            Sign out
          </AdminButton>
        </div>
        {moderated ? (
          <div className="admin-banner admin-banner--success">
            Item {moderated === "approved" ? "approved" : "rejected"}{" "}
            successfully.
          </div>
        ) : null}
      </Panel>
      <PendingQueue />
    </>
  );
}

export default function AdminHomePage() {
  return (
    <PageShell narrow={false}>
      <AdminGuard>
        <DashboardContent />
      </AdminGuard>
    </PageShell>
  );
}
