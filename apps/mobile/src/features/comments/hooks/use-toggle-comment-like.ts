import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CommentWithAuthor } from "@drop-senpai/types";

import { queryKeys } from "../../../constants/query-keys";
import { likeComment, unlikeComment } from "../api/comments";

export function useToggleCommentLike(itemId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.itemComments(itemId);

  return useMutation({
    mutationFn: async ({
      commentId,
      userId,
      liked,
    }: {
      commentId: string;
      userId: string;
      liked: boolean;
    }) => {
      if (liked) {
        await unlikeComment(commentId, userId);
      } else {
        await likeComment(commentId, userId);
      }
    },
    onMutate: async ({ commentId, liked }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<CommentWithAuthor[]>(queryKey);

      queryClient.setQueryData<CommentWithAuthor[]>(queryKey, (old) =>
        old?.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likedByMe: !liked,
                likeCount: liked
                  ? Math.max(0, c.likeCount - 1)
                  : c.likeCount + 1,
              }
            : c,
        ),
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });
}
