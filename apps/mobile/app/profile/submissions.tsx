import { FlatList, RefreshControl, StyleSheet } from "react-native";

import { EmptyState } from "../../src/components/empty-state";
import { ErrorState } from "../../src/components/error-state";
import { LoadingState } from "../../src/components/loading-state";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { AuthGate } from "../../src/features/auth/components/auth-gate";
import { useAuth } from "../../src/features/auth/hooks/use-auth";
import { ItemCard } from "../../src/features/items/components/item-card";
import { useMySubmissions } from "../../src/features/profile/hooks/use-my-submissions";

export default function MySubmissionsScreen() {
  const { user } = useAuth();
  const mySubmissions = useMySubmissions(user?.id);

  return (
    <ScreenShell>
      <AuthGate>
        {mySubmissions.isLoading ? (
          <LoadingState label="Loading your submissions..." />
        ) : null}
        {mySubmissions.isError ? (
          <ErrorState
            title="Could not load your submissions"
            description="Try again after checking your connection."
            onRetry={() => mySubmissions.refetch()}
          />
        ) : null}
        {mySubmissions.isSuccess && mySubmissions.data.length === 0 ? (
          <EmptyState
            title="No submissions yet"
            description="Once you submit an event or drop, it will appear here with its current status."
          />
        ) : null}
        {mySubmissions.isSuccess && mySubmissions.data.length > 0 ? (
          <FlatList
            data={mySubmissions.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={mySubmissions.isLoading}
                onRefresh={() => void mySubmissions.refetch()}
              />
            }
            renderItem={({ item }) => <ItemCard item={item} />}
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
