import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

import { mobileTheme } from "../../src/constants/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconName;
  iconFocused: IoniconName;
}

const tabs: TabConfig[] = [
  { name: "index", title: "Home", icon: "home-outline", iconFocused: "home" },
  {
    name: "explore",
    title: "Explore",
    icon: "search-outline",
    iconFocused: "search",
  },
  {
    name: "submit",
    title: "Submit",
    icon: "add-circle-outline",
    iconFocused: "add-circle",
  },
  {
    name: "saved",
    title: "Saved",
    icon: "bookmark-outline",
    iconFocused: "bookmark",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "person-outline",
    iconFocused: "person",
  },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: mobileTheme.colors.primary,
        tabBarInactiveTintColor: mobileTheme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: mobileTheme.colors.surface,
          borderTopColor: mobileTheme.colors.border,
          borderTopWidth: 1,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={size ?? 22}
                color={color}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="items/[itemId]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
