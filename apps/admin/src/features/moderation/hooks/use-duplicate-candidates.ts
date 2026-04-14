"use client";

import { useEffect, useState } from "react";

import type { DuplicateCandidate } from "../api/moderation";
import { fetchDuplicateCandidates } from "../api/moderation";
import { useAdminAuth } from "../../auth/hooks/use-admin-auth";

export function useDuplicateCandidates(
  itemId: string,
  searchText: string,
  enabled = true,
) {
  const { supabase, role } = useAdminAuth();
  const [data, setData] = useState<DuplicateCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || role !== "admin" || !supabase) {
      setData([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    async function load() {
      if (!supabase) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const results = await fetchDuplicateCandidates(supabase, itemId, searchText);

        if (!isMounted) {
          return;
        }

        setData(results);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load duplicate suggestions.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [enabled, itemId, role, searchText, supabase]);

  return { data, isLoading, error };
}
