"use client";

import type { PropsWithChildren } from "react";

import { AdminButton } from "../../../components/admin-button";
import { Panel } from "../../../components/panel";
import { useAdminAuth } from "../hooks/use-admin-auth";
import { AdminAuthForm } from "./admin-auth-form";

export function AdminGuard({ children }: PropsWithChildren) {
  const { isLoading, profileExists, role, user, signOut } = useAdminAuth();

  if (isLoading) {
    return (
      <Panel
        title="Loading admin session"
        description="Checking your authenticated session and admin role."
      >
        <div className="admin-empty">
          <span className="admin-muted">
            Restoring your admin session and validating access.
          </span>
        </div>
      </Panel>
    );
  }

  if (!user) {
    return (
      <Panel
        title="Admin sign in required"
        description="Use your admin email and password to access the moderation dashboard."
        eyebrow="Moderator access"
        className="admin-card--auth"
      >
        <AdminAuthForm />
      </Panel>
    );
  }

  if (!profileExists) {
    return (
      <Panel
        title="Profile setup incomplete"
        description="Your account is signed in, but the dashboard could not load its access profile."
        className="admin-card--auth"
      >
        <div className="admin-empty">
          <span className="admin-muted">
            Ask an existing admin to confirm your account has a matching access
            profile and the correct role.
          </span>
          <AdminButton variant="ghost" onClick={() => void signOut()}>
            Sign out
          </AdminButton>
        </div>
      </Panel>
    );
  }

  if (role !== "admin") {
    return (
      <Panel
        title="Admin access blocked"
        description="Your account is signed in, but it does not have access to this dashboard."
        className="admin-card--auth"
      >
        <div className="admin-empty">
          <span className="admin-muted">
            Ask an existing admin to grant your account the admin role before
            trying again.
          </span>
          <AdminButton variant="ghost" onClick={() => void signOut()}>
            Sign out
          </AdminButton>
        </div>
      </Panel>
    );
  }

  return <>{children}</>;
}
