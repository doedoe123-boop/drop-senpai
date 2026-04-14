import { Alert, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../../../constants/theme";
import { useAuth } from "../../auth/hooks/use-auth";
import { useItemComments } from "../hooks/use-item-comments";
import { useCreateComment } from "../hooks/use-create-comment";
import { useDeleteComment } from "../hooks/use-delete-comment";
import { useToggleCommentLike } from "../hooks/use-toggle-comment-like";
import { CommentCard } from "./comment-card";
import { CommentInput } from "./comment-input";

interface CommentSectionProps {
  itemId: string;
}

export function CommentSection({ itemId }: CommentSectionProps) {
  const { user } = useAuth();
  const { data: comments, isLoading } = useItemComments(itemId);
  const createComment = useCreateComment(itemId);
  const deleteCommentMutation = useDeleteComment(itemId);
  const toggleLike = useToggleCommentLike(itemId);

  const handleSubmit = (body: string) => {
    if (!user) return;
    createComment.mutate({ userId: user.id, body });
  };

  const handleDelete = (commentId: string) => {
    Alert.alert("Delete comment", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteCommentMutation.mutate(commentId),
      },
    ]);
  };

  const handleToggleLike = (commentId: string, liked: boolean) => {
    if (!user) return;
    toggleLike.mutate({ commentId, userId: user.id, liked });
  };

  const commentCount = comments?.length ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Comments{commentCount > 0 ? ` (${commentCount})` : ""}
      </Text>

      {user ? (
        <CommentInput
          onSubmit={handleSubmit}
          isSubmitting={createComment.isPending}
        />
      ) : (
        <Text style={styles.signInHint}>Sign in to leave a comment</Text>
      )}

      {isLoading ? (
        <Text style={styles.loadingText}>Loading comments...</Text>
      ) : commentCount === 0 ? (
        <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
      ) : (
        <View style={styles.list}>
          {comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDelete={comment.isOwn ? handleDelete : undefined}
              onToggleLike={user ? handleToggleLike : undefined}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.lg,
  },
  heading: {
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize.lg,
    fontWeight: "700",
  },
  signInHint: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
  },
  loadingText: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
    textAlign: "center",
    paddingVertical: mobileTheme.spacing.xl,
  },
  emptyText: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
    textAlign: "center",
    paddingVertical: mobileTheme.spacing.xl,
  },
  list: {
    gap: mobileTheme.spacing.md,
  },
});
