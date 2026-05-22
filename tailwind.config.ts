import type { Config } from "tailwindcss";
import { design } from "./src/constants/design";

/**
 * @file tailwind.config.ts
 *
 * Dripit Tailwind CSS configuration.
 *
 * Architecture decisions:
 *
 * 1. Single source of truth — all values are imported from design.ts.
 *    Never hardcode a color or radius here; always reference the token.
 *    This means a single change in design.ts propagates everywhere.
 *
 * 2. shadcn/ui compatibility — shadcn expects specific CSS variable names
 *    (--background, --foreground, --primary, --radius, etc.) mapped in
 *    globals.css. The Tailwind theme extends those same variable names so
 *    both shadcn components and custom components consume the same tokens.
 *    We use the `hsl(var(--token))` pattern for shadcn slots and raw hex
 *    for custom brand tokens that shadcn never touches.
 *
 * 3. Dark mode via `class` strategy — toggling `dark` on <html> controls
 *    the theme. This gives us SSR-safe dark mode with no flash
 *    (next-themes handles the class toggle before paint).
 *
 * 4. `extend` only — we never replace Tailwind's defaults wholesale.
 *    This keeps utility classes like `text-sm`, `p-4`, etc. available
 *    alongside our custom tokens.
 */

const config: Config = {
  // ---------------------------------------------------------------------------
  // Dark mode
  // ---------------------------------------------------------------------------
  darkMode: "class",

  // ---------------------------------------------------------------------------
  // Content paths — Tailwind scans these for class usage
  // ---------------------------------------------------------------------------
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],

  theme: {
    // -------------------------------------------------------------------------
    // Container — override default to match Dripit layout token
    // -------------------------------------------------------------------------
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
      screens: {
        "2xl": design.layout.container,
      },
    },

    extend: {
      // -----------------------------------------------------------------------
      // Colors
      //
      // Two-layer system:
      // Layer 1 — shadcn/ui CSS variable slots (hsl-based, theme-aware)
      //           These MUST match the CSS variables defined in globals.css.
      // Layer 2 — Dripit brand tokens (static hex, used in custom components)
      // -----------------------------------------------------------------------
      colors: {
        // --- shadcn/ui slots (DO NOT RENAME — shadcn components reference these) ---
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },

        // --- Dripit brand tokens (design.ts → static hex) ---
        brand: {
          purple: design.colors.brandPurple,
          "purple-light": design.colors.brandPurpleLight,
          "purple-mid": design.colors.brandPurpleMid,
          "purple-dark": design.colors.brandPurpleDark,
        },

        // Dark surface tokens — used for dark-mode custom surfaces
        dark: {
          bg: design.colors.darkBackground,
          surface: design.colors.darkSurface,
          border: design.colors.darkBorder,
        },

        // Semantic tokens
        success: design.colors.success,
        error: design.colors.error,
      },

      // -----------------------------------------------------------------------
      // Border radius
      //
      // `--radius` CSS variable is set in globals.css and controlled by shadcn.
      // We extend it with Dripit's full radius scale.
      // -----------------------------------------------------------------------
      borderRadius: {
        // shadcn-compatible relative radii (respect the --radius variable)
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Dripit fixed radius scale from design.ts
        "dripit-sm": design.radius.sm,
        "dripit-md": design.radius.md,
        "dripit-lg": design.radius.lg,
        "dripit-xl": design.radius.xl,
        icon: design.radius.icon,
      },

      // -----------------------------------------------------------------------
      // Typography — fonts
      // -----------------------------------------------------------------------
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
        editorial: [
          "Satoshi",
          "Inter",
          "ui-sans-serif",
          "sans-serif",
        ],
        wordmark: [
          "'Bebas Neue'",
          "Anton",
          "ui-sans-serif",
          "sans-serif",
        ],
        tagline: [
          "Montserrat",
          "Geist",
          "ui-sans-serif",
          "sans-serif",
        ],
      },

      // -----------------------------------------------------------------------
      // Font sizes — extend with design.ts scale
      // -----------------------------------------------------------------------
      fontSize: {
        "2xs": [design.typography.sizes.xs, { lineHeight: "1rem" }],
        xs: [design.typography.sizes.xs, { lineHeight: "1rem" }],
        sm: [design.typography.sizes.sm, { lineHeight: "1.25rem" }],
        base: [design.typography.sizes.base, { lineHeight: "1.5rem" }],
        lg: [design.typography.sizes.lg, { lineHeight: "1.75rem" }],
        xl: [design.typography.sizes.xl, { lineHeight: "1.75rem" }],
        "2xl": [design.typography.sizes["2xl"], { lineHeight: "2rem" }],
        "3xl": [design.typography.sizes["3xl"], { lineHeight: "2.25rem" }],
        "4xl": [design.typography.sizes["4xl"], { lineHeight: "2.5rem" }],
        "5xl": [design.typography.sizes["5xl"], { lineHeight: "1.1" }],
      },

      // -----------------------------------------------------------------------
      // Letter spacing — brand tracking scale
      // -----------------------------------------------------------------------
      letterSpacing: {
        tight: design.typography.tracking.tight,
        normal: design.typography.tracking.normal,
        wide: design.typography.tracking.wide,
        tagline: design.typography.tracking.tagline,
      },

      // -----------------------------------------------------------------------
      // Spacing — extend (not replace) Tailwind's default scale
      // -----------------------------------------------------------------------
      spacing: {
        "dripit-xs": design.spacing.xs,
        "dripit-sm": design.spacing.sm,
        "dripit-md": design.spacing.md,
        "dripit-lg": design.spacing.lg,
        "dripit-xl": design.spacing.xl,
        "dripit-2xl": design.spacing["2xl"],
        "dripit-3xl": design.spacing["3xl"],
        section: design.spacing.section,
        navbar: design.layout.navbarHeight,
      },

      // -----------------------------------------------------------------------
      // Height helpers
      // -----------------------------------------------------------------------
      height: {
        navbar: design.layout.navbarHeight,
        screen: "100dvh", // Use dvh for mobile browser chrome correctness
      },

      minHeight: {
        screen: "100dvh",
      },

      // -----------------------------------------------------------------------
      // Max width — container reference
      // -----------------------------------------------------------------------
      maxWidth: {
        container: design.layout.container,
      },

      // -----------------------------------------------------------------------
      // Animation & transitions — motion tokens
      // -----------------------------------------------------------------------
      transitionDuration: {
        fast: design.motion.fast,
        normal: design.motion.normal,
        slow: design.motion.slow,
      },

      transitionTimingFunction: {
        "dripit-ease": design.motion.ease,
      },

      keyframes: {
        // Subtle fade-up for editorial reveals
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Fade-in only (for overlays, modals)
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Marquee for the tagline "CREATE • WEAR • EARN"
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Subtle scale pulse for loading states
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
      },

      animation: {
        "fade-up": `fade-up ${design.motion.slow} ${design.motion.ease} both`,
        "fade-in": `fade-in ${design.motion.normal} ${design.motion.ease} both`,
        marquee: `marquee 20s linear infinite`,
        "scale-pulse": `scale-pulse 2s ${design.motion.ease} infinite`,
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"), // Required by shadcn/ui
  ],
};

export default config;