import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchFeaturedItems } from "../api/items";

export function useFeaturedItems() {
  return useQuery({
    queryKey: queryKeys.featuredItems,
    queryFn: fetchFeaturedItems,
    staleTime: 30_000,
  });
}
