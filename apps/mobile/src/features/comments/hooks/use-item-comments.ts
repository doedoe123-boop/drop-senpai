import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { useAuth } from "../../auth/hooks/use-auth";
import { fetchComments } from "../api/comments";

export function useItemComments(itemId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.itemComments(itemId),
    queryFn: () => fetchComments(itemId, user?.id),
    staleTime: 30_000,
  });
}
