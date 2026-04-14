import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatEventDateTime, formatLocationLabel } from "@drop-senpai/lib";
import type { ItemDetailModel } from "@drop-senpai/types";

import { mobileTheme } from "../../../constants/theme";
import { BookmarkButton } from "../../bookmarks/components/bookmark-button";
import { CommentSection } from "../../comments/components/comment-section";

interface ItemDetailContentProps {
  item: ItemDetailModel;
}

function typeBadgeLabel(type: string) {
  return type === "event" ? "EVENT" : "DROP";
}

export function ItemDetailContent({ item }: ItemDetailContentProps) {
  const handleOpenSource = async () => {
    await Linking.openURL(item.sourceUrl);
  };

  const badgeBg =
    item.type === "event"
      ? "rgba(239, 77, 158, 0.15)"
      : "rgba(240, 182, 19, 0.15)";
  const badgeColor =
    item.type === "event"
      ? mobileTheme.colors.eventBadge
      : mobileTheme.colors.dropBadge;

  return (
    <ScrollView contentContainerStyle={styles.content}>
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
            size={36}
            color={mobileTheme.colors.textMuted}
          />
        </View>
      )}

      <View style={styles.header}>
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
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {item.author ? (
        <View style={styles.authorSection}>
          <Text style={styles.authorLabel}>
            Posted by{" "}
            <Text style={styles.authorName}>{item.author.displayName}</Text>
          </Text>
          {item.author.isVerifiedOrganizer ? (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={mobileTheme.colors.accent}
              />
              <Text style={styles.verifiedText}>Verified Organizer</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.metaSection}>
        {item.eventDate ? (
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={17}
              color={mobileTheme.colors.primary}
            />
            <Text style={styles.metaText}>
              {formatEventDateTime(item.eventDate)}
            </Text>
          </View>
        ) : null}
        {item.location ? (
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={17}
              color={mobileTheme.colors.primary}
            />
            <Text style={styles.metaText}>
              {formatLocationLabel([item.location, item.city, item.region])}
            </Text>
          </View>
        ) : null}
      </View>

      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}

      {item.tags && item.tags.length > 0 ? (
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={handleOpenSource}>
          <Ionicons name="open-outline" size={17} color="#ffffff" />
          <Text style={styles.primaryButtonText}>View Source</Text>
        </Pressable>
        <BookmarkButton itemId={item.id} variant="icon" />
      </View>

      <CommentSection itemId={item.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: mobileTheme.spacing.xl,
    paddingBottom: mobileTheme.spacing["3xl"],
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 24,
    backgroundColor: mobileTheme.colors.surfaceMuted,
  },
  imageFallback: {
    width: "100%",
    height: 260,
    borderRadius: 24,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    gap: mobileTheme.spacing.md,
  },
  badgeRow: {
    flexDirection: "row",
    gap: mobileTheme.spacing.sm,
    flexWrap: "wrap",
  },
  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: mobileTheme.radius.full,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  featuredBadge: {
    alignSelf: "flex-start",
    borderRadius: mobileTheme.radius.full,
    backgroundColor: "rgba(19, 205, 212, 0.18)",
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  featuredBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: mobileTheme.colors.accent,
    letterSpacing: 0.8,
  },
  title: {
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize["2xl"],
    lineHeight: 34,
    fontWeight: "700",
  },
  metaSection: {
    gap: mobileTheme.spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: mobileTheme.spacing.sm,
  },
  metaText: {
    color: mobileTheme.colors.textSecondary,
    fontSize: mobileTheme.fontSize.base,
    lineHeight: 21,
    flex: 1,
  },
  description: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: "row",
    gap: mobileTheme.spacing.sm,
    flexWrap: "wrap",
  },
  tagChip: {
    borderRadius: mobileTheme.radius.full,
    backgroundColor: mobileTheme.colors.secondary,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  tagText: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: mobileTheme.spacing.md,
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: mobileTheme.colors.primary,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: mobileTheme.spacing.sm,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: mobileTheme.fontSize.base,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: mobileTheme.spacing.sm,
    flexWrap: "wrap",
  },
  authorLabel: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
  },
  authorName: {
    color: mobileTheme.colors.text,
    fontWeight: "600",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: mobileTheme.radius.full,
    backgroundColor: "rgba(19, 205, 212, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    color: mobileTheme.colors.accent,
    fontSize: mobileTheme.fontSize.xs,
    fontWeight: "700",
  },
});
