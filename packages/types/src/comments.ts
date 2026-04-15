export type {
  CommentRow,
  CommentInsert,
  CommentLikeRow,
  CommentLikeInsert,
} from "./database";

export interface CommentWithAuthor {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    reputationPoints: number;
  };
  likeCount: number;
  likedByMe: boolean;
  isOwn: boolean;
}
