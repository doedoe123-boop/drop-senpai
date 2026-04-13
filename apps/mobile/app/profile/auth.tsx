import { ScrollView, StyleSheet } from "react-native";

import { ScreenHeader } from "../../src/components/screen-header";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { AuthForm } from "../../src/features/auth/components/auth-form";

export default function AuthEntryScreen() {
  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Sign in to DropSenpai"
          description="Save items, submit events, and manage your profile."
        />
        <AuthForm />
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing.lg,
  },
});
