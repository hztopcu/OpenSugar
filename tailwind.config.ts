import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        destructive: "hsl(var(--destructive))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "SF Pro Text", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        "card": "22px",
        md: "var(--radius-sm)",
        sm: "var(--radius-sm)",
      },
      spacing: {
        "sidebar": "var(--sidebar-width)",
        "bottom-nav": "var(--bottom-nav-height)",
      },
      transitionDuration: {
        smooth: "150ms",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "soft-dark": "0 1px 2px 0 rgb(0 0 0 / 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
