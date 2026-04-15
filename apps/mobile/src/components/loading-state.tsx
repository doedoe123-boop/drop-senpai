import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../constants/theme";
import { SkeletonBlock } from "./skeleton-block";

interface LoadingStateProps {
  label?: string;
  variant?: "default" | "feed" | "list" | "detail" | "form" | "profile";
}

export function LoadingState({
  label = "Loading...",
  variant = "default",
}: LoadingStateProps) {
  if (variant === "feed") {
    return (
      <View style={styles.feedContainer}>
        <View style={styles.stickyHeaderCard}>
          <SkeletonBlock width={132} height={30} radius={18} />
          <SkeletonBlock width="58%" height={14} radius={10} />
        </View>
        <View style={styles.feedSection}>
          <SkeletonBlock width={110} height={14} radius={10} />
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </View>
        <View style={styles.feedSection}>
          <SkeletonBlock width={138} height={14} radius={10} />
          <FeedCardSkeleton />
        </View>
      </View>
    );
  }

  if (variant === "list") {
    return (
      <View style={styles.listContainer}>
        <SkeletonBlock width={148} height={28} radius={18} />
        <SkeletonBlock width="72%" height={14} radius={10} />
        <ListCardSkeleton />
        <ListCardSkeleton />
        <ListCardSkeleton />
      </View>
    );
  }

  if (variant === "detail") {
    return (
      <View style={styles.detailContainer}>
        <SkeletonBlock width="100%" height={260} radius={24} />
        <View style={styles.detailTextGroup}>
          <SkeletonBlock width={120} height={26} radius={999} />
          <SkeletonBlock width="88%" height={34} radius={16} />
          <SkeletonBlock width="74%" height={20} radius={12} />
        </View>
        <View style={styles.detailMetaGroup}>
          <SkeletonBlock width="65%" height={18} />
          <SkeletonBlock width="82%" height={18} />
          <SkeletonBlock width="100%" height={90} radius={18} />
        </View>
      </View>
    );
  }

  if (variant === "form") {
    return (
      <View style={styles.formContainer}>
        <SkeletonBlock width={220} height={28} radius={18} />
        <SkeletonBlock width="85%" height={16} radius={10} />
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.formField}>
            <SkeletonBlock width={84} height={12} radius={8} />
            <SkeletonBlock width="100%" height={50} radius={14} />
          </View>
        ))}
      </View>
    );
  }

  if (variant === "profile") {
    return (
      <View style={styles.profileContainer}>
        <SkeletonBlock width={108} height={14} radius={10} />
        <SkeletonBlock width={220} height={30} radius={18} />
        <SkeletonBlock width={140} height={14} radius={10} />
        <SkeletonBlock width="100%" height={92} radius={20} />
        <View style={styles.profileButtons}>
          <SkeletonBlock width={136} height={46} radius={16} />
          <SkeletonBlock width={120} height={46} radius={16} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={mobileTheme.colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function FeedCardSkeleton() {
  return (
    <View style={styles.feedCard}>
      <SkeletonBlock width="100%" height={172} radius={20} />
      <View style={styles.cardContent}>
        <SkeletonBlock width={90} height={22} radius={999} />
        <SkeletonBlock width="86%" height={24} radius={14} />
        <SkeletonBlock width="62%" height={16} radius={10} />
        <SkeletonBlock width="76%" height={16} radius={10} />
      </View>
    </View>
  );
}

function ListCardSkeleton() {
  return (
    <View style={styles.listCard}>
      <SkeletonBlock width="100%" height={150} radius={18} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: mobileTheme.spacing.sm,
    minHeight: 220,
  },
  label: {
    color: mobileTheme.colors.textMuted,
    fontSize: 14,
  },
  feedContainer: {
    gap: mobileTheme.spacing.xl,
    paddingBottom: mobileTheme.spacing["2xl"],
  },
  stickyHeaderCard: {
    gap: mobileTheme.spacing.sm,
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingTop: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: mobileTheme.colors.border,
    backgroundColor: "rgba(13, 15, 23, 0.95)",
  },
  feedSection: {
    gap: mobileTheme.spacing.md,
  },
  feedCard: {
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surface,
  },
  cardContent: {
    gap: mobileTheme.spacing.sm,
    padding: mobileTheme.spacing.lg,
  },
  listContainer: {
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing.lg,
  },
  listCard: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surface,
  },
  detailContainer: {
    gap: mobileTheme.spacing.xl,
    paddingBottom: mobileTheme.spacing["2xl"],
  },
  detailTextGroup: {
    gap: mobileTheme.spacing.md,
  },
  detailMetaGroup: {
    gap: mobileTheme.spacing.md,
  },
  formContainer: {
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing["2xl"],
  },
  formField: {
    gap: mobileTheme.spacing.sm,
  },
  profileContainer: {
    gap: mobileTheme.spacing.md,
  },
  profileButtons: {
    flexDirection: "row",
    gap: mobileTheme.spacing.md,
  },
});
