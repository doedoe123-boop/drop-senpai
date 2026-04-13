import { StyleSheet, Text, View } from "react-native";

import { formatEventDate, formatLocationLabel } from "@drop-senpai/lib";

import { mobileTheme } from "../../../constants/theme";

interface ItemCardPlaceholderProps {
  type: "event" | "drop";
  title: string;
  eventDate: string | null;
  location: string | null;
}

export function ItemCardPlaceholder({
  type,
  title,
  eventDate,
  location,
}: ItemCardPlaceholderProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{type.toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{formatEventDate(eventDate)}</Text>
      <Text style={styles.meta}>{formatLocationLabel([location])}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: mobileTheme.spacing.md,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    gap: 6,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: mobileTheme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(239, 77, 158, 0.12)",
  },
  badgeText: {
    color: mobileTheme.colors.primary,
    fontSize: mobileTheme.fontSize.xs,
    fontWeight: "700",
  },
  title: {
    color: mobileTheme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: mobileTheme.colors.textMuted,
    fontSize: 13,
  },
});
