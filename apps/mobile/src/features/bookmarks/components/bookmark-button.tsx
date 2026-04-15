import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { mobileTheme } from "../../../constants/theme";
import { useAuth } from "../../auth/hooks/use-auth";
import { useBookmarkState, useToggleBookmark } from "../hooks/use-bookmark-state";

interface BookmarkButtonProps {
  itemId: string;
  variant?: "full" | "icon";
}

export function BookmarkButton({
  itemId,
  variant = "full",
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const bookmarkState = useBookmarkState(user?.id, itemId);
  const toggleBookmark = useToggleBookmark(user?.id, itemId);

  const handlePress = async () => {
    if (!user) {
      router.push("/profile/auth");
      return;
    }

    await toggleBookmark.mutateAsync(!bookmarkState.data);
  };

  const isSaved = Boolean(bookmarkState.data);
  const isIcon = variant === "icon";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isIcon ? styles.iconButton : null,
        pressed ? styles.buttonPressed : null,
      ]}
      onPress={() => void handlePress()}
      disabled={toggleBookmark.isPending}
    >
      {isIcon ? (
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={18}
          color={isSaved ? mobileTheme.colors.primary : mobileTheme.colors.text}
        />
      ) : (
        <View style={styles.fullButtonContent}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={18}
            color={isSaved ? mobileTheme.colors.primary : mobileTheme.colors.text}
          />
          <Text style={styles.buttonText}>
            {toggleBookmark.isPending
              ? "Saving..."
              : isSaved
                ? "Saved"
                : "Save item"}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mobileTheme.colors.surface,
  },
  iconButton: {
    width: 42,
    height: 42,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: mobileTheme.radius.full,
    backgroundColor: "rgba(13, 15, 23, 0.72)",
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  fullButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: mobileTheme.spacing.sm,
  },
  buttonText: {
    color: mobileTheme.colors.text,
    fontWeight: "700",
  },
});
