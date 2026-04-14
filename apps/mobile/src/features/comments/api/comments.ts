import type { CommentWithAuthor } from "@drop-senpai/types";

import { supabase } from "../../../lib/supabase";

interface CommentQueryRow {
  id: string;
  body: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    reputation_points: number;
  };
  comment_likes: Array<{ id: string; user_id: string }>;
}

function mapToCommentWithAuthor(
  row: CommentQueryRow,
  currentUserId?: string,
): CommentWithAuthor {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.created_at,
    author: {
      id: row.profiles.id,
      username: row.profiles.username,
      avatarUrl: row.profiles.avatar_url,
      reputationPoints: row.profiles.reputation_points,
    },
    likeCount: row.comment_likes.length,
    likedByMe: currentUserId
      ? row.comment_likes.some((like) => like.user_id === currentUserId)
      : false,
    isOwn: currentUserId ? row.user_id === currentUserId : false,
  };
}

export async function fetchComments(
  itemId: string,
  currentUserId?: string,
): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, body, user_id, created_at, profiles!inner(id, username, avatar_url, reputation_points), comment_likes(id, user_id)",
    )
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as unknown as CommentQueryRow[]).map((row) =>
    mapToCommentWithAuthor(row, currentUserId),
  );
}

export async function createComment(
  itemId: string,
  userId: string,
  body: string,
): Promise<void> {
  const { error } = await supabase.from("comments").insert({
    item_id: itemId,
    user_id: userId,
    body: body.trim(),
  });

  if (error) {
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}

export async function likeComment(
  commentId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase.from("comment_likes").insert({
    comment_id: commentId,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function unlikeComment(
  commentId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}
