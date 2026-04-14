import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { fetchUserProfile } from "../api/profile";

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.userProfile(userId as string),
    queryFn: () => fetchUserProfile(userId as string),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}
