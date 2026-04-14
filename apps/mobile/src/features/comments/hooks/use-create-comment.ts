import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { createComment } from "../api/comments";

export function useCreateComment(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, body }: { userId: string; body: string }) => {
      await createComment(itemId, userId, body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.itemComments(itemId),
      });
    },
  });
}
