import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { mobileTheme } from "../../../constants/theme";

interface ExploreFiltersProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  type: "all" | "event" | "drop";
  onTypeChange: (value: "all" | "event" | "drop") => void;
  region: string;
  onRegionChange: (value: string) => void;
  availableRegions: string[];
  tag: string;
  onTagChange: (value: string) => void;
  onReset: () => void;
}

export function ExploreFilters({
  searchText,
  onSearchTextChange,
  type,
  onTypeChange,
  region,
  onRegionChange,
  availableRegions,
  tag,
  onTagChange,
  onReset,
}: ExploreFiltersProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by title"
        placeholderTextColor={mobileTheme.colors.textMuted}
        value={searchText}
        onChangeText={onSearchTextChange}
        style={styles.input}
      />
      <View style={styles.segmentedControl}>
        {(["all", "event", "drop"] as const).map((option) => (
          <Pressable
            key={option}
            style={[
              styles.segment,
              type === option ? styles.segmentActive : null,
            ]}
            onPress={() => onTypeChange(option)}
          >
            <Text
              style={[
                styles.segmentText,
                type === option ? styles.segmentTextActive : null,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionRow}
      >
        <Pressable
          style={[
            styles.regionChip,
            region === "" ? styles.regionChipActive : null,
          ]}
          onPress={() => onRegionChange("")}
        >
          <Text
            style={[
              styles.regionChipText,
              region === "" ? styles.regionChipTextActive : null,
            ]}
          >
            All regions
          </Text>
        </Pressable>
        {availableRegions.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.regionChip,
              region === option ? styles.regionChipActive : null,
            ]}
            onPress={() => onRegionChange(option)}
          >
            <Text
              style={[
                styles.regionChipText,
                region === option ? styles.regionChipTextActive : null,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <TextInput
        placeholder="Optional tag filter"
        placeholderTextColor={mobileTheme.colors.textMuted}
        value={tag}
        onChangeText={onTagChange}
        style={styles.input}
      />
      <Pressable style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Reset filters</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.sm,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    color: mobileTheme.colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 10,
  },
  segment: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    paddingVertical: 12,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "rgba(239, 77, 158, 0.12)",
    borderColor: mobileTheme.colors.primary,
  },
  segmentText: {
    color: mobileTheme.colors.textMuted,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  segmentTextActive: {
    color: mobileTheme.colors.primary,
  },
  regionRow: {
    gap: 8,
    paddingRight: mobileTheme.spacing.md,
  },
  regionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: mobileTheme.colors.surfaceMuted,
  },
  regionChipActive: {
    borderColor: mobileTheme.colors.primary,
    backgroundColor: "rgba(239, 77, 158, 0.12)",
  },
  regionChipText: {
    color: mobileTheme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  regionChipTextActive: {
    color: mobileTheme.colors.primary,
  },
  resetButton: {
    alignSelf: "flex-start",
  },
  resetButtonText: {
    color: mobileTheme.colors.accent,
    fontWeight: "700",
  },
});
