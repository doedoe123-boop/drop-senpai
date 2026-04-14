import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { updateDisplayName } from "../api/profile";

export function useUpdateDisplayName(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (displayName: string) => {
      if (!userId) {
        throw new Error("Not signed in.");
      }

      await updateDisplayName(userId, displayName);
    },
    onSuccess: async () => {
      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.userProfile(userId),
        });
      }
    },
  });
}
