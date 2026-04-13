import * as ImagePicker from "expo-image-picker";

import { supabase } from "../../../lib/supabase";

const ITEM_IMAGES_BUCKET = "item-images";

export interface PickedImageAsset {
  fileName: string;
  mimeType: string;
  uri: string;
}

export async function pickImageFromLibrary(): Promise<PickedImageAsset | null> {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error("Media library permission is required to upload an image.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    fileName: asset.fileName ?? `item-image-${Date.now()}.jpg`,
    mimeType: asset.mimeType ?? "image/jpeg"
  };
}

export async function uploadSubmissionImage(userId: string, image: PickedImageAsset): Promise<string> {
  const filePath = `${userId}/${Date.now()}-${sanitizeFileName(image.fileName)}`;
  const response = await fetch(image.uri);
  const imageBytes = await response.arrayBuffer();

  const { error } = await supabase.storage.from(ITEM_IMAGES_BUCKET).upload(filePath, imageBytes, {
    contentType: image.mimeType,
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(ITEM_IMAGES_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}
