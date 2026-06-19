/**
 * Design tokens synced from Figma file:
 * https://www.figma.com/design/7hx4AzvQbY2eo4NtJ4UTsb/NearDrop
 *
 * Logo node: 89:123 — exported as public/logo.svg (42×60)
 */
export const figma = {
  colors: {
    primary: "#1D7DFC",
    primaryHover: "#1565D8",
    primaryLight: "#EBF4FF",
    primaryMuted: "#BFDBFE",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    surfaceMuted: "#F3F4F6",
    surfaceModal: "#F5F5F0",
    text: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E5E7EB",
    borderLight: "#F3F4F6",
    success: "#22C55E",
    danger: "#EF4444",
    dangerBg: "#FEF2F2",
    dark: "#111827",
    teal: "#14B8A6",
  },
  font: {
    family: "var(--font-inter), Inter, system-ui, sans-serif",
    hero: { size: "48px", lineHeight: "56px", weight: 700, tracking: "-0.02em" },
    h2: { size: "32px", lineHeight: "40px", weight: 700, tracking: "-0.02em" },
    h3: { size: "18px", lineHeight: "28px", weight: 700 },
    body: { size: "16px", lineHeight: "24px", weight: 400 },
    bodySm: { size: "14px", lineHeight: "20px", weight: 400 },
    caption: { size: "12px", lineHeight: "16px", weight: 400 },
    label: { size: "11px", lineHeight: "16px", weight: 600, tracking: "0.1em" },
    nav: { size: "14px", lineHeight: "20px", weight: 500 },
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
  spacing: {
    pageX: "24px",
    section: "64px",
    card: "24px",
    stack: "20px",
  },
  layout: {
    maxWidth: "1152px",
    clipboardMaxWidth: "720px",
    authMaxWidth: "448px",
    navHeight: "64px",
  },
  logo: {
    width: 42,
    height: 60,
    aspectRatio: 60 / 42,
  },
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
  },
} as const;
