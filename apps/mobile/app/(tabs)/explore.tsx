import { useCallback, useDeferredValue, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { EmptyState } from "../../src/components/empty-state";
import { ErrorState } from "../../src/components/error-state";
import { AnimatedEntrance } from "../../src/components/animated-entrance";
import { LoadingState } from "../../src/components/loading-state";
import { ScreenHeader } from "../../src/components/screen-header";
import { ScreenShell } from "../../src/components/screen-shell";
import { mobileTheme } from "../../src/constants/theme";
import { ExploreFilters } from "../../src/features/explore/components/explore-filters";
import { useApprovedRegions } from "../../src/features/explore/hooks/use-approved-regions";
import { useExploreItems } from "../../src/features/explore/hooks/use-explore-items";
import { ItemCard } from "../../src/features/items/components/item-card";

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");
  const [type, setType] = useState<"all" | "event" | "drop">("all");
  const [region, setRegion] = useState("");
  const [tag, setTag] = useState("");
  const deferredSearchText = useDeferredValue(searchText);
  const deferredTag = useDeferredValue(tag);

  const exploreItems = useExploreItems({
    searchText: deferredSearchText,
    type,
    region,
    tag: deferredTag,
  });
  const approvedRegions = useApprovedRegions();

  // Refetch when the tab gains focus
  useFocusEffect(
    useCallback(() => {
      void exploreItems.refetch();
      void approvedRegions.refetch();
    }, []),
  );

  const resetFilters = () => {
    setSearchText("");
    setType("all");
    setRegion("");
    setTag("");
  };

  const header = (
    <View style={styles.header}>
      <ScreenHeader
        title="Explore"
        description="Search and filter approved items."
      />
      <ExploreFilters
        searchText={searchText}
        onSearchTextChange={setSearchText}
        type={type}
        onTypeChange={setType}
        region={region}
        onRegionChange={setRegion}
        availableRegions={approvedRegions.data ?? []}
        tag={tag}
        onTagChange={setTag}
        onReset={resetFilters}
      />
    </View>
  );

  const refreshControl = (
    <RefreshControl
      refreshing={exploreItems.isFetching && !exploreItems.isLoading}
      onRefresh={() => {
        void exploreItems.refetch();
        void approvedRegions.refetch();
      }}
      tintColor={mobileTheme.colors.textMuted}
    />
  );

  return (
    <ScreenShell>
      {exploreItems.isLoading ? (
        <LoadingState
          variant="list"
          label="Searching approved items..."
        />
      ) : null}
      {exploreItems.isError ? (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedEntrance>
            {header}
            <ErrorState
              title="Could not load explore results"
              description="Check your connection and try again."
              onRetry={() => exploreItems.refetch()}
            />
          </AnimatedEntrance>
        </ScrollView>
      ) : null}
      {exploreItems.isSuccess && exploreItems.data.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
        >
          <AnimatedEntrance>
            {header}
            <EmptyState
              title="No matching items"
              description="Try clearing one or two filters to widen the results."
            />
          </AnimatedEntrance>
        </ScrollView>
      ) : null}
      {exploreItems.isSuccess && exploreItems.data.length > 0 ? (
        <FlatList
          data={exploreItems.data}
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
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: mobileTheme.spacing.md,
    paddingBottom: mobileTheme.spacing.lg,
  },
  header: {
    gap: mobileTheme.spacing.md,
  },
  description: {
    color: mobileTheme.colors.textMuted,
    lineHeight: 22,
  },
});
