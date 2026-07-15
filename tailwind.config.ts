import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark, nukler-inspired surfaces
        base: {
          DEFAULT: "#000000",
          900: "#050706",
          800: "#0A0D0C",
          700: "#0F1311",
          600: "#161A18",
          500: "#1C211E",
        },
        line: {
          DEFAULT: "#1E2320",
          soft: "#161A18",
          strong: "#2A302C",
        },
        // Brand colours sampled directly from the Telogica logo (cyan-teal -> emerald)
        cyan: {
          DEFAULT: "#0BAEC9",
        },
        teal: {
          DEFAULT: "#16C0A8",
          400: "#3FD3C0",
          600: "#0E9E8C",
        },
        grass: {
          DEFAULT: "#5EBE89", // logo emerald
          400: "#7FD0A2",
          600: "#46A974",
        },
        lime: {
          DEFAULT: "#5EBE89", // kept on-brand (no yellow-green)
        },
        fog: {
          DEFAULT: "#9AA4A0", // secondary text
          dim: "#6C7771",
          bright: "#C7CFCB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        logo: ["var(--font-fredoka)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(100deg, #0BAEC9 0%, #16C0A8 45%, #2BB2B1 70%, #5EBE89 100%)",
        "brand-gradient-v":
          "linear-gradient(160deg, #0BAEC9 0%, #16C0A8 50%, #5EBE89 100%)",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -24px rgba(0,0,0,0.8)",
        glow: "0 0 0 1px rgba(107,198,112,0.18), 0 18px 50px -18px rgba(107,198,112,0.35)",
        "glow-teal": "0 18px 60px -20px rgba(22,192,168,0.45)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pp-head": {
          // pick-and-place gantry head travel
          "0%": { transform: "translateX(0)" },
          "18%": { transform: "translateX(0)" },
          "38%": { transform: "translateX(150px)" },
          "58%": { transform: "translateX(150px)" },
          "78%": { transform: "translateX(40px)" },
          "100%": { transform: "translateX(0)" },
        },
        "pp-z": {
          "0%,18%": { transform: "translateY(0)" },
          "26%": { transform: "translateY(34px)" },
          "34%": { transform: "translateY(0)" },
          "50%,58%": { transform: "translateY(0)" },
          "66%": { transform: "translateY(34px)" },
          "74%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(0)" },
        },
        "trace-pulse": {
          "0%": { strokeDashoffset: "200", opacity: "0.2" },
          "50%": { opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "0.2" },
        },
        blink: {
          "0%,100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        "pp-head": "pp-head 5s ease-in-out infinite",
        "pp-z": "pp-z 5s ease-in-out infinite",
        blink: "blink 2.4s ease-in-out infinite",
        scan: "scan 3.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
