import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#1f2937", // Gray-800 (Tailwind) for a "grash" look
              foreground: "#f3f4f6", // Gray-100 for high contrast text
            },
            focus: "#374151", // Gray-700 for focus state
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#000000", // Black for buttons/background
              foreground: "#FFFFFF", // White text for contrast
            },
            focus: "#222222", // Slightly lighter black for focus
          },
        },
      },
    }),
  ],
};

module.exports = config;
