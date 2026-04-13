import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchApprovedItemById } from "../api/items";

export function useApprovedItem(itemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.approvedItem(itemId as string),
    queryFn: () => fetchApprovedItemById(itemId as string),
    enabled: Boolean(itemId),
  });
}
