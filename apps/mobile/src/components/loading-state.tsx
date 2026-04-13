import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../constants/theme";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={mobileTheme.colors.primary} />
      <Text style={styles.label}>{label}</Text>
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
});
