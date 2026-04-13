import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchUpcomingEvents } from "../api/items";

export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.upcomingEvents,
    queryFn: fetchUpcomingEvents,
    staleTime: 30_000,
  });
}
