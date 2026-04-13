import { StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../constants/theme";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
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
    gap: mobileTheme.spacing.sm
  },
  title: {
    color: mobileTheme.colors.text,
    fontSize: 20,
    fontWeight: "700"
  },
  description: {
    color: mobileTheme.colors.textMuted,
    lineHeight: 22
  }
});
