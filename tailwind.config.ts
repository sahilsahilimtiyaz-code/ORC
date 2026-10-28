import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette from the owner's design comps
        gold: { DEFAULT: "#d4af37", bright: "#f0d78c", deep: "#9c7a1e" },
        bronze: "#cd7f32",
        silver: "#c0c0c0",
        ink: "#050609",
        panel: "#0b0d14",
        panel2: "#0f1220",
        line: "#ffffff14",
        rise: "#34d399",
        fall: "#f87171",
        neon: "#67e8f9",
        royal: "#3b82f6",
      },
      fontFamily: {
        // fonts are wired via next/font CSS variables in app/layout.tsx
        display: ["var(--font-display, Georgia, serif)"],
        sans: ["var(--font-sans, ui-sans-serif, system-ui)"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px 2px rgba(212,175,55,0.18)",
        "glow-lg": "0 0 56px 8px rgba(212,175,55,0.16)",
        panel: "0 10px 40px rgba(0,0,0,0.45)",
        "num-gold": "0 0 18px rgba(240,215,140,0.35)",
      },
      maxWidth: {
        content: "1440px",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      animation: {
        "float-y": "floatY 6s ease-in-out infinite",
        "spin-slow": "spin 26s linear infinite",
        "pulse-soft": "pulseSoft 3.2s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        "grad-x": "gradShift 7s ease infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
      keyframes: {
        floatY: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradShift: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
