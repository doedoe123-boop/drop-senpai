import { FlatList, RefreshControl, StyleSheet } from "react-native";

import { AnimatedEntrance } from "../../src/components/animated-entrance";
import { EmptyState } from "../../src/components/empty-state";
import { ErrorState } from "../../src/components/error-state";
import { LoadingState } from "../../src/components/loading-state";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { AuthGate } from "../../src/features/auth/components/auth-gate";
import { useAuth } from "../../src/features/auth/hooks/use-auth";
import { SubmissionCard } from "../../src/features/profile/components/submission-card";
import { useMySubmissions } from "../../src/features/profile/hooks/use-my-submissions";

export default function MySubmissionsScreen() {
  const { user } = useAuth();
  const mySubmissions = useMySubmissions(user?.id);

  return (
    <ScreenShell>
      <AuthGate>
        {mySubmissions.isLoading ? (
          <LoadingState
            variant="list"
            label="Loading your submissions..."
          />
        ) : null}
        {mySubmissions.isError ? (
          <AnimatedEntrance>
            <ErrorState
              title="Could not load your submissions"
              description="Try again after checking your connection."
              onRetry={() => mySubmissions.refetch()}
            />
          </AnimatedEntrance>
        ) : null}
        {mySubmissions.isSuccess && mySubmissions.data.length === 0 ? (
          <AnimatedEntrance>
            <EmptyState
              title="No submissions yet"
              description="Once you submit an event or drop, it will appear here with its current status."
            />
          </AnimatedEntrance>
        ) : null}
        {mySubmissions.isSuccess && mySubmissions.data.length > 0 ? (
          <FlatList
            data={mySubmissions.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={mySubmissions.isFetching && !mySubmissions.isLoading}
                onRefresh={() => void mySubmissions.refetch()}
                tintColor={mobileTheme.colors.textMuted}
              />
            }
            renderItem={({ item, index }) => (
              <AnimatedEntrance delay={index * 45} distance={14}>
                <SubmissionCard item={item} />
              </AnimatedEntrance>
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : null}
      </AuthGate>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing.lg,
  },
});
