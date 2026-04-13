export const mobileTheme = {
  colors: {
    // Core surfaces (from Lovable --background, --card, --secondary, --muted)
    background: "#0d0f17",
    surface: "#151926",
    surfaceMuted: "#1e2234",
    secondary: "#232838",
    border: "#272c3d",

    // Text (from Lovable --foreground, --muted-foreground, --secondary-foreground)
    text: "#dee4ef",
    textSecondary: "#b3bbd0",
    textMuted: "#737d8c",

    // Primary & accent (from Lovable --primary, --accent)
    primary: "#ef4d9e",
    accent: "#13cdd4",

    // Badge colors (from Lovable --event-badge, --drop-badge)
    eventBadge: "#ef4d9e",
    dropBadge: "#f0b613",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999,
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 24,
    "2xl": 28,
  },
} as const;
