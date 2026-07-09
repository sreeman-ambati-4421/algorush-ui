import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          bg: "#05070c",
          surface: "#0d111a",
          raised: "#121824",
          border: "#1e2432",
        },
        brand: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          soft: "rgba(59,130,246,0.12)",
        },
        positive: {
          DEFAULT: "#34d399",
          soft: "rgba(52,211,153,0.12)",
        },
        negative: {
          DEFAULT: "#f87171",
          soft: "rgba(248,113,113,0.12)",
        },
        warning: {
          DEFAULT: "#fbbf24",
          soft: "rgba(251,191,36,0.12)",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)",
        popover: "0 12px 40px -8px rgba(0,0,0,0.7)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96) translateY(4px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "scale-in": "scale-in 150ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
