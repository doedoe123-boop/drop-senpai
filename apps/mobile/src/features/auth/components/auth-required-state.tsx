import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../../../constants/theme";

export function AuthRequiredState() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sign in to continue</Text>
      <Text style={styles.description}>
        Sign in to save items, submit events, and manage your profile.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/profile/auth")}
      >
        <Text style={styles.buttonText}>Continue to sign in</Text>
      </Pressable>
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
    fontSize: 22,
    fontWeight: "700",
  },
  description: {
    color: mobileTheme.colors.textMuted,
    lineHeight: 22,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: mobileTheme.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: mobileTheme.colors.primary,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
