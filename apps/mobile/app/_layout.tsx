import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { mobileTheme } from "../src/constants/theme";
import { AuthProvider } from "../src/providers/auth-provider";
import { QueryProvider } from "../src/providers/query-provider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <AuthProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: mobileTheme.colors.background,
                },
                headerStyle: {
                  backgroundColor: mobileTheme.colors.background,
                },
                headerTintColor: mobileTheme.colors.text,
                headerTitleStyle: {
                  fontWeight: "700",
                },
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="profile/auth"
                options={{ headerShown: true, title: "Sign In" }}
              />
              <Stack.Screen
                name="profile/submissions"
                options={{ headerShown: true, title: "My Submissions" }}
              />
            </Stack>
          </AuthProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
