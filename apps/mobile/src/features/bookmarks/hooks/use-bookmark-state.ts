import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import {
  fetchBookmarkState,
  removeBookmark,
  saveBookmark,
} from "../api/bookmarks";

export function useBookmarkState(
  userId: string | undefined,
  itemId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.bookmarkState(userId as string, itemId as string),
    queryFn: () => fetchBookmarkState(userId as string, itemId as string),
    enabled: Boolean(userId && itemId),
  });
}

export function useToggleBookmark(
  userId: string | undefined,
  itemId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shouldSave: boolean) => {
      if (!userId || !itemId) {
        throw new Error("Sign in before saving items.");
      }

      if (shouldSave) {
        await saveBookmark(userId, itemId);
      } else {
        await removeBookmark(userId, itemId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarkState(userId as string, itemId as string),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.savedItems(userId as string),
      });
    },
  });
}
