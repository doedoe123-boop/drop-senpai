import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { mobileTheme } from "../constants/theme";

interface ScreenShellProps {
  /** Skip horizontal padding (e.g. when a FlatList manages its own padding) */
  noPadding?: boolean;
}

export function ScreenShell({
  children,
  noPadding,
}: PropsWithChildren<ScreenShellProps>) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={[styles.content, noPadding && styles.noPadding]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingTop: mobileTheme.spacing.lg,
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});
