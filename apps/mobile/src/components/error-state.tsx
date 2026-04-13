import { Pressable, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../constants/theme";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry ? (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      ) : null}
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
  title: {
    color: mobileTheme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    color: mobileTheme.colors.textMuted,
    lineHeight: 22,
  },
  button: {
    marginTop: mobileTheme.spacing.sm,
    alignSelf: "flex-start",
    borderRadius: mobileTheme.radius.lg,
    backgroundColor: mobileTheme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
