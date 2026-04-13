import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchApprovedRegions } from "../../items/api/items";

export function useApprovedRegions() {
  return useQuery({
    queryKey: queryKeys.approvedRegions,
    queryFn: fetchApprovedRegions,
  });
}
