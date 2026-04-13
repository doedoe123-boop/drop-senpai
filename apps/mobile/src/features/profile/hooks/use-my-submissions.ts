import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchMySubmissions } from "../api/profile";

export function useMySubmissions(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.mySubmissions(userId as string),
    queryFn: () => fetchMySubmissions(userId as string),
    enabled: Boolean(userId),
  });
}
