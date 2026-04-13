import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchApprovedItems } from "../api/items";

export function useApprovedItems() {
  return useQuery({
    queryKey: queryKeys.approvedItems,
    queryFn: fetchApprovedItems,
    staleTime: 30_000,
  });
}
