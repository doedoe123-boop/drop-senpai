import type { ItemRow, ItemStatus, ItemType, ProfileRow } from "./database";

export interface ItemAuthor {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isVerifiedOrganizer: boolean;
  reputationPoints: number;
}

export interface ItemCardModel {
  id: string;
  title: string;
  type: ItemType;
  status: ItemStatus;
  featured: boolean;
  eventDate: string | null;
  createdAt: string;
  locationLabel: string | null;
  imageUrl: string | null;
  sourceUrl: string;
  tags: string[];
  author: ItemAuthor | null;
}

export interface ItemDetailModel extends ItemCardModel {
  description: string | null;
  endDate: string | null;
  location: string | null;
  city: string | null;
  region: string | null;
}

type ProfileJoin = Pick<
  ProfileRow,
  | "id"
  | "display_name"
  | "username"
  | "avatar_url"
  | "is_verified_organizer"
  | "reputation_points"
>;

export interface ItemRowWithAuthor extends ItemRow {
  profiles?: ProfileJoin | ProfileJoin[] | null;
}

function resolveDisplayName(
  displayName: string | null,
  username: string | null,
): string {
  return displayName || username || "Anonymous";
}

function mapAuthor(
  profiles: ProfileJoin | ProfileJoin[] | null | undefined,
): ItemAuthor | null {
  if (!profiles) return null;
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  if (!profile) return null;

  return {
    id: profile.id,
    displayName: resolveDisplayName(profile.display_name, profile.username),
    avatarUrl: profile.avatar_url,
    isVerifiedOrganizer: profile.is_verified_organizer,
    reputationPoints: profile.reputation_points,
  };
}

export function mapItemRowToCardModel(item: ItemRowWithAuthor): ItemCardModel {
  const locationParts = [item.location, item.city, item.region].filter(Boolean);

  return {
    id: item.id,
    title: item.title,
    type: item.type,
    status: item.status,
    featured: Boolean(item.featured),
    eventDate: item.event_date,
    createdAt: item.created_at,
    locationLabel: locationParts.length > 0 ? locationParts.join(", ") : null,
    imageUrl: item.image_url,
    sourceUrl: item.source_url,
    tags: item.tags,
    author: mapAuthor(item.profiles),
  };
}

export function mapItemRowToDetailModel(
  item: ItemRowWithAuthor,
): ItemDetailModel {
  const cardModel = mapItemRowToCardModel(item);

  return {
    ...cardModel,
    description: item.description,
    endDate: item.end_date,
    location: item.location,
    city: item.city,
    region: item.region,
  };
}
