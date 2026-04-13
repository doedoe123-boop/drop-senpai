import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../../../constants/theme";

interface ProfileSummaryProps {
  email: string;
  onSignOut: () => Promise<void>;
}

export function ProfileSummary({ email, onSignOut }: ProfileSummaryProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Profile</Text>
      <Text style={styles.email}>{email}</Text>
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
  email: {
    color: mobileTheme.colors.text,
    fontSize: 22,
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
