import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubmissionInput } from "@drop-senpai/types";

import { queryKeys } from "../../../constants/query-keys";
import { createSubmission } from "../api/create-submission";

export function useCreateSubmission(
  userId: string | undefined,
  isVerifiedOrganizer: boolean = false,
) {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, SubmissionInput>({
    mutationFn: async (input) => {
      if (!userId) {
        throw new Error("Sign in before submitting an item.");
      }

      return createSubmission(input, userId, isVerifiedOrganizer);
    },
    onSuccess: async () => {
      if (userId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.mySubmissions(userId),
        });
      }
    },
  });
}
