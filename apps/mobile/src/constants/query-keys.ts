export const queryKeys = {
  approvedItems: ["approved-items"] as const,
  featuredItems: ["featured-items"] as const,
  upcomingEvents: ["upcoming-events"] as const,
  latestDrops: ["latest-drops"] as const,
  exploreItems: (filters: object) =>
    ["explore-items", filters] as const,
  approvedRegions: ["approved-regions"] as const,
  approvedItem: (itemId: string) => ["approved-item", itemId] as const,
  mySubmissions: (userId: string) => ["my-submissions", userId] as const,
  savedItems: (userId: string) => ["saved-items", userId] as const,
  bookmarkState: (userId: string, itemId: string) =>
    ["bookmark-state", userId, itemId] as const,
};
