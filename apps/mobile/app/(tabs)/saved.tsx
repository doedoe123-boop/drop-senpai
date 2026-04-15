import { useCallback } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";

import { EmptyState } from "../../src/components/empty-state";
import { ErrorState } from "../../src/components/error-state";
import { AnimatedEntrance } from "../../src/components/animated-entrance";
import { LoadingState } from "../../src/components/loading-state";
import { ScreenHeader } from "../../src/components/screen-header";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { AuthGate } from "../../src/features/auth/components/auth-gate";
import { useAuth } from "../../src/features/auth/hooks/use-auth";
import { useSavedItems } from "../../src/features/bookmarks/hooks/use-saved-items";
import { ItemCard } from "../../src/features/items/components/item-card";

const header = (
  <ScreenHeader title="Saved" description="Your bookmarked events and drops." />
);

export default function SavedScreen() {
  const { user } = useAuth();
  const savedItems = useSavedItems(user?.id);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        void savedItems.refetch();
      }
    }, [user]),
  );

  const refreshControl = (
    <RefreshControl
      refreshing={savedItems.isFetching && !savedItems.isLoading}
      onRefresh={() => void savedItems.refetch()}
      tintColor={mobileTheme.colors.textMuted}
    />
  );

  return (
    <ScreenShell>
      <AuthGate>
        {savedItems.isLoading ? (
          <LoadingState variant="list" label="Loading saved items..." />
        ) : null}
        {savedItems.isError ? (
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={refreshControl}
            showsVerticalScrollIndicator={false}
          >
            <AnimatedEntrance>
              {header}
              <ErrorState
                title="Could not load bookmarks"
                description="Try again after checking your connection."
                onRetry={() => savedItems.refetch()}
              />
            </AnimatedEntrance>
          </ScrollView>
        ) : null}
        {savedItems.isSuccess && savedItems.data.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={refreshControl}
            showsVerticalScrollIndicator={false}
          >
            <AnimatedEntrance>
              {header}
              <EmptyState
                title="No saved items yet"
                description="Use the save button on an item detail screen to build your watchlist."
              />
            </AnimatedEntrance>
          </ScrollView>
        ) : null}
        {savedItems.isSuccess && savedItems.data.length > 0 ? (
          <FlatList
            data={savedItems.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.content}
            ListHeaderComponent={header}
            renderItem={({ item, index }) => (
              <AnimatedEntrance delay={index * 45} distance={14}>
                <ItemCard item={item} />
              </AnimatedEntrance>
            )}
            refreshControl={refreshControl}
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
