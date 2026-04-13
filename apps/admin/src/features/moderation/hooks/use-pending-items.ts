"use client";

import { useEffect, useState } from "react";

import { useAdminAuth } from "../../auth/hooks/use-admin-auth";
import { fetchPendingItems, type PendingQueueItem } from "../api/moderation";

export function usePendingItems() {
  const { supabase, role } = useAdminAuth();
  const [data, setData] = useState<PendingQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (role !== "admin" || !supabase) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setData(await fetchPendingItems(supabase));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load pending items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [role, supabase]);

  return {
    data,
    isLoading,
    error,
    refetch: load
  };
}
