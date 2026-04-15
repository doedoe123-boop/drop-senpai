import { useCallback, useRef } from "react";
import {
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { AnimatedEntrance } from "../../src/components/animated-entrance";
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

function StickyHomeHeader() {
  return (
    <View style={styles.stickyHeader}>
      <Text style={styles.headerEyebrow}>Anime & Pop Culture PH</Text>
      <Text style={styles.headerTitle}>Discover what&apos;s worth showing up for</Text>
      <Text style={styles.headerDescription}>
        Featured picks, upcoming events, and trusted merch drops.
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const featured = useFeaturedItems();
  const events = useUpcomingEvents();
  const drops = useLatestDrops();
  const scrollY = useRef(new Animated.Value(0)).current;

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
      <ScreenShell noPadding>
        <LoadingState variant="feed" label="Loading feed..." />
      </ScreenShell>
    );
  }

  if (isError) {
    return (
      <ScreenShell noPadding>
        <Animated.ScrollView
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[0]}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <StickyHomeHeader />
          <ErrorState
            title="Could not load the feed"
            description="Check your connection and pull to refresh."
            onRetry={refetchAll}
          />
        </Animated.ScrollView>
      </ScreenShell>
    );
  }

  if (isEmpty) {
    return (
      <ScreenShell noPadding>
        <Animated.ScrollView
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[0]}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <StickyHomeHeader />
          <EmptyState
            title="No approved items yet"
            description="Items will appear here once approved by an admin."
          />
        </Animated.ScrollView>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell noPadding>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        refreshControl={refreshControl}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <StickyHomeHeader />

        {(featured.data ?? []).length > 0 ? (
          <View style={styles.section}>
            <SectionLabel label="★ Featured" />
            <View style={styles.cardList}>
              {(featured.data ?? []).map((item, index) => (
                <AnimatedEntrance
                  key={item.id}
                  delay={index * 60}
                  distance={18}
                >
                  <ItemCard item={item} />
                </AnimatedEntrance>
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
              {(events.data ?? []).map((item, index) => (
                <AnimatedEntrance
                  key={item.id}
                  delay={80 + index * 50}
                  distance={16}
                >
                  <ItemCard item={item} />
                </AnimatedEntrance>
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
              {(drops.data ?? []).map((item, index) => (
                <AnimatedEntrance
                  key={item.id}
                  delay={120 + index * 50}
                  distance={16}
                >
                  <ItemCard item={item} />
                </AnimatedEntrance>
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingTop: mobileTheme.spacing.md,
    gap: mobileTheme.spacing.xl,
    paddingBottom: mobileTheme.spacing["2xl"],
  },
  stickyHeader: {
    gap: mobileTheme.spacing.xs,
    marginHorizontal: -mobileTheme.spacing.lg,
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingTop: mobileTheme.spacing.lg,
    paddingBottom: mobileTheme.spacing.md,
    backgroundColor: "rgba(13, 15, 23, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(39, 44, 61, 0.72)",
  },
  headerEyebrow: {
    color: mobileTheme.colors.accent,
    fontSize: mobileTheme.fontSize.sm,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize["2xl"],
    fontWeight: "800",
    lineHeight: 34,
  },
  headerDescription: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
    lineHeight: 21,
    maxWidth: 320,
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
