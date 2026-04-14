export function formatRelativeTime(dateValue: string): string {
  const now = Date.now();
  const then = new Date(dateValue).getTime();

  if (Number.isNaN(then)) {
    return "";
  }

  const diffSeconds = Math.floor((now - then) / 1000);

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue));
}
