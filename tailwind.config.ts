import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0fa89b",
        "primary-dark": "#0c8a80",
        "primary-light": "#e5f7f5",
        "section-alt": "#f4f9f8",
        "border-light": "#e4efed",
        "border-card": "#d4e4e0",
        "border-filter": "#cce0dc",
        "text-primary": "#0d1f2d",
        "text-secondary": "#4e6570",
        "text-muted": "#6b8090",
        "text-faint": "#9aadb6",
        "footer-bg": "#0c1e2a",
      },
      fontFamily: {
        rounded: ["var(--font-rounded)", "sans-serif"],
        noto: ["var(--font-noto)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
