import { StyleSheet, Text, View } from "react-native";

import { getReputationTitle } from "@drop-senpai/lib";

import { mobileTheme } from "../../../constants/theme";

interface ReputationBadgeProps {
  points: number;
}

export function ReputationBadge({ points }: ReputationBadgeProps) {
  const { title } = getReputationTitle(points);

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: mobileTheme.radius.full,
    backgroundColor: "rgba(19, 205, 212, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    color: mobileTheme.colors.accent,
    fontSize: mobileTheme.fontSize.xs,
    fontWeight: "700",
  },
});
