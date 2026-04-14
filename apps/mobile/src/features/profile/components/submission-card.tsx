import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { formatEventDateTime } from "@drop-senpai/lib";
import type { SubmissionListItemModel } from "@drop-senpai/types";

import { mobileTheme } from "../../../constants/theme";

interface SubmissionCardProps {
  item: SubmissionListItemModel;
}

function statusLabel(status: SubmissionListItemModel["status"]) {
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function statusColors(status: SubmissionListItemModel["status"]) {
  if (status === "approved") {
    return {
      backgroundColor: "rgba(46, 204, 113, 0.16)",
      color: "#8ef0ba",
    };
  }

  if (status === "rejected") {
    return {
      backgroundColor: "rgba(255, 107, 129, 0.16)",
      color: "#ffb5c0",
    };
  }

  return {
    backgroundColor: "rgba(19, 205, 212, 0.15)",
    color: "#9ef4f8",
  };
}

function typeColors(type: SubmissionListItemModel["type"]) {
  return type === "event"
    ? {
        backgroundColor: "rgba(239, 77, 158, 0.15)",
        color: mobileTheme.colors.eventBadge,
      }
    : {
        backgroundColor: "rgba(240, 182, 19, 0.15)",
        color: mobileTheme.colors.dropBadge,
      };
}

export function SubmissionCard({ item }: SubmissionCardProps) {
  const statusTone = statusColors(item.status);
  const typeTone = typeColors(item.type);
  const submissionDate = formatEventDateTime(item.createdAt);
  const scheduledDate = item.eventDate ? formatEventDateTime(item.eventDate) : null;
  const latestModerationDate = item.latestModerationAt
    ? formatEventDateTime(item.latestModerationAt)
    : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: typeTone.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: typeTone.color }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
          <View
            style={[styles.badge, { backgroundColor: statusTone.backgroundColor }]}
          >
            <Text style={[styles.badgeText, { color: statusTone.color }]}>
              {statusLabel(item.status).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.metaList}>
        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={15}
            color={mobileTheme.colors.primary}
          />
          <Text style={styles.metaText}>Submitted {submissionDate}</Text>
        </View>
        {scheduledDate ? (
          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={15}
              color={mobileTheme.colors.primary}
            />
            <Text style={styles.metaText}>Scheduled {scheduledDate}</Text>
          </View>
        ) : null}
        {item.locationLabel ? (
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color={mobileTheme.colors.primary}
            />
            <Text style={styles.metaText}>{item.locationLabel}</Text>
          </View>
        ) : null}
        {latestModerationDate ? (
          <View style={styles.metaRow}>
            <Ionicons
              name="checkmark-done-outline"
              size={15}
              color={mobileTheme.colors.primary}
            />
            <Text style={styles.metaText}>
              Last reviewed {latestModerationDate}
            </Text>
          </View>
        ) : null}
      </View>
      {item.latestRejectionNote ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Latest moderator note</Text>
          <Text style={styles.noteText}>{item.latestRejectionNote}</Text>
        </View>
      ) : null}
      {item.duplicateOfItemTitle ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Marked duplicate of</Text>
          <Text style={styles.noteText}>{item.duplicateOfItemTitle}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: mobileTheme.spacing.sm,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surface,
    padding: mobileTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: mobileTheme.spacing.sm,
  },
  badge: {
    borderRadius: mobileTheme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize.md,
    fontWeight: "700",
    lineHeight: 24,
  },
  metaList: {
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    color: mobileTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  noteCard: {
    gap: 4,
    borderRadius: 14,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    padding: mobileTheme.spacing.md,
  },
  noteLabel: {
    color: mobileTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  noteText: {
    color: mobileTheme.colors.textSecondary,
    lineHeight: 20,
  },
});
