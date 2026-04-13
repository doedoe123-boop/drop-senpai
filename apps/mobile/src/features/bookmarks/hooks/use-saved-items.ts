import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchSavedItems } from "../api/bookmarks";

export function useSavedItems(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.savedItems(userId as string),
    queryFn: () => fetchSavedItems(userId as string),
    enabled: Boolean(userId),
  });
}
