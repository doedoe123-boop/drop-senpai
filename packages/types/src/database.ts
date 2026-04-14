export type ItemType = "event" | "drop";

export type ItemStatus = "pending" | "approved" | "rejected";

export type ProfileRole = "user" | "admin";

export type SubmissionLogAction = "approved" | "rejected" | "edited";

export interface ProfileRow {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  created_at: string;
}

export interface ItemRow {
  id: string;
  type: ItemType;
  title: string;
  description: string | null;
  source_url: string;
  image_url: string | null;
  event_date: string | null;
  end_date: string | null;
  location: string | null;
  city: string | null;
  region: string | null;
  tags: string[];
  status: ItemStatus;
  featured: boolean;
  submitted_by: string | null;
  duplicate_of_item_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemInsert {
  type: ItemType;
  title: string;
  description?: string | null;
  source_url: string;
  image_url?: string | null;
  event_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  city?: string | null;
  region?: string | null;
  tags?: string[];
  featured?: boolean;
  status?: ItemStatus;
  submitted_by?: string | null;
  duplicate_of_item_id?: string | null;
}

export interface ItemUpdate extends Partial<ItemInsert> {
  updated_at?: string;
}

export interface BookmarkRow {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
}

export interface BookmarkInsert {
  user_id: string;
  item_id: string;
}

export interface SubmissionLogRow {
  id: string;
  item_id: string;
  reviewed_by: string | null;
  action: SubmissionLogAction;
  notes: string | null;
  created_at: string;
}

export interface SubmissionLogInsert {
  item_id: string;
  reviewed_by?: string | null;
  action: SubmissionLogAction;
  notes?: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at">;
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
        Relationships: [];
      };
      items: {
        Row: ItemRow;
        Insert: ItemInsert;
        Update: ItemUpdate;
        Relationships: [];
      };
      bookmarks: {
        Row: BookmarkRow;
        Insert: BookmarkInsert;
        Update: Partial<BookmarkInsert>;
        Relationships: [];
      };
      submission_logs: {
        Row: SubmissionLogRow;
        Insert: SubmissionLogInsert;
        Update: Partial<SubmissionLogInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
