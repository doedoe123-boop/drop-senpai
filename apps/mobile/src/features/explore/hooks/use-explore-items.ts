import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import {
  fetchApprovedItemsWithFilters,
  type ApprovedItemsFilters,
} from "../../items/api/items";

export function useExploreItems(filters: ApprovedItemsFilters) {
  return useQuery({
    queryKey: queryKeys.exploreItems(filters),
    queryFn: () => fetchApprovedItemsWithFilters(filters),
    staleTime: 30_000,
  });
}
