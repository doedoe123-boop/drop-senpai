import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { formatEventDateTime } from "@drop-senpai/lib";
import type { ItemCardModel } from "@drop-senpai/types";

import { mobileTheme } from "../../../constants/theme";
import { BookmarkButton } from "../../bookmarks/components/bookmark-button";

interface ItemCardProps {
  item: ItemCardModel;
}

function typeBadgeLabel(type: string) {
  return type === "event" ? "EVENT" : "DROP";
}

export function ItemCard({ item }: ItemCardProps) {
  const dateLabel = item.eventDate ?? item.createdAt;
  const badgeBg =
    item.type === "event"
      ? "rgba(239, 77, 158, 0.15)"
      : "rgba(240, 182, 19, 0.15)";
  const badgeColor =
    item.type === "event"
      ? mobileTheme.colors.eventBadge
      : mobileTheme.colors.dropBadge;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/items/${item.id}`)}
    >
      <View style={styles.mediaWrap}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons
              name={item.type === "event" ? "sparkles-outline" : "cube-outline"}
              size={28}
              color={mobileTheme.colors.textMuted}
            />
          </View>
        )}
        <View style={styles.overlayTopRow}>
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.typeBadgeText, { color: badgeColor }]}>
                {typeBadgeLabel(item.type)}
              </Text>
            </View>
            {item.featured ? (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>★ FEATURED</Text>
              </View>
            ) : null}
          </View>
          <BookmarkButton itemId={item.id} variant="icon" />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.metaList}>
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={mobileTheme.colors.primary}
            />
            <Text style={styles.meta}>{formatEventDateTime(dateLabel)}</Text>
          </View>
          {item.locationLabel ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-outline"
                size={15}
                color={mobileTheme.colors.primary}
              />
              <Text style={styles.meta}>{item.locationLabel}</Text>
            </View>
          ) : null}
        </View>
        {item.tags.length > 0 ? (
          <View style={styles.tagRow}>
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {item.author ? (
          <View style={styles.authorRow}>
            <Text style={styles.authorText}>by {item.author.displayName}</Text>
            {item.author.isVerifiedOrganizer ? (
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={mobileTheme.colors.accent}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: mobileTheme.colors.surface,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  mediaWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 182,
    backgroundColor: mobileTheme.colors.surfaceMuted,
  },
  imageFallback: {
    width: "100%",
    height: 182,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayTopRow: {
    position: "absolute",
    top: mobileTheme.spacing.md,
    left: mobileTheme.spacing.md,
    right: mobileTheme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  body: {
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingVertical: mobileTheme.spacing.lg,
    gap: mobileTheme.spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    gap: mobileTheme.spacing.sm,
    flexWrap: "wrap",
  },
  typeBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  featuredBadge: {
    borderRadius: 999,
    backgroundColor: "rgba(19, 205, 212, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: mobileTheme.colors.accent,
    letterSpacing: 0.8,
  },
  title: {
    color: mobileTheme.colors.text,
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 26,
  },
  metaList: {
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  meta: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  tagRow: {
    flexDirection: "row",
    gap: mobileTheme.spacing.sm,
    flexWrap: "wrap",
    marginTop: mobileTheme.spacing.xs,
  },
  tagChip: {
    borderRadius: mobileTheme.radius.full,
    backgroundColor: mobileTheme.colors.secondary,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  tagText: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  authorText: {
    color: mobileTheme.colors.textMuted,
    fontSize: 12,
  },
});
