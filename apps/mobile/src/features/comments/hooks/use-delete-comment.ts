import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { deleteComment } from "../api/comments";

export function useDeleteComment(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      await deleteComment(commentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.itemComments(itemId),
      });
    },
  });
}
