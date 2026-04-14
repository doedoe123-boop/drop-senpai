import { ScrollView, StyleSheet } from "react-native";

import { LoadingState } from "../../src/components/loading-state";
import { ScreenHeader } from "../../src/components/screen-header";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { AuthForm } from "../../src/features/auth/components/auth-form";
import { useAuth } from "../../src/features/auth/hooks/use-auth";
import { ProfileSummary } from "../../src/features/profile/components/profile-summary";
import { useUserProfile } from "../../src/features/profile/hooks/use-user-profile";
import { useUpdateDisplayName } from "../../src/features/profile/hooks/use-update-display-name";

export default function ProfileScreen() {
  const { isLoading, user, signOut } = useAuth();
  const { data: profile } = useUserProfile(user?.id);
  const updateDisplayName = useUpdateDisplayName(user?.id);

  return (
    <ScreenShell>
      {isLoading ? <LoadingState label="Loading profile..." /> : null}
      {!isLoading ? (
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader
            title="Profile"
            description={
              user
                ? undefined
                : "Sign in to save items, submit events, and manage your profile."
            }
          />
          {user ? (
            <ProfileSummary
              email={user.email ?? "No email available"}
              displayName={profile?.display_name}
              reputationPoints={profile?.reputation_points}
              isVerifiedOrganizer={profile?.is_verified_organizer}
              onSignOut={signOut}
              onUpdateDisplayName={(name) => updateDisplayName.mutate(name)}
            />
          ) : (
            <AuthForm />
          )}
        </ScrollView>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing.lg,
  },
});
