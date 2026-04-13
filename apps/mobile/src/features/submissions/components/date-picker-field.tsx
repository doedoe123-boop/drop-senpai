import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Pressable, Platform, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";

import { mobileTheme } from "../../../constants/theme";

interface DatePickerFieldProps {
  value: string | null | undefined;
  onChange: (value: string | undefined) => void;
}

type AndroidPickerStep = "date" | "time";

function normalizeSelectedDate(date: Date): string {
  return date.toISOString();
}

function parseDateValue(value: string | null | undefined): Date {
  if (!value) {
    return new Date();
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}

function formatReadableDateTime(value: string | null | undefined): string {
  if (!value) {
    return "Select event date and time";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Select event date and time";
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [androidStep, setAndroidStep] = useState<AndroidPickerStep>("date");
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const selectedDate = useMemo(() => parseDateValue(value), [value]);

  const handleChange = (event: DateTimePickerEvent, pickedDate?: Date) => {
    if (event.type === "dismissed") {
      if (Platform.OS === "android") {
        setIsOpen(false);
        setAndroidStep("date");
        setDraftDate(null);
      }
      return;
    }

    if (!pickedDate) {
      return;
    }

    if (Platform.OS === "ios") {
      onChange(normalizeSelectedDate(pickedDate));
      return;
    }

    if (androidStep === "date") {
      const nextDraftDate = new Date(pickedDate);
      const baseDate = draftDate ?? selectedDate;

      nextDraftDate.setHours(baseDate.getHours());
      nextDraftDate.setMinutes(baseDate.getMinutes());
      nextDraftDate.setSeconds(0);
      nextDraftDate.setMilliseconds(0);

      setDraftDate(nextDraftDate);
      setAndroidStep("time");
      return;
    }

    const finalizedDate = new Date(draftDate ?? selectedDate);
    finalizedDate.setHours(pickedDate.getHours());
    finalizedDate.setMinutes(pickedDate.getMinutes());
    finalizedDate.setSeconds(0);
    finalizedDate.setMilliseconds(0);

    onChange(normalizeSelectedDate(finalizedDate));
    setDraftDate(null);
    setAndroidStep("date");
    setIsOpen(false);
  };

  const handleOpen = () => {
    setDraftDate(selectedDate);
    setAndroidStep("date");
    setIsOpen(true);
  };

  const handleClose = () => {
    setDraftDate(null);
    setAndroidStep("date");
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.trigger} onPress={handleOpen}>
        <Text
          style={[styles.triggerText, !value ? styles.placeholderText : null]}
        >
          {formatReadableDateTime(value)}
        </Text>
      </Pressable>
      {value ? (
        <Pressable onPress={() => onChange(undefined)} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear date and time</Text>
        </Pressable>
      ) : null}
      {isOpen ? (
        Platform.OS === "ios" ? (
          <View style={styles.iosPickerCard}>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="spinner"
              onChange={handleChange}
            />
            <Pressable style={styles.doneButton} onPress={handleClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        ) : (
          <DateTimePicker
            value={androidStep === "time" ? draftDate ?? selectedDate : selectedDate}
            mode={androidStep}
            display="default"
            onChange={handleChange}
          />
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: mobileTheme.spacing.sm,
  },
  trigger: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  triggerText: {
    color: mobileTheme.colors.text,
    fontSize: 15,
  },
  placeholderText: {
    color: mobileTheme.colors.textMuted,
  },
  clearButton: {
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: mobileTheme.colors.primary,
    fontWeight: "700",
  },
  iosPickerCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surface,
    paddingVertical: mobileTheme.spacing.sm,
    overflow: "hidden",
  },
  doneButton: {
    alignSelf: "flex-end",
    marginHorizontal: mobileTheme.spacing.md,
    marginTop: mobileTheme.spacing.sm,
    borderRadius: 12,
    backgroundColor: mobileTheme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  doneButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
