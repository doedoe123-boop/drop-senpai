"use client";

import { useState } from "react";

import { AdminButton } from "../../../components/admin-button";
import { AdminField } from "../../../components/admin-field";
import { useAdminAuth } from "../hooks/use-admin-auth";

export function AdminAuthForm() {
  const { signInWithPassword } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithPassword(email, password);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not sign in with those credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form-grid">
      <AdminField label="Admin email">
        <input
          className="admin-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@example.com"
          autoComplete="email"
          required
        />
      </AdminField>
      <AdminField label="Password">
        <input
          className="admin-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
      </AdminField>
      {errorMessage ? (
        <div className="admin-banner admin-banner--error">{errorMessage}</div>
      ) : null}
      <AdminButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </AdminButton>
    </form>
  );
}
