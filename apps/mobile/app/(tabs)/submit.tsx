import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { ScreenHeader } from "../../src/components/screen-header";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { AuthGate } from "../../src/features/auth/components/auth-gate";
import { SubmissionForm } from "../../src/features/submissions/forms/submission-form";

export default function SubmitScreen() {
  return (
    <ScreenShell>
      <AuthGate>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <ScreenHeader
              title="Submit an event or drop"
              description="Share a trusted source link and the core details. Submissions are saved as pending for admin review."
            />
            <SubmissionForm />
          </ScrollView>
        </KeyboardAvoidingView>
      </AuthGate>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing["3xl"],
  },
});
