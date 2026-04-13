import { StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../constants/theme";

interface ScreenHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function ScreenHeader({
  title,
  description,
  eyebrow,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.xs,
    paddingBottom: mobileTheme.spacing.sm,
  },
  eyebrow: {
    color: mobileTheme.colors.textMuted,
    fontWeight: "600",
    fontSize: mobileTheme.fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize.lg,
    fontWeight: "700",
    lineHeight: 24,
  },
  description: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
    lineHeight: 20,
  },
});
