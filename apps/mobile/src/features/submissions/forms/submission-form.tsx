import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema } from "@drop-senpai/lib";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

import type { SubmissionSchemaInput } from "@drop-senpai/lib";
import type { SubmissionInput } from "@drop-senpai/types";

import { mobileTheme } from "../../../constants/theme";
import { useAuth } from "../../auth/hooks/use-auth";
import { DatePickerField } from "../components/date-picker-field";
import { ImagePickerField } from "../components/image-picker-field";
import { useCreateSubmission } from "../hooks/use-create-submission";
import {
  deleteUploadedSubmissionImage,
  pickImageFromLibrary,
  uploadSubmissionImage,
  type PickedImageAsset,
} from "../utils/image-upload";

const placeholderDefaults: SubmissionSchemaInput = {
  type: "event",
  title: "",
  source_url: "",
  image_url: "",
  description: "",
  event_date: "",
  location: "",
  city: "",
  region: "",
  tags: [],
};

function normalizeTagInput(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}

function cleanSubmissionPayload(input: SubmissionSchemaInput): SubmissionInput {
  const parsed = submissionSchema.parse({
    ...input,
    tags: input.tags ?? [],
  });

  return {
    type: parsed.type,
    title: parsed.title,
    source_url: parsed.source_url,
    description: parsed.description ?? null,
    image_url: parsed.image_url ?? null,
    event_date: parsed.event_date ?? null,
    location: parsed.location ?? null,
    city: parsed.city ?? null,
    region: parsed.region ?? null,
    tags: parsed.tags ?? [],
  };
}

export function SubmissionForm() {
  const { user } = useAuth();
  const [pickedImage, setPickedImage] = useState<PickedImageAsset | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionSchemaInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: placeholderDefaults,
  });
  const createSubmission = useCreateSubmission(user?.id);

  const onSubmit = handleSubmit(async (values) => {
    const normalizedInput = cleanSubmissionPayload(values);
    let imageUrl = normalizedInput.image_url ?? null;
    let uploadedImagePath: string | null = null;

    try {
      if (user?.id && pickedImage) {
        const uploadedImage = await uploadSubmissionImage(user.id, pickedImage);
        imageUrl = uploadedImage.publicUrl;
        uploadedImagePath = uploadedImage.path;
      }

      await createSubmission.mutateAsync({
        ...normalizedInput,
        image_url: imageUrl,
      });
      reset(placeholderDefaults);
      setPickedImage(null);
    } catch (error) {
      if (uploadedImagePath) {
        try {
          await deleteUploadedSubmissionImage(uploadedImagePath);
        } catch (cleanupError) {
          console.warn("Could not delete uploaded image after failed submission.", cleanupError);
        }
      }

      throw error;
    }
  });

  const handlePickImage = async () => {
    const image = await pickImageFromLibrary();

    if (image) {
      setPickedImage(image);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Type</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <View style={styles.segmentedControl}>
            {["event", "drop"].map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.segment,
                  value === option ? styles.segmentActive : null,
                ]}
                onPress={() => onChange(option)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    value === option ? styles.segmentTextActive : null,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />
      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Event or drop title"
            placeholderTextColor={mobileTheme.colors.textMuted}
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.title ? (
        <Text style={styles.error}>{errors.title.message}</Text>
      ) : null}
      <Text style={styles.label}>Source URL</Text>
      <Controller
        control={control}
        name="source_url"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="https://official-source.example"
            placeholderTextColor={mobileTheme.colors.textMuted}
            autoCapitalize="none"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.source_url ? (
        <Text style={styles.error}>{errors.source_url.message}</Text>
      ) : null}
      <Text style={styles.label}>Image</Text>
      <Controller
        control={control}
        name="image_url"
        render={({ field: { onChange, value } }) => (
          <View style={styles.imageSection}>
            <ImagePickerField
              image={pickedImage}
              imageUrlFallback={value ?? ""}
              onPick={handlePickImage}
              onClear={() => {
                setPickedImage(null);
                onChange("");
              }}
            />
            <TextInput
              placeholder="Optional image URL fallback"
              placeholderTextColor={mobileTheme.colors.textMuted}
              autoCapitalize="none"
              style={styles.input}
              onChangeText={onChange}
              value={value ?? ""}
            />
          </View>
        )}
      />
      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Add context, schedule notes, or drop details"
            placeholderTextColor={mobileTheme.colors.textMuted}
            multiline
            style={[styles.input, styles.multilineInput]}
            onChangeText={onChange}
            value={value ?? ""}
          />
        )}
      />
      <Text style={styles.label}>Event date</Text>
      <Controller
        control={control}
        name="event_date"
        render={({ field: { onChange, value } }) => (
          <DatePickerField value={value ?? undefined} onChange={onChange} />
        )}
      />
      <Text style={styles.label}>Location</Text>
      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Venue or shop name"
            placeholderTextColor={mobileTheme.colors.textMuted}
            style={styles.input}
            onChangeText={onChange}
            value={value ?? ""}
          />
        )}
      />
      <Text style={styles.label}>City</Text>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Quezon City"
            placeholderTextColor={mobileTheme.colors.textMuted}
            style={styles.input}
            onChangeText={onChange}
            value={value ?? ""}
          />
        )}
      />
      <Text style={styles.label}>Region</Text>
      <Controller
        control={control}
        name="region"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Metro Manila"
            placeholderTextColor={mobileTheme.colors.textMuted}
            style={styles.input}
            onChangeText={onChange}
            value={value ?? ""}
          />
        )}
      />
      <Text style={styles.label}>Tags</Text>
      <Controller
        control={control}
        name="tags"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="convention, cosplay, figures"
            placeholderTextColor={mobileTheme.colors.textMuted}
            style={styles.input}
            onChangeText={(text) => onChange(normalizeTagInput(text))}
            value={(value ?? []).join(", ")}
          />
        )}
      />
      {createSubmission.isSuccess ? (
        <Text style={styles.success}>
          Submission sent for review. It is now pending moderation.
        </Text>
      ) : null}
      {createSubmission.isError ? (
        <Text style={styles.error}>
          {createSubmission.error instanceof Error
            ? createSubmission.error.message
            : "Something went wrong while sending your submission."}
        </Text>
      ) : null}
      <Pressable
        style={styles.button}
        onPress={() => {
          Keyboard.dismiss();
          void onSubmit();
        }}
        disabled={createSubmission.isPending || !user}
      >
        <Text style={styles.buttonText}>
          {createSubmission.isPending ? "Submitting..." : "Submit for review"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: mobileTheme.spacing.sm,
  },
  imageSection: {
    gap: mobileTheme.spacing.sm,
  },
  label: {
    color: mobileTheme.colors.text,
    fontSize: 13,
    fontWeight: "700",
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
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
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
  button: {
    marginTop: mobileTheme.spacing.sm,
    borderRadius: mobileTheme.radius.lg,
    backgroundColor: mobileTheme.colors.primary,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  error: {
    color: "#ff9b9b",
    fontSize: 12,
  },
  success: {
    color: "#9ef0c2",
    fontSize: 13,
    lineHeight: 20,
  },
});
