import type { Config } from "tailwindcss";

/**
 * Design-token layer for the Xandrea Harshey luxury aesthetic.
 * Mirrors the quiet-luxury editorial mood of carolwoodre.com:
 *   - near-black ink, warm cream paper, pure white
 *   - one deep brand navy + one muted gold/bronze accent
 *   - high-contrast serif display + clean grotesque sans
 * Colors are exposed both here and as CSS variables (see globals.css)
 * so they can be tuned in one place.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cream: "#F5F2EC",
        paper: "#FFFFFF",
        navy: {
          DEFAULT: "#15243B",
          deep: "#0E1A2B",
        },
        gold: {
          DEFAULT: "#A9885F",
          light: "#C2A878",
        },
      },
      fontFamily: {
        // One geometric-sans system (matches the reference). Avenir renders
        // natively on Apple devices; Jost (self-hosted via next/font) is the
        // cross-platform fallback. `serif` is kept as an alias to the same
        // stack so existing `font-serif` headings stay on-system without
        // touching every component.
        sans: [
          "Avenir Next",
          "Avenir",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "Avenir Next",
          "Avenir",
          "var(--font-sans)",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        site: "1440px",
      },
      fontSize: {
        // Editorial display sizes
        "display-xl": ["clamp(2.75rem, 7vw, 6.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      spacing: {
        section: "clamp(5rem, 12vw, 11rem)",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
