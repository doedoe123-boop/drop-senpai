import { useCallback } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { EmptyState } from "../../src/components/empty-state";
import { ErrorState } from "../../src/components/error-state";
import { LoadingState } from "../../src/components/loading-state";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { ItemCard } from "../../src/features/items/components/item-card";
import { useFeaturedItems } from "../../src/features/items/hooks/use-featured-items";
import { useLatestDrops } from "../../src/features/items/hooks/use-latest-drops";
import { useUpcomingEvents } from "../../src/features/items/hooks/use-upcoming-events";

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

export default function HomeScreen() {
  const featured = useFeaturedItems();
  const events = useUpcomingEvents();
  const drops = useLatestDrops();

  const refetchAll = () => {
    void featured.refetch();
    void events.refetch();
    void drops.refetch();
  };

  useFocusEffect(
    useCallback(() => {
      refetchAll();
    }, []),
  );

  const refreshControl = (
    <RefreshControl
      refreshing={
        (featured.isFetching || events.isFetching || drops.isFetching) &&
        !(featured.isLoading || events.isLoading || drops.isLoading)
      }
      onRefresh={refetchAll}
      tintColor={mobileTheme.colors.textMuted}
    />
  );

  const isLoading = featured.isLoading || events.isLoading || drops.isLoading;
  const isError = featured.isError || events.isError || drops.isError;
  const isEmpty =
    featured.isSuccess &&
    events.isSuccess &&
    drops.isSuccess &&
    featured.data.length === 0 &&
    events.data.length === 0 &&
    drops.data.length === 0;

  if (isLoading) {
    return (
      <ScreenShell>
        <LoadingState label="Loading feed..." />
      </ScreenShell>
    );
  }

  if (isError) {
    return (
      <ScreenShell>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={refreshControl}
        >
          <ErrorState
            title="Could not load the feed"
            description="Check your connection and pull to refresh."
            onRetry={refetchAll}
          />
        </ScrollView>
      </ScreenShell>
    );
  }

  if (isEmpty) {
    return (
      <ScreenShell>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={refreshControl}
        >
          <EmptyState
            title="No approved items yet"
            description="Items will appear here once approved by an admin."
          />
        </ScrollView>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={refreshControl}
      >
        {(featured.data ?? []).length > 0 ? (
          <View style={styles.section}>
            <SectionLabel label="★ Featured" />
            <View style={styles.cardList}>
              {(featured.data ?? []).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionLabel label="Upcoming Events" />
          {(events.data ?? []).length === 0 ? (
            <Text style={styles.emptyHint}>No upcoming events yet.</Text>
          ) : (
            <View style={styles.cardList}>
              {(events.data ?? []).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <SectionLabel label="Latest Drops" />
          {(drops.data ?? []).length === 0 ? (
            <Text style={styles.emptyHint}>No drops yet.</Text>
          ) : (
            <View style={styles.cardList}>
              {(drops.data ?? []).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: mobileTheme.spacing.xl,
    paddingBottom: mobileTheme.spacing["2xl"],
  },
  section: {
    gap: mobileTheme.spacing.md,
  },
  cardList: {
    gap: mobileTheme.spacing.md,
  },
  sectionLabel: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyHint: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
  },
});
