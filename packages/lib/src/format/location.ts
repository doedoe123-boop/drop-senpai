export function formatLocationLabel(parts: Array<string | null | undefined>): string {
  const filteredParts = parts.filter((value): value is string => Boolean(value && value.trim()));

  return filteredParts.length > 0 ? filteredParts.join(", ") : "Location TBD";
}
