import type { ItemRow } from "@drop-senpai/types";

function getUpcomingSortValue(dateValue: string | null): number {
  if (!dateValue) {
    return Number.POSITIVE_INFINITY;
  }

  const timestamp = new Date(dateValue).getTime();

  if (Number.isNaN(timestamp)) {
    return Number.POSITIVE_INFINITY;
  }

  const now = Date.now();

  return timestamp >= now ? timestamp : now + Number.MAX_SAFE_INTEGER;
}

export function sortItemsByNearestUpcomingEventDate<T extends ItemRow>(
  items: T[],
): T[] {
  return [...items].sort((leftItem, rightItem) => {
    const leftSortValue = getUpcomingSortValue(leftItem.event_date);
    const rightSortValue = getUpcomingSortValue(rightItem.event_date);

    if (leftSortValue === rightSortValue) {
      return leftItem.title.localeCompare(rightItem.title);
    }

    return leftSortValue - rightSortValue;
  });
}
