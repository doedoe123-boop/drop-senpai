import { zodResolver } from "@hookform/resolvers/zod";
import { emailAuthSchema } from "@drop-senpai/lib";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

import type { EmailAuthInput } from "@drop-senpai/lib";

import { mobileTheme } from "../../../constants/theme";
import { useAuth } from "../hooks/use-auth";

type Step = "email" | "otp";

export function AuthForm() {
  const { signInWithEmail, verifyOtp } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailAuthInput>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues: { email: "" },
  });

  const onSendCode = handleSubmit(async (values) => {
    setIsSending(true);
    setSendError(null);
    try {
      await signInWithEmail(values.email);
      setSubmittedEmail(values.email);
      setCodeSent(true);
      setStep("otp");
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsSending(false);
    }
  });

  const onVerifyCode = async () => {
    const trimmed = otpValue.trim();
    if (trimmed.length !== 8 || !/^\d{8}$/.test(trimmed)) {
      setVerifyError("Enter a valid 8-digit code.");
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);
    try {
      await verifyOtp(submittedEmail, trimmed);
    } catch (err) {
      setVerifyError(
        err instanceof Error ? err.message : "Invalid code. Try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const onResendCode = async () => {
    setIsSending(true);
    setSendError(null);
    setVerifyError(null);
    try {
      await signInWithEmail(submittedEmail);
      setCodeSent(true);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Could not resend code.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const onChangeEmail = () => {
    setStep("email");
    setOtpValue("");
    setVerifyError(null);
    setCodeSent(false);
  };

  if (step === "otp") {
    return (
      <View style={styles.form}>
        <Text style={styles.helperText}>
          Enter the 8-digit code sent to{" "}
          <Text style={styles.emailHighlight}>{submittedEmail}</Text>.
        </Text>
        <TextInput
          placeholder="00000000"
          placeholderTextColor={mobileTheme.colors.textMuted}
          keyboardType="number-pad"
          maxLength={8}
          style={[styles.input, styles.otpInput]}
          onChangeText={setOtpValue}
          value={otpValue}
          editable={!isVerifying}
          autoFocus
        />
        {verifyError ? <Text style={styles.error}>{verifyError}</Text> : null}
        <Pressable
          style={[styles.button, isVerifying ? styles.buttonDisabled : null]}
          onPress={() => void onVerifyCode()}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Verify code</Text>
          )}
        </Pressable>
        <View style={styles.secondaryActions}>
          <Pressable onPress={() => void onResendCode()} disabled={isSending}>
            <Text style={styles.linkText}>
              {isSending ? "Sending…" : "Resend code"}
            </Text>
          </Pressable>
          <Pressable onPress={onChangeEmail}>
            <Text style={styles.linkText}>Use a different email</Text>
          </Pressable>
        </View>
        {sendError ? <Text style={styles.error}>{sendError}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.helperText}>
        Enter your email and we'll send you a sign-in code.
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={mobileTheme.colors.textMuted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            editable={!isSending}
          />
        )}
      />
      {errors.email ? (
        <Text style={styles.error}>{errors.email.message}</Text>
      ) : null}
      {sendError ? <Text style={styles.error}>{sendError}</Text> : null}
      {codeSent ? (
        <Text style={styles.success}>
          Check your email for your sign-in code.
        </Text>
      ) : null}
      <Pressable
        style={[styles.button, isSending ? styles.buttonDisabled : null]}
        onPress={onSendCode}
        disabled={isSending}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Send code</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: mobileTheme.spacing.md,
  },
  helperText: {
    color: mobileTheme.colors.textMuted,
    fontSize: mobileTheme.fontSize.base,
    lineHeight: 20,
  },
  emailHighlight: {
    color: mobileTheme.colors.text,
    fontWeight: "600",
  },
  input: {
    borderRadius: mobileTheme.radius.lg,
    borderWidth: 1,
    borderColor: mobileTheme.colors.border,
    backgroundColor: mobileTheme.colors.surfaceMuted,
    color: mobileTheme.colors.text,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: mobileTheme.fontSize.base,
  },
  otpInput: {
    fontSize: mobileTheme.fontSize.xl,
    letterSpacing: 8,
    textAlign: "center",
    fontWeight: "700",
  },
  button: {
    borderRadius: mobileTheme.radius.lg,
    backgroundColor: mobileTheme.colors.primary,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: mobileTheme.fontSize.base,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    color: mobileTheme.colors.accent,
    fontSize: mobileTheme.fontSize.sm,
    fontWeight: "600",
  },
  error: {
    color: "#ff9b9b",
    fontSize: mobileTheme.fontSize.sm,
  },
  success: {
    color: "#9ef0c2",
    fontSize: mobileTheme.fontSize.sm,
    lineHeight: 20,
  },
});
