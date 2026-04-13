import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchLatestDrops } from "../api/items";

export function useLatestDrops() {
  return useQuery({
    queryKey: queryKeys.latestDrops,
    queryFn: fetchLatestDrops,
    staleTime: 30_000,
  });
}
