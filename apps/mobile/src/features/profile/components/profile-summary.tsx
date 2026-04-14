import { useState } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getReputationTitle } from "@drop-senpai/lib";

import { mobileTheme } from "../../../constants/theme";

interface ProfileSummaryProps {
  email: string;
  displayName?: string | null;
  reputationPoints?: number;
  isVerifiedOrganizer?: boolean;
  onSignOut: () => Promise<void>;
  onUpdateDisplayName?: (name: string) => void;
}

export function ProfileSummary({
  email,
  displayName,
  reputationPoints,
  isVerifiedOrganizer,
  onSignOut,
  onUpdateDisplayName,
}: ProfileSummaryProps) {
  const reputation = reputationPoints ?? 0;
  const { title } = getReputationTitle(reputation);
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(displayName ?? "");

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateDisplayName && nameValue.trim() !== (displayName ?? "")) {
      onUpdateDisplayName(nameValue.trim());
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Profile</Text>

      {isEditing ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.nameInput}
            value={nameValue}
            onChangeText={setNameValue}
            placeholder="Display name"
            placeholderTextColor={mobileTheme.colors.textMuted}
            autoFocus
            maxLength={50}
            onBlur={handleSave}
            onSubmitEditing={handleSave}
          />
        </View>
      ) : (
        <Pressable onPress={() => setIsEditing(true)} style={styles.nameRow}>
          <Text style={styles.displayName}>{displayName || email}</Text>
          <Ionicons
            name="pencil"
            size={14}
            color={mobileTheme.colors.textMuted}
          />
        </Pressable>
      )}

      {!displayName && !isEditing ? (
        <Text style={styles.emailSubtext}>{email}</Text>
      ) : null}

      <View style={styles.badgeRow}>
        <View style={styles.reputationBadge}>
          <Text style={styles.reputationBadgeText}>{title}</Text>
        </View>
        <Text style={styles.reputationPoints}>{reputation} pts</Text>
        {isVerifiedOrganizer ? (
          <View style={styles.organizerBadge}>
            <Ionicons
              name="checkmark-circle"
              size={12}
              color={mobileTheme.colors.accent}
            />
            <Text style={styles.organizerText}>Verified Organizer</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.description}>
        Your account now owns submissions and bookmarks.
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/profile/submissions")}
        >
          <Text style={styles.primaryButtonText}>My submissions</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => void onSignOut()}
        >
          <Text style={styles.secondaryButtonText}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: mobileTheme.spacing.lg,
    backgroundColor: mobileTheme.colors.surface,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    gap: mobileTheme.spacing.sm,
  },
  eyebrow: {
    color: mobileTheme.colors.primary,
    textTransform: "uppercase",
    fontSize: mobileTheme.fontSize.sm,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: mobileTheme.spacing.sm,
  },
  displayName: {
    color: mobileTheme.colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  emailSubtext: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.sm,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameInput: {
    flex: 1,
    color: mobileTheme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: mobileTheme.colors.primary,
    paddingVertical: 4,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: mobileTheme.spacing.sm,
    flexWrap: "wrap",
  },
  reputationBadge: {
    borderRadius: mobileTheme.radius.full,
    backgroundColor: "rgba(19, 205, 212, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  reputationBadgeText: {
    color: mobileTheme.colors.accent,
    fontSize: mobileTheme.fontSize.xs,
    fontWeight: "700",
  },
  reputationPoints: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.sm,
  },
  organizerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: mobileTheme.radius.full,
    backgroundColor: "rgba(19, 205, 212, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  organizerText: {
    color: mobileTheme.colors.accent,
    fontSize: mobileTheme.fontSize.xs,
    fontWeight: "700",
  },
  description: {
    color: mobileTheme.colors.textMuted,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  primaryButton: {
    borderRadius: mobileTheme.radius.lg,
    backgroundColor: mobileTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: mobileTheme.colors.text,
    fontWeight: "700",
  },
});
