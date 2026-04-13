"use client";

import { useEffect, useState } from "react";

import type { ItemRow } from "@drop-senpai/types";

import { useAdminAuth } from "../../auth/hooks/use-admin-auth";
import { fetchPendingItemById } from "../api/moderation";

export function usePendingItem(itemId: string) {
  const { supabase, role } = useAdminAuth();
  const [data, setData] = useState<ItemRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (role !== "admin" || !supabase) {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setData(await fetchPendingItemById(supabase, itemId));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load this pending item.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [itemId, role, supabase]);

  return {
    data,
    isLoading,
    error,
    refetch: load
  };
}
