import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatRelativeTime } from "@drop-senpai/lib";
import type { CommentWithAuthor } from "@drop-senpai/types";

import { mobileTheme } from "../../../constants/theme";
import { ReputationBadge } from "./reputation-badge";

interface CommentCardProps {
  comment: CommentWithAuthor;
  onDelete?: (commentId: string) => void;
  onToggleLike?: (commentId: string, liked: boolean) => void;
}

export function CommentCard({
  comment,
  onDelete,
  onToggleLike,
}: CommentCardProps) {
  const displayName = comment.author.displayName ?? "Anonymous";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.authorName}>{displayName}</Text>
        <ReputationBadge points={comment.author.reputationPoints} />
        <Text style={styles.timestamp}>
          {formatRelativeTime(comment.createdAt)}
        </Text>
      </View>

      <Text style={styles.body}>{comment.body}</Text>

      <View style={styles.footer}>
        {onToggleLike ? (
          <Pressable
            style={styles.likeButton}
            onPress={() => onToggleLike(comment.id, comment.likedByMe)}
            hitSlop={8}
          >
            <Ionicons
              name={comment.likedByMe ? "heart" : "heart-outline"}
              size={16}
              color={
                comment.likedByMe
                  ? mobileTheme.colors.accent
                  : mobileTheme.colors.textMuted
              }
            />
            {comment.likeCount > 0 ? (
              <Text
                style={[
                  styles.likeCount,
                  comment.likedByMe && styles.likeCountActive,
                ]}
              >
                {comment.likeCount}
              </Text>
            ) : null}
          </Pressable>
        ) : null}

        {comment.isOwn && onDelete ? (
          <Pressable
            style={styles.deleteButton}
            onPress={() => onDelete(comment.id)}
            hitSlop={8}
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color={mobileTheme.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: mobileTheme.colors.surface,
    borderRadius: mobileTheme.radius.lg,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    padding: mobileTheme.spacing.lg,
    gap: mobileTheme.spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: mobileTheme.spacing.sm,
  },
  authorName: {
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize.base,
    fontWeight: "700",
  },
  timestamp: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.xs,
  },
  body: {
    color: mobileTheme.colors.textSecondary,
    fontSize: mobileTheme.fontSize.base,
    lineHeight: 21,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: mobileTheme.spacing.xs,
    padding: mobileTheme.spacing.xs,
  },
  likeCount: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.sm,
  },
  likeCountActive: {
    color: mobileTheme.colors.accent,
  },
  deleteButton: {
    padding: mobileTheme.spacing.xs,
  },
});
