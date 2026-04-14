import type { ItemRow, ItemStatus, ItemType } from "./database";

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
}

export interface ItemDetailModel extends ItemCardModel {
  description: string | null;
  endDate: string | null;
  location: string | null;
  city: string | null;
  region: string | null;
}

export function mapItemRowToCardModel(item: ItemRow): ItemCardModel {
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
  };
}

export function mapItemRowToDetailModel(item: ItemRow): ItemDetailModel {
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
