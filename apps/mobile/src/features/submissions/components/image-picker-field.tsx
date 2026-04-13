import { Pressable, StyleSheet, Text, View, Image } from "react-native";

import { mobileTheme } from "../../../constants/theme";
import type { PickedImageAsset } from "../utils/image-upload";

interface ImagePickerFieldProps {
  image: PickedImageAsset | null;
  imageUrlFallback: string;
  onPick: () => Promise<void>;
  onClear: () => void;
}

export function ImagePickerField({ image, imageUrlFallback, onPick, onClear }: ImagePickerFieldProps) {
  const previewUri = image?.uri ?? (imageUrlFallback || null);

  return (
    <View style={styles.container}>
      {previewUri ? (
        <Image source={{ uri: previewUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackTitle}>No image selected</Text>
          <Text style={styles.fallbackText}>Uploads are optional. You can pick an image or keep using a direct image URL.</Text>
        </View>
      )}
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={() => void onPick()}>
          <Text style={styles.buttonText}>{previewUri ? "Replace image" : "Pick image"}</Text>
        </Pressable>
        {previewUri ? (
          <Pressable style={styles.secondaryButton} onPress={onClear}>
            <Text style={styles.secondaryButtonText}>Remove image</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.sm
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    backgroundColor: mobileTheme.colors.surface
  },
  fallback: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    padding: mobileTheme.spacing.md,
    gap: 8
  },
  fallbackTitle: {
    color: mobileTheme.colors.text,
    fontWeight: "700"
  },
  fallbackText: {
    color: mobileTheme.colors.textMuted,
    lineHeight: 20
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap"
  },
  button: {
    borderRadius: 14,
    backgroundColor: mobileTheme.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  buttonText: {
    color: "#21131d",
    fontWeight: "700"
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  secondaryButtonText: {
    color: mobileTheme.colors.text,
    fontWeight: "700"
  }
});
