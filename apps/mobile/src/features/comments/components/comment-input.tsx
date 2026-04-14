import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { mobileTheme } from "../../../constants/theme";

interface CommentInputProps {
  onSubmit: (body: string) => void;
  isSubmitting: boolean;
}

const MAX_COMMENT_LENGTH = 1000;

export function CommentInput({ onSubmit, isSubmitting }: CommentInputProps) {
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const canSend =
    trimmed.length > 0 && trimmed.length <= MAX_COMMENT_LENGTH && !isSubmitting;

  const handleSend = () => {
    if (!canSend) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        placeholderTextColor={mobileTheme.colors.textMuted}
        value={text}
        onChangeText={setText}
        maxLength={MAX_COMMENT_LENGTH}
        multiline
        editable={!isSubmitting}
      />
      <Pressable
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend}
        hitSlop={8}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Ionicons
            name="send"
            size={18}
            color={canSend ? "#ffffff" : mobileTheme.colors.textMuted}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: mobileTheme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: mobileTheme.colors.surface,
    borderRadius: mobileTheme.radius.lg,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    paddingHorizontal: mobileTheme.spacing.lg,
    paddingVertical: mobileTheme.spacing.md,
    color: mobileTheme.colors.text,
    fontSize: mobileTheme.fontSize.base,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: mobileTheme.radius.full,
    backgroundColor: mobileTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: mobileTheme.colors.secondary,
  },
});
