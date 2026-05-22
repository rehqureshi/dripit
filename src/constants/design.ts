/**
 * Dripit Design System
 *
 * Centralized design tokens for:
 * - spacing
 * - typography
 * - colors
 * - radius
 * - motion
 *
 * Brand direction:
 * Editorial luxury streetwear.
 * Minimal. Monochrome. Purple-accented.
 */

export const design = {
  // ---------------------------------------------------------------------------
  // Colors
  // ---------------------------------------------------------------------------

  colors: {
    // Base
    background: "#FFFFFF",
    foreground: "#0A0A0A",

    // UI
    muted: "#71717A",
    border: "#E4E4E7",

    // Semantic
    primary: "#000000",
    secondary: "#F4F4F5",
    accent: "#18181B",

    success: "#16A34A",
    error: "#DC2626",

    card: "#FFFFFF",

    // Brand
    brandPurple: "#6B4FA0",
    brandPurpleLight: "#9B7EC8",
    brandPurpleMid: "#7B5BB5",
    brandPurpleDark: "#3B2060",

    // Dark surfaces
    darkBackground: "#0D0B12",
    darkSurface: "#1A1525",
    darkBorder: "#2E2640",

    // Neutrals
    white: "#FFFFFF",
    black: "#0A0A0A",
  },

  // ---------------------------------------------------------------------------
  // Typography
  // ---------------------------------------------------------------------------

  typography: {
    fonts: {
      sans: "Geist, Inter, sans-serif",
      mono: "Geist Mono, monospace",
      editorial: "Satoshi, Inter, sans-serif",

      // Brand-specific UI fonts
      wordmark: "'Bebas Neue', 'Anton', sans-serif",
      tagline: "'Montserrat', 'Geist', sans-serif",
    },

    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },

    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    tracking: {
      tight: "-0.04em",
      normal: "0",
      wide: "0.08em",

      // Used for:
      // CREATE • WEAR • EARN
      tagline: "0.25em",
    },
  },

  // ---------------------------------------------------------------------------
  // Spacing
  // ---------------------------------------------------------------------------

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",

    section: "6rem",
  },

  // ---------------------------------------------------------------------------
  // Radius
  // ---------------------------------------------------------------------------

  radius: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",

    full: "9999px",

    // Rounded-square social/app icon radius
    icon: "1.75rem",
  },

  // ---------------------------------------------------------------------------
  // Animation
  // ---------------------------------------------------------------------------

  motion: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",

    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // ---------------------------------------------------------------------------
  // Layout
  // ---------------------------------------------------------------------------

  layout: {
    container: "1280px",
    navbarHeight: "72px",
  },

  // ---------------------------------------------------------------------------
  // Brand Metadata
  // ---------------------------------------------------------------------------

  brand: {
    name: "dripit",
    tagline: "CREATE • WEAR • EARN",
  },
} as const;